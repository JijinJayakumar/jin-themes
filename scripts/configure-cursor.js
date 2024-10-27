const fs = require('fs');
const path = require('path');

function configureCursor() {
    try {
        // Path to user's VS Code settings
        const userSettingsPath = path.join(process.env.APPDATA, 'Code', 'User', 'settings.json');
        
        // Base settings for smooth cursor
        const baseSettings = {
            "editor.cursorStyle": "line",
            "editor.cursorBlinking": "expand",
            "editor.cursorSmoothCaretAnimation": "on",
            "editor.smoothScrolling": true,
            "editor.cursorWidth": 3
        };

        // Read existing settings
        let settings = {};
        if (fs.existsSync(userSettingsPath)) {
            const settingsContent = fs.readFileSync(userSettingsPath, 'utf8');
            settings = JSON.parse(settingsContent);
        }

        // Apply base cursor settings
        Object.assign(settings, baseSettings);

        // Theme-specific cursor widths
        settings["workbench.colorCustomizations"] = {
            "[J charcoal]": {
                "editorCursor.background": "#000000",
                // "editorCursor.foreground": "#sFFCC66"
            },
            "[J Dark Material v2]": {
                "editorCursor.background": "#000000",
                "editorCursor.foreground": "#89DDFF"
            },
            "[J Charcoal Light]": {
                "editorCursor.background": "#FFFFFF",
                // "editorCursor.foreground": "#FF9940"
            },
            "[J Funky Minimal Dark]": {
                "editorCursor.background": "#000000",
                "editorCursor.foreground": "#FF00FF"
            }
        };

        // Write back the updated settings
        fs.writeFileSync(userSettingsPath, JSON.stringify(settings, null, 2));

        console.log('✅ Smooth cursor configurations installed successfully');
    } catch (error) {
        console.error('❌ Error configuring cursor settings:', error);
    }
}

configureCursor();