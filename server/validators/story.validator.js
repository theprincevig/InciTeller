const { z } = require("zod");

const createStorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120),
  content: z.string().trim().min(1, "Content is required").max(2000),
});

// Every field optional. Multipart forms send strings, so removeImage is "true"/"false".
const updateStorySchema = createStorySchema.partial().extend({
  status: z.enum(["draft", "published"]).optional(),
  removeImage: z.enum(["true", "false"]).optional(),
});

module.exports = { createStorySchema, updateStorySchema };
