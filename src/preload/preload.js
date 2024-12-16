// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

/**
 * @callback onClipboardNew
 *
 * @callback removeClipModel
 * @param {string} clipModelId
 *
 * @callback selectClipModel
 * @param {import('../models/clip').Model} clipModel
 *
 * @callback clearList
 *
 * @callback willShowWindow
 *
 * @callback willHideWindow
 *
 * @callback changeStartAtLogin
 * @param {boolean} openAtLogin
 *
 * @callback openUrl
 * @param {string} url
 *
 * @callback saveImage
 * @param {string} data
 *
 * @callback saveText
 * @param {string} text
 *
 * @callback clipboardTop
 * @param {import('../models/clip').Model[]} clips
 *
 * @typedef {Object} electronAPI
 * @property {onClipboardNew} onClipboardNew
 * @property {removeClipModel} removeClipModel
 * @property {selectClipModel} selectClipModel
 * @property {clearList} clearList
 * @property {willShowWindow} willShowWindow
 * @property {willHideWindow} willHideWindow
 * @property {changeStartAtLogin} changeStartAtLogin
 * @property {openUrl} openUrl
 * @property {saveImage} saveImage
 * @property {saveText} saveText
 * @property {clipboardTop} clipboardTop
 */
contextBridge.exposeInMainWorld('electronAPI', {
  onClipboardNew: (callback) => ipcRenderer.on('clipboard:new', (_event, clipModel) => callback(clipModel)),
  removeClipModel: (clipModelId) => ipcRenderer.send('clip:remove', clipModelId),
  selectClipModel: (clipModel) => ipcRenderer.send('clip:select', clipModel),
  clearList: () => ipcRenderer.send('clear:list'),
  willShowWindow: () => ipcRenderer.send('will-show-window'),
  willHideWindow: () => ipcRenderer.send('will-hide-window'),
  changeStartAtLogin: (openAtLogin) => ipcRenderer.send('pref:startAtLogin', openAtLogin),
  openUrl: (url) => ipcRenderer.send('open:url', url),
  saveImage: (data) => ipcRenderer.send('save:image', data),
  saveText: (text) => ipcRenderer.send('save:text', text),
  clipboardTop: (clips) => ipcRenderer.send('clipboard:top', clips),
});
