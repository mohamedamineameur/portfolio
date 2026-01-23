export const mailTemplates = {
  contactForm: (data: {
    name: string;
    email: string;
    message: string;
  }): { subject: string; html: string; text: string } => {
    return {
      subject: `Nouveau message de contact - ${data.name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
Nouveau message de contact

Nom: ${data.name}
Email: ${data.email}

Message:
${data.message}
      `,
    };
  },
};
