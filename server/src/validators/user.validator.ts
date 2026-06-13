import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),

  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional(),
}).refine(
  (data) => data.name !== undefined || data.avatar !== undefined,
  {
    message: "At least one field is required",
  }
);

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password is required"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});