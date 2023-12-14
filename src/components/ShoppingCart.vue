<template>
  <!-- Main container for the shopping cart interface -->
  <div class="table-container">
    <div class="title">Cart</div>
    <!-- Display cart items if the cart is not empty -->
    <div v-if="isCartNotEmpty">
      <!-- Table content for cart items -->
      <div class="table-content">
        <!-- Header row for cart item details -->
        <div class="header">
          <div class="header-label">Name</div>
          <div class="description-header-label">Description</div>
          <div class="header-label">Unit price</div>
          <div class="header-label">Quantity</div>
          <div class="header-label">Price</div>
        </div>
        <!-- Loop through cart items and display each using the ServiceItem component -->
        <ServiceItem
          v-for="item in cartItems"
          :key="item.service.id"
          :service="item.service"
          :quantity="item.quantity"
          :isCartView="true"
          @delete-item="removeFromCart"
          @update-quantity="updateItemQuantity"
          @computed-price-change="handleComputedPriceChange"
        />
      </div>
      <!-- Total section to display total quantity and price -->
      <TotalSection
      :totalQuantity="totalQuantity"
      :totalPrice="totalPrice"
      />
    </div>
    <!-- Message displayed when cart is empty -->
    <div v-else class="empty-cart-message">
      Your cart is empty
    </div>
    <!-- Buttons for navigating back to services and placing an order -->
    <div class="cart-buttons-container">
      <button @click="backToServices" class="back-button">Back to Services</button>
      <button v-if="isCartNotEmpty" @click="placeOrder">Order</button>
    </div>
  </div>
</template>

<script>
import ServiceItem from './ServiceItem.vue'
import TotalSection from './TotalSection.vue'
import { calculateFinalPrice } from '@/utils/priceRulesManager'
import Swal from 'sweetalert2'

export default {
  components: {
    ServiceItem,
    TotalSection
  },
  data () {
    return {
      computedPrices: {} // Stores computed prices for cart items
    }
  },
  computed: {
    cartItems () {
      // Retrieve items currently in the cart
      return this.$store.getters.cartItems
    },
    isCartNotEmpty () {
      // Check if the cart is not empty
      return this.cartItems.length > 0
    },
    totalQuantity () {
      // Calculate total quantity of items in the cart
      return this.cartItems.reduce((acc, item) => acc + item.quantity, 0)
    },
    totalPrice () {
      // Calculate total price of items in the cart
      return Object.values(this.computedPrices).reduce((acc, price) => acc + price, 0)
    }
  },
  created () {
    // Initialize computed prices for cart items
    this.initializeComputedPrices()
  },
  methods: {
    initializeComputedPrices () {
      // Initialize the computed prices for each item in the cart
      this.cartItems.forEach(item => {
        const { finalPrice } = calculateFinalPrice(this.$store.getters.applicableRules(item.service), item.service, item.quantity)
        this.computedPrices[item.service.id] = finalPrice
      })
    },
    showAlert () {
      // Show success alert when an order is placed
      return Swal.fire({
        icon: 'success',
        title: 'Order placed!',
        showConfirmButton: false,
        timer: 1500
      })
    },
    placeOrder () {
      // Handle the order placement process
      this.showAlert().then(() => {
      // This code will run after the alert's timer has finished
        this.$store.dispatch('clearCart')
        this.$router.push('/')
      })
    },
    backToServices () {
      // Navigate back to the services view
      this.$router.push('/')
    },
    removeFromCart (itemId) {
      // Remove an item from the cart
      this.$store.dispatch('removeFromCart', itemId)
    },
    updateItemQuantity ({ serviceId, quantity }) {
      // Update the quantity of a cart item
      const service = this.cartItems.find(item => item.service.id === serviceId)?.service
      if (service) {
        this.$store.dispatch('updateCartItemQuantity', { service, quantity })
      }
    },
    handleComputedPriceChange ({ serviceId, computedPrice }) {
      // Handle changes in the computed price of a cart item
      this.computedPrices[serviceId] = computedPrice
    }
  }
}
</script>

<style>
.description-header-label {
  flex: 3;
  text-align: center;
}

.empty-cart-message {
  text-align: center;
  font-size: 2rem;
  color: #606060;
  margin-top: 2rem;
}

.cart-buttons-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.back-button{
    background-color: #4c4c4c;
}

.back-button:hover {
  background-color: #2c2c2c;
}
</style>
