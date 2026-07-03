export const newUserRequest = { email: 'jane@example.com', name: 'Jane', password: 'password123' };
export const existingUser = {
  userId: 'USR1',
  email: 'jane@example.com',
  name: 'Jane',
  passwordHash: 'hash',
  role: 'USER',
  isActive: true,
};
export const loginRequest = { email: 'jane@example.com', password: 'password123' };
export const badRequest = { email: 'not-an-email' };
