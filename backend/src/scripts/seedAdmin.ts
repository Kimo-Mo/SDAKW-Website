/**
 * Admin seed script — run once to create the initial admin account.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Required environment variables (in .env):
 *   ADMIN_NAME=
 *   ADMIN_EMAIL=
 *   ADMIN_PASSWORD=
 *
 * The script is idempotent — it will not create a duplicate account.
 * run seed file:
 *    ts-node-dev --transpile-only --exit-child src/scripts/seedAdmin.ts
 */
import 'dotenv/config';

import dns from 'dns';
dns.setServers(['0.0.0.0', '8.8.8.8']);

import mongoose from 'mongoose';
import { z } from 'zod';
import User from '../models/User';
import { hashPassword } from '../services/auth.service';

// Validate required seed env vars independently of the main env schema
// so the main application can run without ADMIN_* being set.
const seedEnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  ADMIN_NAME: z.string().min(1, 'ADMIN_NAME is required'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD: z
    .string()
    .min(8, 'ADMIN_PASSWORD must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

const run = async (): Promise<void> => {
  const parsed = seedEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Seed environment variables are invalid:');
    parsed.error.errors.forEach((e) => console.error(` - ${e.path.join('.')}: ${e.message}`));
    process.exit(1);
  }

  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = parsed.data;

  await mongoose.connect(MONGODB_URI);
  console.info('Connected to MongoDB.');

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existing) {
    console.info('Admin account already exists — no action taken.');
    await mongoose.connection.close();
    return;
  }

  const hashedPassword = await hashPassword(ADMIN_PASSWORD);

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
  });

  // Never log the plain-text or hashed password
  console.info(`Admin account created for: ${ADMIN_EMAIL}`);
  await mongoose.connection.close();
};

run().catch((err: unknown) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
