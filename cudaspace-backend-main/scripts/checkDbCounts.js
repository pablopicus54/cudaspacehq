// Quick script to compare collection counts between current DB (cudaspace)
// and the previous DB (RobinPandey), using the existing Prisma schema.
// Usage: `node scripts/checkDbCounts.js`

/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const dotenv = require('dotenv');

// Load env from backend .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const currentUrl = process.env.DATABASE_URL;
if (!currentUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

function withDbName(baseUrl, dbName) {
  try {
    const u = new URL(baseUrl);
    // Ensure pathname is just the DB name
    u.pathname = `/${dbName}`;
    return u.toString();
  } catch (err) {
    // Fallback: naive replace for cases URL parsing fails
    return baseUrl.replace(/\/(.*?)\?/, `/${dbName}?`);
  }
}

async function getCounts(prisma) {
  const [users, blogs, packages, orders] = await Promise.all([
    prisma.user.count(),
    prisma.blog.count(),
    prisma.package.count(),
    prisma.order.count(),
  ]);
  return { users, blogs, packages, orders };
}

async function main() {
  const cudaspacePrisma = new PrismaClient({ datasources: { db: { url: currentUrl } } });

  const robinUrl = withDbName(currentUrl, 'RobinPandey');
  const robinPrisma = new PrismaClient({ datasources: { db: { url: robinUrl } } });

  console.log('Checking collection counts...');
  console.log('Current DB:', currentUrl);
  const cudaCounts = await getCounts(cudaspacePrisma);
  console.log('cudaspace counts:', cudaCounts);

  console.log('Old DB:', robinUrl);
  const robinCounts = await getCounts(robinPrisma);
  console.log('RobinPandey counts:', robinCounts);

  await cudaspacePrisma.$disconnect();
  await robinPrisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Error while checking DB counts:', err);
  process.exitCode = 1;
});