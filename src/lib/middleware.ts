// lib/middleware.ts
import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import multer from 'multer';
import { ParsedQs } from 'qs';

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single('image');

export const runMiddleware = (req: any, res: any, fn: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: unknown) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};
