import { scrypt, randomBytes, scryptSync } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  // Static Methods are methods that we can access
  // without creating an instance of a class

  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptSync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static compare(storedPassword: string, suppliedPassword: string) {}
}
