/**
 * User Repository
 * Abstracts database operations for User model
 */

import User from "./userModel.js";

class UserRepository {
  constructor(model = User) {
    this.model = model;
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User without password
   */
  async findById(id) {
    return this.model.findById(id).select("-password");
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User with password (for auth)
   */
  async findByEmail(email) {
    return this.model.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find all users
   * @returns {Promise<Array>} Array of users without passwords
   */
  async findAll() {
    return this.model.find().select("-password");
  }

  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Update a user by ID
   * @param {string} id - User ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} Updated user without password
   */
  async update(id, data) {
    return this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select("-password");
  }

  /**
   * Delete a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} Deleted user
   */
  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  /**
   * Check if user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if exists
   */
  async existsByEmail(email) {
    const count = await this.model.countDocuments({
      email: email.toLowerCase(),
    });
    return count > 0;
  }

  /**
   * Update user password
   * @param {string} id - User ID
   * @param {string} hashedPassword - New hashed password
   * @returns {Promise<Object|null>} Updated user
   */
  async updatePassword(id, hashedPassword) {
    return this.model.findByIdAndUpdate(id, { password: hashedPassword });
  }
}

export default UserRepository;
