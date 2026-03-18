import { describe, expect, it, jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';

describe('admin validate middleware', () => {
  const schema = z.object({
    body: z.object({
      name: z.string().min(1),
    }),
  });

  const createMockResponse = () => {
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    (res.status as unknown as ReturnType<typeof jest.fn>).mockReturnValue(res);
    (res.json as unknown as ReturnType<typeof jest.fn>).mockReturnValue(res);

    return res;
  };

  it('calls next when payload is valid', () => {
    const middleware = validate(schema as any);
    const req = { body: { name: 'valid' } } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 for zod validation errors', () => {
    const middleware = validate(schema as any);
    const req = { body: { name: '' } } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: expect.any(Array),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards non-zod errors to next', () => {
    const brokenSchema: { parse: () => never } = {
      parse: () => {
        throw new Error('unexpected');
      },
    };
    const middleware = validate(brokenSchema as any);
    const req = {} as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
