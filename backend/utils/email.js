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
        inviterName: body.inviterName,
        receiverName: body.receiverName,
        inviteUrl: body.inviteUrl,
        organisationName: body.organisationName,
        trackingUrl: "#",
        supportUrl: "#",
        ownerName: body.ownerName,
      }
    );

    try {
      await this.transporter.sendMail({
        from: "Randora test@roware.xyz",
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
      subject: "Welcome to Randora 🎉",
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
      subject: "Randora login Verification",
      body: { otp },
    });
  }

  async sendInvite(inviteUrl, inviterName, organisationName) {
    await this.send({
      file: "invite",
      subject: "You're Invited!",
      body: { inviteUrl, inviterName, organisationName },
    });
  }

  async acceptedInvite(receiverName) {
    await this.send({
      file: "accepted",
      subject: "Your invite has been accepted!",
      body: { receiverName },
    });
  }

  async declinedInvite(receiverName) {
    await this.send({
      file: "declined",
      subject: "Your invite has been declined!",
      body: { receiverName },
    });
  }

  async removedFromOrganization(ownerName, organisationName) {
    await this.send({
      file: "removed",
      subject: "You have been removed from an organization",
      body: { ownerName, organisationName },
    });
  }
}

module.exports = Email;
