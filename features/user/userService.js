/**
 * User Service
 * Business logic for user operations
 */

const {
  hashPassword,
  comparePassword,
  isBcryptHash,
} = require("../../utils/passwordHash.js");
const { generateToken } = require("../../utils/jwt.js");
const {
  ConflictError,
  AuthError,
  NotFoundError,
} = require("../../middleware/errorHandler.js");
const { logger } = require("../../utils/logger.js");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get all users
   * @returns {Promise<Array>} Array of users
   */
  async getAllUsers() {
    logger.info("Fetching all users");
    const users = await this.userRepository.findAll();
    logger.info(`Found ${users.length} users`);
    return { count: users.length, users };
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    logger.info(`Fetching user by ID: ${id}`);
    const user = await this.userRepository.findById(id);

    if (!user) {
      logger.warn(`User not found: ${id}`);
      throw new NotFoundError("User");
    }

    return user;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data (email, password, role, isVerified)
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    const { email, password, role, isVerified } = userData;

    logger.info(`Creating user: ${email}`);

    // Check if user already exists
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      logger.warn(`User creation failed - email exists: ${email}`);
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: isVerified || false,
    });

    logger.info(`User created successfully: ${user._id}`);

    // Return without password
    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updateData) {
    const { email, password, role, isVerified } = updateData;

    logger.info(`Updating user: ${id}`);

    // Build update object
    const data = {};
    if (email !== undefined) data.email = email;
    if (password !== undefined) data.password = await hashPassword(password);
    if (role !== undefined) data.role = role;
    if (isVerified !== undefined) data.isVerified = isVerified;

    const user = await this.userRepository.update(id, data);

    if (!user) {
      logger.warn(`User update failed - not found: ${id}`);
      throw new NotFoundError("User");
    }

    logger.info(`User updated successfully: ${id}`);
    return user;
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteUser(id) {
    logger.info(`Deleting user: ${id}`);

    const user = await this.userRepository.delete(id);

    if (!user) {
      logger.warn(`User deletion failed - not found: ${id}`);
      throw new NotFoundError("User");
    }

    logger.info(`User deleted successfully: ${id}`);
    return { message: "User deleted successfully", id };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} Login result with token and user
   */
  async login(email, password) {
    logger.info(`Login attempt: ${email}`);

    // Find user by email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      logger.warn(`Login failed - user not found: ${email}`);
      throw new AuthError("Invalid email or password");
    }

    // Check password (support lazy migration from V1)
    let passwordMatches;
    if (isBcryptHash(user.password)) {
      // V2+: Compare with bcrypt
      passwordMatches = await comparePassword(password, user.password);
    } else {
      // V1 legacy: Plain text comparison
      passwordMatches = user.password === password;

      // Lazy migration: Hash the password
      if (passwordMatches) {
        logger.info(`Migrating password to bcrypt for user: ${user._id}`);
        await this.userRepository.updatePassword(
          user._id,
          await hashPassword(password),
        );
      }
    }

    if (!passwordMatches) {
      logger.warn(`Login failed - invalid password: ${email}`);
      throw new AuthError("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user);

    logger.info(`Login successful: ${user._id}`);

    return {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  /**
   * Get current user profile
   * @param {string} id - User ID
   * @returns {Promise<Object>} User profile
   */
  async getCurrentUser(id) {
    return this.getUserById(id);
  }
}

module.exports = UserService;
