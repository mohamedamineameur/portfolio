import { Contact } from "../../database/models/Contact.model.js";
import { mailer } from "../../config/mailer.js";
import { mailTemplates } from "../../utils/mailTemplates.js";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export const contactService = {
  async findAll(): Promise<Contact[]> {
    return Contact.findAll({
      order: [["createdAt", "DESC"]],
    });
  },

  async findById(id: number): Promise<Contact | null> {
    return Contact.findByPk(id);
  },

  async create(data: {
    name: string;
    email: string;
    message: string;
  }): Promise<Contact> {
    const contact = await Contact.create(data);

    // Send email notification (non-blocking)
    if (env.EMAIL_FROM && env.SMTP_HOST) {
      try {
        const template = mailTemplates.contactForm(data);
        await mailer.sendMail({
          from: env.EMAIL_FROM,
          to: env.EMAIL_FROM,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      } catch (error) {
        logger.error("Failed to send contact email:", error);
        // Don't fail the request if email fails
      }
    }

    return contact;
  },

  async markAsRead(id: number): Promise<Contact> {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    await contact.update({ read: true });
    return contact;
  },

  async delete(id: number): Promise<void> {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    await contact.destroy();
  },
};
