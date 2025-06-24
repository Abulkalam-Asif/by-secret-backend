import nodemailer from "nodemailer";
import { getSMTPSettings } from "../utils/getSMTPSettings";

const getTransporter = async () => {
  try {
    const smtpSettings = await getSMTPSettings();
    if (!smtpSettings) {
      return null;
    }
    const transporter = nodemailer.createTransport({
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure: smtpSettings.port === 465,
      auth: {
        user: smtpSettings.username,
        pass: smtpSettings.password,
      },
    });
    return transporter;
  } catch (error) {
    console.error("Error creating Nodemailer transporter:", error);
    return null;
  }
};

export default getTransporter;
