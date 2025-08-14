// global.d.ts
import { Post } from "@prisma/client";

declare global {
  interface QueryResponse<T> {
    ok: boolean;
    error: string;
    data: T;
  }

  interface PostType
    extends Omit<Post, "createdAt" | "updatedAt" | "id" | "tagIds"> {
    tag: string[];
  }
}
