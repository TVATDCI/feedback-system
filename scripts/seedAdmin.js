/**
 * Seed Script
 * Creates initial admin user for testing
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { hashPassword } = require("../utils/passwordHash");

// User schema (simplified for seed)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await hashPassword("admin123");
    const admin = await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("Admin user created successfully:");
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: admin123`);
    console.log(`  Role: ${admin.role}`);

    // Create a regular user too
    const existingUser = await User.findOne({ email: "user@example.com" });
    if (!existingUser) {
      const userPassword = await hashPassword("user123");
      const user = await User.create({
        email: "user@example.com",
        password: userPassword,
        role: "user",
        isVerified: true,
      });
      console.log("\nRegular user created successfully:");
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: user123`);
      console.log(`  Role: ${user.role}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedAdmin();
