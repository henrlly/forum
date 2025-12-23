import { z } from "zod";
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/constants/users";

export const emailSchema = z.email("Please enter a valid email address");

export const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .min(
    MIN_USERNAME_LENGTH,
    `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
  )
  .max(
    MAX_USERNAME_LENGTH,
    `Username must be no more than ${MAX_USERNAME_LENGTH} characters`,
  )
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  )
  .max(
    MAX_PASSWORD_LENGTH,
    `Password must be no more than ${MAX_PASSWORD_LENGTH} characters`,
  );

export const confirmPasswordSchema = z
  .string()
  .min(1, "Please confirm your password");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const profileSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
});

export const newPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// z.intersection preserve .refine and .transform in order
export const registerFormSchema = z.intersection(
  profileSchema,
  newPasswordFormSchema,
);

export const changePasswordSchema = newPasswordFormSchema.transform(
  ({ confirmPassword, ...rest }) => rest,
);

export const registerSchema = registerFormSchema.transform(
  ({ confirmPassword, ...rest }) => rest,
);
