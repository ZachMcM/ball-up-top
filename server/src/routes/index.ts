import { Router } from "express";
import { courtSessionsRoute } from "./courtSessions";
import { courtsRoute } from "./courts";
import { homeRoute } from "./home";
import { usersRoute } from "./users";
import { placesRoute } from "./places";

export const routes = Router();

routes.use(courtSessionsRoute);
routes.use(courtsRoute);
routes.use(homeRoute);
routes.use(usersRoute)
routes.use(placesRoute)
