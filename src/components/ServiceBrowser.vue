<template>
  <!-- Main container for displaying services and consumables available for order -->
  <div class="table-container">
    <div class="title">Services and consumables available for order.</div>
    <!-- Buttons to expand or collapse all categories -->
    <div>
      <button @click="expandAll">Show all</button>
      <button @click="collapseAll">Hide all</button>
    </div>
    <!-- Loop through categories and display each using the Category component -->
    <Category
      v-for="category in categories"
      :key="category.id"
      :category="category"
      :services="getServicesByCategory(category.id)"
      :isExpanded="expandedCategories.includes(category.id)"
      @toggle="handleToggle(category.id)"
      @update-service-quantity="updateQuantity"
      @computed-price-change="handleComputedPriceChange"
    />
    <!-- Total section showing the total quantity and price -->
    <TotalSection
    :totalQuantity="totalQuantity"
    :totalPrice="totalPrice"
    />
    <!-- Buttons for adding items to the cart and viewing the cart -->
    <div class="buttons-container">
      <button @click="addToCart">Add to Cart</button>
      <button @click="viewCart">View Cart</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Category from './CategorySection.vue'
import TotalSection from './TotalSection.vue'
import Swal from 'sweetalert2'

export default {
  components: {
    Category,
    TotalSection
  },
  computed: {
    // Vuex state mappings
    ...mapState(['categories', 'services']),
    totalQuantity () {
      // Calculate total quantity of services
      return this.services.reduce((acc, item) => acc + item.quantity, 0)
    },
    totalPrice () {
      // Calculate total price of services
      return Object.values(this.computedPrices).reduce((acc, price) => acc + price, 0)
    }
  },
  created () {
    // Reset service quantities when component is created
    this.resetServiceQuantities()
  },
  data () {
    return {
      expandedCategories: [], // Array to keep track of expanded categories
      computedPrices: {} // Object to store computed prices for each service
    }
  },
  methods: {
    showAlert () {
      // Show a SweetAlert2 dialog
      return Swal.fire({
        title: 'You forgot to add selected services to your cart',
        confirmButtonText: 'Add to Cart',
        confirmButtonColor: '#0070ff',
        showCancelButton: true,
        cancelButtonText: 'Skip',
        cancelButtonColor: '#4c4c4c',
        showDenyButton: true,
        denyButtonText: 'Cancel'
      })
    },
    expandAll () {
      // Expand all categories
      this.expandedCategories = this.categories.map(c => c.id) // Expand all categories
    },
    collapseAll () {
      // Collapse all categories
      this.expandedCategories = [] // Collapse all categories
    },
    handleToggle (categoryId) {
      // Toggle the expansion of a category
      const index = this.expandedCategories.indexOf(categoryId)
      if (index === -1) {
        this.expandedCategories.push(categoryId)
      } else {
        this.expandedCategories.splice(index, 1)
      }
    },
    resetServiceQuantities () {
      // Reset quantities of all services
      this.$store.dispatch('resetQuantities')
    },
    getServicesByCategory (categoryId) {
      // Get services belonging to a specific category
      return this.services.filter(service => service.categoryId === categoryId)
    },
    updateQuantity (payload) {
      // Update the quantity of a specific service
      const serviceToUpdate = this.services.find(service => service.id === payload.serviceId)
      if (serviceToUpdate) {
        serviceToUpdate.quantity = payload.quantity
      }
    },
    addToCart () {
      // Add selected services to the cart
      this.services.forEach(service => {
        if (service.quantity > 0) {
          this.$store.dispatch('addToCart', {
            service: { ...service }, // entire service object
            quantity: service.quantity // selected quantity
          })
        }
      })
      this.resetServiceQuantities()
    },
    viewCart () {
      // Navigate to the cart view, handling any alerts
      const hasSelectedServices = this.services.some(service => service.quantity > 0)

      if (hasSelectedServices) {
        this.showAlert().then((result) => {
          if (result.isConfirmed) {
            // User clicked 'Add to Cart'
            this.addToCart()
            this.$router.push('/cart')
          } else if (result.isDismissed || result.dismiss === Swal.DismissReason.cancel) {
            // User clicked 'Skip' or outside the modal (dismissed the alert)
            this.$router.push('/cart')
          }
          // If 'Cancel' is clicked, do nothing
        })
      } else {
        this.$router.push('/cart')
      }
    },
    handleComputedPriceChange ({ serviceId, computedPrice }) {
      // Handle changes in computed price of a service
      this.computedPrices[serviceId] = computedPrice
    }
  }
}
</script>

<style>
.buttons-container {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}
</style>
