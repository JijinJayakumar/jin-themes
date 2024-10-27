const fs = require("fs");
const path = require("path");

function cleanupCursor() {
  try {
    // Path to user's VS Code settings
    const userSettingsPath = path.join(
      process.env.APPDATA,
      "Code",
      "User",
      "settings.json"
    );

    if (fs.existsSync(userSettingsPath)) {
      // Read existing settings
      const settingsContent = fs.readFileSync(userSettingsPath, "utf8");
      let settings = JSON.parse(settingsContent);

      // Remove our theme-specific settings
      delete settings["jinThemes.cursorEffects"];

      // Write back the cleaned settings
      fs.writeFileSync(userSettingsPath, JSON.stringify(settings, null, 2));
      console.log("✅ Cursor configurations cleaned up successfully");
    }
  } catch (error) {
    console.error("❌ Error cleaning up cursor settings:", error);
  }
}

cleanupCursor();
