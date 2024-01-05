// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("electronAPI", {
  onClipboardNew: (callback) => ipcRenderer.on('clipboard:new', (_event, data) => callback(data)),
  removeClipEntity: (clipEntity) => ipcRenderer.send('clip:remove', clipEntity),
  selectClipEntity: (clipEntity) => ipcRenderer.send('clip:select', clipEntity),
  clearList: () => ipcRenderer.send('clear:list'),
});
