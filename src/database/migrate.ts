import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "./connection";

const runMigrations = async () => {
  await Database.getInstance().connect();
  const db = Database.getInstance().getDb();
  console.log("Running database migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations completed.");
  // Bun seems to hang otherwise, so we explicitly exit.
  process.exit(0);
};

runMigrations();
