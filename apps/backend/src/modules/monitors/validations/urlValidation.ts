import z from "zod";

export const urlSchema = z.object({
  url: z.url({ message: "Invalid url" }).refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        return (
          parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
        );
      } catch (error) {
        return false;
      }
    },
    {
      message: "Only url with http and https protocols are allowed",
    },
  ),

  urlName: z
    .string()
    .max(200, {
      message: "url length cannot exceed 200 characters",
    })
    .optional(),

  intervalSeconds: z
    .number()
    .min(30, { message: "Minimum interval time should be 30seconds" }),
});
