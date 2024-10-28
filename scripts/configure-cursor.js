// configure-cursor.js
const fs = require('fs');
const { getSettingsPath } = require('./shared-constants');

function configureCursor() {
    try {
        const userSettingsPath = getSettingsPath();
        let currentSettings = {};

        // Create directory if it doesn't exist
        const settingsDir = path.dirname(userSettingsPath);
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }

        // Read existing settings if they exist
        if (fs.existsSync(userSettingsPath)) {
            const content = fs.readFileSync(userSettingsPath, 'utf8');
            const normalizedContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
            try {
                currentSettings = JSON.parse(normalizedContent);
            } catch (parseError) {
                console.error('Error parsing settings file:', parseError.message);
                console.log('Creating new settings file...');
            }
        }

        // Store original settings if not already stored
        if (!currentSettings._jinThemesOriginalSettings) {
            currentSettings._jinThemesOriginalSettings = {
                cursorStyle: currentSettings["editor.cursorStyle"],
                cursorBlinking: currentSettings["editor.cursorBlinking"],
                cursorSmoothCaretAnimation: currentSettings["editor.cursorSmoothCaretAnimation"],
                smoothScrolling: currentSettings["editor.smoothScrolling"],
                cursorWidth: currentSettings["editor.cursorWidth"],
                colorCustomizations: currentSettings["workbench.colorCustomizations"]
            };
        }

        // Write settings back to file
        fs.writeFileSync(userSettingsPath, JSON.stringify(currentSettings, null, 2), 'utf8');
        console.log('✅ Original cursor settings backed up successfully');

    } catch (error) {
        console.error('Error:', error.message);
        console.log('Attempted settings path:', getSettingsPath());
    }
}

configureCursor();