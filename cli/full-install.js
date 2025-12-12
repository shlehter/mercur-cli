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
  const { project_name } = await inquirer.prompt({
    type: "input",
    name: "project_name",
    message: "What is your project name?",
    default: "mercur",
  });

  const { install_storefront } = await inquirer.prompt({
    type: "confirm",
    name: "install_storefront",
    message: "Install storefront?",
    default: true,
  });

  const { install_vendor } = await inquirer.prompt({
    type: "confirm",
    name: "install_vendor",
    message: "Install vendor panel?",
    default: true,
  });

  const { db_url } = await inquirer.prompt({
    type: "input",
    name: "db_url",
    message: "Database address:",
    default: "localhost",
  });

  const { db_port } = await inquirer.prompt({
    type: "input",
    name: "db_port",
    message: "Database port:",
    default: "5432",
  });

  const { db_user } = await inquirer.prompt({
    type: "input",
    name: "db_user",
    message: "Database user:",
    default: "postgres",
  });

  const { db_pass } = await inquirer.prompt({
    type: "input",
    name: "db_pass",
    message: "Database password:",
    default: "postgres",
  });

  const { db_name } = await inquirer.prompt({
    type: "input",
    name: "db_name",
    message: "Database name:",
    default: "mercurjs",
  });

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
