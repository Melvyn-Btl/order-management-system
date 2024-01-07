import { mount } from '@vue/test-utils';
import ServiceBrowser from '@/components/ServiceBrowser.vue';
import CategorySection from '@/components/CategorySection.vue';
import TotalSection from '@/components/TotalSection.vue';
import ServiceItem from '@/components/ServiceItem.vue';
import router from '@/router';
import store from '@/store';
import { loadData } from '@/services/dataService';

describe('ServiceBrowser.vue Integration Test', () => {
  let wrapper;

  // Setup before each test
  beforeEach(() => {
    // Load initial data from the dataService
    const { categories, services } = loadData();

    // Set the initial state in the Vuex store
    store.commit('SET_CATEGORIES', categories);
    store.commit('SET_SERVICES', services);

    // Create an instance of the component with global dependencies (store and router)
    wrapper = mount(ServiceBrowser, {
      global: {
        plugins: [store, router]
      }
    });
  });

  // Test to check if child components are rendered correctly
  it('renders child components correctly', async () => {
    // Wait for the component to fully render
    await wrapper.vm.$nextTick();

    // Assertions to check if child components exist
    expect(wrapper.findComponent(CategorySection).exists()).toBe(true);
    expect(wrapper.findComponent(TotalSection).exists()).toBe(true);
    expect(wrapper.findAllComponents(ServiceItem).length).toBeGreaterThan(0);
  });

  it('handles category expansion and service selection', async () => {
    // Simulate clicking the category toggle button
    const toggleButton = wrapper.find('.category-toggle-button');
    await toggleButton.trigger('click');

    // Assert that a ServiceItem is visible after expansion
    const serviceItem = wrapper.findComponent(ServiceItem);
    expect(serviceItem.isVisible()).toBe(true);

    // Simulate changing the quantity of a service
    const quantityInput = serviceItem.find('input[type="number"]');
    await quantityInput.setValue(1);
    expect(store.state.services[0].quantity).toBe(1);
  });

  // Mock the router push function for testing navigation
  router.push = jest.fn();
  
  it('adds items to the cart and navigates to the cart view', async () => {
    // Manually set a service with a quantity in the store
    store.commit('SET_SERVICES', [
      { id: 1, name: 'Service 1', description: "Service description", categoryId: 1, unitPrice: 20, quantity: 1 }
    ]);

    // Trigger the add to cart button click
    await wrapper.find('.add-to-cart-button').trigger('click');

    // Wait for asynchronous operations
    await wrapper.vm.$nextTick();

    // Check if the cart contains the added item
    expect(store.state.cart.length).toBeGreaterThan(0);

    // Simulate clicking the view cart button and check navigation
    const viewCartButton = wrapper.find('.view-cart-button');
    expect(viewCartButton.exists()).toBe(true);
    await viewCartButton.trigger('click');
    expect(router.push).toHaveBeenCalledWith('/cart');
  });  
});