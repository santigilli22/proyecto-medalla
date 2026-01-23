import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const DEST_BASE = path.join(PUBLIC_DIR, 'assets', 'img');

// Define Categories
const CATEGORIES = {
    backgrounds: ['bg_', 'background'],
    products: ['lata_', 'botella_', 'golden', 'honey', 'red_ipa', 'rock_ipa', 'scottish', 'stout', 'info_'],
    events: ['event_'],
    kegs: ['keg_', 'choppera', 'party_pump'],
    process: ['maceracion', 'hervor', 'fermentacion', 'maduracion', 'filtrado', 'embarrilado', 'molienda'],
    ui: ['logo', 'icon', 'arrow', 'check', 'star', 'team'],
    partners: ['partner_', 'logo_']
};

// Helper to determine category
const getCategory = (filename) => {
    const lower = filename.toLowerCase();
    for (const [cat, patterns] of Object.entries(CATEGORIES)) {
        if (patterns.some(p => lower.includes(p))) return cat;
    }
    return 'misc';
};

const processedMap = {};

async function processFiles() {
    // Ensure dest dirs exist
    for (const cat of Object.keys(CATEGORIES).concat(['misc'])) {
        const dir = path.join(DEST_BASE, cat);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    const files = fs.readdirSync(PUBLIC_DIR).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
    });

    console.log(`Found ${files.length} images to process.`);

    for (const file of files) {
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        const category = getCategory(name);

        const sourcePath = path.join(PUBLIC_DIR, file);
        const newFilename = `${name}.webp`;
        const destDir = path.join(DEST_BASE, category);
        const destPath = path.join(destDir, newFilename);

        try {
            // Convert to WebP and Resize if too big (max width 1920)
            await sharp(sourcePath)
                .resize({ width: 1920, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(destPath);

            // Record mapping related to BASE_URL behavior
            // Old: /filename.png or filename.png
            // New: /assets/img/category/filename.webp
            processedMap[file] = `assets/img/${category}/${newFilename}`;

            console.log(`Processed: ${file} -> assets/img/${category}/${newFilename}`);

            // Delete original if successful
            fs.unlinkSync(sourcePath);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    // Handle existing subfolders if needed (e.g. public/process/*.png)
    // For this specific runs, the listing showed flat files mostly or distinct folders.
    // The previous listing showed 'process', 'kegs', 'assets' folders.
    // Let's also check subfolders 'process' and 'kegs' if they exist in public root.

    const subfolders = ['process', 'kegs', 'assets/img/png'];
    for (const sub of subfolders) {
        const subDirPath = path.join(PUBLIC_DIR, sub);
        if (fs.existsSync(subDirPath)) {
            const subFiles = fs.readdirSync(subDirPath).filter(file => ['.png', '.jpg', '.webp'].includes(path.extname(file).toLowerCase()));
            for (const file of subFiles) {
                const ext = path.extname(file);
                const name = path.basename(file, ext);
                const category = getCategory(name) === 'misc' ? sub : getCategory(name); // default to subfolder name if no match

                const sourcePath = path.join(subDirPath, file);
                const newFilename = `${name}.webp`;
                const destDir = path.join(DEST_BASE, category);
                const destPath = path.join(destDir, newFilename);

                try {
                    await sharp(sourcePath)
                        .resize({ width: 1920, withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toFile(destPath);

                    // Map old path: process/molienda.png -> assets/img/process/molienda.webp
                    processedMap[`${sub}/${file}`] = `assets/img/${category}/${newFilename}`;
                    console.log(`Processed subdir: ${sub}/${file} -> assets/img/${category}/${newFilename}`);

                    fs.unlinkSync(sourcePath);
                } catch (err) {
                    console.error(`Error subdir file ${file}:`, err);
                }
            }
            // Remove empty dir
            try { fs.rmdirSync(subDirPath); } catch (e) { }
        }
    }

    fs.writeFileSync('image_map.json', JSON.stringify(processedMap, null, 2));
    console.log('Mapping saved to image_map.json');
}

processFiles().catch(console.error);
