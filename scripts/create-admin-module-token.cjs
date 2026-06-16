#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const ROOT = path.resolve(__dirname, "..");
const CONTRACTS_DIR = path.resolve(ROOT, "..", "contracts");
const CONTRACTS_ENV = path.join(CONTRACTS_DIR, ".env");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
  return env;
}

function hashKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function generateToken() {
  return `yibi_admin_${crypto.randomBytes(32).toString("base64url")}`;
}

function localDatabaseUrl(url) {
  return url.replace("@postgres:", "@localhost:");
}

function upsertEnvValue(content, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) return content.replace(pattern, line);
  return `${content.replace(/\s*$/, "")}\n${line}\n`;
}

async function main() {
  const productionEnv = parseEnvFile(path.join(ROOT, ".env.production"));
  const databaseUrl = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : localDatabaseUrl(productionEnv.DATABASE_URL || "");

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  fs.mkdirSync(CONTRACTS_DIR, { recursive: true });
  let contractsEnv = fs.existsSync(CONTRACTS_ENV)
    ? fs.readFileSync(CONTRACTS_ENV, "utf8")
    : "YIBI_BASE_URL=http://localhost:3000\n";

  const existingToken = parseEnvFile(CONTRACTS_ENV).ADMIN_TOKEN;
  const token = existingToken || generateToken();
  const keyHash = hashKey(token);

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const existing = await client.query(
      'select id, active from "ModuleApiKey" where "keyHash" = $1 limit 1',
      [keyHash],
    );

    if (existing.rowCount === 0) {
      await client.query(
        `insert into "ModuleApiKey"
          (id, "moduleKey", "keyHash", "userId", description, active, "createdAt", "revokedAt")
         values ($1, $2, $3, null, $4, true, now(), null)`,
        [
          `module_api_key_${crypto.randomUUID()}`,
          "admin",
          keyHash,
          "Admin module key for submodule credit consumption",
        ],
      );
    } else if (!existing.rows[0].active) {
      await client.query(
        'update "ModuleApiKey" set active = true, "revokedAt" = null where id = $1',
        [existing.rows[0].id],
      );
    }
  } finally {
    await client.end();
  }

  contractsEnv = upsertEnvValue(contractsEnv, "YIBI_BASE_URL", "http://localhost:3000");
  contractsEnv = upsertEnvValue(contractsEnv, "ADMIN_TOKEN", token);
  contractsEnv = upsertEnvValue(contractsEnv, "ADMIN_MODULE_KEY", "admin");
  fs.writeFileSync(CONTRACTS_ENV, contractsEnv);

  console.log(`ADMIN_TOKEN=${token}`);
  console.log("moduleKey=admin");
  console.log(`contractsEnv=${CONTRACTS_ENV}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
