import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const tableName = process.env.AUTH_TABLE_NAME;

if (!tableName) {
  throw new Error('AUTH_TABLE_NAME is required');
}
const region = process.env.AWS_REGION || 'us-east-1';
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

const buildUser = ({ email, name, passwordHash }) => {
  const now = new Date().toISOString();
  return {
    userId: `USR${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    email,
    name,
    role: 'USER',
    passwordHash,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
};

const findActiveUserByEmail = async (email) => {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: 'EmailIndex',
    KeyConditionExpression: '#email = :email',
    FilterExpression: 'isActive = :active',
    ExpressionAttributeNames: {
      '#email': 'email',
    },
    ExpressionAttributeValues: {
      ':email': email,
      ':active': true,
    },
    Limit: 1,
  });

  const result = await dynamoDb.send(command);
  return result.Items?.[0] ?? null;
};

const register = async (req, res) => {
  try {
    const parsed = userSchema.parse(req.body);
    const existingUser = await findActiveUserByEmail(parsed.email);

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);
    const user = buildUser({
      email: parsed.email,
      name: parsed.name,
      passwordHash,
    });

    await dynamoDb.send(
      new PutCommand({
        TableName: tableName,
        Item: user,
      })
    );

    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Unable to register user.' });
  }
};

const login = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await findActiveUserByEmail(parsed.email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required');
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'User logged in successfully!',
      user: {
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Unable to log in.' });
  }
};

const me = async (req, res) => {
  return res.json({
    user: req.user,
  });
};

export { register, login, me };
