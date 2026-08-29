/**
 * Organize scraped images into job folders and build jobs.json manifest
 */
const fs = require('fs');
const path = require('path');

const SCRAPED_DIR = path.join(__dirname, 'public', 'images', 'jobs', 'all-scraped');
const JOBS_DIR = path.join(__dirname, 'public', 'images', 'jobs');
const MANIFEST_PATH = path.join(__dirname, 'public', 'images', 'jobs.json');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// Image-to-job mapping from the approved catalog
const imageAssignments = {
  'job-01': { images: [], note: 'No photos scraped yet' },
  'job-02': { images: [2, 3, 4, 5, 6, 7] },
  'job-03': { images: [1, 8, 9, 17] },
  'job-04': { images: [10, 11, 18] },
  'job-05': { images: [], note: 'No photos scraped yet' },
  'job-06': { images: [12, 13, 14, 16, 19, 20, 22, 23] },
  'job-07': { images: [], note: 'No photos scraped yet' },
  'job-08': { images: [21, 24] },
  'job-09': { images: [25] },
};

// Full job manifest from spreadsheet
const jobs = [
  { id: 'job-01', date: 'August 24, 2026', location: 'Flora, MS', tag: 'Debris Cleanup', description: 'Brush & debris haul away after completing daily mows.' },
  { id: 'job-02', date: 'August 21, 2026', location: 'Flora, MS', tag: 'Pine Straw & Beds', description: 'Entrance area cleanup, overgrowth removal, flowerbed recovery, and fresh pine straw installation.' },
  { id: 'job-03', date: 'August 20, 2026', location: 'Flora, MS', tag: 'Pine Straw & Beds', description: 'Solid, thick pine straw installation service.' },
  { id: 'job-04', date: 'August 17, 2026', location: 'Flora, MS', tag: 'Debris Cleanup', description: 'Hauled away a pile of brush and yard debris after finishing daily mows.' },
  { id: 'job-05', date: 'August 14, 2026', location: 'Flora, MS', tag: 'Heavy Clearing', description: 'Full yard cleanup, trimming back overgrown hedges, and laying down fresh mulch.' },
  { id: 'job-06', date: 'August 12, 2026', location: 'Bentonia, MS', tag: 'Heavy Clearing', description: 'Heavy fence line cleanup, brush removal, and driveway clearing.' },
  { id: 'job-07', date: 'August 10, 2026', location: 'Flora, MS', tag: 'Mowing & Edging', description: 'Routine lawn mowing, weed eating, and blowing off all concrete and driveways.' },
  { id: 'job-08', date: 'August 8, 2026', location: 'Flora, MS', tag: 'Heavy Clearing', description: 'Bush hogging and clearing out a heavily overgrown side lot.' },
  { id: 'job-09', date: 'August 5, 2026', location: 'Pocahontas, MS', tag: 'Pond Perimeter', description: 'Pond perimeter cleanup and vegetation transformation.' },
  { id: 'job-10', date: 'August 2, 2026', location: 'Flora, MS', tag: 'Mowing & Edging', description: 'Residential lawn maintenance, edging, and blowing debris off walks and driveways.' },
  { id: 'job-11', date: 'July 30, 2026', location: 'Madison, MS', tag: 'Pine Straw & Beds', description: 'Complete flowerbed overhaul, weeding, shrub trimming, and dark brown mulch installation.' },
  { id: 'job-12', date: 'July 25, 2026', location: 'Flora, MS', tag: 'Debris Cleanup', description: 'Storm debris cleanup, cutting up fallen limbs, and hauling away branches.' },
  { id: 'job-13', date: 'June 28, 2026', location: 'Flora, MS', tag: 'Mowing & Edging', description: 'Full-service lawn maintenance, edge trimming around walks, and blowing off driveways.' },
  { id: 'job-14', date: 'June 24, 2026', location: 'Madison, MS', tag: 'Pine Straw & Beds', description: 'Complete flowerbed overhaul, weeding, shrub trimming, and dark brown mulch installation.' },
  { id: 'job-15', date: 'June 20, 2026', location: 'Flora, MS', tag: 'Heavy Clearing', description: 'Heavy brush clearing and property line cleanup following seasonal overgrowth.' },
  { id: 'job-16', date: 'June 16, 2026', location: 'Flora, MS', tag: 'Pine Straw & Beds', description: 'Pine straw installation and precise flowerbed edging.' },
  { id: 'job-17', date: 'June 11, 2026', location: 'Flora, MS', tag: 'Bush & Hedge Trimming', description: 'Complete hedge trimming, shape restoration, and cleanup of surrounding turf.' },
  { id: 'job-18', date: 'June 6, 2026', location: 'Madison, MS', tag: 'Pine Straw & Beds', description: 'Fresh mulch installation and weed barrier setup for commercial flowerbeds.' },
  { id: 'job-19', date: 'June 2, 2026', location: 'Flora, MS', tag: 'Debris Cleanup', description: 'Post-storm limb cleanup and broken branch removal across the front yard.' },
  { id: 'job-20', date: 'May 28, 2026', location: 'Flora, MS', tag: 'Heavy Clearing', description: 'End-of-month property cleanup, overgrowth control, and weed eating along fence lines.' },
  { id: 'job-21', date: 'May 22, 2026', location: 'Madison, MS', tag: 'Pine Straw & Beds', description: 'Residential mulching and flowerbed cleanup with deep edge defining.' },
  { id: 'job-22', date: 'May 15, 2026', location: 'Flora, MS', tag: 'Heavy Clearing', description: 'Bush hogging and heavy pasture brush clearance.' },
  { id: 'job-23', date: 'May 8, 2026', location: 'Flora, MS', tag: 'Mowing & Edging', description: 'Regular lawn maintenance, mowing, and driveway blowing.' },
];

