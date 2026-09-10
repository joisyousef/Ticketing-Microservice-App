import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
    res.send('Hi there! This is the current user route.');
    
});

export { router as currentUserRouter };
