import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  DATA_SOURCE_MODE: z.enum(["auto", "memory", "database"]).default("auto"),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).optional()
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATA_SOURCE_MODE: process.env.DATA_SOURCE_MODE,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const isPlaceholderDatabaseUrl =
  !parsed.data.DATABASE_URL ||
  parsed.data.DATABASE_URL.includes("USER:PASSWORD") ||
  parsed.data.DATABASE_URL.includes("@HOST:");

export const env = {
  ...parsed.data,
  DATA_SOURCE_MODE: isPlaceholderDatabaseUrl && parsed.data.DATA_SOURCE_MODE === "database" ? "memory" : parsed.data.DATA_SOURCE_MODE
};
