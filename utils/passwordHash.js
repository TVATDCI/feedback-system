/**
 * Password Hashing Utility
 * Handles password hashing and comparison using bcrypt
 */

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Check if a string is a bcrypt hash
 * Bcrypt hashes start with $2a$, $2b$, or $2y$
 * @param {string} str - String to check
 * @returns {boolean} True if string appears to be a bcrypt hash
 */
export const isBcryptHash = (str) => {
  return /^\$2[aby]\$\d{2}\$/.test(str);
};

export default {
  hashPassword,
  comparePassword,
  isBcryptHash,
};
