const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
    // Ensure icons directory exists
    const iconsDir = path.join(__dirname, 'icons');
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir);
    }

    // Read the SVG file
    const svgBuffer = fs.readFileSync(path.join(iconsDir, 'icon.svg'));

    // Generate different sizes
    const sizes = [128, 256, 512];

    for (const size of sizes) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(path.join(iconsDir, `icon${size === 128 ? '' : '-' + size}.png`));
        
        console.log(`Generated ${size}x${size} icon`);
    }
}

generateIcons().catch(console.error);