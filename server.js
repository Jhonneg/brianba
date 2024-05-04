import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import "dotenv/config";
import helmet from "helmet";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfileGet from "./controllers/profiles.js";
import handleImage from "./controllers/image.js";

const port = process.env.PORT;

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI,
});
console.log(process.env.POSTGRES_URI);

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());

app.post("/signin", (req, res) => {
  handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  handleImage(req, res, db);
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
