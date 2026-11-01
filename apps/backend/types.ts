import z from "zod";

export const CreateUserSchema = z.object({
  username: z.string().trim().min(2).max(32),
  password: z.string().min(6).max(128),
});

export const CreateAvatarSchenma = z.object({
  name: z.string().trim().min(2).max(60),
  image: z.string().min(1),
  userId: z.string().min(1).optional(),
});

export const CreateVideoSchema = z.object({
  prompt: z.string().trim().min(8).max(1200),
  imageUrls: z.array(z.string().url()).default([]),
  userId: z.string().min(1).optional(),
});