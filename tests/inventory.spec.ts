import { expect, test } from '../fixtures/click-highlight';
import { users } from '../data/test-data';
import { CartPage } from '../pages/cart.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Inventory and cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('adds and removes a product from the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productName = 'Sauce Labs Backpack';

    await inventoryPage.addProduct(productName);
    await inventoryPage.expectCartCount(1);

    await inventoryPage.removeProduct(productName);
    await inventoryPage.expectCartCount(0);
  });

  test('sorts products by price from low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi');
    const displayedPrices = await inventoryPage.getDisplayedPrices();
    const sortedPrices = [...displayedPrices].sort((a, b) => a - b);

    expect(displayedPrices).toEqual(sortedPrices);
  });

  test('keeps the cart item after navigating away and back', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const productName = 'Sauce Labs Backpack';

    await inventoryPage.addProduct(productName);
    await inventoryPage.openCart();
    await cartPage.expectProduct(productName);

    await cartPage.continueShopping();
    await inventoryPage.expectLoaded();
    await inventoryPage.expectCartCount(1);

    await inventoryPage.openCart();
    await cartPage.expectProduct(productName);
  });
});
