// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app, BrowserWindow, ipcMain, Tray, nativeImage, Menu, MenuItem, globalShortcut, shell,
} from 'electron';
import path from 'node:path';
import { clipboardEventEmitter } from './clipboard';
import { keyboard } from '../renderer/keyshortcuts';
import {
  setStartAppAtLogin, isPlatformLinux, isPlatformDarwin, quitApp,
} from './system';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createMainWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 640,
    minWidth: 260,
    minHeight: 180,
    icon: path.join(__dirname, '..', '..', 'resources', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    // initially the window is hidden, if renderer submits 'will-show-window' event
    // the window shows, see below.
    show: false,
  });

  // and load the index.html of the app.
  // eslint-disable-next-line no-undef
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // eslint-disable-next-line no-undef
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // Disable main menu (and default keyboard shortcuts) on release.
    mainWindow.setMenu(null);
    // eslint-disable-next-line no-undef
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Start clipboard watcher and send new clips to renderer process.
  clipboardEventEmitter
    .start()
    .on('clipboard:new', (clipModel) => mainWindow.webContents.send('clipboard:new', clipModel));

  // Handlers from renderer.
  ipcMain.on('clip:remove', (event, id) => {
    if (clipboardEventEmitter.isLastCopied(id)) {
      clipboardEventEmitter.reset();
    }
  });

  ipcMain.on('clip:select', (event, data) => clipboardEventEmitter.copy(data));
  // fires at start, see renderer onload.
  ipcMain.on('will-show-window', () => mainWindow.show());
  ipcMain.on('will-hide-window', () => mainWindow.hide());
  ipcMain.on('pref:startAtLogin', (event, value) => setStartAppAtLogin(value));
  ipcMain.on('open:url', (_, url) => shell.openExternal(url));

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
    {
      label: 'Quit',
      click: quitApp,
    },
  ]);

  // Gnome tray does not support actions by icon clicking.
  // There is a menu item does the same as clicking on the icon to show/hide the main window.
  if (isPlatformLinux()) {
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
    // eslint-disable-next-line no-console
    console.error('globalShortcut.register failed !');
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const isSingleInstance = app.requestSingleInstanceLock();

  if (!isSingleInstance) {
    // will emit 'second-instance' - show and focus main window of running app instance.
    app.quit();
    return;
  }

  const mainWindow = createMainWindow();

  // do not close the window, instead minimize it to tray.
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault(); // prevent closing
      mainWindow.hide();
    }
  });

  createTrayIcon(mainWindow);
  registerGlobalShortcut(mainWindow);

  app.on('second-instance', () => {
    mainWindow.show();
    mainWindow.focus();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isPlatformDarwin()) {
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
