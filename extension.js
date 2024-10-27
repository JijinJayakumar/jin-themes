const vscode = require('vscode');

function activate(context) {
    // Handle theme changes
    let themeWatcher = vscode.workspace.onDidChangeConfiguration(async (event) => {
        if (event.affectsConfiguration('workbench.colorTheme')) {
            await updateCursorSettings();
        }
    });

    // Initial setup
    updateCursorSettings();

    context.subscriptions.push(themeWatcher);
}

async function updateCursorSettings() {
    const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
    const config = vscode.workspace.getConfiguration('editor');

    // Base cursor settings for smooth animation
    const baseSettings = {
        'editor.cursorBlinking': 'expand', // Options: 'blink', 'smooth', 'phase', 'expand', 'solid'
        'editor.cursorSmoothCaretAnimation': true, // Enables smooth caret animation
        'editor.smoothScrolling': true, // Enables smooth scrolling
        'editor.cursorStyle': 'line', // Options: 'block', 'line', 'underline', etc.
        'editor.cursorWidth': 3, // Default cursor thickness
    };

    // Theme-specific cursor settings
    const themeSettings = {
        'J Charcoal': {
            ...baseSettings,
            'editor.cursorWidth': 3, // Thicker cursor for "J Charcoal" theme
            'editor.cursorBlinking': 'expand', // Ensures smooth blinking
        },
        'J Dark Material v2': {
            ...baseSettings,
            'editor.cursorWidth': 4, // Thicker cursor for "J Dark Material v2" theme
            'editor.cursorBlinking': 'smooth',
        },
        'J Charcoal Light': {
            ...baseSettings,
            'editor.cursorWidth': 3, // Standard thickness for "J Charcoal Light" theme
            'editor.cursorBlinking': 'expand',
        },
        'J Funky Minimal Dark': {
            ...baseSettings,
            'editor.cursorWidth': 4, // Thicker cursor for "J Funky Minimal Dark" theme
            'editor.cursorBlinking': 'phase',
        }
    };

    // Apply settings based on the current theme
    const settings = themeSettings[currentTheme] || baseSettings;
    for (const [key, value] of Object.entries(settings)) {
        await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
