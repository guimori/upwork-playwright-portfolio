import { test } from '../fixtures/click-highlight';
import { checkoutCustomer, users } from '../data/test-data';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Checkout', () => {
  test('completes a purchase successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const productName = 'Sauce Labs Backpack';

    await test.step('Authenticate', async () => {
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
      await inventoryPage.expectLoaded();
    });

    await test.step('Add a product and open the cart', async () => {
      await inventoryPage.addProduct(productName);
      await inventoryPage.expectCartCount(1);
      await inventoryPage.openCart();
      await cartPage.expectProduct(productName);
    });

    await test.step('Provide checkout information', async () => {
      await cartPage.checkout();
      await checkoutPage.fillCustomerInformation(checkoutCustomer);
    });

    await test.step('Finish and verify the order', async () => {
      await checkoutPage.finishOrder();
      await checkoutPage.expectOrderCompleted();
    });
  });

  test('requires customer information before checkout overview', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const productName = 'Sauce Labs Backpack';

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addProduct(productName);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.continueWithoutCustomerInformation();
    await checkoutPage.expectCheckoutError('First Name is required');
  });
});
