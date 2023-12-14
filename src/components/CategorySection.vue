<template>
  <!-- This section renders the category header and its services. -->
  <div class="table-content">
    <div class="header">
      <!-- Category header with toggle button and name -->
      <div class="category">
        <!-- Toggle button to show/hide services -->
        <button class="category-toggle-button" @click="toggleServices">{{ isExpanded ? '-' : '+' }}</button>
        <span>{{ category.name }}</span>
      </div>
      <!-- Header labels for unit price, quantity, and total price -->
      <div class="header-label">Unit price</div>
      <div class="header-label">Quantity</div>
      <div class="header-label price-container">
        <!-- Display computed total price and help icon with price rules -->
        <span>Price</span>
        <img src="@/assets/icons/help.svg" class="help-icon filter-white" :title="priceRulesExplanation.join('\n')" />
      </div>
    </div>
    <!-- Service items are displayed here if the category is expanded -->
    <div v-if="isExpanded">
      <ServiceItem
        v-for="service in services"
        :key="service.id"
        :service="service"
        @update-quantity="handleUpdateQuantity"
        @computed-price-change="handleComputedPriceChange"
      />
    </div>
  </div>
</template>

<script>
import ServiceItem from './ServiceItem.vue'
import { parseCategoryPriceRules } from '@/utils/priceRulesManager'

export default {
  components: { ServiceItem }, // Import ServiceItem component
  props: {
    // Define the properties passed to the component
    category: { type: Object, required: true }, // Category object
    services: { type: Array, required: true }, // Array of service objects
    isExpanded: { type: Boolean, default: false } // Toggle state for showing services
  },
  data () {
    return {
      priceRulesExplanation: [] // Explanation for price rules
    }
  },
  mounted () {
    // Process price rules when the component is mounted
    if (this.category && this.category.priceRules) {
      this.priceRulesExplanation = parseCategoryPriceRules(this.category.priceRules)
    }
  },
  methods: {
    // Methods for handling component events
    handleUpdateQuantity (payload) {
      this.$emit('update-service-quantity', payload) // Emit update quantity event
    },
    toggleServices () {
      this.$emit('toggle') // Emit toggle event to parent component
    },
    handleComputedPriceChange (payload) {
      this.$emit('computed-price-change', payload) // Emit price change event
    }
  }
}
</script>

<style>
.category {
  flex: 4;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.category-toggle-button {
  background: none;
  border: 2px solid #ffffff;
  color: white;
  cursor: pointer;
  margin-right: 1rem;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  font-weight: bold;
  }

.price-label-container{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.filter-white {
  filter: invert(95%) sepia(97%) saturate(14%) hue-rotate(213deg) brightness(104%) contrast(104%);
}

</style>
