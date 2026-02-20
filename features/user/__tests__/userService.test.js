/**
 * User Service Unit Tests
 */

import mongoose from "mongoose";
import UserService from "../userService.js";
import UserRepository from "../userRepository.js";
import User from "../userModel.js";
import {
  ConflictError,
  AuthError,
  NotFoundError,
} from "../../../middleware/errorHandler.js";

// Mock dependencies
jest.mock("../../../utils/logger.js", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe("UserService", () => {
  let userService;
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository(User);
    userService = new UserService(userRepository);
  });

  describe("getAllUsers", () => {
    it("should return all users with count", async () => {
      // Create test users
      await User.create([
        { email: "user1@test.com", password: "hashed1", role: "user" },
        { email: "user2@test.com", password: "hashed2", role: "admin" },
      ]);

      const result = await userService.getAllUsers();

      expect(result.count).toBe(2);
      expect(result.users).toHaveLength(2);
      expect(result.users[0]).not.toHaveProperty("password");
    });
  });

  describe("getUserById", () => {
    it("should return user by ID", async () => {
      const user = await User.create({
        email: "test@test.com",
        password: "hashed",
        role: "user",
      });

      const result = await userService.getUserById(user._id);

      expect(result.email).toBe("test@test.com");
      expect(result).not.toHaveProperty("password");
    });

    it("should throw NotFoundError for non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await expect(userService.getUserById(fakeId)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("createUser", () => {
    it("should create a new user with hashed password", async () => {
      const userData = {
        email: "new@test.com",
        password: "plainpassword",
        role: "user",
      };

      const result = await userService.createUser(userData);

      expect(result.email).toBe("new@test.com");
      expect(result.role).toBe("user");
      expect(result).not.toHaveProperty("password");

      // Verify password was hashed
      const savedUser = await User.findById(result._id);
      expect(savedUser.password).not.toBe("plainpassword");
    });

    it("should throw ConflictError if email exists", async () => {
      await User.create({
        email: "exists@test.com",
        password: "hashed",
        role: "user",
      });

      await expect(
        userService.createUser({
          email: "exists@test.com",
          password: "password",
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("login", () => {
    it("should return token for valid credentials", async () => {
      // Create user with known password
      const { hashPassword } = await import("../../../utils/passwordHash.js");
      const hashedPassword = await hashPassword("correctpassword");

      await User.create({
        email: "login@test.com",
        password: hashedPassword,
        role: "user",
      });

      const result = await userService.login(
        "login@test.com",
        "correctpassword",
      );

      expect(result.message).toBe("Login successful");
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe("login@test.com");
    });

    it("should throw AuthError for invalid email", async () => {
      await expect(
        userService.login("nonexistent@test.com", "password"),
      ).rejects.toThrow(AuthError);
    });

    it("should throw AuthError for invalid password", async () => {
      const { hashPassword } = await import("../../../utils/passwordHash.js");
      const hashedPassword = await hashPassword("correctpassword");

      await User.create({
        email: "wrongpass@test.com",
        password: hashedPassword,
        role: "user",
      });

      await expect(
        userService.login("wrongpass@test.com", "wrongpassword"),
      ).rejects.toThrow(AuthError);
    });
  });

  describe("updateUser", () => {
    it("should update user fields", async () => {
      const user = await User.create({
        email: "update@test.com",
        password: "hashed",
        role: "user",
      });

      const result = await userService.updateUser(user._id, {
        email: "updated@test.com",
        role: "admin",
      });

      expect(result.email).toBe("updated@test.com");
      expect(result.role).toBe("admin");
    });

    it("should hash new password", async () => {
      const user = await User.create({
        email: "passupdate@test.com",
        password: "oldhashed",
        role: "user",
      });

      await userService.updateUser(user._id, { password: "newpassword" });

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.password).not.toBe("oldhashed");
      expect(updatedUser.password).not.toBe("newpassword");
    });
  });

  describe("deleteUser", () => {
    it("should delete user", async () => {
      const user = await User.create({
        email: "delete@test.com",
        password: "hashed",
        role: "user",
      });

      const result = await userService.deleteUser(user._id);

      expect(result.message).toBe("User deleted successfully");

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it("should throw NotFoundError for non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await expect(userService.deleteUser(fakeId)).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
