import { z } from 'zod';
const schema = z.object({
  url: z
    .url()
    .refine(
      (v) =>
        v.startsWith('https://') ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(v),
    ),
  publishableKey: z.string().startsWith('sb_publishable_'),
});
export type DatabaseConfiguration = z.infer<typeof schema>;
export function parseDatabaseConfiguration(
  url?: string,
  publishableKey?: string,
): DatabaseConfiguration | null {
  if (!url && !publishableKey) return null;
  const result = schema.safeParse({ url, publishableKey });
  if (!result.success)
    throw new Error('Supply a valid Supabase URL and public publishable key.');
  return result.data;
}
export function getDatabaseConfiguration() {
  return parseDatabaseConfiguration(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
