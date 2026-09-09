import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://arenaoflegends.in';
const PUBLIC_DIR = path.join(__dirname, 'public');
const ROUTES_DIR = path.join(__dirname, 'src', 'routes');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Route configurations with custom priority and change frequency
const ROUTE_META = {
  '/': { priority: '1.0', changefreq: 'daily' },
  '/billing.html': { priority: '0.9', changefreq: 'daily' },
  '/dashboard': { priority: '0.7', changefreq: 'weekly' },
  '/admin': { priority: '0.5', changefreq: 'monthly' },
};

function getRoutesFromSrc() {
  const routes = new Set();

  if (fs.existsSync(ROUTES_DIR)) {
    const files = fs.readdirSync(ROUTES_DIR);
    files.forEach((file) => {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const basename = path.basename(file, path.extname(file));
        if (basename === 'index') {
          routes.add('/');
        } else if (!basename.startsWith('_') && !basename.startsWith('.')) {
          routes.add(`/${basename}`);
        }
      }
    });
  }

  return Array.from(routes);
}

function getStaticHtmlFiles() {
  const htmlFiles = new Set();

  if (fs.existsSync(PUBLIC_DIR)) {
    const files = fs.readdirSync(PUBLIC_DIR);
    files.forEach((file) => {
      if (file.endsWith('.html') && !file.startsWith('google')) {
        htmlFiles.add(`/${file}`);
      }
    });
  }

  return Array.from(htmlFiles);
}

function generateSitemapXml() {
  const srcRoutes = getRoutesFromSrc();
  const htmlFiles = getStaticHtmlFiles();
  const allPaths = Array.from(new Set([...srcRoutes, ...htmlFiles])).sort();

  const todayIso = new Date().toISOString().split('T')[0];

  const urlEntries = allPaths.map((routePath) => {
    const meta = ROUTE_META[routePath] || { priority: '0.6', changefreq: 'weekly' };
    const loc = `${BASE_URL}${routePath === '/' ? '' : routePath}`;

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, xmlContent, 'utf-8');
  console.log(`✅ Sitemap successfully generated at: ${SITEMAP_PATH}`);
  console.log(`📄 Total URLs included: ${allPaths.length}`);
}

generateSitemapXml();
