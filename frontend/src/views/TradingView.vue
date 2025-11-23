<template>
  <div class="trading-container" v-if="currentBroker">
    <div class="trading-header">
      <h1>Торговая площадка - {{ currentBroker.name }}</h1>
      <div class="broker-info">
        <div class="balance">Баланс: ${{ currentBroker.balance.toLocaleString() }}</div>
        <div class="current-date">Текущая дата: {{ marketData.date }}</div>
      </div>
    </div>

    <div class="trading-layout">
      <!-- Левая колонка - Портфель и форма торгов -->
      <div class="left-column">
        <PortfolioPanel :broker="currentBroker" />
        <TradingForm 
          :broker="currentBroker" 
          @order-placed="handleOrderPlaced" 
        />
      </div>

      <!-- Правая колонка - Котировки и графики -->
      <div class="right-column">
        <MarketDataPanel />
        <div class="charts-section">
          <h3>Графики акций</h3>
          <div class="charts-grid">
            <StockChart 
              v-for="stock in stocks" 
              :key="stock.symbol" 
              :stock="stock" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStockStore } from '../stores/stockStore'
import { mapState } from 'pinia'
import PortfolioPanel from '../components/PortfolioPanel.vue'
import TradingForm from '../components/TradingForm.vue'
import MarketDataPanel from '../components/MarketDataPanel.vue'
import StockChart from '../components/StockChart.vue'

export default {
  name: 'TradingView',
  components: {
    PortfolioPanel,
    TradingForm,
    MarketDataPanel,
    StockChart,
  },
  computed: {
    ...mapState(useStockStore, ['currentBroker', 'stocks', 'marketData']),
  },
  methods: {
    handleOrderPlaced() {
      // Обновляем данные после успешной торговли
      const stockStore = useStockStore()
      stockStore.fetchBrokers()
    },
  },
}
</script>

<style scoped>
.trading-container {
  max-width: 1400px;
  margin: 0 auto;
}

.trading-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.trading-header h1 {
  color: #2c3e50;
  margin: 0;
}

.broker-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.balance {
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
}

.current-date {
  font-weight: bold;
  color: #7f8c8d;
}

.trading-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.charts-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .trading-layout {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>