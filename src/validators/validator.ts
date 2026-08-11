import { z } from "zod";

// Auth

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;


// Author

export const createAuthorSchema = z.object({
  name: z.string().min(2).max(100)
});

export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;