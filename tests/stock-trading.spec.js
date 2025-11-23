const { test, expect } = require('@playwright/test');

test.describe('Stock Trading Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173', { timeout: 30000 });
    await page.waitForTimeout(2000);
  });

  test('should create new broker and login', async ({ page }) => {
    await page.fill('input[placeholder="Введите ваше имя"]', 'Тестовый Брокер');
    await page.click('button:has-text("Создать аккаунт")');
    
    await page.waitForURL(/\/trading\//, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Торговая площадка');
  });

  test('should display market data', async ({ page }) => {
    await page.waitForSelector('.broker-item', { timeout: 10000 });
    await page.click('.broker-item:first-child');
    
    await expect(page.locator('.market-data-panel')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.stocks-table')).toBeVisible();
  });

  test('should execute buy order', async ({ page }) => {
    await page.waitForSelector('.broker-item', { timeout: 10000 });
    await page.click('.broker-item:first-child');
    
    await page.waitForSelector('select#symbol', { timeout: 10000 });
    
    await page.selectOption('select#symbol', 'AAPL');
    await page.click('input[value="buy"]');
    await page.fill('input#quantity', '5');
    
    await page.click('button.btn-submit');
    
    await expect(page.locator('.message.success')).toContainText('Заявка на покупку', { timeout: 10000 });
  });

  test('should update portfolio after trade', async ({ page }) => {
    await page.waitForSelector('.broker-item', { timeout: 10000 });
    await page.click('.broker-item:first-child');
    
    const initialBalance = await page.textContent('.balance');
    
    await page.waitForSelector('select#symbol', { timeout: 10000 });
    
    await page.selectOption('select#symbol', 'MSFT');
    await page.click('input[value="buy"]');
    await page.fill('input#quantity', '2');
    await page.click('button.btn-submit');
    
    await page.waitForTimeout(3000);
    
    const newBalance = await page.textContent('.balance');
    expect(newBalance).not.toBe(initialBalance);
  });

  test('should display admin panel correctly', async ({ page }) => {
    await page.click('button:has-text("Панель администратора")');
    
    await page.waitForURL(/\/admin/, { timeout: 10000 });
    
    await expect(page.locator('h1')).toContainText('Панель администратора');
    await expect(page.locator('.brokers-grid')).toBeVisible({ timeout: 10000 });
  });

  test('should start and stop simulation', async ({ page }) => {
    
    await page.click('button:has-text("Панель администратора")');
    await page.waitForURL(/\/admin/, { timeout: 10000 });
    
    await page.fill('input[type="number"]', '3'); 
    await page.click('button:has-text("Запустить симуляцию")');
    
    await page.waitForTimeout(2000);
    
    await page.click('button:has-text("Остановить симуляцию")');
  });
});

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173', { timeout: 30000 });
    await page.waitForSelector('.broker-item', { timeout: 10000 });
    await page.click('.broker-item:first-child');
    await page.waitForSelector('select#symbol', { timeout: 10000 });
  });

  test('should validate buy order with insufficient funds', async ({ page }) => {
    await page.selectOption('select#symbol', 'AAPL');
    await page.click('input[value="buy"]');
    await page.fill('input#quantity', '10000'); 
    
    await expect(page.locator('.summary-item.error')).toContainText('Доступно', { timeout: 5000 });

    await expect(page.locator('button.btn-submit')).toBeDisabled();
  });

  test('should validate sell order with insufficient shares', async ({ page }) => {
    await page.selectOption('select#symbol', 'AAPL');
    await page.click('input[value="sell"]');
    await page.fill('input#quantity', '10000'); //
    
    await expect(page.locator('.summary-item.error')).toContainText('В портфеле', { timeout: 5000 });
    
    await expect(page.locator('button.btn-submit')).toBeDisabled();
  });
});