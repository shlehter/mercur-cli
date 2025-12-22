import chalk from "chalk";
import inquirer from "inquirer";
import { pullAndInstall } from "./pull-and-install.js";
import { backendSetup } from "./backend-setup.js";
import {
  storefrontSetup,
  vendorPanelSetup,
  adminPanelSetup,
} from "./frontend-setup.js";

export async function fullInstall() {
  const project_name = "mercur"
  const install_storefront = true
  const install_vendor = true
  const db_url = "postgres"
  const db_port = 5432
  const db_user = "postgres"
  const db_pass = "postgres"
  const db_name = "mercurjs"

  console.log(chalk.blue("Downloading Mercur"));
  await pullAndInstall({
    directory: project_name,
    install_storefront,
    install_vendor,
  });
  console.log(chalk.blue("Setting up Mercur"));
  const publishableKey = await backendSetup({
    db_name,
    db_pass,
    db_port,
    db_url,
    db_user,
    directory: project_name,
  });

  await adminPanelSetup({ directory: project_name });

  if (install_storefront) {
    await storefrontSetup({ directory: project_name, publishableKey });
  }

  if (install_vendor) {
    await vendorPanelSetup({ directory: project_name });
  }

  console.log(chalk.greenBright("=== Mercur ready! ==="));
  console.log(chalk.blue("Here are your credentials:"));
  console.log(`
    ${chalk.bold("Admin panel:")}
    login: ${chalk.cyanBright("admin@mercurjs.com")}
    password: ${chalk.cyanBright("admin")}
    
    `);
  console.log(`
    ${chalk.bold("Vendor panel:")}
    login: ${chalk.cyanBright("seller@mercurjs.com")}
    password: ${chalk.cyanBright("secret")}
    
    `);
}
