import nodemailer from "nodemailer";

if (
  !process.env.NODEMAILER_HOST ||
  !process.env.NODEMAILER_PORT ||
  !process.env.NODEMAILER_USER ||
  !process.env.NODEMAILER_PASS
) {
  throw new Error("Nodemailer environment variables are not defined");
}

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: process.env.NODEMAILER_PORT === "465",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export default transporter;
