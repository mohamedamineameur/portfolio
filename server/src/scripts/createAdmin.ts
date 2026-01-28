import readline from "readline";
import { sequelize } from "../database/sequelize.js";
import { logger } from "../utils/logger.js";
import { hashPassword } from "../utils/hash.js";
import "../database/models/index.js";
import { User } from "../database/models/User.model.js";

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

function questionHidden(query: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    stdout.write(query);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let password = "";
    const onData = (char: string) => {
      char = char.toString();

      switch (char) {
        case "\n":
        case "\r":
        case "\u0004": // Ctrl+D
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          stdout.write("\n");
          resolve(password);
          break;
        case "\u0003": // Ctrl+C
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.exit(0);
          break;
        case "\u007f": // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write("\b \b");
          }
          break;
        default:
          password += char;
          stdout.write("*");
          break;
      }
    };

    stdin.on("data", onData);
  });
}

async function createAdmin(): Promise<void> {
  let rl: readline.Interface | null = createReadlineInterface();

  try {
    logger.info("Création d'un utilisateur administrateur...");

    // Connect to database
    await sequelize.authenticate();
    logger.info("Connexion à la base de données réussie");

    // Ask for email
    const email = await question(rl, "Adresse email: ");
    if (!email || !email.trim()) {
      logger.error("L'adresse email est requise");
      if (rl) rl.close();
      await sequelize.close();
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      logger.error("Format d'email invalide");
      if (rl) rl.close();
      await sequelize.close();
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.trim() } });
    if (existingUser) {
      logger.error(`Un utilisateur avec l'email ${email.trim()} existe déjà`);
      if (rl) rl.close();
      await sequelize.close();
      process.exit(1);
    }

    if (rl) {
      rl.close();
      rl = null;
    }

    // Ask for password (hidden)
    const password = await questionHidden("Mot de passe: ");
    if (!password || password.length < 6) {
      logger.error("Le mot de passe doit contenir au moins 6 caractères");
      await sequelize.close();
      process.exit(1);
    }

    // Confirm password (hidden)
    const confirmPassword = await questionHidden("Confirmer le mot de passe: ");
    if (password !== confirmPassword) {
      logger.error("Les mots de passe ne correspondent pas");
      await sequelize.close();
      process.exit(1);
    }

    // Hash password
    logger.info("Hachage du mot de passe...");
    const hashedPassword = await hashPassword.hash(password);

    // Create admin user
    logger.info("Création de l'utilisateur administrateur...");
    const admin = await User.create({
      email: email.trim(),
      password: hashedPassword,
      role: "admin",
    });

    logger.info(`✅ Utilisateur administrateur créé avec succès !`);
    logger.info(`   Email: ${admin.email}`);
    logger.info(`   ID: ${admin.id}`);
    logger.info(`   Rôle: ${admin.role}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error("Erreur lors de la création de l'administrateur:", error);
    if (rl) rl.close();
    await sequelize.close();
    process.exit(1);
  }
}

createAdmin().catch((error) => {
  logger.error("Erreur non gérée:", error);
  process.exit(1);
});
