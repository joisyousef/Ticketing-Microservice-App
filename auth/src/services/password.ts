import { scrypt, randomBytes, scryptSync } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  // Static Methods are methods that we can access
  // without creating an instance of a class

  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex"); // 1. random salt
    const buf = (await scryptSync(password, salt, 64)) as Buffer; // 2. hash it
    return `${buf.toString("hex")}.${salt}`; // 3. store hash + salt together
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedpassword, salt] = storedPassword.split("."); // 1. split back apart
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // 2. hash attempt w/ SAME salt
    return buf.toString("hex") === hashedpassword; // 3. compare hashes
  }
}
