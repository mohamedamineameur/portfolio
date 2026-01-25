import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "./env.js";

function createTransport(): Transporter {
  const useGmailOAuth =
    !!env.GMAIL_CLIENT_ID &&
    !!env.GMAIL_CLIENT_SECRET &&
    !!env.GMAIL_REFRESH_TOKEN &&
    !!env.EMAIL_FROM;

  const useSmtp =
    !!env.SMTP_HOST &&
    !!env.EMAIL_FROM &&
    !!env.SMTP_USER &&
    !!env.SMTP_PASS;

  if (useGmailOAuth) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: env.EMAIL_FROM,
        clientId: env.GMAIL_CLIENT_ID,
        clientSecret: env.GMAIL_CLIENT_SECRET,
        refreshToken: env.GMAIL_REFRESH_TOKEN,
      },
    });
  }

  if (useSmtp) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
}

export const mailer = createTransport();

/**
 * Indique si l'envoi d'emails est configuré (Gmail OAuth2 ou SMTP).
 */
export function canSendEmail(): boolean {
  const useGmailOAuth =
    !!env.GMAIL_CLIENT_ID &&
    !!env.GMAIL_CLIENT_SECRET &&
    !!env.GMAIL_REFRESH_TOKEN &&
    !!env.EMAIL_FROM;

  const useSmtp =
    !!env.SMTP_HOST &&
    !!env.EMAIL_FROM &&
    !!env.SMTP_USER &&
    !!env.SMTP_PASS;

  return useGmailOAuth || useSmtp;
}
