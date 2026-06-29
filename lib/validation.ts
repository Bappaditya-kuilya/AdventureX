import { z } from "zod";

export const recommendationSchema = z.object({
  duration: z.enum(["weekend", "long-weekend", "week"]),
  budget: z.union([z.literal(5000), z.literal(10000), z.literal(15000)], {
    errorMap: () => ({ message: "Budget must be one of the supported values" })
  }).or(z.coerce.number().transform((value) => {
    if (value === 5000 || value === 10000 || value === 15000) return value;
    throw new Error("Invalid budget");
  })),
  vibe: z.enum(["adrenaline", "nature", "chill"]),
  origin: z.string().min(2).max(40).optional().default("Pune")
});

export const bookingSchema = z.object({
  adventureId: z.string().min(1).max(64),
  adventureDateId: z.string().min(1).max(64),
  date: z.string().date(),
  participants: z.coerce.number().int().min(1).max(8),
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().trim().min(7).max(20),
  dietaryPreference: z.enum(["veg", "non-veg", "vegan", "no-preference"]).optional(),
  specialRequests: z.string().trim().max(500).optional()
});
