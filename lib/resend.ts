import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  // We throw on the server only; this file should not be imported in client components.
  throw new Error(
    "Missing RESEND_API_KEY environment variable. Set it in your .env.local file."
  )
}

export const resend = new Resend(resendApiKey)

