import fs from "fs-extra";
import path from "path";
import ora from "ora";

export async function storefrontSetup(options) {
  const targetDir = options.directory;
  const spinner = ora("Setting up Mercur storefront...").start();

  await fs.writeFile(
    path.join(targetDir, "storefront/.env.local"),
    `MEDUSA_BACKEND_URL=https://backend.market.tlakepro.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${options.publishableKey}
NEXT_PUBLIC_BASE_URL=https://market.tlakepro.com
NEXT_PUBLIC_DEFAULT_REGION=pl
NEXT_PUBLIC_STRIPE_KEY=supersecret
REVALIDATE_SECRET=supersecret
NEXT_PUBLIC_SITE_NAME="TLakePro market"
NEXT_PUBLIC_SITE_DESCRIPTION="TLakePro Marketplace"
NEXT_PUBLIC_ALGOLIA_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=`
  );

  spinner.succeed("Storefront ready!");
}

export async function adminPanelSetup(options) {
  const targetDir = options.directory;
  const spinner = ora("Setting up Mercur admin panel...").start();

  await fs.writeFile(
    path.join(targetDir, "admin-panel/.env"),
    `
    VITE_MEDUSA_BASE='/'
VITE_MEDUSA_STOREFRONT_URL=https://market.tlakepro.com
VITE_MEDUSA_BACKEND_URL=https://backend.market.tlakepro.com
VITE_MEDUSA_B2B_PANEL=true
    `
  );

  spinner.succeed("Admin panel ready!");
}

export async function vendorPanelSetup(options) {
  const targetDir = options.directory;
  const spinner = ora("Setting up Mercur vendor panel...").start();

  await fs.writeFile(
    path.join(targetDir, "vendor-panel/.env"),
    `VITE_MEDUSA_BASE=/
VITE_MEDUSA_STOREFRONT_URL=https://market.tlakepro.com
VITE_MEDUSA_BACKEND_URL=https://backend.market.tlakepro.com
VITE_PUBLISHABLE_API_KEY=
VITE_TALK_JS_APP_ID=
VITE_DISABLE_SELLERS_REGISTRATION=false`
  );

  spinner.succeed("Vendor panel ready!");
}
