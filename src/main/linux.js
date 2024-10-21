import fs from 'node:fs/promises';
import { app } from 'electron';
import path from 'node:path';

/**
 * @returns {boolean}
 */
async function enableAutostart() {
  try {
    if (! await hasAutostartDir()) {
      await fs.mkdir(getAutostartDir());
    }
  
    if (await hasAutostartFile()) {
      return true;
    }
  
    const desktopEntry = ""
      + '[Desktop Entry]\n'
      + 'Type=Application\n'
      + `Version=1.0\n`
      + `Name=${app.getName()}\n`
      + `Comment=${app.getName()} startup script\n`
      + `Exec=${app.getPath('exe')}\n`
      + 'StartupNotify=false\n'
      + 'Terminal=false\n'
    ;
  
    const desktopFile = getAutostartFilepath();

    await fs.writeFile(desktopFile, desktopEntry, 'utf-8');
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}

/**
 * @returns {boolean} False if error or autostart file not found.
 */
async function disableAutostart() {
  const desktopFile = getAutostartFilepath();

  try {
    const stat = await fs.stat(desktopFile);
    if (stat.isFile()) {
      await fs.rm(desktopFile);
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * @returns {string} The autostart directory.
 */
function getAutostartDir() {
  return path.join(app.getPath('appData'), 'autostart');
}

/**
 * @returns {string} The application autostart file path.
 */
function getAutostartFilepath() {
  return path.join(getAutostartDir(), `${app.getName()}.desktop`);
}

/**
 * @return {boolean}
 */
async function hasAutostartDir() {
  try {
    const stat = await fs.stat(getAutostartDir());
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * @returns {boolean}
 */
async function hasAutostartFile() {
  try {
    const stat = await fs.stat(getAutostartFilepath());
    return stat.isFile();
  } catch {
    return false;
  }
}

export { enableAutostart, disableAutostart }
