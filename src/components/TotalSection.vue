<template>
  <div class="table-content">
    <div class="header">
      <div class="header-label total-label">Total</div>
      <div class="header-label">Quantity</div>
      <div class="header-label">Price</div>
    </div>
    <div class="row">
      <div class="cell empty-cell"></div>
      <div class="cell">{{ totalQuantity }}</div>
      <div class="cell">{{ totalPrice.toFixed(2) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    totalQuantity: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style>
.total-label{
  flex: 5;
  text-align: start;
  padding-left: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.empty-cell{
  flex: 5;
  padding-left: 1rem;
}
</style>
