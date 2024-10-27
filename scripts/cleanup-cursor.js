const fs = require('fs');
const path = require('path');

function cleanupCursor() {
    try {
        // Path to user's VS Code settings
        const userSettingsPath = path.join(process.env.APPDATA, 'Code', 'User', 'settings.json');
        
        if (fs.existsSync(userSettingsPath)) {
            // Read existing settings
            const content = fs.readFileSync(userSettingsPath, 'utf8');
            // Remove any BOM and normalize line endings
            const normalizedContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
            let settings = JSON.parse(normalizedContent);

            // Remove cursor settings
            const settingsToRemove = [
                "editor.cursorStyle",
                "editor.cursorBlinking",
                "editor.cursorSmoothCaretAnimation",
                "editor.smoothScrolling",
                "editor.cursorWidth"
            ];

            settingsToRemove.forEach(setting => {
                delete settings[setting];
            });

            // Remove theme-specific cursor colors
            if (settings["workbench.colorCustomizations"]) {
                const themesToRemove = [
                    "[J charcoal]",
                    "[J Dark Material v2]",
                    "[J Charcoal Light]",
                    "[J Funky Minimal Dark]"
                ];

                themesToRemove.forEach(theme => {
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
        console.log('Settings path:', path.join(process.env.APPDATA, 'Code', 'User', 'settings.json'));
    }
}

cleanupCursor();