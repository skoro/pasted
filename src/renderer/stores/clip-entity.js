import hash from "hash.js";

export default class ClipEntity {
  constructor(data, favorite) {
    this.data = String(data);
    this.favorite = Boolean(favorite);
    this.id = this.#createId();
  }

  #createId() {
    return hash.sha256().update(this.data).digest("hex");
  }

  hasMatch(value) {
    return this.data.toLowerCase().includes(value.toLowerCase());
  }

  equals(clipEntity) {
    return this.id === clipEntity.id;
  }
}
