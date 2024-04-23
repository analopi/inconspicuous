<script>
  import { onMount } from 'svelte';

  let fromCurrency = '';
  let toCurrency = '';
  let amount = '';
  let exchangeRate = null;
  let currencyList = [];

  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      console.log(func);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  async function fetchExchangeRate() {
    if (fromCurrency && toCurrency && amount) {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      exchangeRate = data.rates[toCurrency];
    }
  }

  async function fetchCurrencyList() {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/RUB`);
    const data = await response.json();
    currencyList = Object.keys(data.rates);
  }

  const debouncedFetchExchangeRate = debounce(fetchExchangeRate, 300);

  function handleFromCurrencyChange(event) {
    fromCurrency = event.target.value.toUpperCase();
    debouncedFetchExchangeRate();
  }

  function handleToCurrencyChange(event) {
    toCurrency = event.target.value.toUpperCase();
    debouncedFetchExchangeRate();
  }

  function handleAmountInput(event) {
    amount = event.target.value;
    debouncedFetchExchangeRate();
  }

  onMount(fetchExchangeRate);
  onMount(fetchCurrencyList);

  $: convertedAmount = (amount * exchangeRate).toFixed(2);
</script>



<div>
  <label>Ваша валюта:</label>
  <select bind:value={fromCurrency} on:change={handleFromCurrencyChange}>
    {#each currencyList as currency}
      <option value={currency}>{currency}</option>
    {/each}
  </select>

  <label>Переводим в:</label>
  <select bind:value={toCurrency} on:change={handleToCurrencyChange}>
    {#each currencyList as currency}
      <option value={currency}>{currency}</option>
    {/each}
  </select>

  <label>Кол-во в {fromCurrency}</label>
  <input type="text" bind:value={amount} on:input={handleAmountInput}>

  <label>Кол-во в {toCurrency}</label>
  <input type="text" readonly bind:value={convertedAmount}>
</div>