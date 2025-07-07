
import { z } from "zod";

// Adventure schema and type
export const AdventureSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: z.string(),
  price: z.string(),
  duration: z.string(),
  groupSize: z.string(),
  rating: z.number(),
  reviews: z.number(),
  location: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  steps: z.array(z.string())
});

export type Adventure = z.infer<typeof AdventureSchema>;

// BlogPost schema and type
export const BlogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  imgUrl: z.string(),
  author: z.string(),
  date: z.string(),
  slug: z.string()
});

export type BlogPost = z.infer<typeof BlogPostSchema>;
