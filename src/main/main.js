import { app, BrowserWindow, ipcMain, Tray, nativeImage, Menu, MenuItem, globalShortcut } from 'electron';
import path from 'node:path';
import { clipboardEventEmitter } from './clipboard';
import { keyboard } from '../renderer/keyshortcuts';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createMainWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 640,
    minWidth: 240,
    minHeight: 180,
    icon: path.join(__dirname, '..', '..', 'resources', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // Disable main menu (and default keyboard shortcuts) on release.
    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Start clipboard watcher and send new clips to renderer process.
  clipboardEventEmitter
    .start()
    .on('clipboard:new', (clipModel) => mainWindow.webContents.send('clipboard:new', clipModel));

  // Handlers from renderer.
  ipcMain.on('clip:remove', (event, id) => {
    if (clipboardEventEmitter.isLastCopied(id)) {
      clipboardEventEmitter.reset()
    }
  });

  ipcMain.on('clip:select', (event, data) => clipboardEventEmitter.copy(data));

  return mainWindow;
};

// Create and setup the application tray icon.
/**
 * @param {BrowserWindow} mainWindow 
 */
const createTrayIcon = (mainWindow) => {
  const icon = nativeImage.createFromPath(path.join(__dirname, '..', '..', 'resources', 'icon.png'));
  const tray = new Tray(icon);

  const showHideCallback = () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  };
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', role: 'quit' }
  ]);

  // Gnome tray does not support actions by icon clicking.
  // There is a menu item does the same as clicking on the icon to show/hide the main window.
  if (process.platform === 'linux') {
    contextMenu.insert(0, new MenuItem({
      label: 'Show/Hide',
      click: () => showHideCallback(),
    }));
    contextMenu.insert(1, new MenuItem({ type: 'separator' }));
  }

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Pasted');

  tray.on('click', () => showHideCallback());
};

/**
 * @param {BrowserWindow} mainWindow 
 */
const registerGlobalShortcut = (mainWindow) => {
  const ret = globalShortcut.register(keyboard.toggleAppFocus, () => {
    if (mainWindow.isFocused()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  if (!ret) {
    console.error("globalShortcut.register failed !");
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createMainWindow();
  createTrayIcon(mainWindow);
  registerGlobalShortcut(mainWindow);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
