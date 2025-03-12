import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.NODE_ENV === "production" ? "smtp.gmail.com" : "smtp.ethereal.email",
            port: process.env.NODE_ENV === "production" ? 465 : 587,
            secure: process.env.NODE_ENV === "production",
            auth: {
                user: process.env.NODE_ENV === "production" ? process.env.SMTP_EMAIL : process.env.ETHEREAL_EMAIL,
                pass: process.env.NODE_ENV === "production" ? process.env.SMTP_PASSWORD : process.env.ETHEREAL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Support" <${process.env.NODE_ENV === "production" ? process.env.SMTP_EMAIL : process.env.ETHEREAL_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent: ${info.messageId}`);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

export { sendEmail };
