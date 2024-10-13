import { app } from 'electron';

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
};
