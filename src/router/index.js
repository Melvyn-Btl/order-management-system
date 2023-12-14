import { createRouter, createWebHashHistory } from 'vue-router'
import ServiceBrowser from '@/components/ServiceBrowser.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'

// Define the routes for the application
const routes = [
  {
    path: '/', // Root path
    name: 'ServiceBrowser', // Name of the route
    component: ServiceBrowser // Component to be rendered at this route
  },
  {
    path: '/cart',
    name: 'ShoppingCart',
    component: ShoppingCart
  }
]

// Create the router instance with a hash-based history
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router // Export the router instance for use in the Vue application
