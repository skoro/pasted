import {
  app, dialog, nativeImage, MenuItem, Menu,
} from 'electron';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import * as linux from './linux';
import { clipboardEventEmitter } from './clipboard';

/**
 * @returns {boolean}
 */
function isPlatformLinux() {
  return process.platform === 'linux';
}

/**
 * @returns {boolean}
 */
function isPlatformWindows() {
  return process.platform === 'windows';
}

/**
 * @returns {boolean}
 */
function isPlatformDarwin() {
  return process.platform === 'darwin';
}

/**
 * Sets or unsets starting the application at the user login.
 *
 * @param {boolean} open Should the app opened at login.
 */
async function setStartAppAtLogin(open) {
  if (isPlatformLinux()) {
    // ElectronJS does not support yet open application at login on Linux.
    // There is a custom solution of openAtLogin.
    await (open ? linux.enableAutostart() : linux.disableAutostart());
  } else {
    app.setLoginItemSettings({
      openAtLogin: Boolean(open),
    });
  }
}

/**
 * Quits the application.
 */
function quitApp() {
  // isQuiting is a dynamic property. It is preventing quit the app in the closing window.
  app.isQuiting = true;
  app.quit();
}

/**
 * Creates a dynamic filename with current date and time.
 *
 * @param {string} basename
 * @param {string} extension The filename extension without dot.
 * @param {string} [folder] Add the specified folder to the filename.
 *
 * @returns {string} The filename in format: "basename-202410271852.ext"
 */
function makeFilenameWithDateTime(basename, extension, folder) {
  const padZero = (value) => value.toString().padStart(2, '0');
  const date = new Date();
  const dateStr = [
    date.getFullYear(),
    padZero(date.getMonth() + 1),
    padZero(date.getDate()),
  ].join('');
  const timeStr = [
    padZero(date.getHours()),
    padZero(date.getMinutes()),
  ].join('');
  const filename = `${basename}-${dateStr}${timeStr}.${extension}`;

  return folder ? path.join(folder, filename) : filename;
}

/**
 * Provides a save dialog and converts image data url to a native image.
 *
 * @param {import('electron').BaseWindow} parentWindow
 * @param {string} imageDataUrl An image encoded as data url.
 * @param {string} [filename] Default file name.
 */
async function saveImage(parentWindow, imageDataUrl, filename) {
  try {
    const defaultFileName = filename
      || makeFilenameWithDateTime('image', 'png', app.getPath('pictures'));

    const result = await dialog.showSaveDialog(parentWindow, {
      title: 'Save image',
      defaultPath: defaultFileName,
      filters: [
        { name: 'All files', extensions: ['*'] },
        { name: 'PNG', extensions: ['png'] },
        { name: 'JPEG', extensions: ['jpg'] },
      ],
    });

    if (result.canceled) {
      return;
    }

    let buffer;

    const image = nativeImage.createFromDataURL(imageDataUrl);
    const { filePath } = result;
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case '.png':
        buffer = image.toPNG();
        break;
      case '.jpg': case '.jpeg':
        buffer = image.toJPEG(100);
        break;
      default:
        throw new Error(`Cannot convert image to ${ext.replace('.', '').toUpperCase()}`);
    }

    await writeFile(filePath, buffer);
  } catch (err) {
    dialog.showErrorBox('Save error', err.message);
  }
}

/**
 * Saves a text data with file selection dialog.
 *
 * @param {import('electron').BaseWindow} parentWindow
 * @param {string} text A text to save
 * @param {string} [filename] Default file name.
 */
async function saveText(parentWindow, text, filename) {
  try {
    const defaultFileName = filename
      || makeFilenameWithDateTime('text', 'txt', app.getPath('documents'));

    const result = await dialog.showSaveDialog(parentWindow, {
      title: 'Save text',
      defaultPath: defaultFileName,
      filters: [
        { name: 'All files', extensions: ['*'] },
        { name: 'TXT', extensions: ['txt'] },
      ],
    });

    if (result.canceled) {
      return;
    }

    await writeFile(result.filePath, text);
  } catch (err) {
    dialog.showErrorBox('Save error', err.message);
  }
}

/**
 * Updates the application tray icon menu.
 *
 * @param {Electron.Tray} tray
 * @param {Electron.Menu} contextMenu The tray context menu.
 * @param {import('../models/clip').Model[]} [clipItems] Appends the clipboard items to the context menu.
 * @returns {Electron.Menu} The modified context menu.
 */
function updateTrayContextMenu(tray, contextMenu, clipItems) {
  const ITEM_PREFIX = 'clipboard--';
  // Remove previously added clipboard items.
  const menuItems = contextMenu.items.filter((item) => ! item.id?.startsWith(ITEM_PREFIX));

  contextMenu = Menu.buildFromTemplate(menuItems);

  if (clipItems?.length > 0) {
    // Inserting at 0 like unshift() on arrays - adding an item to the head of the array.
    contextMenu.insert(0, new MenuItem({
      id: `${ITEM_PREFIX}sep`,
      type: 'separator',
    }));

    for (const clipItem of clipItems) {
      const label = clipItem.image ? '[IMAGE]' : stringCut(clipItem.data, 50);
      contextMenu.insert(0, new MenuItem({
        id: `${ITEM_PREFIX}item-${clipItem.id}`,
        label,
        click: () => clipboardEventEmitter.copy(clipItem),
      }));
    }
  }

  // In order for changes made to individual MenuItems to take effect, you have to call setContextMenu again.
  // https://www.electronjs.org/docs/latest/api/tray
  tray.setContextMenu(contextMenu);

  return contextMenu;
}

/**
 * Cuts a string to the specified limit of characters.
 *
 * @param {string} str
 * @param {number} limit A desired string limit.
 * @param {string} [trail='...'] A trail appended to the end of the string longer than limit.
 * @return {string}
 */
function stringCut(str, limit, trail = '...') {
  const cutStr = str.trim().split('\n')[0].trim();

  if (cutStr.length <= limit) {
    return cutStr;
  }

  return cutStr.slice(0, limit) + trail;
}

export {
  isPlatformLinux,
  isPlatformWindows,
  isPlatformDarwin,
  setStartAppAtLogin,
  saveImage,
  saveText,
  quitApp,
  updateTrayContextMenu,
};
