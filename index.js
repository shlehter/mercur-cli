#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import { fullInstall } from "./cli/full-install.js";
import { startAll } from "./cli/start.js";

console.log(
  chalk.blue(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   ${chalk.bold("Mercur - Open Source Marketplace Platform")}   ║
║                                               ║
╚═══════════════════════════════════════════════╝
`)
);

program.option("-v, --version", "Show version").action(() => {
  console.log(chalk.blue(`Mercur CLI v0.1.7`));
  process.exit(0);
});

program
  .command("install")
  .version("1.1.0")
  .description("Perform full installation of Mercur")
  .action(fullInstall);

program
  .command("dev")
  .version("1.0.0")
  .description("Start all Mercur components")
  .action(startAll);

program.parse(process.argv);
