
import app from '../src/app';
import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
dotenv.config();


export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}

