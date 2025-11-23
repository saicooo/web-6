<template>
  <div class="portfolio-panel">
    <h3>Ваш портфель</h3>
    
    <div class="portfolio-summary">
      <div class="summary-item">
        <span>Общая стоимость:</span>
        <span class="value">${{ totalPortfolioValue.toLocaleString() }}</span>
      </div>
      <div class="summary-item">
        <span>Денежные средства:</span>
        <span class="value">${{ broker.balance.toLocaleString() }}</span>
      </div>
    </div>

    <div class="holdings-list">
      <div 
        v-for="holding in portfolioWithDetails" 
        :key="holding.symbol" 
        class="holding-item"
      >
        <div class="stock-info">
          <strong>{{ holding.symbol }}</strong>
          <span>{{ holding.quantity }} акций</span>
        </div>
        <div class="value-info">
          <div class="current-price">${{ holding.currentPrice }}</div>
          <div class="total-value">${{ holding.totalValue.toLocaleString() }}</div>
          <div 
            class="profit" 
            :class="getProfitClass(holding.symbol)"
          >
            {{ getProfit(holding.symbol) > 0 ? '+' : '' }}{{ getProfit(holding.symbol) }}$
          </div>
        </div>
      </div>
      
      <div v-if="!portfolioWithDetails.length" class="no-holdings">
        У вас пока нет акций
      </div>
    </div>
  </div>
</template>

<script>
import { useStockStore } from '../stores/stockStore'
import { mapState } from 'pinia'

export default {
  name: 'PortfolioPanel',
  props: {
    broker: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useStockStore, ['currentBrokerPortfolio', 'stocks']),
    
    portfolioWithDetails() {
      return this.currentBrokerPortfolio
    },
    
    totalPortfolioValue() {
      const stocksValue = this.portfolioWithDetails.reduce(
        (total, holding) => total + holding.totalValue, 0
      )
      return stocksValue + this.broker.balance
    },
  },
  methods: {
    getProfit(symbol) {
      // Упрощенный расчет прибыли
      const holding = this.portfolioWithDetails.find(h => h.symbol === symbol)
      if (!holding) return 0
      
      const averagePrice = holding.currentPrice * 0.9 // Примерная средняя цена покупки
      return (holding.currentPrice - averagePrice) * holding.quantity
    },
    
    getProfitClass(symbol) {
      const profit = this.getProfit(symbol)
      return profit > 0 ? 'positive' : profit < 0 ? 'negative' : 'neutral'
    },
  },
}
</script>

<style scoped>
.portfolio-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.portfolio-summary {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-item .value {
  font-weight: bold;
  color: #27ae60;
}

.holdings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.holding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ecf0f1;
  border-radius: 6px;
  background-color: white;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.value-info {
  text-align: right;
}

.current-price {
  font-weight: bold;
  color: #2c3e50;
}

.total-value {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.profit {
  font-weight: bold;
  margin-top: 0.25rem;
}

.profit.positive {
  color: #27ae60;
}

.profit.negative {
  color: #e74c3c;
}

.profit.neutral {
  color: #7f8c8d;
}

.no-holdings {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
  background-color: #f8f9fa;
  border-radius: 6px;
}
</style>