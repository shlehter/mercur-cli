import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import {
  b2cDependencies,
  b2cMedusaConfigTemplate,
  getSeedScript,
} from "./data.js";

export async function pullAndInstall(options) {
  const targetDir = path.resolve(process.cwd(), options.directory);

  const spinner = ora("Setting up Mercur...").start();
  await fs.ensureDir(targetDir);

  spinner.text = "Installing Mercur backend...";
  await execa(
    "git",
    ["clone", "https://github.com/mercurjs/clean-medusa-starter", "backend"],
    {
      cwd: targetDir,
    }
  );

  for (const dependency of b2cDependencies) {
    await execa("yarn", ["add", dependency], {
      cwd: path.join(targetDir, "backend"),
    });
  }

  await fs.remove(path.join(targetDir, "backend/medusa-config.ts"));

  await fs.writeFile(
    path.join(targetDir, "backend/medusa-config.ts"),
    b2cMedusaConfigTemplate
  );

  const seedScript = await getSeedScript();

  await fs.writeFile(
    path.join(targetDir, "backend/src/scripts/seed.ts"),
    seedScript.seedScript
  );

  await fs.mkdir(path.join(targetDir, "backend/src/scripts/seed"));
  await fs.writeFile(
    path.join(targetDir, "backend/src/scripts/seed/seed-functions.ts"),
    seedScript.seedFunctions
  );

  await fs.writeFile(
    path.join(targetDir, "backend/src/scripts/seed/seed-products.ts"),
    seedScript.seedProducts
  );

  await execa("yarn", ["install"], { cwd: path.join(targetDir, "backend") });

  spinner.text = "Installing Mercur admin panel...";
  await execa(
    "git",
    ["clone", "https://github.com/mercurjs/admin-panel.git", "admin-panel"],
    {
      cwd: targetDir,
    }
  );
  await execa("yarn", ["install"], {
    cwd: path.join(targetDir, "admin-panel"),
  });

  if (options.install_storefront) {
    spinner.text = "Installing Mercur storefront...";
    await execa(
      "git",
      [
        "clone",
        "https://github.com/mercurjs/b2c-marketplace-storefront.git",
        "storefront",
      ],
      {
        cwd: targetDir,
      }
    );
    await execa("npm", ["install"], {
      cwd: path.join(targetDir, "storefront"),
    });
  }

  if (options.install_vendor) {
    spinner.text = "Installing Mercur vendor panel...";
    await execa(
      "git",
      ["clone", "https://github.com/mercurjs/vendor-panel.git", "vendor-panel"],
      {
        cwd: targetDir,
      }
    );
    await execa("npm", ["install"], {
      cwd: path.join(targetDir, "vendor-panel"),
    });
  }

  spinner.succeed("Download complete!");
}
