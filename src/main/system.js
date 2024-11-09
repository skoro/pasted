import { app, dialog, nativeImage } from 'electron';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import * as linux from './linux';

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
 * @param {boolean} open Should the app opened at login.
 */
async function setStartAppAtLogin(open) {
  if (isPlatformLinux()) {
    // ElectronJS does not support yet open application at login on Linux.
    // There is be a custom solution of openAtLogin.
    await (open ? linux.enableAutostart() : linux.disableAutostart());
  } else {
    app.setLoginItemSettings({
      openAtLogin: Boolean(open),
    });
  }
}

/**
 * Provides a save dialog and converts image data url to a native image.
 *
 * @param {import('electron').BaseWindow} parentWindow
 * @param {string} imageDataUrl An image encoded as data url.
 */
async function saveImage(parentWindow, imageDataUrl) {
  try {
    const defaultFileName = path.join(app.getPath('pictures'), `image-${(new Date()).getTime().toString()}.png`);

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
    const filename = result.filePath;
    const ext = path.extname(filename).toLowerCase();

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

    await writeFile(filename, buffer);
  } catch (err) {
    dialog.showErrorBox('Save error', err.message);
  }
}

function quitApp() {
  app.isQuiting = true;
  app.quit();
}

export {
  isPlatformLinux,
  isPlatformWindows,
  isPlatformDarwin,
  setStartAppAtLogin,
  quitApp,
  saveImage,
};
