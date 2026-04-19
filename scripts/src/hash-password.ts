/**
 * hash-password.ts
 *
 * Generates a bcrypt hash for the given plaintext password.
 * Usage:
 *   cd scripts
 *   npx tsx src/hash-password.ts "YourPlainPassword"
 *
 * Copy the printed hash into ADMIN_PASSWORD_HASH in your .env file.
 */

import bcrypt from "bcryptjs";

const plain = process.argv[2];

if (!plain) {
  console.error("Usage: npx tsx src/hash-password.ts \"YourPlainPassword\"");
  process.exit(1);
}

const hash = await bcrypt.hash(plain, 12);
console.log("\n✅  Paste this into your .env as ADMIN_PASSWORD_HASH:\n");
console.log(hash);
console.log();
