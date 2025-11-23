<template>
  <div class="admin-container">
    <h1>Admin Panel</h1>
    
    <div class="admin-section">
      <h2>Simulation Control</h2>
      <div class="simulation-controls">
        <div class="control-group">
          <label>
            Speed (seconds):
            <input 
              v-model.number="simulationSpeed" 
              type="number" 
              min="1" 
              max="10" 
              class="input-field"
            >
          </label>
          <button 
            @click="startSimulation" 
            class="btn-success"
            :disabled="simulationStatus.isRunning"
          >
            {{ simulationStatus.isRunning ? 'Simulation Running' : 'Start Simulation' }}
          </button>
          <button 
            @click="stopSimulation" 
            class="btn-danger"
            :disabled="!simulationStatus.isRunning"
          >
            Stop Simulation
          </button>
        </div>
      </div>
      <div class="simulation-info">
        <div class="info-item">
          <strong>Current Date:</strong> {{ marketData.date }}
        </div>
        <div class="info-item">
          <strong>Simulation Status:</strong> 
          <span :class="simulationStatus.isRunning ? 'status-running' : 'status-stopped'">
            {{ simulationStatus.isRunning ? 'Running' : 'Stopped' }}
          </span>
        </div>
        <div class="info-item">
          <strong>Speed:</strong> {{ simulationStatus.speed }} seconds
        </div>
      </div>
      <div v-if="simulationMessage" class="message" :class="messageType">
        {{ simulationMessage }}
      </div>
    </div>

    <div class="admin-section">
      <h2>Traders</h2>
      <div class="brokers-grid">
        <div 
          v-for="broker in brokers" 
          :key="broker.id" 
          class="broker-card"
        >
          <h3>{{ broker.name }}</h3>
          <p class="balance">Balance: ${{ broker.balance.toLocaleString() }}</p>
          <div class="portfolio">
            <h4>Portfolio:</h4>
            <div 
              v-for="(quantity, symbol) in broker.portfolio" 
              :key="symbol" 
              class="portfolio-item"
            >
              <span class="symbol">{{ symbol }}</span>
              <span class="quantity">{{ quantity }} shares</span>
              <span class="profit" :class="getProfitClass(broker.id, symbol)">
                {{ getProfit(broker.id, symbol) > 0 ? '+' : '' }}{{ getProfit(broker.id, symbol).toFixed(2) }}$
              </span>
            </div>
            <div v-if="!Object.keys(broker.portfolio || {}).length" class="no-stocks">
              No holdings
            </div>
          </div>
          <p class="total-value">
            Total Value: ${{ getTotalPortfolioValue(broker).toLocaleString() }}
          </p>
        </div>
      </div>
    </div>

    <div class="admin-section">
      <h2>Market Overview</h2>
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
          Cryptocurrencies
        </button>
      </div>
      
      <div v-if="activeTab === 'stocks'" class="stocks-grid">
        <div 
          v-for="stock in stocksByType('stock')" 
          :key="stock.symbol" 
          class="stock-card"
        >
          <h3>{{ stock.symbol }}</h3>
          <p>{{ stock.name }}</p>
          <p class="price">${{ stock.currentPrice.toLocaleString() }}</p>
          <StockChart :stock="stock" />
        </div>
      </div>

      <div v-if="activeTab === 'crypto'" class="stocks-grid">
        <div 
          v-for="stock in stocksByType('crypto')" 
          :key="stock.symbol" 
          class="stock-card crypto"
        >
          <h3>{{ stock.symbol }}</h3>
          <p>{{ stock.name }}</p>
          <p class="price">${{ stock.currentPrice.toLocaleString() }}</p>
          <StockChart :stock="stock" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStockStore } from '../stores/stockStore'
import { mapState, mapActions, mapGetters } from 'pinia'
import StockChart from '../components/StockChart.vue'

