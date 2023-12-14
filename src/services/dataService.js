import categoriesData from '@/assets/jsonFiles/categories.json'
import servicesData from '@/assets/jsonFiles/services.json'
import priceRulesData from '@/assets/jsonFiles/pricerules.json'
import Category from '@/models/Category'
import Service from '@/models/Service'
import PriceRule from '@/models/PriceRule'

export const loadData = () => {
  // Initialize categories and services from the data
  const categories = categoriesData.categories.map(c => new Category(c.id, c.name, []))
  const services = servicesData.services.map(s => new Service(s.id, s.name, s.description, s.categoryId, 0))

  // pricerules.json (priceRulesData) contains both price rules and services unit prices.
  // We retrieve the unit prices and add it to 'services'
  // We also retrieve the price rules, parse it and add it to 'categories'

  priceRulesData.priceRules.forEach(rule => {
    if (rule.serviceId) {
      // Apply unit price to the matching service
      const service = services.find(s => s.id === rule.serviceId)
      if (service) {
        service.unitPrice = rule.unitPrice
      }
    } else if (rule.categoryId) {
      // Add price rule to the matching category
      const category = categories.find(c => c.id === rule.categoryId)
      if (category) {
        const priceRule = new PriceRule()

        if (rule.minimumQuantity) {
          priceRule.conditionTag = 'minimumQuantity'
          priceRule.conditionValue = rule.minimumQuantity
        }
        // ... handle other condition tags

        if (rule.discount) {
          priceRule.ruleTag = 'discount'
          priceRule.ruleValue = rule.discount
        } else if (rule.additionalFlatFee) {
          priceRule.ruleTag = 'additionalFlatFee'
          priceRule.ruleValue = rule.additionalFlatFee
        }
        // ... handle other rule tags

        category.priceRules.push(priceRule)
      }
    }
  })

  return { categories, services }
}
