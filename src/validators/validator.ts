import { z } from "zod";

// Auth and Token

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8)
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// Author

export const createAuthorSchema = z.object({
  name: z.string().min(2).max(100)
});

export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;


// Book

export const createBookSchema = z.object({
  title: z.string().min(1).max(200),
  isbn: z.string().min(1).max(20),
  publishedYear: z.number().int().min(1),
  authorId: z.number().int().positive()
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const updateBookSchema = z.object({
  title: z.string().min(1).max(200),
  isbn: z.string().min(1).max(20),
  publishedYear: z.number().int().min(1),
  authorId: z.number().int().positive()
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;

export const patchBookSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  isbn: z.string().min(1).max(20).optional(),
  publishedYear: z.number().int().min(1).optional(),
  authorId: z.number().int().positive().optional()
})
.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required"
  }
);

export type PatchBookInput = z.infer<typeof patchBookSchema>;

export const createLoanSchema = z.object({
  bookId: z.number().int().positive(),
  dueAt: z.iso.datetime()
});

export type CreateLoanInput =  z.infer<typeof createLoanSchema>;