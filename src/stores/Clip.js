import { v4 as uuid } from 'uuid'

export default class Clip {
  constructor(data, favorite) {
    this.data = String(data)
    this.favorite = Boolean(favorite)
    this.id = uuid()
  }

  hasMatch(value) {
    return this.data.toLowerCase().includes(value.toLowerCase())
  }
}
