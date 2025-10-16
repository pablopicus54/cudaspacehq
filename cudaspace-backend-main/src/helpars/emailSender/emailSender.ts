import nodemailer from "nodemailer";
import config from "../../config";
import ApiError from "../../errors/ApiErrors";

const emailSender = async (subject: string, email: string, html: string) => {
  // Prefer custom SMTP if configured, otherwise fallback to Gmail service
  const useSmtp = !!(config.smtp.host && config.smtp.user && config.smtp.pass);

  const transporter = useSmtp
    ? nodemailer.createTransport({
        host: config.smtp.host as string,
        port: (config.smtp.port as number) || 587,
        secure: !!config.smtp.secure, // true for 465, false for other ports
        auth: {
          user: config.smtp.user as string,
          pass: config.smtp.pass as string,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.emailSender.email,
          pass: config.emailSender.app_pass,
        },
      });

  const fromEmail = (config.smtp.from_email || config.emailSender.email) as string;
  const fromName = (config.smtp.from_name || "Cudaspace") as string;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(500, "Error sending email");
  }
};

export default emailSender;