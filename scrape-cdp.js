/**
 * Connect to the user's Chrome via CDP and scrape the Facebook page
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'jobs');
const MANIFEST_PATH = path.join(__dirname, 'public', 'images', 'jobs.json');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { if (fs.existsSync(destPath)) fs.unlinkSync(destPath); reject(err); });
  });
}

function guessTag(text) {
  const l = text.toLowerCase();
  if (l.includes('pine straw') || l.includes('mulch') || l.includes('flowerbed') || l.includes('flower bed')) return 'Pine Straw & Beds';
  if (l.includes('pond') || l.includes('perimeter') || l.includes('bank')) return 'Pond Perimeter';
  if (l.includes('fence') || l.includes('overgrown') || l.includes('brush') || l.includes('clearing') || l.includes('overgrowth')) return 'Heavy Clearing';
  if (l.includes('gutter')) return 'Gutter Cleaning';
  if (l.includes('bush') || l.includes('hedge') || l.includes('trim') || l.includes('shrub')) return 'Bush & Hedge Trimming';
  if (l.includes('debris') || l.includes('haul') || l.includes('junk') || l.includes('cleanup') || l.includes('clean up')) return 'Debris Cleanup';
  if (l.includes('mow') || l.includes('edge') || l.includes('edging') || l.includes('stripe') || l.includes('cut')) return 'Mowing & Edging';
  return 'Lawn Care';
}

function guessLocation(text) {
  const l = text.toLowerCase();
  if (l.includes('pocahontas')) return 'Pocahontas, MS';
  if (l.includes('bentonia')) return 'Bentonia, MS';
  if (l.includes('madison')) return 'Madison County, MS';
  if (l.includes('canton')) return 'Canton, MS';
  if (l.includes('flora')) return 'Flora, MS';
  return 'Flora, MS';
}

async function main() {
  console.log('\n🌿 Connecting to your Chrome browser...\n');

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  } catch (e) {
    console.error('❌ Could not connect to Chrome. Make sure you ran launch-chrome-debug.bat');
    console.error('   Error:', e.message);
    process.exit(1);
  }

  console.log('✅ Connected to Chrome!\n');

  const contexts = browser.contexts();
  const page = contexts[0]?.pages()[0];
  
  if (!page) {
    console.error('❌ No page found in Chrome. Open the Facebook page first.');
    process.exit(1);
  }

  const url = page.url();
  console.log(`📍 Current page: ${url}\n`);

  // Navigate to the page if not already there
  if (!url.includes('LungrinsLawncare') && !url.includes('lungrin')) {
    console.log('📍 Navigating to Lungrin\'s Lawncare page...');
    await page.goto('https://www.facebook.com/LungrinsLawncare', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
  }

  // Scroll to load posts
  console.log('📜 Scrolling to load all posts...');
  let previousHeight = 0;
  let staleCount = 0;
  
  for (let i = 0; i < 80; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) {
      staleCount++;
      if (staleCount >= 4) {
        console.log(`   Reached bottom after ${i + 1} scrolls.`);
        break;
      }
    } else {
      staleCount = 0;
    }
    previousHeight = currentHeight;
    if ((i + 1) % 5 === 0) console.log(`   ... scrolled ${i + 1} times`);
  }

  // Now scroll back to top slowly, collecting posts as we go
  // Facebook virtualizes DOM, so we need to collect in chunks
  console.log('\n📸 Collecting posts (scrolling back up to capture all)...');
  
  const allJobs = [];
  const seenTexts = new Set();
  
  // First get the total scroll height
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const steps = Math.ceil(totalHeight / (viewportHeight * 0.5));
  
  for (let step = 0; step <= steps; step++) {
    const scrollTo = step * viewportHeight * 0.5;
    await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
    await page.waitForTimeout(1500);
    
    // Extract from currently visible articles
    const posts = await page.evaluate(() => {
      const results = [];
      const articles = document.querySelectorAll('div[role="article"]');
      
      articles.forEach((article, idx) => {
        try {
          let text = '';
          const textEls = article.querySelectorAll('div[dir="auto"]');
          if (textEls.length > 0) {
            text = Array.from(textEls).map(el => el.innerText).filter(t => t.length > 10).join(' ').trim();
          }
          
          let date = '';
          const allLinks = article.querySelectorAll('a');
          allLinks.forEach(link => {
            const label = link.getAttribute('aria-label') || '';
            if (label.match(/ago|January|February|March|April|May|June|July|August|September|October|November|December|yesterday|hour|minute|day/i)) {
              if (!date) date = label;
            }
          });

          // Broad image search
          const images = [];
          
          // Regular img tags
          article.querySelectorAll('img').forEach(img => {
            const src = img.src || '';
            if ((src.includes('fbcdn') || src.includes('scontent')) && 
                !src.includes('emoji') && !src.includes('rsrc.php') && 
                !src.includes('static.xx') && src.length > 50) {
              // Check if it's a content image (not a tiny icon)
              const rect = img.getBoundingClientRect();
              if (rect.width > 80 || img.naturalWidth > 80) {
                images.push(src);
              }
            }
          });
          
          // Also check picture > source elements
          article.querySelectorAll('picture source').forEach(source => {
            const srcset = source.getAttribute('srcset') || '';
            const urls = srcset.split(',').map(s => s.trim().split(' ')[0]).filter(u => u.includes('scontent') || u.includes('fbcdn'));
            images.push(...urls);
          });
          
          // Check for image links
          article.querySelectorAll('a[href*="/photo"] img, a[href*="photo.php"] img').forEach(img => {
            if (img.src && !images.includes(img.src)) {
              images.push(img.src);
            }
          });

          const uniqueImages = [...new Set(images)];
          
          if (uniqueImages.length > 0) {
            results.push({
              text: text.substring(0, 1000),
              date: date,
              images: uniqueImages,
            });
          }
        } catch (e) {}
      });
      return results;
    });

    // Add new posts (dedup by text)
    for (const post of posts) {
      const key = post.text.substring(0, 100);
      if (!seenTexts.has(key) && post.images.length > 0) {
        seenTexts.add(key);
        allJobs.push(post);
        console.log(`   ✅ Found: ${post.images.length} imgs — "${post.text.substring(0, 60)}..."`);
      }
    }
  }

  console.log(`\n📊 Total unique job posts found: ${allJobs.length}\n`);

  if (allJobs.length === 0) {
    console.log('⚠️  No job posts with images found.');
    console.log('   Dumping all images visible on page as fallback...\n');
    
    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
    
    // Get ALL images on page
    const allImgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => ({ src: img.src, w: img.naturalWidth, h: img.naturalHeight, alt: img.alt || '' }))
        .filter(i => (i.src.includes('scontent') || i.src.includes('fbcdn')) && i.w > 50 && !i.src.includes('emoji') && !i.src.includes('rsrc.php'));
    });
    
    console.log(`   Found ${allImgs.length} content images total.`);
    
    if (allImgs.length > 0) {
      ensureDir(path.join(OUTPUT_DIR, 'all-scraped'));
      for (let i = 0; i < allImgs.length; i++) {
        const dest = path.join(OUTPUT_DIR, 'all-scraped', `${i + 1}.jpg`);
        try {
          await downloadFile(allImgs[i].src, dest);
          console.log(`   ✅ ${i + 1}.jpg (${allImgs[i].w}x${allImgs[i].h}) ${allImgs[i].alt.substring(0,40)}`);
        } catch (e) {
          console.log(`   ❌ ${i + 1}.jpg failed: ${e.message}`);
        }
      }
    }
    
    browser.disconnect();
    return;
  }

  // Download images and build manifest
  console.log('💾 Downloading images...\n');
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

  for (let i = 0; i < allJobs.length; i++) {
    const post = allJobs[i];
    const jobNum = String(i + 1).padStart(2, '0');
    const jobId = `job-${jobNum}`;
    const jobDir = path.join(OUTPUT_DIR, jobId);
    ensureDir(jobDir);

    console.log(`── ${jobId} ──────────────────────────`);
    console.log(`   📝 ${post.text.substring(0, 80)}...`);

    let downloadedCount = 0;
    for (let j = 0; j < post.images.length; j++) {
      const dest = path.join(jobDir, `${j + 1}.jpg`);
      try {
        await downloadFile(post.images[j], dest);
        downloadedCount++;
        process.stdout.write(`   ✅ ${j + 1}.jpg  `);
      } catch (e) {
        process.stdout.write(`   ❌ ${j + 1}.jpg  `);
      }
    }
    console.log('');

    const description = post.text.replace(/\s+/g, ' ').trim().substring(0, 500);
    manifest.jobs.push({
      id: jobId,
      date: post.date || null,
      location: guessLocation(post.text),
      tag: guessTag(post.text),
      description,
      images: downloadedCount,
    });

    fs.writeFileSync(path.join(jobDir, '_post-text.txt'), 
      `Date: ${post.date}\nLocation: ${guessLocation(post.text)}\nTag: ${guessTag(post.text)}\n\n${post.text}`, 'utf-8');
    
    console.log(`   → ${guessLocation(post.text)} | ${guessTag(post.text)} | ${downloadedCount} photos\n`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  const totalImages = manifest.jobs.reduce((sum, j) => sum + j.images, 0);
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║          📊 SCRAPE COMPLETE                      ║');
  console.log(`║  Jobs: ${manifest.jobs.length}    Photos: ${totalImages}                        ║`);
  console.log('╚══════════════════════════════════════════════════╝\n');

  browser.disconnect();
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
