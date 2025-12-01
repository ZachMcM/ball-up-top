import { Router } from "express";
import { courtSessionsRoute } from "./courts";

export const routes = Router();

routes.use(courtSessionsRoute);
