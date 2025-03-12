import nodemailer from "nodemailer";

const createTestAccount = async () => {
    let testAccount = await nodemailer.createTestAccount();
    console.log({
        email: testAccount.user,
        pass: testAccount.pass,
        smtpHost: testAccount.smtp.host,
        smtpPort: testAccount.smtp.port,
    });
};
export { createTestAccount }