import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { emailOTP, phoneNumber } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { resend } from "./resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      onboardingStep: {
        type: "string",
      },
      height: {
        type: "string",
      },
      primaryCollegeId: {
        type: "number",
      },
    },
  },
  session: {
    expiresIn: 365 * 24 * 60 * 60, // one year
  },
  plugins: [
    expo(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in" || type === "email-verification") {
          resend.emails.send({
            from: `Ball Up Top <${process.env.RESEND_FROM_OTP_DNS}>`,
            to: email,
            subject: "Your Ball Up Top one-time verification code",
            html: `One-Time Verification Code: ${otp}. Do not share with anyone else.`,
          });
        }
      },
    }),
  ],
  trustedOrigins: [
    "ball-up-top-client://", // Production Expo app
    // Development mode - Expo's exp:// scheme with local IP ranges
    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://*/*", // Trust all Expo development URLs
          "exp://10.0.0.*:*/*", // Trust 10.0.0.x IP range
          "exp://192.168.*.*:*/*", // Trust 192.168.x.x IP range
          "exp://172.*.*.*:*/*", // Trust 172.x.x.x IP range
          "exp://localhost:*/*", // Trust localhost
        ]
      : []),
  ],
});
