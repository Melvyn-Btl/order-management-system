<template>
  <!-- Component representing a single service item in a row format -->
  <div class="row">
    <div class="cell service-name">{{ service.name }}</div>
    <div class="cell service-description">{{ service.description }}</div>
    <div class="cell">{{ service.unitPrice.toFixed(2) }}</div>
    <div class="cell input-container">
      <!-- Input field for service quantity with validation and conditional styling -->
      <input type="number" :value="localQuantity" @input="onQuantityInput" min="0" :class="{ 'highlighted-input': isQuantityGreaterThanZero }" />
      <!-- Delete icon for removing item from cart, shown only in cart view -->
      <img v-if="isCartView" src="@/assets/icons/trash.svg" class="trash-icon" @click="deleteItem" alt="Delete" />
    </div>
    <div class="cell price-container">
      <!-- Display computed price and provide explanations on hover if available -->
      <span>{{ computedPrice }}</span>
      <img v-if="priceExplanations.length > 0" src="@/assets/icons/help.svg" class="help-icon" :title="priceExplanations.join('\n')" />
    </div>
  </div>
</template>

<script>
import { calculateFinalPrice } from '@/utils/priceRulesManager'

export default {
  props: {
    service: { type: Object, required: true }, // Service object
    quantity: { type: Number, default: 0 }, // Quantity of the service
    isCartView: { type: Boolean, default: false } // Flag to indicate if component is used in cart view
  },
  data () {
    return {
      localQuantity: this.quantity, // Local state for quantity
      priceExplanations: [], // Explanations for computed price
      computedPrice: '0.00' // Computed price for the service
    }
  },
  computed: {
    isQuantityGreaterThanZero () {
      // Checks if the quantity is greater than zero
      return this.localQuantity > 0
    },
    serviceRules () {
      // Retrieves applicable price rules for the service
      return this.$store.getters.applicableRules(this.service)
    }
  },
  methods: {
    onQuantityInput (event) {
      // Handles input change for quantity, validates and updates local state
      const newQuantity = parseInt(event.target.value)
      if (isNaN(newQuantity) || newQuantity <= 0) {
        this.localQuantity = 0
        event.target.value = '0'
        if (this.isCartView) {
          this.deleteItem()
        }
      } else {
        this.localQuantity = newQuantity
      }
      this.$emit('update-quantity', { serviceId: this.service.id, quantity: this.localQuantity })
      this.calculatePriceAndExplanations()
    },
    deleteItem () {
      // Emits event to delete item from cart
      this.$emit('computed-price-change', { serviceId: this.service.id, computedPrice: 0 })
      this.$emit('delete-item', this.service.id)
    },
    calculatePriceAndExplanations () {
      // Calculates final price and gathers explanations for it
      if (this.localQuantity === 0) {
        this.computedPrice = '0.00'
        this.priceExplanations = []
      } else {
        const { finalPrice, explanations } = calculateFinalPrice(this.serviceRules, this.service, this.localQuantity)
        this.computedPrice = finalPrice.toFixed(2)
        this.priceExplanations = explanations
      }
    }
  },
  watch: {
    'service.quantity': function (newVal) {
      // Watches for external changes in quantity and updates component state
      if (!this.isCartView) {
        this.localQuantity = newVal < 0 ? 0 : newVal
        this.calculatePriceAndExplanations()
      }
    },
    computedPrice (newVal) {
      // Watches computed price changes and emits an event for parent components
      this.$emit('computed-price-change', { serviceId: this.service.id, computedPrice: parseFloat(newVal) })
    }
  },
  mounted () {
    // Initial price calculation when component is mounted
    this.calculatePriceAndExplanations() // Initial calculation
  }
}
</script>

<style>
.service-name {
  text-align: start;
  padding-left: 0.25rem;
}

.service-description {
  flex: 3;
  text-align: start;
  padding-left: 0.25rem;
}

.input-container{
  display: flex;
  align-items: center;
  justify-content: center;
}

input[type="number"] {
  width: 45%;
  padding: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 0.3rem;
  text-align: center;
}

.highlighted-input {
  background-color: #d6f7ff;
}

.trash-icon {
  cursor: pointer;
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
}

.trash-icon:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
</style>
