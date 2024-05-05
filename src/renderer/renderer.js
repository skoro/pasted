/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './components/App.vue';
import { useClipboardStore } from './stores/useClipboardStore';
import { pluginTrimStrings } from './plugins/plugin-trim-strings';
import { pluginLocalStoragePrefs, loadPrefs } from './plugins/plugin-localstorage-prefs';
import db from './stores/db'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(pluginLocalStoragePrefs);
pinia.use(pluginTrimStrings);

app.mount('#app');

const clipboardStore = useClipboardStore();

db.open(clipboardStore.getModelsFromDb);
const prefs = loadPrefs();

const electronAPI = window.electronAPI;

electronAPI.onClipboardNew(clipboardStore.put);

// App preferences are in local storage, after loading the dom
// notify the main process whether the window should be displayed.
window.onload = () => {
    const isNotMinimized = ! (prefs?.startMinimized ?? false);
    if (isNotMinimized) {
        electronAPI.willShowWindow();
    }
};
