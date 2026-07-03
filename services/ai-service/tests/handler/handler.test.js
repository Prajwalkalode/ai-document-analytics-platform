import { describe, it, expect } from 'vitest';
import { handler } from '../../handler.js';

describe('handler export', () => {
  it('exports a handler value', () => {
    expect(handler).toBeDefined();
  });
});
