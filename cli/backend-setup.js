import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import ora from "ora";

export async function backendSetup(options) {
  const targetDir = options.directory;
  const spinner = ora("Setting up Mercur backend...").start();
  const DB_URL = `postgres://${options.db_user}:${options.db_pass}@${options.db_url}:${options.db_port}/${options.db_name}`;

  await fs.writeFile(
    path.join(targetDir, "backend/.env"),
    `STORE_CORS=http://localhost:3001
ADMIN_CORS=http://localhost:9000,http://localhost:9001
VENDOR_CORS=http://localhost:5173
AUTH_CORS=http://localhost:9000,http://localhost:9001,http://localhost:5173,http://localhost:3001
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=${DB_URL}

ALGOLIA_APP_ID=XXX
ALGOLIA_API_KEY=supersecret

STRIPE_SECRET_API_KEY=supersecret
STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET=supersecret

RESEND_API_KEY=supersecret
RESEND_FROM_EMAIL=onboarding@resend.dev

VITE_TALK_JS_APP_ID=xxx
VITE_TALK_JS_SECRET_API_KEY=xxx
    `
  );

  spinner.text = "Setting up database...";
  await execa("npx", ["medusa", "db:create", "--db", options.db_name], {
    cwd: path.join(targetDir, "backend"),
  });

  spinner.text = "Running migrations...";
  await execa("npx", ["medusa", "db:migrate"], {
    cwd: path.join(targetDir, "backend"),
  });

  spinner.text = "Seeding data...";

  await execa(
    "npx",
    ["medusa", "user", "--email", "admin@mercurjs.com", "--password", "admin"],
    {
      cwd: path.join(targetDir, "backend"),
    }
  );

  const result = await execa("yarn", ["seed"], {
    cwd: path.join(targetDir, "backend"),
  });

  const pkstart = result.stdout.indexOf("pk_");
  const publishableKey = result.stdout.substring(pkstart, pkstart + 67);

  spinner.succeed("Backend ready!");
  return publishableKey;
}
