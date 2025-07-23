import { z, ZodError } from "zod";
import { formatZodErrors } from "@/lib/formatZodErrors";

describe("formatZodErrors", () => {
  it("should format a single Zod error", () => {
    const schema = z.object({
      title: z.string().min(1, "Title is required"),
    });

    const result = schema.safeParse({ title: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodErrors(result.error);

      expect(formatted).toEqual({
        title: ["Title is required"],
      });
    }
  });

  it("should format multiple Zod errors with different paths", () => {
    const schema = z.object({
      title: z.string().min(1, "Title is required"),
      status: z.enum(["todo", "in-progress", "done"], {
        error: "Invalid status",
      }),
    });

    const result = schema.safeParse({ title: "", status: "invalid" });

    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodErrors(result.error);

      expect(formatted).toEqual({
        title: ["Title is required"],
        status: ["Invalid status"],
      });
    }
  });

  it("should default to 'root' for missing path", () => {
    const error: ZodError = new ZodError([
      {
        code: "custom",
        message: "Something went wrong",
        path: [],
        input: undefined,
      },
    ]);

    const formatted = formatZodErrors(error);

    expect(formatted).toEqual({
      root: ["Something went wrong"],
    });
  });
});
