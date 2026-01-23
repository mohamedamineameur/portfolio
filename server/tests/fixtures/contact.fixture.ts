import { Contact } from "../../src/database/models/Contact.model.js";

export async function createContact(data?: {
  name?: string;
  email?: string;
  message?: string;
  read?: boolean;
}): Promise<Contact> {
  const name = data?.name || "John Doe";
  const email = data?.email || "john@example.com";
  const message = data?.message || "This is a test contact message";
  const read = data?.read || false;

  return Contact.create({
    name,
    email,
    message,
    read,
  });
}
