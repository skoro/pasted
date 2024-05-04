// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("electronAPI", {
  onClipboardNew: (callback) => ipcRenderer.on('clipboard:new', (_event, clipModel) => callback(clipModel)),
  removeClipModel: (clipModelId) => ipcRenderer.send('clip:remove', clipModelId),
  selectClipModel: (clipModel) => ipcRenderer.send('clip:select', clipModel),
  clearList: () => ipcRenderer.send('clear:list'),
  willShowWindow: () => ipcRenderer.send('will-show-window'),
});
