<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.dispatch('loadInitialData')
  }
}
</script>

<style>
  body {
    font-family: 'Roboto', sans-serif;
  }

  button {
    background-color: #0070ff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    font-size: 1rem;
    cursor: pointer;
    margin: 0.5rem;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }

  .title {
  color: #0070ff;
  font-size: 2rem;
  font-weight: bold;
  text-decoration: underline;
  text-align: center;
  }

  .table-container{
    display: flex;
    flex-direction: column;
    border-radius: 0.3rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    margin: 5rem auto;
    max-width: 1200px;
    padding: 1rem;
  }

  .table-content{
    margin: 0.5rem;
  }

  .header {
  display: flex;
  background-color: #0070ff;
  color: white;
  padding: 0.5rem;
  border-radius: 0.3rem;
  align-items: center;
  }

  .header-label {
  flex: 1;
  text-align: center;
  }

  .row{
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .cell {
    flex: 1;
    text-align: center;
    padding-top: 0.25rem;
    border-left: 1px solid #e0e0e0;
  }

  .price-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .help-icon {
    cursor: help;
    height: 30px;
    width: 30px;
    position: absolute;
    right: 0;
    transition: transform 0.2s ease;
  }

  .help-icon:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .price-container {
      flex-direction: column;
      align-items: center;
    }
    .help-icon {
      position: static;
      order: 2;
      margin-top: 5px;
      margin-left: 0;
    }
  }
</style>
