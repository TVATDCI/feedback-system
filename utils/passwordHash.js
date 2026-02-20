/**
 * Password Hashing Utility
 * Handles password hashing and comparison using bcrypt
 */

const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Check if a string is a bcrypt hash
 * Bcrypt hashes start with $2a$, $2b$, or $2y$
 * @param {string} str - String to check
 * @returns {boolean} True if string appears to be a bcrypt hash
 */
const isBcryptHash = (str) => {
  return /^\$2[aby]\$\d{2}\$/.test(str);
};

module.exports = {
  hashPassword,
  comparePassword,
  isBcryptHash,
};
