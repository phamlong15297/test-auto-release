import { app, BrowserWindow, dialog, shell } from 'electron';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { exec } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { autoUpdater } = require('electron-updater');

/**
 * Creates the main application window and loads the renderer content.
 */
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    title: `Sample Electron App v${app.getVersion()}`,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(join(__dirname, 'index.html'));
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle(`Sample Electron App v${app.getVersion()}`);
  });

  // Uncomment the next line to open DevTools on launch.
  // mainWindow.webContents.openDevTools();

  return mainWindow;
}

function setupAutoUpdater(mainWindow) {
  autoUpdater.autoDownload = false;
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'phamlong15297',
    repo: 'test-auto-release',
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.setProgressBar(progress.percent / 100);
    mainWindow.setTitle(`Sample Electron App v${app.getVersion()} - Downloading update ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: `A new version (${info.version}) is available. Would you like to download and install it now?`,
      buttons: ['Install Update', 'Later'],
      defaultId: 0,
      cancelId: 1
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.setProgressBar(-1);
    mainWindow.setTitle(`Sample Electron App v${app.getVersion()}`);
    const isAppImage = !!process.env.APPIMAGE;

    if (isAppImage) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'The update has been downloaded. The application will restart to install it.',
        buttons: ['Restart Now']
      }).then(() => {
        autoUpdater.quitAndInstall();
      });
    } else {
      // .deb installs require root — pkexec elevates privileges via PolicyKit
      const debPath = info.downloadedFile;
      exec(`pkexec dpkg -i "${debPath}"`, (err) => {
        if (err) {
          // pkexec unavailable or user cancelled — open file manager as fallback
          shell.showItemInFolder(debPath);
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Manual Install Required',
            message: `The update was downloaded but could not be installed automatically.\n\nPlease install it manually:\n  sudo dpkg -i "${debPath}"`,
            buttons: ['OK']
          });
        } else {
          app.relaunch();
          app.quit();
        }
      });
    }
  });

  autoUpdater.on('error', (err) => {
    mainWindow.setProgressBar(-1);
    mainWindow.setTitle(`Sample Electron App v${app.getVersion()}`);
    console.error('Auto-updater error:', err);
  });

  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
  const mainWindow = createMainWindow();

  setupAutoUpdater(mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // ?
    app.quit();
  }
});
