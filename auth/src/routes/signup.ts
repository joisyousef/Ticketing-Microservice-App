import express from "express";

const router = express.Router();

router.post("/api/users/signup", (req, res) => {
    res.send('Hi there! This is the signup route.');
});

export { router as signupRouter };
