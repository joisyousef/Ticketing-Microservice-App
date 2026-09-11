import express, { type Request, type Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Invalid request parameters");
    }

    
    const { email, password } = req.body;
    console.log("Creating a user with email:", email, "and password:", password);

    throw new Error("Error connecting to the database");

    res.send({ message: "User created successfully" });
},
);

export { router as signupRouter };
