// extension.js
const vscode = require('vscode');

// Store original cursor settings for restoration
let originalSettings = null;

async function activate(context) {
    try {
        // Store original settings when extension is first activated
        if (!originalSettings) {
            originalSettings = await getCurrentCursorSettings();
        }

        // Initialize settings on activation
        await initializeSettings();

        // Register theme change handler
        let themeWatcher = vscode.workspace.onDidChangeConfiguration(async (event) => {
            if (event.affectsConfiguration('workbench.colorTheme')) {
                const newTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
                
                // Check if the new theme is one of ours
                if (isJinTheme(newTheme)) {
                    await updateThemeSettings(newTheme);
                } else {
                    // Restore original settings if switching to a non-Jin theme
                    await restoreOriginalSettings();
                }
            }
        });

        // Register commands
        let resetCommand = vscode.commands.registerCommand('jinThemes.resetCursorSettings', async () => {
            await restoreOriginalSettings();
            vscode.window.showInformationMessage('Cursor settings have been reset to defaults.');
        });

        context.subscriptions.push(themeWatcher, resetCommand);
    } catch (error) {
        console.error('Activation error:', error);
        vscode.window.showErrorMessage('Error activating Jin Themes extension');
    }
}

async function getCurrentCursorSettings() {
    const config = vscode.workspace.getConfiguration('editor');
    return {
        cursorStyle: config.get('cursorStyle'),
        cursorBlinking: config.get('cursorBlinking'),
        cursorSmoothCaretAnimation: config.get('cursorSmoothCaretAnimation'),
        smoothScrolling: config.get('smoothScrolling'),
        cursorWidth: config.get('cursorWidth'),
        colorCustomizations: vscode.workspace.getConfiguration('workbench').get('colorCustomizations')
    };
}

function isJinTheme(themeName) {
    const jinThemes = [
        'J charcoal',
        'J Dark Material v2',
        'J Charcoal Light',
        'J Funky Minimal Dark'
    ];
    return jinThemes.includes(themeName);
}

async function initializeSettings() {
    const config = vscode.workspace.getConfiguration('workbench');
    const currentTheme = config.get('colorTheme');
    
    if (isJinTheme(currentTheme)) {
        await updateThemeSettings(currentTheme);
    }
}

async function updateThemeSettings(themeName) {
    const themeSettings = {
        'J charcoal': {
            cursorStyle: 'line',
            cursorBlinking: 'expand',
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            cursorWidth: 3,
            colors: {
                "editorCursor.background": "#000000",
                "editorCursor.foreground": "#FFCC66"
            }
        },
        'J Dark Material v2': {
            cursorStyle: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            cursorWidth: 4,
            colors: {
                "editorCursor.background": "#000000",
                "editorCursor.foreground": "#89DDFF"
            }
        },
        'J Charcoal Light': {
            cursorStyle: 'line',
            cursorBlinking: 'expand',
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            cursorWidth: 3,
            colors: {
                "editorCursor.background": "#FFFFFF",
                "editorCursor.foreground": "#FF9940"
            }
        },
        'J Funky Minimal Dark': {
            cursorStyle: 'line',
            cursorBlinking: 'phase',
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            cursorWidth: 4,
            colors: {
                "editorCursor.background": "#000000",
                "editorCursor.foreground": "#FF00FF"
            }
        }
    };

    try {
        if (themeSettings[themeName]) {
            const settings = themeSettings[themeName];
            const config = vscode.workspace.getConfiguration();
            
            // Update editor settings
            await config.update('editor.cursorStyle', settings.cursorStyle, vscode.ConfigurationTarget.Global);
            await config.update('editor.cursorBlinking', settings.cursorBlinking, vscode.ConfigurationTarget.Global);
            await config.update('editor.cursorSmoothCaretAnimation', settings.cursorSmoothCaretAnimation, vscode.ConfigurationTarget.Global);
            await config.update('editor.smoothScrolling', settings.smoothScrolling, vscode.ConfigurationTarget.Global);
            await config.update('editor.cursorWidth', settings.cursorWidth, vscode.ConfigurationTarget.Global);

            // Update color customizations
            const colorConfig = config.get('workbench.colorCustomizations') || {};
            colorConfig[`[${themeName}]`] = {
                ...colorConfig[`[${themeName}]`],
                ...settings.colors
            };
            
            await config.update('workbench.colorCustomizations', colorConfig, vscode.ConfigurationTarget.Global);
        }
    } catch (error) {
        console.error('Error updating theme settings:', error);
        vscode.window.showErrorMessage(`Failed to update theme settings: ${error.message}`);
    }
}

async function restoreOriginalSettings() {
    if (originalSettings) {
        const config = vscode.workspace.getConfiguration();
        
        try {
            await config.update('editor.cursorStyle', originalSettings.cursorStyle, vscode.ConfigurationTarget.Global);
            await config.update('editor.cursorBlinking', originalSettings.cursorBlinking, vscode.ConfigurationTarget.Global);
            await config.update('editor.cursorSmoothCaretAnimation', originalSettings.cursorSmoothCaretAnimation, vscode.ConfigurationTarget.Global);
            await config.update('editor.smoothScrolling', originalSettings.smoothScrolling, vscode.ConfigurationTarget.Global);
            await config.update('editor.cursorWidth', originalSettings.cursorWidth, vscode.ConfigurationTarget.Global);
            await config.update('workbench.colorCustomizations', originalSettings.colorCustomizations, vscode.ConfigurationTarget.Global);
        } catch (error) {
            console.error('Error restoring original settings:', error);
            vscode.window.showErrorMessage('Failed to restore original cursor settings');
        }
    }
}

function deactivate() {
    // Restore original settings on deactivation
    return restoreOriginalSettings();
}

module.exports = {
    activate,
    deactivate
};
