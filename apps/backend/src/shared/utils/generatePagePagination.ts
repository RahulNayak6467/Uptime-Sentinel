import { pagePaginationSchema } from "../validators/offsetValidation";

export const getPaginationData = (pageNumber: number, limitRange: number)=> {
  pagePaginationSchema.parse({ page: pageNumber, limit: limitRange });

    const offset: number = (pageNumber - 1) * limitRange;
    const limit = limitRange;
    return { pageNumber, limit, offset };
};
