import { Router } from "express";
import { courtSessionsRoute } from "./courtSessions";
import { courtsRoute } from "./courts";

export const routes = Router();

routes.use(courtSessionsRoute);
routes.use(courtsRoute);
