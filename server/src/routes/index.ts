import { Router } from "express";
import { courtSessionsRoute } from "./courtSessions";
import { courtsRoute } from "./courts";
import { usersRoute } from "./usersRoute";

export const routes = Router();

routes.use(courtSessionsRoute);
routes.use(courtsRoute);
routes.use(usersRoute)
