import { clipboard } from "electron";
import { EventEmitter } from "node:events";
import Clip from '../models/clip'

class ClipboardEventEmitter extends EventEmitter {

  /** @type {boolean} */
  isRunning = false;
  
  /** @type {?import("../models/clip").Model} */
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
    /** @type {string} */
    const text = clipboard.readText();
    if (text.length) {
      const newClip = Clip.factory(text)
      if (!this._recent || !Clip.equals(this._recent, newClip)) {
        this._recent = newClip;
        this.emit("clipboard:new", newClip);
      }
    }
    setTimeout(this._loop.bind(this), 800);
  }

  /**
   * @param {string} id 
   * @returns {boolean}
   */
  isLastCopied(id) {
    return this._recent?.id === id;
  }

  reset() {
    this._recent = null;
    clipboard.clear();
  }

  /**
   * @param {import("../models/clip").Model} clip
   */
  copy(clip) {
    this._recent = clip
    clipboard.writeText(clip.data)
  }
}

export const clipboardEventEmitter = new ClipboardEventEmitter();
