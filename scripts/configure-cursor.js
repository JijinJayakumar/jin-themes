const fs = require('fs');
const path = require('path');

function configureCursor() {
    try {
        // Path to user's VS Code settings
        const userSettingsPath = path.join(process.env.APPDATA, 'Code', 'User', 'settings.json');
        
        // Simple cursor settings
        const newSettings = {
            "editor.cursorStyle": "line",
            "editor.cursorBlinking": "expand",
            "editor.cursorSmoothCaretAnimation": true,
            "editor.smoothScrolling": true,
            "editor.cursorWidth": 3,
            "workbench.colorCustomizations": {
                "[J charcoal]": {
                    "editorCursor.background": "#000000",
                    "editorCursor.foreground": "#FFCC66"
                },
                "[J Dark Material v2]": {
                    "editorCursor.background": "#000000",
                    "editorCursor.foreground": "#89DDFF"
                },
                "[J Charcoal Light]": {
                    "editorCursor.background": "#FFFFFF",
                    "editorCursor.foreground": "#FF9940"
                },
                "[J Funky Minimal Dark]": {
                    "editorCursor.background": "#000000",
                    "editorCursor.foreground": "#FF00FF"
                }
            }
        };

        // Read and parse existing settings
        let currentSettings = {};
        if (fs.existsSync(userSettingsPath)) {
            try {
                const content = fs.readFileSync(userSettingsPath, 'utf8');
                // Remove any BOM and normalize line endings
                const normalizedContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
                currentSettings = JSON.parse(normalizedContent);
            } catch (parseError) {
                console.error('Error parsing settings file:', parseError.message);
                console.log('Creating new settings file...');
            }
        }

        // Merge new settings with existing settings
        const mergedSettings = {
            ...currentSettings,
            ...newSettings,
            "workbench.colorCustomizations": {
                ...currentSettings["workbench.colorCustomizations"],
                ...newSettings["workbench.colorCustomizations"]
            }
        };

        // Write settings back to file
        fs.writeFileSync(userSettingsPath, JSON.stringify(mergedSettings, null, 2), 'utf8');
        console.log('✅ Cursor settings updated successfully');

    } catch (error) {
        console.error('Error:', error.message);
        console.log('Settings path:', path.join(process.env.APPDATA, 'Code', 'User', 'settings.json'));
    }
}

configureCursor();