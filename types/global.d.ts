// global.d.ts
import { Post } from "@prisma/client";

declare global {
  interface Window {
    grecaptcha: {
      getResponse: (opt_widgetId?: number) => string;
      reset: (opt_widgetId?: number) => void;
      render: (
        container: string | HTMLElement,
        parameters: {
          sitekey: string;
          callback?: (response: string) => void;
          theme?: "light" | "dark";
          size?: "compact" | "normal" | "invisible";
        }
      ) => number;
    };
  }

  interface QueryResponse<T> {
    ok: boolean;
    error: string;
    data: T;
  }

  interface InfiniteResponse<T> {
    ok: boolean;
    data: T[];
  }

  interface PostType
    extends Omit<Post, "createdAt" | "updatedAt" | "id" | "tagIds"> {
    tag: string[];
  }
}
