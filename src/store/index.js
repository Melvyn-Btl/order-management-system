import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { loadData } from '@/services/dataService'

// Plugin to persist Vuex state in local storage
const vuexPersisted = createPersistedState({
  storage: window.localStorage,
  paths: ['cart', 'categories', 'services']
})

// Vuex store creation
const store = createStore({
  // Initial state of the store
  state () {
    return {
      categories: [],
      services: [],
      cart: []
    }
  },
  // Mutations for altering the state
  mutations: {
    SET_CATEGORIES (state, categories) {
      state.categories = categories
    },
    SET_SERVICES (state, services) {
      state.services = services
    },
    RESET_QUANTITIES (state) {
      state.services.forEach(service => {
        service.quantity = 0
      })
    },
    ADD_TO_CART (state, { service, quantity }) {
      const existingItem = state.cart.find(item => item.service.id === service.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.cart.push({ service, quantity })
      }
    },
    REMOVE_FROM_CART (state, itemId) {
      state.cart = state.cart.filter(cartItem => cartItem.service.id !== itemId)
    },
    CLEAR_CART (state) {
      state.cart = []
    },
    UPDATE_CART_ITEM_QUANTITY (state, { serviceId, quantity }) {
      const itemIndex = state.cart.findIndex(item => item.service.id === serviceId)
      if (itemIndex !== -1) {
        state.cart[itemIndex].quantity = quantity
      }
    }
  },
  // Actions for committing mutations
  actions: {
    loadInitialData ({ commit }) {
      const { categories, services } = loadData()
      commit('SET_CATEGORIES', categories)
      commit('SET_SERVICES', services)
    },
    resetQuantities ({ commit }) {
      commit('RESET_QUANTITIES')
    },
    addToCart ({ commit }, item) {
      commit('ADD_TO_CART', item)
    },
    removeFromCart ({ commit }, itemId) {
      commit('REMOVE_FROM_CART', itemId)
    },
    clearCart ({ commit }) {
      commit('CLEAR_CART')
    },
    updateCartItemQuantity ({ commit }, { service, quantity }) {
      commit('UPDATE_CART_ITEM_QUANTITY', { serviceId: service.id, quantity })
    }
  },
  // Getters for accessing store state
  getters: {
    applicableRules: (state) => (service) => {
      // Returns applicable price rules for a service
      const category = state.categories.find(c => c.id === service.categoryId)
      return category ? category.priceRules : []
    },
    cartItems: (state) => state.cart // Returns items in the cart
  },
  plugins: [vuexPersisted]
})

export default store
