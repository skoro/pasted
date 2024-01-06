import { clipboard } from "electron";
import { EventEmitter } from "node:events";
import ClipEntity from "../renderer/stores/clip-entity";

class ClipboardEventEmitter extends EventEmitter {
  isRunning = false;
  _recent;

  start() {
    this.isRunning = true;
    this._loop();
    return this;
  }

  stop() {
    this.isRunning = false;
    return this;
  }

  _loop() {
    if (!this.isRunning) {
      return;
    }
    const text = clipboard.readText();
    if (text.length) {
      const entity = new ClipEntity(text);
      if (!this._recent || (this._recent && !this._recent.equals(entity))) {
        this._recent = entity;
        this.emit("clipboard:new", entity);
      }
    }
    setTimeout(this._loop.bind(this), 800);
  }

  isLastCopied(id) {
    return this._recent?.id === id;
  }

  reset() {
    this._recent = null;
    clipboard.clear();
  }

  copy(data) {
    this._recent = new ClipEntity(data.data);
    clipboard.writeText(data.data);
  }
}

export const clipboardEventEmitter = new ClipboardEventEmitter();
