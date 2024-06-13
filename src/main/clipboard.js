import { clipboard, nativeImage } from "electron";
import { EventEmitter } from "node:events";
import Clip from '../models/clip';

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

    let newModel = this._getText() ?? this._getImage();

    if (newModel) {
      if (!this._recent || !Clip.equals(this._recent, newModel)) {
        this._recent = newModel;
        this.emit('clipboard:new', newModel);
      }
    }

    setTimeout(this._loop.bind(this), 800);
  }

  /**
   * @returns {import("../models/clip").Model}
   */
  _getText() {
    const text = clipboard.readText();
    if (text.length) {
      return Clip.factory(text);
    }
  }

  /**
   * @returns {import("../models/clip").Model}
   */
  _getImage() {
    const image = clipboard.readImage();
    if (!image.isEmpty()) {
      return Clip.image(image);
    }
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
    if (clip.image) {
      const image = nativeImage.createFromDataURL(clip.data);
      clipboard.writeImage(image);
    } else {
      clipboard.writeText(clip.data);
    }
    
    this._recent = clip;
  }
}

export const clipboardEventEmitter = new ClipboardEventEmitter();
