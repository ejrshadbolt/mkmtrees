// Type definitions for Cloudflare Pages Functions
/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  // Add other environment variables as needed
  ENVIRONMENT?: string;
  NEXTJS_ENV?: string;
  NEXTAUTH_URL?: string;
  NEXTAUTH_SECRET?: string;
  CLOUDFLARE_LOCAL_MODE?: string;
  NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface PagesFunction<EnvType = Env, Params extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> {
  (context: EventContext<EnvType, Params, Data>): Response | Promise<Response>;
}

interface EventContext<EnvType, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: EnvType & {
    ASSETS: {
      fetch: typeof fetch;
    };
  };
  params: Record<string, string>;
  data: Data;
}

// Global type augmentation
declare global {
  const PagesFunction: PagesFunction;
  const EventContext: EventContext<Env, any, any>;
}

export { Env, PagesFunction, EventContext }; 