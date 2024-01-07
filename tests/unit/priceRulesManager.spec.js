import { calculateFinalPrice } from '@/utils/priceRulesManager';

describe('calculateFinalPrice', () => {
  // Common service object used in all tests
  const service = { id: 1, name: 'Service 1', description: "Service description", categoryId: 1, unitPrice: 100 };

  it('calculates the base price with no rules', () => {
    const rules = []; // No discount or additional fee rules
    const quantity = 2;
    const { finalPrice, explanations } = calculateFinalPrice(rules, service, quantity);

    expect(finalPrice).toBe(200); // Base price calculation without rules
    expect(explanations).toHaveLength(0); // No explanations as there are no rules
  });

  it('applies a discount rule correctly', () => {
    const rules = [{ ruleTag: 'discount', ruleValue: 0.1 }]; // 10% discount rule
    const quantity = 1;
    const { finalPrice, explanations } = calculateFinalPrice(rules, service, quantity);

    expect(finalPrice).toBe(90); // Price after 10% discount
    expect(explanations).toContain('Discount of 10% applied.'); // Explanation for discount
  });

  it('applies an additional flat fee rule correctly', () => {
    const rules = [{ ruleTag: 'additionalFlatFee', ruleValue: 20 }]; // Additional flat fee of 20
    const quantity = 1;
    const { finalPrice, explanations } = calculateFinalPrice(rules, service, quantity);

    expect(finalPrice).toBe(120); // Price after adding flat fee of 20
    expect(explanations).toContain('Additional fee of 20 applied.'); // Explanation for additional fee
  });

  it('applies multiple rules correctly', () => {
    const rules = [
      { ruleTag: 'discount', ruleValue: 0.1 }, // 10% discount
      { ruleTag: 'additionalFlatFee', ruleValue: 15 } // Additional fee of 15
    ];
    const quantity = 1;
    const { finalPrice, explanations } = calculateFinalPrice(rules, service, quantity);

    expect(finalPrice).toBe(105); // Price after applying both discount and additional fee
    expect(explanations).toEqual(['Discount of 10% applied.', 'Additional fee of 15 applied.']); // Explanations for both rules
  });

  it('does not apply a rule if the condition is not met', () => {
    const rules = [
      { ruleTag: 'discount', ruleValue: 0.2, conditionTag: 'minimumQuantity', conditionValue: 3 } // 20% discount, applicable only if minimum quantity is 3
    ];
    const quantity = 2; // Quantity less than the required minimum
    const { finalPrice, explanations } = calculateFinalPrice(rules, service, quantity);

    expect(finalPrice).toBe(200); // No discount applied as condition not met
    expect(explanations).toHaveLength(0); // No explanations as rule was not applied
  });
});