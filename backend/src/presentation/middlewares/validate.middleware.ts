import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: { body?: z.ZodSchema, query?: z.ZodSchema, params?: z.ZodSchema }) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query) as any;
            }
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params) as any;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues
                });
            }
            next(error);
        }
    };
