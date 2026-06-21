/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldValues, Resolver } from "react-hook-form";

export function zodResolver<TFieldValues extends FieldValues>(
  schema: { safeParseAsync(data: unknown): Promise<any> },
): Resolver<TFieldValues> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { values: result.data as TFieldValues, errors: {} };
    }
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues as Array<{
      path: (string | number)[];
      code: string;
      message: string;
    }>) {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {} as TFieldValues, errors: errors as any };
  };
}
