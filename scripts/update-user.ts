/**
 * Script to update user password and role
 * Run with: npx tsx scripts/update-user.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: 'reyhanbutt18@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('📋 Current user:', { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });
    
    // Update password and role
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const updated = await prisma.user.update({
      where: { email: 'reyhanbutt18@gmail.com' },
      data: {
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    });
    
    console.log('✅ Updated user:', { 
      id: updated.id, 
      email: updated.email, 
      role: updated.role 
    });
    console.log('🔐 New password: password123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
