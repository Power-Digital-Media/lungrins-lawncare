/**
 * Scroll-and-capture: grabs images as we scroll so Facebook's 
 * DOM virtualization can't hide them.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'jobs', 'all-scraped');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close(); fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { if (fs.existsSync(destPath)) fs.unlinkSync(destPath); reject(err); });
  });
}

async function main() {
  console.log('\n🌿 Smart Image Scraper — Scroll & Capture\n');

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  } catch (e) {
    console.error('❌ Cannot connect to Chrome:', e.message);
    process.exit(1);
  }
  console.log('✅ Connected to Chrome!\n');

  const page = browser.contexts()[0]?.pages()[0];
  if (!page) { console.error('❌ No page found'); process.exit(1); }

  // Make sure we're on the right page
  const url = page.url();
  if (!url.includes('LungrinsLawncare') && !url.includes('lungrin')) {
    console.log('📍 Navigating to Lungrin\'s page...');
    await page.goto('https://www.facebook.com/LungrinsLawncare', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
  }

  // Scroll to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);

  const allImageUrls = new Set();
  let scrollCount = 0;
  let staleCount = 0;
  let previousHeight = 0;

  console.log('📜 Scrolling down and capturing images at every step...\n');

  // Scroll down slowly, capturing images at each position
  while (scrollCount < 150) {
    // Capture all content images currently in DOM
    const newImages = await page.evaluate(() => {
      const imgs = [];
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || '';
        if ((src.includes('scontent') || src.includes('fbcdn')) &&
            !src.includes('emoji') && !src.includes('rsrc.php') &&
            !src.includes('static.xx') && src.length > 50) {
          const rect = img.getBoundingClientRect();
          const w = img.naturalWidth || rect.width;
          const h = img.naturalHeight || rect.height;
          if (w > 80) {
            imgs.push({ src, w, h });
          }
        }
      });
      // Also check picture > source srcset
      document.querySelectorAll('picture source').forEach(source => {
        const srcset = source.getAttribute('srcset') || '';
        srcset.split(',').forEach(s => {
          const url = s.trim().split(' ')[0];
          if ((url.includes('scontent') || url.includes('fbcdn')) && url.length > 50) {
            imgs.push({ src: url, w: 0, h: 0 });
          }
        });
      });
      return imgs;
    });

    let newCount = 0;
    for (const img of newImages) {
      if (!allImageUrls.has(img.src)) {
        allImageUrls.add(img.src);
        newCount++;
      }
    }

    if (newCount > 0) {
      console.log(`   Scroll ${scrollCount + 1}: +${newCount} new images (${allImageUrls.size} total)`);
    }

    // Scroll down by ~80% of viewport
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8));
    await page.waitForTimeout(1500);
    scrollCount++;

    // Check if we've reached the bottom
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) {
      staleCount++;
      if (staleCount >= 5) {
        console.log(`\n   Reached bottom after ${scrollCount} scrolls.`);
        break;
      }
    } else {
      staleCount = 0;
    }
    previousHeight = currentHeight;

    if (scrollCount % 10 === 0) {
      console.log(`   --- ${scrollCount} scrolls, ${allImageUrls.size} images collected ---`);
    }
  }

  console.log(`\n📊 Total unique image URLs collected: ${allImageUrls.size}\n`);

  // Filter to only real content images (skip tiny profile pics)
  // We'll download everything and sort by size after
  ensureDir(OUTPUT_DIR);

  const urls = Array.from(allImageUrls);
  let downloaded = 0;
  let failed = 0;

  console.log('💾 Downloading all images...\n');

  for (let i = 0; i < urls.length; i++) {
    const dest = path.join(OUTPUT_DIR, `${i + 1}.jpg`);
    try {
      await downloadFile(urls[i], dest);
      const stats = fs.statSync(dest);
      const sizeKB = (stats.size / 1024).toFixed(1);
      
      // Delete tiny files (< 5KB = definitely icons/emojis)
      if (stats.size < 5000) {
        fs.unlinkSync(dest);
        continue;
      }
      
      downloaded++;
      const label = stats.size > 30000 ? '📸 JOB PHOTO' : '🖼️  small';
      console.log(`   ✅ ${i + 1}.jpg — ${sizeKB}KB ${label}`);
    } catch (e) {
      failed++;
    }
  }

  // Renumber the remaining files sequentially
  const remainingFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('.jpg', ''));
      const numB = parseInt(b.replace('.jpg', ''));
      return numA - numB;
    });

  // Renumber
  for (let i = 0; i < remainingFiles.length; i++) {
    const oldPath = path.join(OUTPUT_DIR, remainingFiles[i]);
    const newPath = path.join(OUTPUT_DIR, `${i + 1}.jpg`);
    if (oldPath !== newPath) {
      const tempPath = path.join(OUTPUT_DIR, `_temp_${i + 1}.jpg`);
      fs.renameSync(oldPath, tempPath);
    }
  }
  // Second pass to remove temp prefix
  const tempFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('_temp_'));
  for (const f of tempFiles) {
    const newName = f.replace('_temp_', '');
    fs.renameSync(path.join(OUTPUT_DIR, f), path.join(OUTPUT_DIR, newName));
  }

  const finalCount = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.jpg')).length;

  console.log(`\n╔═══════════════════════════════════════════╗`);
  console.log(`║  📊 SCRAPE COMPLETE                       ║`);
  console.log(`║  Total images saved: ${String(finalCount).padEnd(20)}  ║`);
  console.log(`║  Location: public/images/jobs/all-scraped/ ║`);
  console.log(`╚═══════════════════════════════════════════╝\n`);

  try { browser.disconnect(); } catch(e) {}
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
