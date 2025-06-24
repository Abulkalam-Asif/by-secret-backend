import { AdminGeneralSettings } from "../models/AdminGeneralSettings";

type SMTPSettings = {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
};

export const getSMTPSettings = async (): Promise<SMTPSettings | null> => {
  try {
    const settings = await AdminGeneralSettings.findOne();
    if (!settings) {
      return null;
    }
    if (
      !settings.smtpHost ||
      !settings.smtpPort ||
      !settings.smtpUsername ||
      !settings.smtpPassword ||
      !settings.smtpFromEmail ||
      !settings.smtpFromName
    ) {
      return null;
    }
    const response: SMTPSettings = {
      host: settings.smtpHost as string,
      port: Number(settings.smtpPort),
      username: settings.smtpUsername as string,
      password: settings.smtpPassword as string,
      fromEmail: settings.smtpFromEmail as string,
      fromName: settings.smtpFromName as string,
    };

    return response;
  } catch (error) {
    console.error("Error getting SMTP settings:", error);
    return null;
  }
};
