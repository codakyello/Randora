const nodemailer = require("nodemailer");
const { htmlToText } = require("html-to-text");
const path = require("path");
const ejs = require("ejs");
const AppError = require("./appError");

const getMailErrorDetails = (error = {}) => ({
  name: error.name,
  message: error.message,
  code: error.code,
  command: error.command,
  response: error.response,
  responseCode: error.responseCode,
  errno: error.errno,
  syscall: error.syscall,
});

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
    try {
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
          daysRemaining: body.daysRemaining,
          trackingUrl: "#",
          supportUrl: "#",
          ownerName: body.ownerName,
        }
      );

      const info = await this.transporter.sendMail({
        from: `Randora <${process.env.MAIL_USER}>`,
        to: this.user.email,
        subject,
        html,
        text: htmlToText(html),
      });

      const accepted = Array.isArray(info.accepted) ? info.accepted : [];
      const rejected = Array.isArray(info.rejected) ? info.rejected : [];

      console.log("[mail] sent", {
        to: this.user.email,
        subject,
        accepted,
        rejected,
        response: info.response,
        messageId: info.messageId,
      });

      if (!accepted.length || rejected.length) {
        const deliveryError = new Error(
          "SMTP transport did not accept the message recipient"
        );
        deliveryError.code = "MAIL_RECIPIENT_REJECTED";
        deliveryError.response = info.response;
        deliveryError.rejected = rejected;
        throw deliveryError;
      }

      return info;
    } catch (error) {
      console.error("[mail] failed", {
        to: this.user.email,
        file,
        subject,
        host: process.env.MAIL_HOST,
        ...getMailErrorDetails(error),
      });
      throw error;
    }
  }

  async sendWelcome() {
    try {
      await this.send({
        file: "welcome",
        subject: "Welcome to Randora 🎉",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendResetToken(resetUrl) {
    try {
      await this.send({
        file: "reset",
        subject: "Reset Password",
        body: { resetUrl },
      });
    } catch (error) {
      throw new AppError(
        "An error occurred while sending the reset token. Please try again later.",
        500
      );
    }
  }

  async sendOTP(otp) {
    try {
      await this.send({
        file: "otp",
        subject: "Randora login Verification",
        body: { otp },
      });
    } catch (error) {
      throw new AppError(
        "An error occurred while sending the OTP. Please try again later.",
        500
      );
    }
  }

  async sendInvite(inviteUrl, inviterName, organisationName) {
    try {
      await this.send({
        file: "invite",
        subject: "You're Invited!",
        body: { inviteUrl, inviterName, organisationName },
      });
    } catch (error) {
      throw new AppError(
        "An error occurred while sending the invite. Please try again later.",
        500
      );
    }
  }

  async acceptedInvite(receiverName) {
    try {
      await this.send({
        file: "accepted",
        subject: "Your invite has been accepted!",
        body: { receiverName },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async declinedInvite(receiverName) {
    try {
      await this.send({
        file: "declined",
        subject: "Your invite has been declined!",
        body: { receiverName },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async removedFromOrganization(ownerName, organisationName) {
    try {
      await this.send({
        file: "removed",
        subject: "You have been removed from an organization",
        body: { ownerName, organisationName },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendSubscriptionReminder(organisationName, daysRemaining) {
    try {
      await this.send({
        file: "subscriptionReminder",
        subject: "Subscription Reminder",
        body: { organisationName, daysRemaining },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendSubscriptionReminderU(daysRemaining) {
    try {
      await this.send({
        file: "subscriptionReminderU",
        subject: "Subscription Reminder",
        body: { daysRemaining },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendOrgSubscriptionExpiry(organisationName) {
    try {
      await this.send({
        file: "subscriptionExpiry",
        subject: "Subscription Expired",
        body: { organisationName },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendUserSubscriptionExpiry(organisationName) {
    try {
      await this.send({
        file: "subscriptionExpiry",
        subject: "Subscription Expired",
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Email;