console.log('\n🌿 Organizing images into job folders...\n');

// Also include the 3 photos from the earlier job-01 scrape
const existingJob01 = path.join(JOBS_DIR, 'job-01');

let totalMoved = 0;

for (const job of jobs) {
  const assignment = imageAssignments[job.id];
  const jobDir = path.join(JOBS_DIR, job.id);
  ensureDir(jobDir);

  if (assignment && assignment.images.length > 0) {
    let photoNum = 1;
    for (const imgNum of assignment.images) {
      const src = path.join(SCRAPED_DIR, `${imgNum}.jpg`);
      const dest = path.join(jobDir, `${photoNum}.jpg`);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        totalMoved++;
        photoNum++;
      }
    }
    job.images = photoNum - 1;
    console.log(`  ✅ ${job.id} — ${job.tag} — ${job.images} photos`);
  } else {
    job.images = 0;
    console.log(`  ⬜ ${job.id} — ${job.tag} — no photos yet`);
  }

  // Write post text file
  fs.writeFileSync(path.join(jobDir, '_post-text.txt'),
    `Date: ${job.date}\nLocation: ${job.location}\nTag: ${job.tag}\n\n${job.description}`, 'utf-8');
}

// Handle the pine straw photo (#30 from old scrape = nice pine straw detail)
// Also copy the #35 mowing stripes photo as a general gallery image
const galleryDir = path.join(JOBS_DIR, 'gallery');
ensureDir(galleryDir);
const galleryImages = [15, 30, 35]; // pine straw detail, backyard pine straw, mowing stripes
let gNum = 1;
for (const imgNum of galleryImages) {
  const src = path.join(SCRAPED_DIR, `${imgNum}.jpg`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(galleryDir, `${gNum}.jpg`));
    gNum++;
  }
}
console.log(`\n  🖼️  ${gNum - 1} general gallery photos saved`);

// Build manifest
const manifest = {
  business: {
    name: "Lungrin's Lawncare",
    owner: 'Luke Lungrin',
    phones: ['(601) 906-1281', '(601) 906-1282'],
    facebook: 'https://www.facebook.com/LungrinsLawncare',
    serviceAreas: ['Flora, MS', 'Bentonia, MS', 'Pocahontas, MS', 'Madison, MS'],
  },
  jobs: jobs.map(j => ({
    id: j.id,
    date: j.date,
    location: j.location,
    tag: j.tag,
    description: j.description,
    images: j.images,
  })),
  scrapedAt: new Date().toISOString(),
  totalJobs: jobs.length,
  totalWithPhotos: jobs.filter(j => j.images > 0).length,
};

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

const withPhotos = jobs.filter(j => j.images > 0).length;
const totalPhotos = jobs.reduce((s, j) => s + j.images, 0);

console.log(`
╔═══════════════════════════════════════════════╗
║         📊 ORGANIZATION COMPLETE              ║
╠═══════════════════════════════════════════════╣
║  Total jobs:        ${String(jobs.length).padEnd(25)} ║
║  Jobs with photos:  ${String(withPhotos).padEnd(25)} ║
║  Jobs need photos:  ${String(jobs.length - withPhotos).padEnd(25)} ║
║  Total photos:      ${String(totalPhotos).padEnd(25)} ║
╚═══════════════════════════════════════════════╝

📁 Job folders:    public/images/jobs/job-XX/
📄 Manifest:       public/images/jobs.json
🖼️  Gallery:        public/images/jobs/gallery/
`);
