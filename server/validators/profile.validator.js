const { z } = require("zod");

// Multipart forms send strings, so removeAvatar is "true" / "false".
module.exports.updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50),
    removeAvatar: z.enum(["true", "false"]),
  })
  .partial();