export default {
  name: 'AdminView',
  components: { StockChart },
  data() {
    return {
      simulationSpeed: 2,
      simulationMessage: '',
      messageType: '',
      activeTab: 'stocks'
    }
  },
  computed: {
    ...mapState(useStockStore, ['brokers', 'stocks', 'marketData', 'simulationStatus']),
    ...mapGetters(useStockStore, ['stocksByType']),
  },
  methods: {
    ...mapActions(useStockStore, ['startSimulation', 'stopSimulation', 'fetchBrokers', 'checkSimulationStatus']),
    
    async startSimulation() {
      try {
        this.simulationMessage = 'Starting simulation...'
        this.messageType = 'info'
        
        const result = await this.startSimulation(this.simulationSpeed)
        
        this.simulationMessage = result.message
        this.messageType = result.success ? 'success' : 'error'
        
        setTimeout(() => {
          this.simulationMessage = ''
        }, 3000)
        
      } catch (error) {
        this.simulationMessage = `Error: ${error.message}`
        this.messageType = 'error'
        
        setTimeout(() => {
          this.simulationMessage = ''
        }, 5000)
      }
    },
    
    async stopSimulation() {
      try {
        this.simulationMessage = 'Stopping simulation...'
        this.messageType = 'info'
        
        const result = await this.stopSimulation()
        
        this.simulationMessage = result.message
        this.messageType = result.success ? 'success' : 'error'
        
        setTimeout(() => {
          this.simulationMessage = ''
        }, 3000)
        
      } catch (error) {
        this.simulationMessage = `Error: ${error.message}`
        this.messageType = 'error'
        
        setTimeout(() => {
          this.simulationMessage = ''
        }, 5000)
      }
    },
    
    getProfit(brokerId, symbol) {
      const stock = this.stocks.find(s => s.symbol === symbol)
      const broker = this.brokers.find(b => b.id === brokerId)
      if (!stock || !broker) return 0
      
      const quantity = broker.portfolio[symbol] || 0
      const averagePrice = stock.currentPrice * 0.9
      return (stock.currentPrice - averagePrice) * quantity
    },
    
    getProfitClass(brokerId, symbol) {
      const profit = this.getProfit(brokerId, symbol)
      return profit > 0 ? 'positive' : profit < 0 ? 'negative' : 'neutral'
    },
    
    getTotalPortfolioValue(broker) {
      let total = broker.balance
      Object.entries(broker.portfolio || {}).forEach(([symbol, quantity]) => {
        const stock = this.stocks.find(s => s.symbol === symbol)
        if (stock) {
          total += stock.currentPrice * quantity
        }
      })
      return total
    },
  },
  async mounted() {
    await this.fetchBrokers()
    await this.checkSimulationStatus()
    
    // Update data every 5 seconds
    setInterval(async () => {
      await this.fetchBrokers()
      await this.checkSimulationStatus()
    }, 5000)
  },
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.admin-section {
  background: white;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.simulation-controls {
  margin-bottom: 1rem;
}

.control-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.input-field {
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  width: 80px;
}

.btn-success {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-success:hover:not(:disabled) {
  background-color: #229954;
}

.btn-success:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn-danger:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.simulation-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-running {
  color: #27ae60;
  font-weight: bold;
}

.status-stopped {
  color: #e74c3c;
  font-weight: bold;
}

.message {
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.brokers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.broker-card {
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f8f9fa;
  transition: transform 0.2s;
}

.broker-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.broker-card h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.balance {
  font-weight: bold;
  color: #27ae60;
  font-size: 1.1rem;
}

.portfolio {
  margin: 1rem 0;
}

.portfolio h4 {
  margin-bottom: 0.5rem;
  color: #34495e;
}

.portfolio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  border-left: 4px solid #3498db;
}

.symbol {
  font-weight: bold;
  color: #2c3e50;
}

.quantity {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.profit.positive {
  color: #27ae60;
  font-weight: bold;
}

.profit.negative {
  color: #e74c3c;
  font-weight: bold;
}

.profit.neutral {
  color: #7f8c8d;
}

.no-stocks {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  padding: 1rem;
}

.total-value {
  font-weight: bold;
  border-top: 2px solid #bdc3c7;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  color: #2c3e50;
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

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.stock-card {
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s;
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.stock-card.crypto {
  border-left: 4px solid #f39c12;
}

.stock-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .control-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .input-field {
    width: 100%;
  }
  
  .brokers-grid {
    grid-template-columns: 1fr;
  }
  
  .stocks-grid {
    grid-template-columns: 1fr;
  }
}
</style>