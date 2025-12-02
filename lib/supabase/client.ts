import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (typeof window === "undefined") {
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not set")
    return null
  }

  if (client) return client

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}
