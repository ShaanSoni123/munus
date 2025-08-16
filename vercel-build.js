#!/usr/bin/env node

/**
 * Vercel Build Script for Munus Frontend
 * This ensures proper build process on Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Verify build output
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output directory "dist" not found!');
  }
  
  const files = fs.readdirSync(distPath);
  console.log('✅ Build completed successfully!');
  console.log('📁 Build output files:', files);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
