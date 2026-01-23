import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../database/models/User.model.js";
import { hashPassword } from "../utils/hash.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email: string, password: string, done): void => {
      (async (): Promise<void> => {
        try {
          const user = await User.findOne({ where: { email } });
          if (!user) {
            done(null, false, { message: "Invalid credentials" });
            return;
          }

          const isValid = await hashPassword.compare(password, user.password);
          if (!isValid) {
            done(null, false, { message: "Invalid credentials" });
            return;
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      })().catch(() => {
        // Error already handled in try/catch
      });
    }
  )
);

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done): void => {
  (async (): Promise<void> => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  })().catch((): void => {
    // Error already handled in try/catch
  });
});

export default passport;
