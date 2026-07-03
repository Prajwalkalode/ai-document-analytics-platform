import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';

// set required env before importing controller (module checks)
process.env.AUTH_TABLE_NAME = 'AUTH_TABLE';
process.env.AWS_REGION = 'us-east-1';

// Prepare mutable responses for the mocked DynamoDB client
let queryResponse = null;
let putResponse = null;

vi.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocumentClient: {
      from: () => ({
        send: (cmd) => {
          if (cmd.constructor.name === 'QueryCommand') return Promise.resolve(queryResponse);
          if (cmd.constructor.name === 'PutCommand') return Promise.resolve(putResponse);
          return Promise.resolve({});
        },
      }),
    },
    PutCommand: class PutCommand {
      constructor(input) {
        this.input = input;
      }
    },
    QueryCommand: class QueryCommand {
      constructor(input) {
        this.input = input;
      }
    },
    __setQueryResponse: (r) => {
      queryResponse = r;
    },
    __setPutResponse: (r) => {
      putResponse = r;
    },
  };
});

vi.mock('bcryptjs', () => {
  const hash = vi.fn(() => Promise.resolve('hashed'));
  const compare = vi.fn(() => Promise.resolve(true));
  return {
    default: { hash, compare },
    hash,
    compare,
  };
});

vi.mock('jsonwebtoken', () => {
  const sign = vi.fn(() => 'jwt-token');
  return { default: { sign }, sign };
});

// dynamically import controller after setting env and mocks to avoid module-level env checks
let register;
let login;
let me;
import { newUserRequest, existingUser, loginRequest, badRequest } from '../testData.js';

beforeAll(async () => {
  const mod = await import('../../controller/authController.js');
  register = mod.register;
  login = mod.login;
  me = mod.me;
});

describe('authController', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.resetAllMocks();
    queryResponse = null;
    putResponse = null;

    req = { body: {} };
    res = { status: vi.fn(() => res), json: vi.fn(() => res) };
  });

  it('registers a new user (201)', async () => {
    req.body = newUserRequest;
    // no existing user
    const lib = await import('@aws-sdk/lib-dynamodb');
    lib.__setQueryResponse({ Items: [] });
    lib.__setPutResponse({});

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'User registered successfully!' })
    );
  });

  it('returns 409 when user exists', async () => {
    req.body = newUserRequest;
    const lib = await import('@aws-sdk/lib-dynamodb');
    lib.__setQueryResponse({ Items: [existingUser] });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'A user with this email already exists.' })
    );
  });

  it('returns 400 on invalid register payload', async () => {
    req.body = badRequest;

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('logs in successfully and returns token', async () => {
    req.body = loginRequest;
    const lib = await import('@aws-sdk/lib-dynamodb');
    lib.__setQueryResponse({ Items: [existingUser] });
    process.env.JWT_SECRET = 'secret';

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'jwt-token' }));
  });

  it('returns 401 on invalid login', async () => {
    req.body = loginRequest;
    const lib = await import('@aws-sdk/lib-dynamodb');
    lib.__setQueryResponse({ Items: [] });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('me returns req.user', async () => {
    req.user = { userId: 'USR1', email: 'u@example.com' };

    await me(req, res);

    expect(res.json).toHaveBeenCalledWith({ user: req.user });
  });
});
