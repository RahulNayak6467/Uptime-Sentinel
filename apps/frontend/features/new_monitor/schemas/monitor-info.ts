import { z } from "zod";

export const monitorInfoSchema = z.object({
  monitorName: z
    .string()
    .min(2, { message: "Minimum 2 characters are required" })
    .max(50, { message: "Maximum 50 characters are required" }),

  url: z.url({ message: "Invalid url" }).refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        return (
          parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
        );
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    {
      message: "Only url with http and https protocols are allowed",
    },
  ),

  timeout: z
    .number()
    .min(60, { message: "Minimum timeout should be 60 seconds" }),

  statusCode: z.number().nullable(),

  responseTimeAlert: z.number(),
});

export type monitorInfoProps = z.infer<typeof monitorInfoSchema>;
