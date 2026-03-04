import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { env } from "@/lib/env";

export const api = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_API_URL,
});
