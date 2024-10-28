// cleanup-cursor.js
const fs = require('fs');
const { getSettingsPath } = require('./shared-constants');

function cleanupCursor() {
    try {
        const userSettingsPath = getSettingsPath();
        
        if (fs.existsSync(userSettingsPath)) {
            const content = fs.readFileSync(userSettingsPath, 'utf8');
            const normalizedContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
            let settings = JSON.parse(normalizedContent);

            // Restore original settings if they exist
            if (settings._jinThemesOriginalSettings) {
                const originalSettings = settings._jinThemesOriginalSettings;
                
                // Restore each setting
                if (originalSettings.cursorStyle) settings["editor.cursorStyle"] = originalSettings.cursorStyle;
                if (originalSettings.cursorBlinking) settings["editor.cursorBlinking"] = originalSettings.cursorBlinking;
                if (originalSettings.cursorSmoothCaretAnimation) settings["editor.cursorSmoothCaretAnimation"] = originalSettings.cursorSmoothCaretAnimation;
                if (originalSettings.smoothScrolling) settings["editor.smoothScrolling"] = originalSettings.smoothScrolling;
                if (originalSettings.cursorWidth) settings["editor.cursorWidth"] = originalSettings.cursorWidth;
                if (originalSettings.colorCustomizations) settings["workbench.colorCustomizations"] = originalSettings.colorCustomizations;

                // Remove the backup
                delete settings._jinThemesOriginalSettings;
            }

            // Remove theme-specific cursor colors
            if (settings["workbench.colorCustomizations"]) {
                const themesToClean = [
                    "[J charcoal]",
                    "[J Dark Material v2]",
                    "[J Charcoal Light]",
                    "[J Funky Minimal Dark]"
                ];

                themesToClean.forEach(theme => {
                    if (settings["workbench.colorCustomizations"][theme]) {
                        delete settings["workbench.colorCustomizations"][theme];
                    }
                });

                // Remove colorCustomizations if empty
                if (Object.keys(settings["workbench.colorCustomizations"]).length === 0) {
                    delete settings["workbench.colorCustomizations"];
                }
            }

            // Write back the cleaned settings
            fs.writeFileSync(userSettingsPath, JSON.stringify(settings, null, 2), 'utf8');
            console.log('✅ Cursor settings cleaned up successfully');
        }
    } catch (error) {
        console.error('Error:', error.message);
        console.log('Attempted settings path:', getSettingsPath());
    }
}

cleanupCursor();