<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Stock Trading Platform</h2>
      
      <div class="connection-status" :class="connectionStatus">
        Connection: {{ connectionStatus }}
      </div>
      
      <div class="form-section">
        <h3>Create New Account</h3>
        <form @submit.prevent="createBroker">
          <input 
            v-model="newBrokerName" 
            placeholder="Enter your name" 
            required 
            class="input-field"
          >
          <input 
            v-model.number="initialBalance" 
            type="number" 
            placeholder="Initial balance ($)" 
            min="1000"
            max="1000000"
            required 
            class="input-field"
          >
          <button type="submit" class="btn-primary">Create Account</button>
        </form>
      </div>

      <div class="form-section">
        <h3>Existing Traders</h3>
        <div class="brokers-list">
          <div 
            v-for="broker in brokers" 
            :key="broker.id" 
            class="broker-item"
            @click="selectBroker(broker)"
          >
            <span class="broker-name">{{ broker.name }}</span>
            <span class="broker-balance">Balance: ${{ broker.balance.toLocaleString() }}</span>
          </div>
          <div v-if="brokers.length === 0" class="no-brokers">
            No existing traders found
          </div>
        </div>
      </div>

      <div class="admin-section">
        <button @click="goToAdmin" class="btn-secondary">Admin Panel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStockStore } from '../stores/stockStore'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'LoginView',
  data() {
    return {
      newBrokerName: '',
      initialBalance: 10000,
    }
  },
  computed: {
    ...mapState(useStockStore, ['brokers', 'connectionStatus']),
  },
  methods: {
    ...mapActions(useStockStore, ['addBroker', 'setCurrentBroker', 'fetchBrokers']),
    
    async createBroker() {
      if (!this.newBrokerName.trim()) {
        alert('Please enter your name')
        return
      }

      if (this.initialBalance < 1000) {
        alert('Minimum initial balance is $1,000')
        return
      }

      try {
        const newBroker = await this.addBroker(this.newBrokerName, this.initialBalance)
        if (newBroker) {
          this.setCurrentBroker(newBroker)
          this.$router.push(`/trading/${newBroker.id}`)
        }
      } catch (error) {
        alert('Error creating account: ' + error.message)
      }
    },
    
    selectBroker(broker) {
      this.setCurrentBroker(broker)
      this.$router.push(`/trading/${broker.id}`)
    },
    
    goToAdmin() {
      this.$router.push('/admin')
    },
  },
  async mounted() {
    await this.fetchBrokers()
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.connection-status {
  text-align: center;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: bold;
}

.connection-status.connected {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.connection-status.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.connection-status.disconnected {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

h3 {
  margin-bottom: 1rem;
  color: #34495e;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.brokers-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.broker-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.broker-item:hover {
  background-color: #ecf0f1;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.broker-name {
  font-weight: bold;
  color: #2c3e50;
}

.broker-balance {
  color: #27ae60;
  font-weight: bold;
}

.no-brokers {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.admin-section {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ecf0f1;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}
</style>