import { Router } from "express";
import { courtSessionsRoute } from "./courtSessions";
import { courtsRoute } from "./courts";
import { homeRoute } from "./home";
import { usersRoute } from "./users";

export const routes = Router();

routes.use(courtSessionsRoute);
routes.use(courtsRoute);
routes.use(homeRoute);
routes.use(usersRoute)
