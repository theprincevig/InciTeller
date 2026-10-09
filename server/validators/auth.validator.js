const { z } = require("zod");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email")
  .max(254);

module.exports.registerSchema = z.object({
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"), // bcrypt ignores bytes past 72
});

module.exports.loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required").max(72),
});
