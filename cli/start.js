import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

export async function startAll() {
  const spinner = ora("Starting Mercur development environment...").start();

  const backendExists = fs.existsSync("backend");
  const storefrontExists = fs.existsSync("storefront");
  const vendorExists = fs.existsSync("vendor-panel");
  const adminPanelExists = fs.existsSync("admin-panel");

  console.log("Vadim molodec")
  if (!backendExists) {
    spinner.fail("Mercur backend not detected!");
    process.exit();
  }

  const servicesToRun = [];

  spinner.text = "Starting Mercur backend...";
  const backend = execa("yarn", ["dev"], {
    cwd: path.join(process.cwd(), "backend"),
  });
  servicesToRun.push(backend);

  if (adminPanelExists) {
    const adminPanel = execa("yarn", ["dev", "--port", "9001"], {
      cwd: path.join(process.cwd(), "admin-panel"),
    });
    servicesToRun.push(adminPanel);
  }

  if (storefrontExists) {
    spinner.text = "Starting Mercur storefront...";
    const storefront = execa("npm", ["run", "dev"], {
      cwd: path.join(process.cwd(), "storefront"),
    });
    servicesToRun.push(storefront);
  }

  if (vendorExists) {
    spinner.text = "Starting vendor panel...";
    const vendorPanel = execa("npm", ["run", "dev"], {
      cwd: path.join(process.cwd(), "vendor-panel"),
    });
    servicesToRun.push(vendorPanel);
  }

  spinner.succeed(chalk.green("Development environment started!"));
  console.log(chalk.blue("\nServices:"));
  console.log("- API: http://localhost:9000");

  if (adminPanelExists) {
    console.log("- Admin Panel: http://localhost:9001");
  }

  if (storefrontExists) {
    console.log("- B2C Storefront: http://localhost:3000");
  }

  if (vendorExists) {
    console.log("- Vendor Panel: http://localhost:5173");
  }

  process.on("SIGINT", async () => {
    console.log(chalk.yellow("\nShutting down services..."));
    servicesToRun.forEach((service) => service.kill());
    process.exit(0);
  });

  await Promise.all(servicesToRun);
}
