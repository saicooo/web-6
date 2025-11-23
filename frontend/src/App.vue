<template>
  <div id="app">
    <nav v-if="$route.name !== 'Login'" class="navbar">
      <div class="nav-brand">Stock Trading Platform</div>
      <div class="nav-links">
        <router-link to="/admin" class="nav-link">Administrator</router-link>
        <router-link 
          v-if="currentBroker" 
          :to="`/trading/${currentBroker.id}`" 
          class="nav-link"
        >
          Trading
        </router-link>
        <button @click="logout" class="logout-btn">Exit</button>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { useStockStore } from './stores/stockStore'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'App',
  computed: {
    ...mapState(useStockStore, ['currentBroker']),
  },
  methods: {
    ...mapActions(useStockStore, ['setCurrentBroker']),
    logout() {
      this.setCurrentBroker(null)
      this.$router.push('/')
    },
  },
  mounted() {
    const stockStore = useStockStore()
    stockStore.initializeSocket()
    stockStore.fetchStocks()
    stockStore.fetchBrokers()
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Binance Color Scheme */
  --binance-bg-primary: #0c0e14;
  --binance-bg-secondary: #161a25;
  --binance-bg-card: #515c77ff;
  --binance-green: #00c087;
  --binance-red: #f6465d;
  --binance-yellow: #f0b90b;
  --binance-blue: #3861fb;
  --binance-text-primary: #f37908;
  --binance-text-secondary: #5c5e60;
  --binance-border: #2a2f4c;
  --binance-hover: #2a2f45;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: var(--binance-bg-primary);
  color: var(--binance-text-primary);
  line-height: 1.4;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  background: var(--binance-bg-primary);
}

.navbar {
  background: var(--binance-bg-secondary);
  color: var(--binance-text-primary);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--binance-border);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--binance-yellow);
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: var(--binance-text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.nav-link:hover {
  color: var(--binance-text-primary);
  background: var(--binance-hover);
}

.nav-link.router-link-active {
  color: var(--binance-text-primary);
  background: var(--binance-hover);
}

.logout-btn {
  background: var(--binance-red);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #d9364c;
  transform: translateY(-1px);
}

main {
  padding: 2rem;
  background: var(--binance-bg-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
  }
  
  main {
    padding: 1rem;
  }
}
</style>