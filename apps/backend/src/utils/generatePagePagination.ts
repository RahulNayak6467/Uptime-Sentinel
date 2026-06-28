import { ZodError } from "zod";
import { pagePaginationSchema } from "../validators/offsetValidation";

export const getPaginationData = (pageNumber: number, limitRange: number) => {
  try {
    pagePaginationSchema.parse({ page: pageNumber, limit: limitRange });
    const offset: number = (pageNumber - 1) * limitRange;
    const limit = limitRange;

    return { pageNumber, limit, offset };
  } catch (err) {
    if (err instanceof ZodError) {
      throw err;
    }
  }
};
