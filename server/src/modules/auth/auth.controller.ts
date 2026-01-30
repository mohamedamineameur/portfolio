import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import type { z } from "zod";
import type { User } from "../../database/models/User.model.js";

type RegisterBody = z.infer<typeof registerSchema>;
type LoginBody = z.infer<typeof loginSchema>;

export const authController = {
  register: async (
    req: Request<unknown, unknown, RegisterBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.status(201).json({
        message: "User created successfully",
        user: { id: user.id, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  },

  login: (req: Request<unknown, unknown, LoginBody>, res: Response, next: NextFunction): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    passport.authenticate("local", (err: Error | null, user: User | false) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        res.json({
          message: "Login successful",
          user: { id: user.id, email: user.email },
        });
      });
    })(req, res, next);
  },

  logout: (req: Request, res: Response): void => {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ error: "Logout failed" });
        return;
      }
      req.session.destroy(() => {
        res.json({ message: "Logout successful" });
      });
    });
  },

  me: (req: Request, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  },
};
