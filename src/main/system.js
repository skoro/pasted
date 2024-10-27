import { app, dialog, nativeImage } from 'electron';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';

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
 * @param {boolean} open
 */
function setStartAppAtLogin(open) {
  if (isPlatformLinux()) {
    // todo
    // eslint-disable-next-line no-console
    console.error('setStartAppAtLogin not implemented yet for Linux.');
  } else {
    app.setLoginItemSettings({
      openAtLogin: Boolean(open),
    });
  }
}

/**
 * Creates a dynamic filename with current date and time.
 *
 * @param {string} basename
 * @param {string} extension The filename extension without dot.
 * @param {string} [folder] Add the specified folder to the filename.
 *
 * @returns {string} The filename in format: "basename 2024-10-27 18:52.ext"
 */
function makeFilenameWithDateTime(basename, extension, folder) {
  const padZero = (value) => value.toString().padStart(2, '0');
  const date = new Date();
  const dateStr = [
    date.getFullYear(),
    padZero(date.getMonth() + 1),
    padZero(date.getDate()),
  ].join('-');
  const timeStr = [
    padZero(date.getHours()),
    padZero(date.getMinutes()),
  ].join(':');
  const filename = `${basename} ${dateStr} ${timeStr}.${extension}`;

  return folder ? path.join(folder, filename) : filename;
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

function quitApp() {
  app.isQuiting = true;
  app.quit();
}

export {
  isPlatformLinux,
  isPlatformWindows,
  isPlatformDarwin,
  setStartAppAtLogin,
  saveImage,
  saveText,
  quitApp,
};
