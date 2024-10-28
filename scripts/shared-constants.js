// shared-constants.js
const vscode = require('vscode');
const path = require('path');
const os = require('os');

function getUserSettingsPath() {
    // Get the appropriate path based on OS
    switch (process.platform) {
        case 'win32':
            return path.join(process.env.APPDATA, 'Code', 'User', 'settings.json');
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'settings.json');
        case 'linux':
            return path.join(os.homedir(), '.config', 'Code', 'User', 'settings.json');
        default:
            throw new Error('Unsupported operating system');
    }
}

// For VS Code Insiders
function getInsidersSettingsPath() {
    switch (process.platform) {
        case 'win32':
            return path.join(process.env.APPDATA, 'Code - Insiders', 'User', 'settings.json');
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', 'Code - Insiders', 'User', 'settings.json');
        case 'linux':
            return path.join(os.homedir(), '.config', 'Code - Insiders', 'User', 'settings.json');
        default:
            throw new Error('Unsupported operating system');
    }
}

// Get the appropriate settings path
function getSettingsPath() {
    try {
        // Check if using VS Code Insiders
        const isInsiders = vscode.env.appName.includes('Insiders');
        const settingsPath = isInsiders ? getInsidersSettingsPath() : getUserSettingsPath();
        return settingsPath;
    } catch (error) {
        console.error('Error determining settings path:', error);
        throw error;
    }
}

module.exports = {
    getSettingsPath
};
