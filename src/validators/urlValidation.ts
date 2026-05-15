import z from "zod";

export const urlSchema = z.url({ message: "Invalid url" }).refine(
  (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (error) {
      return false;
    }
  },
  {
    message: "Only url with http and https protocols are allowed",
  },
);

// export type UrlSchema = z.infer<typeof urlSchema>;

// export const schema = z.url();
