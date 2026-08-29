/**
 * Lungrin's Lawncare — Facebook Job Scraper
 * 
 * This script:
 *   1. Opens a real browser window (you log into Facebook manually)
 *   2. Navigates to the Lungrin's Lawncare page
 *   3. Scrolls through all posts
 *   4. Extracts post text and downloads all photos
 *   5. Saves everything into job-XX/ folders
 *   6. Generates a jobs.json manifest
 * 
 * Usage:  node scrape-facebook-jobs.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ── Config ──────────────────────────────────────────────────────
const FB_PAGE_URL = 'https://www.facebook.com/LungrinsLawncare';
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'jobs');
const MANIFEST_PATH = path.join(__dirname, 'public', 'images', 'jobs.json');
const SCROLL_PAUSE_MS = 2500;       // Wait between scroll attempts
const MAX_SCROLL_ATTEMPTS = 80;     // Max scrolls before stopping
const LOGIN_TIMEOUT_MS = 300000;    // 5 min to log in manually

// ── Helpers ─────────────────────────────────────────────────────

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', (err) => { fs.unlinkSync(destPath); reject(err); });
    }).on('error', (err) => {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

function sanitizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function guessTag(text) {
  const lower = text.toLowerCase();
  if (lower.includes('pine straw') || lower.includes('mulch') || lower.includes('flowerbed') || lower.includes('flower bed')) {
    return 'Pine Straw & Beds';
  }
  if (lower.includes('pond') || lower.includes('perimeter') || lower.includes('bank')) {
    return 'Pond Perimeter';
  }
  if (lower.includes('fence') || lower.includes('overgrown') || lower.includes('overgrowth') || lower.includes('brush') || lower.includes('clearing')) {
    return 'Heavy Clearing';
  }
  if (lower.includes('gutter')) {
    return 'Gutter Cleaning';
  }
  if (lower.includes('bush') || lower.includes('hedge') || lower.includes('trim') || lower.includes('shrub')) {
    return 'Bush & Hedge Trimming';
  }
  if (lower.includes('debris') || lower.includes('haul') || lower.includes('junk') || lower.includes('cleanup') || lower.includes('clean up')) {
    return 'Debris Cleanup';
  }
  if (lower.includes('mow') || lower.includes('edge') || lower.includes('edging') || lower.includes('stripe') || lower.includes('cut')) {
    return 'Mowing & Edging';
  }
  if (lower.includes('leaf') || lower.includes('leaves')) {
    return 'Leaf Removal';
  }
  return 'Lawn Care';
}

function guessLocation(text) {
  const lower = text.toLowerCase();
  if (lower.includes('pocahontas')) return 'Pocahontas, MS';
  if (lower.includes('bentonia')) return 'Bentonia, MS';
  if (lower.includes('madison')) return 'Madison County, MS';
  if (lower.includes('canton')) return 'Canton, MS';
  if (lower.includes('flora')) return 'Flora, MS';
  // Default — most jobs are Flora
  return 'Flora, MS';
}

// ── Main Scraper ────────────────────────────────────────────────

async function main() {
  console.log('\n🌿 Lungrin\'s Lawncare — Facebook Job Scraper');
  console.log('═══════════════════════════════════════════════\n');

  // Launch Chrome directly with executablePath
  console.log('🚀 Launching Chrome...');

  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--start-maximized',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // ── Step 1: Navigate to Facebook ────────────────────────────
  console.log('📖 Opening Facebook...');
  await page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  👉  LOG INTO FACEBOOK in the Chrome window.         ║');
  console.log('║  The window should be visible on your taskbar.       ║');
  console.log('║  Once you see your News Feed, the script continues.  ║');
  console.log('║  Waiting up to 5 minutes...                          ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  // Wait for login
  try {
    await page.waitForFunction(() => {
      return document.querySelector('[aria-label="Your profile"]')
        || document.querySelector('div[role="feed"]')
        || document.querySelector('[role="banner"] [role="navigation"]')
        || document.querySelectorAll('a[href*="/me"]').length > 0;
    }, { timeout: LOGIN_TIMEOUT_MS });
    console.log('✅ Login detected! Proceeding...\n');
  } catch (e) {
    console.log('⏰ Login timeout. Continuing anyway...\n');
  }
  await page.waitForTimeout(2000);

  // ── Step 2: Navigate to the Lungrin's Lawncare page ─────────
  console.log(`📍 Navigating to ${FB_PAGE_URL}...`);
  await page.goto(FB_PAGE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Try to click "Posts" tab if visible
  try {
    const postsTab = page.locator('a:has-text("Posts")').first();
    if (await postsTab.isVisible({ timeout: 3000 })) {
      await postsTab.click();
      console.log('   Clicked "Posts" tab.');
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    // Posts tab might not be a separate link, that's OK
  }

  // ── Step 3: Scroll to load all posts ────────────────────────
  console.log('📜 Scrolling to load all posts...');
  
  let previousHeight = 0;
  let staleCount = 0;

  for (let i = 0; i < MAX_SCROLL_ATTEMPTS; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(SCROLL_PAUSE_MS);

    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) {
      staleCount++;
      if (staleCount >= 5) {
        console.log(`   Reached bottom after ${i + 1} scrolls.`);
        break;
      }
    } else {
      staleCount = 0;
    }
    previousHeight = currentHeight;

    if ((i + 1) % 10 === 0) {
      console.log(`   ... scrolled ${i + 1} times, page height: ${currentHeight}px`);
    }
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // ── Step 4: Extract posts ───────────────────────────────────
  console.log('\n🔍 Extracting posts...');

  const posts = await page.evaluate(() => {
    const results = [];
    
    // Facebook wraps each post in a div with role="article" 
    const articles = document.querySelectorAll('div[role="article"]');
    
    articles.forEach((article, index) => {
      try {
        // Get the post text content
        // Facebook post text is usually in a div with data-ad-preview="message"
        // or within the main content area of the article
        let textContent = '';
        
        // Try multiple selectors for post text
        const textSelectors = [
          '[data-ad-preview="message"]',
          'div[data-ad-comet-preview="message"]',
          'div[dir="auto"]',
        ];
        
        for (const sel of textSelectors) {
          const textEls = article.querySelectorAll(sel);
          if (textEls.length > 0) {
            textContent = Array.from(textEls)
              .map(el => el.innerText || el.textContent)
              .join(' ')
              .trim();
            if (textContent.length > 20) break;
          }
        }

        // If still no text, grab all text from the article
        if (textContent.length < 20) {
          textContent = article.innerText || '';
        }

        // Get the timestamp/date
        let dateText = '';
        const timeEl = article.querySelector('a[href*="/posts/"] span') 
          || article.querySelector('span[id] a[role="link"]')
          || article.querySelector('a[aria-label*="ago"]')
          || article.querySelector('abbr')
          || article.querySelector('span:has(> a[href*="/permalink/"])');
        
        if (timeEl) {
          dateText = timeEl.getAttribute('aria-label') 
            || timeEl.getAttribute('title') 
            || timeEl.innerText 
            || '';
        }

        // Get all image URLs from the post
        const images = [];
        const imgEls = article.querySelectorAll('img');
        imgEls.forEach(img => {
          const src = img.src || '';
          // Filter: only get actual post photos (not profile pics, reactions, etc.)
          // Post photos are typically large and from scontent servers
          if (src.includes('scontent') && 
              !src.includes('emoji') &&
              !src.includes('rsrc.php') &&
              img.naturalWidth > 100) {
            // Try to get the highest resolution version
            const highResSrc = src.replace(/\/s[0-9]+x[0-9]+\//, '/s2048x2048/')
                                  .replace(/\/p[0-9]+x[0-9]+\//, '/');
            images.push(highResSrc);
          }
        });

        // Also check for background images in photo containers
        const photoDivs = article.querySelectorAll('div[style*="background-image"]');
        photoDivs.forEach(div => {
          const style = div.getAttribute('style') || '';
          const match = style.match(/url\(["']?(https:\/\/scontent[^"')]+)["']?\)/);
          if (match && match[1]) {
            images.push(match[1]);
          }
        });

        // Deduplicate images
        const uniqueImages = [...new Set(images)];

        // Only include posts that have images (these are job posts)
        if (uniqueImages.length > 0 || textContent.length > 50) {
          results.push({
            index,
            text: textContent.substring(0, 2000), // Cap text length
            date: dateText,
            imageUrls: uniqueImages,
            imageCount: uniqueImages.length,
          });
        }
      } catch (err) {
        // Skip problematic articles
      }
    });

    return results;
  });

  console.log(`   Found ${posts.length} posts with content.\n`);

  // ── Step 5: Filter to job posts (have images) ───────────────
  const jobPosts = posts.filter(p => p.imageUrls.length > 0);
  console.log(`📸 ${jobPosts.length} posts have photos (likely job posts).\n`);

  if (jobPosts.length === 0) {
    console.log('⚠️  No posts with images found. This can happen if:');
    console.log('    - Facebook loaded the page differently');
    console.log('    - Posts haven\'t fully rendered');
    console.log('');
    console.log('    Trying alternative image extraction...\n');

    // Alternative: try to get all images visible on the page
    const allImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => {
          const src = img.src || '';
          return src.includes('scontent') && 
                 !src.includes('emoji') && 
                 !src.includes('rsrc.php') &&
                 img.naturalWidth > 200;
        })
        .map(img => img.src);
    });

    console.log(`   Found ${allImages.length} content images on the page total.`);
    
    if (allImages.length > 0) {
      // Save them all as a single batch
      ensureDir(path.join(OUTPUT_DIR, 'all-scraped'));
      for (let i = 0; i < allImages.length; i++) {
        const dest = path.join(OUTPUT_DIR, 'all-scraped', `${i + 1}.jpg`);
        try {
          await downloadFile(allImages[i], dest);
          console.log(`   ✅ Downloaded image ${i + 1}/${allImages.length}`);
        } catch (e) {
          console.log(`   ❌ Failed image ${i + 1}: ${e.message}`);
        }
      }
      console.log(`\n📁 All images saved to: public/images/jobs/all-scraped/`);
      console.log('   You can manually sort these into job folders.\n');
    }

    await browser.close();
    return;
  }

  // ── Step 6: Download images and build manifest ──────────────
  console.log('💾 Downloading images and building job folders...\n');

  ensureDir(OUTPUT_DIR);

  const manifest = {
    business: {
      name: "Lungrin's Lawncare",
      owner: 'Luke Lungrin',
      phones: ['(601) 906-1281', '(601) 906-1282'],
      facebook: 'https://www.facebook.com/LungrinsLawncare',
    },
    jobs: [],
    scrapedAt: new Date().toISOString(),
  };

  for (let i = 0; i < jobPosts.length; i++) {
    const post = jobPosts[i];
    const jobNum = String(i + 1).padStart(2, '0');
    const jobId = `job-${jobNum}`;
    const jobDir = path.join(OUTPUT_DIR, jobId);

    ensureDir(jobDir);

    console.log(`── ${jobId} ──────────────────────────────────────`);
    console.log(`   📝 ${post.text.substring(0, 100)}...`);
    console.log(`   📅 ${post.date || '(no date detected)'}`);
    console.log(`   🖼️  ${post.imageUrls.length} photos`);

    // Download each image
    let downloadedCount = 0;
    for (let j = 0; j < post.imageUrls.length; j++) {
      const imgUrl = post.imageUrls[j];
      const imgDest = path.join(jobDir, `${j + 1}.jpg`);
      try {
        await downloadFile(imgUrl, imgDest);
        downloadedCount++;
        process.stdout.write(`   ✅ ${j + 1}.jpg  `);
      } catch (e) {
        process.stdout.write(`   ❌ ${j + 1}.jpg (${e.message})  `);
      }
    }
    console.log('');

    // Build manifest entry
    const description = sanitizeText(post.text.substring(0, 500));
    const location = guessLocation(post.text);
    const tag = guessTag(post.text);

    manifest.jobs.push({
      id: jobId,
      date: post.date || null,
      location,
      tag,
      description,
      images: downloadedCount,
      facebookPostUrl: null,
    });

    // Save the raw post text for reference
    fs.writeFileSync(
      path.join(jobDir, '_post-text.txt'),
      `Date: ${post.date || 'unknown'}\nLocation: ${location}\nTag: ${tag}\n\n--- Original Post Text ---\n${post.text}`,
      'utf-8'
    );

    console.log(`   → ${location} | ${tag} | ${downloadedCount} photos saved\n`);
  }

  // ── Step 7: Write manifest ──────────────────────────────────
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n✅ Manifest saved: ${MANIFEST_PATH}`);
  console.log(`✅ ${manifest.jobs.length} jobs scraped into: ${OUTPUT_DIR}\n`);

  // Print summary
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║          📊 SCRAPE COMPLETE — SUMMARY            ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Total jobs:    ${String(manifest.jobs.length).padEnd(33)}║`);
  
  const totalImages = manifest.jobs.reduce((sum, j) => sum + j.images, 0);
  console.log(`║  Total photos:  ${String(totalImages).padEnd(33)}║`);
  
  const locations = [...new Set(manifest.jobs.map(j => j.location))];
  console.log(`║  Locations:     ${locations.join(', ').substring(0, 33).padEnd(33)}║`);
  
  const tags = [...new Set(manifest.jobs.map(j => j.tag))];
  console.log(`║  Service types: ${tags.join(', ').substring(0, 33).padEnd(33)}║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('\n📁 Job folders are in:  public/images/jobs/job-XX/');
  console.log('📄 Manifest is at:     public/images/jobs.json');
  console.log('\nNext step: Review the jobs.json and images, then');
  console.log('run the website to see them in the gallery!\n');

  await browser.close();
}

// ── Run ─────────────────────────────────────────────────────────
main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
