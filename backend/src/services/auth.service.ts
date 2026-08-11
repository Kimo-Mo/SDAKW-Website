import bcrypt from 'bcryptjs';
import User, { IUserPublic } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import { LoginInput, ChangePasswordInput } from '../validators/auth.validator';

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Validates credentials and returns a signed JWT + public user data.
 * Uses a generic error message regardless of whether the email or the
 * password is wrong — prevents user enumeration.
 */
export const loginUser = async (
  input: LoginInput,
): Promise<{ token: string; user: IUserPublic }> => {
  // Explicitly select password (excluded by default via select:false)
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');

  const GENERIC_ERROR = 'Invalid email or password';

  if (!user) {
    // Run a dummy compare to prevent timing attacks even on missing accounts
    await bcrypt.compare(input.password, '$2b$12$dummyhashforatimingattackprevention');
    throw new ApiError(401, GENERIC_ERROR);
  }

  const passwordMatch = await bcrypt.compare(input.password, user.password);
  if (!passwordMatch) {
    throw new ApiError(401, GENERIC_ERROR);
  }

  const token = signToken(user._id.toString());

  return { token, user: user.toPublic() };
};

/**
 * Fetches and returns the public profile for a given user ID.
 * Called by the /me route after the auth middleware has verified the token.
 */
export const getCurrentUser = async (userId: string): Promise<IUserPublic> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }
  return user.toPublic();
};

/**
 * Changes the admin's password.
 * - Verifies the current password
 * - Validates and hashes the new password
 * - Returns a new token so the client must store the updated cookie
 */
export const changePassword = async (
  userId: string,
  input: ChangePasswordInput,
): Promise<{ token: string }> => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const match = await bcrypt.compare(input.currentPassword, user.password);
  if (!match) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = await bcrypt.hash(input.newPassword, BCRYPT_SALT_ROUNDS);
  await user.save();

  // Issue a new token — the old one is technically still valid until it
  // expires (stateless JWTs cannot be revoked), so we immediately rotate
  // it and clear the old cookie in the controller.
  const token = signToken(user._id.toString());
  return { token };
};

/**
 * Hashes a plain-text password. Used by the seed script.
 */
export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);
};
