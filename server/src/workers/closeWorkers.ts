import { leaderboardCleanupWorker } from "./leaderboardCleanupWorker";
import { notificationsWorker } from "./notificationsWorker";
import { sessionRatingReminderWorker } from "./sessionRatingReminderWorker";
import { sessionTimeoutWorker } from "./sessionTimeoutWorker";

const workersList = [
  leaderboardCleanupWorker,
  notificationsWorker,
  sessionRatingReminderWorker,
  sessionTimeoutWorker,
];

export async function closeWorkers() {
  for (const worker of workersList) {
    await worker.close();
  }
}
