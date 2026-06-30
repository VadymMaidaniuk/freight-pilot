import { config } from "dotenv";
import { closeDb, getDb } from "../src/db/client";
import {
  activityEvents,
  agentCoverages,
  agentMetrics,
  agentRequests,
  agents,
  attachments,
  quoteVersions,
  quotes,
  rateOptions,
  rateReplies,
  replyPlans,
  rfqCases,
  rfqFieldAssertions,
  rfqInputs,
  rfqRounds,
  rfqScenarios,
  tenants
} from "../src/db/schema";
import { seedAll } from "../src/lib/repositories/workspace-repository";

config({ path: ".env.local" });
config();

async function main() {
  const db = getDb();
  const reset = process.argv.includes("--reset");

  if (reset) {
    await db.delete(activityEvents);
    await db.delete(quoteVersions);
    await db.delete(quotes);
    await db.delete(rateOptions);
    await db.delete(rateReplies);
    await db.delete(replyPlans);
    await db.delete(agentRequests);
    await db.delete(rfqRounds);
    await db.delete(attachments);
    await db.delete(rfqFieldAssertions);
    await db.delete(rfqCases);
    await db.delete(rfqInputs);
    await db.delete(rfqScenarios);
    await db.delete(agentMetrics);
    await db.delete(agentCoverages);
    await db.delete(agents);
    await db.delete(tenants);
  }

  await seedAll(db);
  console.log(reset ? "Демо-база сброшена и заполнена." : "Демо-база заполнена.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
