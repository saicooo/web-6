<template>
  <div class="trading-form">
    <h3>Торговая операция</h3>
    
    <form @submit.prevent="placeOrder" class="order-form">
      <div class="form-group">
        <label for="symbol">Акция:</label>
        <select 
          id="symbol" 
          v-model="selectedSymbol" 
          required
          class="input-field"
        >
          <option value="">Выберите акцию</option>
          <option 
            v-for="stock in stocks" 
            :key="stock.symbol" 
            :value="stock.symbol"
          >
            {{ stock.symbol }} - {{ stock.name }} (${{ stock.currentPrice }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="type">Тип операции:</label>
        <div class="radio-group">
          <label>
            <input 
              type="radio" 
              v-model="orderType" 
              value="buy" 
              required
            >
            Покупка
          </label>
          <label>
            <input 
              type="radio" 
              v-model="orderType" 
              value="sell" 
              required
            >
            Продажа
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="quantity">Количество:</label>
        <input 
          id="quantity" 
          v-model.number="quantity" 
          type="number" 
          min="1" 
          required
          class="input-field"
        >
      </div>

      <div v-if="selectedSymbol" class="order-summary">
        <div class="summary-item">
          <span>Текущая цена:</span>
          <span>${{ getCurrentPrice() }}</span>
        </div>
        <div class="summary-item">
          <span>Общая стоимость:</span>
          <span>${{ getTotalCost() }}</span>
        </div>
        <div 
          v-if="orderType === 'buy'" 
          class="summary-item"
          :class="{ 'error': getTotalCost() > broker.balance }"
        >
          <span>Доступно:</span>
          <span>${{ broker.balance.toLocaleString() }}</span>
        </div>
        <div 
          v-if="orderType === 'sell'" 
          class="summary-item"
          :class="{ 'error': quantity > getAvailableQuantity() }"
        >
          <span>В портфеле:</span>
          <span>{{ getAvailableQuantity() }} акций</span>
        </div>
      </div>

      <button 
        type="submit" 
        class="btn-submit"
        :disabled="!isFormValid"
        :class="{
          'btn-buy': orderType === 'buy',
          'btn-sell': orderType === 'sell'
        }"
      >
        {{ orderType === 'buy' ? 'Купить' : 'Продать' }} акции
      </button>
    </form>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { useStockStore } from '../stores/stockStore'
import { mapState } from 'pinia'

export default {
  name: 'TradingForm',
  props: {
    broker: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedSymbol: '',
      orderType: 'buy',
      quantity: 1,
      message: '',
      messageType: '',
    }
  },
  computed: {
    ...mapState(useStockStore, ['stocks']),
    
    isFormValid() {
      if (!this.selectedSymbol || !this.quantity || this.quantity < 1) {
        return false
      }
      
      if (this.orderType === 'buy') {
        return this.getTotalCost() <= this.broker.balance
      } else {
        return this.quantity <= this.getAvailableQuantity()
      }
    },
  },
  methods: {
    getCurrentPrice() {
      const stock = this.stocks.find(s => s.symbol === this.selectedSymbol)
      return stock ? stock.currentPrice : 0
    },
    
    getTotalCost() {
      return this.getCurrentPrice() * this.quantity
    },
    
    getAvailableQuantity() {
      return this.broker.portfolio[this.selectedSymbol] || 0
    },
    
    async placeOrder() {
      const stockStore = useStockStore()
      
      try {
        stockStore.placeOrder({
          brokerId: this.broker.id,
          symbol: this.selectedSymbol,
          type: this.orderType,
          quantity: this.quantity,
        })
        
        this.message = `Заявка на ${this.orderType === 'buy' ? 'покупку' : 'продажу'} 
                       ${this.quantity} акций ${this.selectedSymbol} отправлена`
        this.messageType = 'success'
        
        // Сброс формы
        this.quantity = 1
        this.selectedSymbol = ''
        
        // Уведомляем родительский компонент
        this.$emit('order-placed')
        
      } catch (error) {
        this.message = `Ошибка: ${error.message}`
        this.messageType = 'error'
      }
      
      // Автоматическое скрытие сообщения
      setTimeout(() => {
        this.message = ''
      }, 5000)
    },
  },
}
</script>

<style scoped>
.trading-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  color: #2c3e50;
}

.input-field {
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.order-summary {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-item.error {
  color: #e74c3c;
  font-weight: bold;
}

.btn-submit {
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-buy {
  background-color: #27ae60;
  color: white;
}

.btn-buy:not(:disabled):hover {
  background-color: #229954;
}

.btn-sell {
  background-color: #e74c3c;
  color: white;
}

.btn-sell:not(:disabled):hover {
  background-color: #c0392b;
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
</style>