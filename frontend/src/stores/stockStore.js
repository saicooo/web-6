import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useStockStore = defineStore('stock', {
  state: () => ({
    socket: null,
    stocks: [],
    brokers: [],
    currentBroker: null,
    marketData: {
      date: '',
      stocks: [],
    },
    trades: [],
    simulationStatus: {
      isRunning: false,
      speed: 1
    },
    connectionStatus: 'disconnected'
  }),

  actions: {
    initializeSocket() {
      try {
        this.socket = io('http://localhost:3000', {
          transports: ['websocket', 'polling']
        })
        
        this.socket.on('connect', () => {
          console.log('✅ Connected to server')
          this.connectionStatus = 'connected'
        })

        this.socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error)
          this.connectionStatus = 'error'
        })

        this.socket.on('disconnect', () => {
          console.log('🔌 Disconnected from server')
          this.connectionStatus = 'disconnected'
        })
        
        this.socket.on('marketUpdate', (data) => {
          console.log('📈 Market update received:', data)
          this.marketData = data
          this.updateStockPrices(data.stocks)
        })

        this.socket.on('orderExecuted', (trade) => {
          console.log('✅ Order executed:', trade)
          this.trades.push(trade)
          this.fetchBrokers()
        })

        this.socket.on('orderError', (error) => {
          console.error('❌ Order error:', error)
          alert(`Order Error: ${error.message}`)
        })

        // Subscribe to market updates
        this.socket.emit('subscribeToMarket')
        
      } catch (error) {
        console.error('❌ Error initializing socket:', error)
      }
    },

    async fetchStocks() {
      try {
        const response = await fetch('http://localhost:3000/api/stocks')
        if (!response.ok) throw new Error('Network response was not ok')
        this.stocks = await response.json()
        console.log('📊 Stocks fetched:', this.stocks)
      } catch (error) {
        console.error('❌ Error fetching stocks:', error)
      }
    },

    async fetchBrokers() {
      try {
        const response = await fetch('http://localhost:3000/api/brokers')
        if (!response.ok) throw new Error('Network response was not ok')
        this.brokers = await response.json()
        console.log('👥 Brokers fetched:', this.brokers)
      } catch (error) {
        console.error('❌ Error fetching brokers:', error)
      }
    },

    async addBroker(name, initialBalance) {
      try {
        const response = await fetch('http://localhost:3000/api/brokers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, initialBalance }),
        })
        if (!response.ok) throw new Error('Network response was not ok')
        const newBroker = await response.json()
        this.brokers.push(newBroker)
        return newBroker
      } catch (error) {
        console.error('❌ Error adding broker:', error)
        throw error
      }
    },

    updateStockPrices(updatedStocks) {
      updatedStocks.forEach(updatedStock => {
        const stock = this.stocks.find(s => s.symbol === updatedStock.symbol)
        if (stock) {
          stock.currentPrice = updatedStock.price
        }
      })
    },

    placeOrder(orderData) {
      if (this.socket && this.socket.connected) {
        console.log('📤 Placing order:', orderData)
        this.socket.emit('placeOrder', orderData)
      } else {
        console.error('❌ Socket not connected')
        alert('Connection error: Please refresh the page')
      }
    },

    setCurrentBroker(broker) {
      this.currentBroker = broker
    },

    async startSimulation(speed) {
      try {
        console.log('🚀 Starting simulation with speed:', speed)
        const response = await fetch('http://localhost:3000/api/simulation/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speed }),
        })
        
        if (!response.ok) throw new Error('Network response was not ok')
        
        const result = await response.json()
        console.log('✅ Simulation start result:', result)
        
        if (result.success) {
          this.simulationStatus.isRunning = true
          this.simulationStatus.speed = speed
        }
        
        return result
      } catch (error) {
        console.error('❌ Error starting simulation:', error)
        throw error
      }
    },

    async stopSimulation() {
      try {
        console.log('🛑 Stopping simulation')
        const response = await fetch('http://localhost:3000/api/simulation/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (!response.ok) throw new Error('Network response was not ok')
        
        const result = await response.json()
        console.log('✅ Simulation stop result:', result)
        
        if (result.success) {
          this.simulationStatus.isRunning = false
        }
        
        return result
      } catch (error) {
        console.error('❌ Error stopping simulation:', error)
        throw error
      }
    },

    async checkSimulationStatus() {
      try {
        const response = await fetch('http://localhost:3000/api/simulation/status')
        if (!response.ok) throw new Error('Network response was not ok')
        this.simulationStatus = await response.json()
      } catch (error) {
        console.error('❌ Error checking simulation status:', error)
      }
    },
  },

  getters: {
    getStockBySymbol: (state) => (symbol) => {
      return state.stocks.find(stock => stock.symbol === symbol)
    },
    
    getBrokerById: (state) => (id) => {
      return state.brokers.find(broker => broker.id === id)
    },
    
    currentBrokerPortfolio: (state) => {
      if (!state.currentBroker) return []
      return Object.entries(state.currentBroker.portfolio || {}).map(([symbol, quantity]) => ({
        symbol,
        quantity,
        currentPrice: state.getStockBySymbol(symbol)?.currentPrice || 0,
        totalValue: quantity * (state.getStockBySymbol(symbol)?.currentPrice || 0),
      }))
    },

    stocksByType: (state) => (type) => {
      return state.stocks.filter(stock => stock.type === type)
    }
  },
})