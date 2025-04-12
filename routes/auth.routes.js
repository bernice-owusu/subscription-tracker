import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) => {
  res.send({ title: "Sign up user" });
});

authRouter.post("/sign-in", (req, res) => {
  res.send({ title: "Sign in user" });
});

authRouter.post("/sign-out", (req, res) => {
  res.send({ title: "Sign out user" });
});

export default authRouter;
