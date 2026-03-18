import { jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';

const createMockResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  (res.status as unknown as ReturnType<typeof jest.fn>).mockReturnValue(res);
  (res.json as unknown as ReturnType<typeof jest.fn>).mockReturnValue(res);

  return res;
};

describe('auth middleware and token helpers', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('signs and verifies a token', async () => {
    const { signToken, verifyToken } = await import('../middlewares/auth.js');
    const token = await signToken({ id: 'user-1' });
    const payload = await verifyToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.id).toBe('user-1');
  });

  it('returns null for invalid token', async () => {
    const { verifyToken } = await import('../middlewares/auth.js');
    const payload = await verifyToken('invalid.token.value');

    expect(payload).toBeNull();
  });

  it('returns 401 when auth header is missing', async () => {
    const { isAuthenticated } = await import('../middlewares/auth.js');
    const req = { headers: {} } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    await isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for invalid bearer token', async () => {
    const { isAuthenticated } = await import('../middlewares/auth.js');
    const req = {
      headers: { authorization: 'Bearer invalid.token.value' },
    } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    await isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.userId and calls next for valid token', async () => {
    const { isAuthenticated, signToken } = await import('../middlewares/auth.js');
    const token = await signToken({ id: 'user-42' });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    await isAuthenticated(req, res, next);

    expect((req as { userId?: string }).userId).toBe('user-42');
    expect(next).toHaveBeenCalledWith();
  });

  it('returns 500 when JWT secret is not configured', async () => {
    delete process.env.JWT_SECRET;
    const { isAuthenticated } = await import('../middlewares/auth.js');
    const req = {
      headers: { authorization: 'Bearer any-token' },
    } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    await isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when downstream middleware throws', async () => {
    const { isAuthenticated, signToken } = await import('../middlewares/auth.js');
    const token = await signToken({ id: 'user-42' });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const res = createMockResponse();
    const next = jest.fn(() => {
      throw new Error('downstream error');
    }) as NextFunction;

    await isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Forbidden' })
    );
  });
});
