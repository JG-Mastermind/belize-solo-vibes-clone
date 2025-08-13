declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
      OPENAI_ORGANIZATION?: string;
      VITE_OPENAI_API_KEY?: string;
      VITE_OPENAI_ORGANIZATION?: string;
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    }
  }
}

export {};