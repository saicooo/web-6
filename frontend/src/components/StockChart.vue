<template>
  <div class="stock-chart">
    <h4>{{ stock.symbol }} - {{ stock.name }}</h4>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="chart-info">
      <div class="current-price">${{ stock.currentPrice }}</div>
      <div class="price-change" :class="priceChangeClass">
        {{ priceChange }}
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

export default {
  name: 'StockChart',
  props: {
    stock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  computed: {
    priceChange() {
      if (this.stock.history.length < 2) return '+0.00%'
      
      const current = this.stock.currentPrice
      const previous = this.stock.history[1]?.price || current
      const change = ((current - previous) / previous) * 100
      
      return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
    },
    
    priceChangeClass() {
      if (this.stock.history.length < 2) return 'neutral'
      
      const current = this.stock.currentPrice
      const previous = this.stock.history[1]?.price || current
      
      if (current > previous) return 'positive'
      if (current < previous) return 'negative'
      return 'neutral'
    },
  },
  mounted() {
    Chart.register(...registerables)
    this.renderChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      const labels = this.stock.history.map(item => item.date).reverse()
      const data = this.stock.history.map(item => item.price).reverse()
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: this.stock.symbol,
              data: data,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Дата',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Цена ($)',
              },
            },
          },
        },
      })
    },
  },
}
</script>

<style scoped>
.stock-chart {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
  text-align: center;
}

.chart-container {
  position: relative;
  height: 200px;
  margin-bottom: 1rem;
}

.chart-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #ecf0f1;
}

.current-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.price-change {
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.price-change.positive {
  background-color: #d4edda;
  color: #155724;
}

.price-change.negative {
  background-color: #f8d7da;
  color: #721c24;
}

.price-change.neutral {
  background-color: #e2e3e5;
  color: #383d41;
}
</style>