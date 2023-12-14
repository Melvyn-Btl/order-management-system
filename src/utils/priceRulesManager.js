/**
 * Parses category price rules into a readable text format.
 * @param {PriceRule[]} rules - An array of pricing rules for a category.
 * @returns {string[]} An array of parsed rule descriptions.
 */
export function parseCategoryPriceRules (rules) {
  const priceRulesText = []
  rules.forEach(rule => {
    let parsedRule = rule.ruleTag.charAt(0).toUpperCase() + rule.ruleTag.slice(1) + ': ' + rule.ruleValue
    if (rule.conditionTag === 'minimumQuantity') {
      parsedRule += ' (if quantity greater than or equal to ' + rule.conditionValue + ')'
    }
    // ... Add all possible rules

    priceRulesText.push(parsedRule)
  })
  return priceRulesText
}

/**
 * Calculates the final price for a service based on applicable rules.
 * @param {PriceRule[]} rules - An array of pricing rules to apply.
 * @param {Service} service - The service for which to calculate the price.
 * @param {number} quantity - The quantity of the service.
 * @returns {{finalPrice: number, explanations: string[]}} The final price and explanations.
 */
export function calculateFinalPrice (rules, service, quantity) {
  let finalPrice = service.unitPrice * quantity
  const explanations = []

  rules.forEach(rule => {
    // Apply each rule only if it meets its condition or if there are no conditions
    if (!rule.conditionTag || (rule.conditionTag === 'minimumQuantity' && quantity >= rule.conditionValue)) {
      const result = applyPriceRule(finalPrice, rule)
      finalPrice = result.newPrice
      if (result.explanation) {
        explanations.push(result.explanation)
      }
    }
  })

  return { finalPrice, explanations }
}

/**
 * Applies a specific pricing rule to the given price.
 * @param {number} finalPrice - The initial calculated price.
 * @param {PriceRule} rule - The pricing rule to apply.
 * @returns {{newPrice: number, explanation: string}} The new price and an explanation.
 */
function applyPriceRule (finalPrice, rule) {
  let explanation = ''
  if (rule.ruleTag === 'discount') {
    explanation = `Discount of ${rule.ruleValue * 100}% applied.`
    return { newPrice: finalPrice - finalPrice * rule.ruleValue, explanation }
  } else if (rule.ruleTag === 'additionalFlatFee') {
    explanation = `Additional fee of ${rule.ruleValue} applied.`
    return { newPrice: finalPrice + rule.ruleValue, explanation }
  } else {
    return { newPrice: finalPrice }
  }
}
