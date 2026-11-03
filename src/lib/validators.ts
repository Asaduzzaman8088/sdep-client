import { z } from "zod";

import { eventTypes } from "@/lib/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const httpUrlPattern = /^https?:\/\//i;

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .refine((value) => emailPattern.test(value), {
    message: "Enter a valid email address.",
  });

const passwordField = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required."),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(80, "Name must be 80 characters or fewer."),
    email: emailField,
    photoURL: z
      .string()
      .trim()
      .refine((value) => value === "" || httpUrlPattern.test(value), {
        message: "Photo URL must start with http:// or https://.",
      })
      .refine((value) => value === "" || z.string().url().safeParse(value).success, {
        message: "Enter a valid photo URL.",
      }),
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

const thumbnailField = z
  .string()
  .trim()
  .min(1, "Thumbnail URL is required.")
  .url("Thumbnail must be a valid URL.")
  .refine((value) => httpUrlPattern.test(value), {
    message: "Thumbnail must start with http:// or https://.",
  });

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, "Title must be at least 4 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(5000, "Description must be 5000 characters or fewer."),
  eventType: z.enum(eventTypes, { message: "Choose an event type." }),
  thumbnail: thumbnailField,
  location: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters.")
    .max(160, "Location must be 160 characters or fewer."),
  eventDate: z
    .string()
    .min(1, "Choose the event date and time.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Choose a valid event date and time.",
    })
    .refine((value) => new Date(value).getTime() > Date.now(), {
      message: "Event date must be in the future.",
    }),
  capacity: z
    .number({ message: "Capacity is required." })
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1 volunteer.")
    .max(10_000, "Capacity cannot exceed 10,000."),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;

// The Edit (Update Event) form validates against the same rules as Create.
export const updateEventSchema = eventFormSchema;
export type UpdateEventValues = z.infer<typeof updateEventSchema>;

export function getPasswordChecks(password: string) {
  return [
    {
      label: "At least 6 characters",
      valid: password.length >= 6,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
  ];
}

export function toDateTimeLocalValue(value: string | Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
