import hash from "hash.js";
import { v4 as uuid } from "uuid";

export default class ClipEntity {
  constructor(data, favorite) {
    this.data = String(data);
    this.favorite = Boolean(favorite);
    this.id = uuid();
    this.checkSum = this.#createCheckSum();
  }

  #createCheckSum() {
    return hash.sha256().update(this.data).digest("hex");
  }

  hasMatch(value) {
    return this.data.toLowerCase().includes(value.toLowerCase());
  }

  equals(clipEntity) {
    return this.checkSum === clipEntity.checkSum;
  }

  same(clipEntity) {
    return this.id === clipEntity.id;
  }
}
