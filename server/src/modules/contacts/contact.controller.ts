import { Request, Response, NextFunction } from "express";
import { contactService } from "./contact.service.js";
import { createContactSchema } from "./contact.schema.js";
import type { z } from "zod";

type CreateContactBody = z.infer<typeof createContactSchema>;

export const contactController = {
  findAll: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const contacts = await contactService.findAll();
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  },

  findById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const contact = await contactService.findById(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },

  create: async (
    req: Request<unknown, unknown, CreateContactBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body: CreateContactBody = req.body;
      const contact = await contactService.create(body);
      res.status(201).json({
        message: "Contact message sent successfully",
        contact,
      });
    } catch (error) {
      next(error);
    }
  },

  markAsRead: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const contact = await contactService.markAsRead(id);
      res.json(contact);
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      await contactService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
