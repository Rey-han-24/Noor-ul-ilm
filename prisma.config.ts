/**
 * Prisma Configuration for Noor ul Ilm
 * 
 * Prisma 7+ configuration file for database connection and migration settings
 */

import path from 'node:path';
import type { PrismaConfig } from 'prisma';

/**
 * Get the database URL from environment variables
 */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return url;
}

/**
 * Prisma configuration
 */
const config: PrismaConfig = {
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  
  // Migration configuration
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const { Pool } = await import('pg');
      
      const pool = new Pool({
        connectionString: getDatabaseUrl(),
      });
      
      return new PrismaPg(pool);
    },
  },
};

export default config;
