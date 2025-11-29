import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { auth } from "../utils/auth";
import { limiter } from "../utils/limiter";
import { routes } from "./routes";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan("combined"));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(limiter);
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
