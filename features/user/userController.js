/**
 * User Controller
 * HTTP request handling for user endpoints
 */

const UserService = require("./userService.js");
const UserRepository = require("./userRepository.js");

// Initialize repository and service
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

/**
 * Get all users
 * @route GET /api/user
 * @access Admin only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single user by ID
 * @route GET /api/user/:id
 * @access Admin only
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 * @route POST /api/user
 * @access Admin only
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a user
 * @route PATCH /api/user/:id
 * @access Admin only
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user
 * @route DELETE /api/user/:id
 * @access Admin only
 */
const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * User login
 * @route POST /api/user/login
 * @access Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/user/me
 * @access Authenticated user
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userService.getCurrentUser(req.user._id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getCurrentUser,
};
