import nodemailer from 'nodemailer';

// I was using SendGrid, but they kept suspending my account

export const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
