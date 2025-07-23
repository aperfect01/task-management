import { ZodError } from "zod";

/**
 * Formats a ZodError into a field-wise error map.
 * Example output:
 * {
 *   title: ["Title is required", "Title must be at least 3 characters"],
 *   description: ["Description is too short"]
 * }
 */
export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "root";
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }

  return formatted;
}
