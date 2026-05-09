import { leaderboardCleanupWorker } from "./leaderboardCleanupWorker";
import { notificationsWorker } from "./notificationsWorker";
import { sessionTimeoutWorker } from "./sessionTimeoutWorker";

const workersList = [
  leaderboardCleanupWorker,
  notificationsWorker,
  sessionTimeoutWorker,
];

export async function closeWorkers() {
  for (const worker of workersList) {
    await worker.close();
  }
}
