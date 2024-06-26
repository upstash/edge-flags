"use server"

export async function getCredentials() {
  // These will be used as the default credentials
  return {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  }
}
