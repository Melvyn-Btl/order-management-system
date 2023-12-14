export default class Category {
  constructor (id, name, priceRules = []) {
    this.id = id
    this.name = name
    this.priceRules = priceRules
  }
}
