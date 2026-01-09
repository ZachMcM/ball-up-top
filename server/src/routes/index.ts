import { Router } from "express";
import { courtSessionsRoute } from "./courtSessions";
import { courtsRoute } from "./courts";
import { usersRoute } from "./users";
import { placesRoute } from "./places";
import { playersRoute } from "./players";

export const routes = Router();

routes.use(courtSessionsRoute);
routes.use(courtsRoute);
routes.use(usersRoute)
routes.use(placesRoute)
routes.use(playersRoute)
