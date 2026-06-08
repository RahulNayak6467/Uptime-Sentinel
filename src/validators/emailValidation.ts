import z from "zod";

export const emailSchema = z
  .email({ message: "Invalid email format" })
  .max(255);
