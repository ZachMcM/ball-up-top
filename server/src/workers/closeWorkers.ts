import { leaderboardCleanupWorker } from "./leaderboardCleanupWorker";
import { notificationsWorker } from "./notificationsWorker";
import { sessionTimeoutWorker } from "./sessionTimeoutWorker";
import { unratedSessionsWorker } from "./unratedSessionsWorker";

const workersList = [
  leaderboardCleanupWorker,
  notificationsWorker,
  sessionTimeoutWorker,
  unratedSessionsWorker,
];

export async function closeWorkers() {
  for (const worker of workersList) {
    await worker.close();
  }
}
