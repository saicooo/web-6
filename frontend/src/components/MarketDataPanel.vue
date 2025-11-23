<template>
  <div class="market-data-panel">
    <h3>Market Data</h3>
    
    <div class="market-info">
      <div class="current-date">
        Date: {{ marketData.date }}
      </div>
      <div class="simulation-status">
        Simulation: {{ simulationStatus.isRunning ? 'Running' : 'Stopped' }}
      </div>
    </div>

    <div class="market-tabs">
      <button 
        @click="activeTab = 'stocks'" 
        :class="{ active: activeTab === 'stocks' }"
        class="tab-button"
      >
        Stocks
      </button>
      <button 
        @click="activeTab = 'crypto'" 
        :class="{ active: activeTab === 'crypto' }"
        class="tab-button"
      >
        Crypto
      </button>
    </div>

    <div class="stocks-table">
      <div class="table-header">
        <div>Symbol</div>
        <div>Price</div>
        <div>Change</div>
        <div>Actions</div>
      </div>
      
      <div 
        v-for="stockData in filteredStocks" 
        :key="stockData.symbol" 
        class="table-row"
      >
        <div class="stock-name">
          <strong>{{ stockData.symbol }}</strong>
          <span>{{ stockData.name }}</span>
        </div>
        <div class="price">${{ formatPrice(stockData.price) }}</div>
        <div class="change" :class="getChangeClass(stockData.symbol)">
          {{ getChangePercent(stockData.symbol) }}
        </div>
        <div class="actions">
          <button 
            @click="showGraph(stockData.symbol)" 
            class="btn-chart"
          >
            Graph
          </button>
        </div>
      </div>
    </div>

    <!-- Graph Modal -->
    <div v-if="selectedStock" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <h3>{{ selectedStock.symbol }} - {{ selectedStock.name }}</h3>
        <StockChart :stock="selectedStock" />
      </div>
    </div>
  </div>
</template>

<script>
import { useStockStore } from '../stores/stockStore'
import { mapState, mapGetters } from 'pinia'
import StockChart from './StockChart.vue'

export default {
  name: 'MarketDataPanel',
  components: { StockChart },
  data() {
    return {
      activeTab: 'stocks',
      selectedStock: null,
      previousPrices: {},
    }
  },
  computed: {
    ...mapState(useStockStore, ['marketData', 'stocks', 'simulationStatus', 'selectedStockForChart']),
    ...mapGetters(useStockStore, ['stocksByType', 'getStockBySymbol']),
    
    filteredStocks() {
      return this.stocksByType(this.activeTab)
    },
  },
  watch: {
    marketData: {
      handler(newData) {
        // Store previous prices for change calculation
        newData.stocks.forEach(stock => {
          if (!this.previousPrices[stock.symbol]) {
            this.previousPrices[stock.symbol] = stock.price
          }
        })
      },
      immediate: true,
    },
    selectedStockForChart: {
      handler(newStock) {
        if (newStock) {
          this.selectedStock = newStock
        }
      },
      immediate: true
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },
    
    getChangePercent(symbol) {
      const currentPrice = this.marketData.stocks.find(s => s.symbol === symbol)?.price
      const previousPrice = this.previousPrices[symbol]
      
      if (!currentPrice || !previousPrice || previousPrice === currentPrice) {
        return '0.00%'
      }
      
      const change = ((currentPrice - previousPrice) / previousPrice) * 100
      return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
    },
    
    getChangeClass(symbol) {
      const currentPrice = this.marketData.stocks.find(s => s.symbol === symbol)?.price
      const previousPrice = this.previousPrices[symbol]
      
      if (!currentPrice || !previousPrice) return 'neutral'
      
      if (currentPrice > previousPrice) return 'positive'
      if (currentPrice < previousPrice) return 'negative'
      return 'neutral'
    },
    
    showGraph(symbol) {
      const stockStore = useStockStore()
      const stock = stockStore.getStockBySymbol(symbol)
      if (stock) {
        this.selectedStock = stock
        stockStore.setSelectedStockForChart(stock)
      }
    },
    
    closeModal() {
      this.selectedStock = null
      const stockStore = useStockStore()
      stockStore.setSelectedStockForChart(null)
    },
  },
}
</script>

<style scoped>
.market-data-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.market-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.current-date, .simulation-status {
  font-weight: bold;
  color: #7f8c8d;
}

.market-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: bold;
  color: #7f8c8d;
  transition: all 0.3s;
}

.tab-button.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.tab-button:hover {
  color: #2980b9;
}

.stocks-table {
  display: flex;
  flex-direction: column;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background-color: #34495e;
  color: white;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #ecf0f1;
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.stock-name {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stock-name strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

.stock-name span {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.price {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1rem;
}

.change {
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-align: center;
}

.change.positive {
  background-color: #d4edda;
  color: #155724;
}

.change.negative {
  background-color: #f8d7da;
  color: #721c24;
}

.change.neutral {
  background-color: #e2e3e5;
  color: #383d41;
}

.btn-chart {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn-chart:hover {
  background-color: #2980b9;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s;
}

.close:hover {
  color: #e74c3c;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .modal-content {
    width: 95%;
    padding: 1rem;
  }
}
</style>