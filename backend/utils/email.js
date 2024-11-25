const nodemailer = require("nodemailer");
const { htmlToText } = require("html-to-text");
const path = require("path");
const ejs = require("ejs");

class Email {
  constructor(user) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    this.user = user;
  }

  async send({ file, subject, body = {} }) {
    console.log("sending");
    const html = await ejs.renderFile(
      path.join(__dirname, "../emails", `${file}.ejs`),
      {
        otp: body.otp,
        url: body.resetUrl,
        userName: this.user.userName,
        trackingUrl: "#",
        supportUrl: "#",
      }
    );

    console.log(this.user.email);
    try {
      await this.transporter.sendMail({
        from: "Mega Draw test@roware.xyz",
        to: this.user.email,
        subject,
        html,
        text: htmlToText(html),
      });
      console.log("Message sent");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  async sendWelcome() {
    await this.send({
      file: "welcome",
      subject: "Welcome to the MegaDraw Family 🎉",
    });
  }

  async sendResetToken(resetUrl) {
    await this.send({
      file: "reset",
      subject: "Reset Password",
      body: { resetUrl },
    });
  }

  async sendOTP(otp) {
    await this.send({
      file: "otp",
      subject: "Mega Draw login Verification",
      body: { otp },
    });
  }
}

module.exports = Email;
