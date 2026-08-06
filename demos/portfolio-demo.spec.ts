import { test } from '../fixtures/click-highlight';
import { checkoutCustomer, users } from '../data/test-data';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Portfolio video demo', () => {
  test('shows the full UI regression suite sequentially', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const productName = 'Sauce Labs Backpack';

    const pause = async () => {
      await page.waitForTimeout(700);
    };

    const resetSession = async () => {
      await page.evaluate(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });
      await loginPage.goto();
      await pause();
    };

    const loginAsStandardUser = async () => {
      await loginPage.login(users.standard.username, users.standard.password);
      await inventoryPage.expectLoaded();
      await pause();
    };

    await test.step('Valid login opens the inventory page', async () => {
      await loginPage.goto();
      await pause();
      await loginAsStandardUser();
    });

    await test.step('Invalid credentials show a clear login error', async () => {
      await resetSession();
      await loginPage.login(users.invalid.username, users.invalid.password);
      await loginPage.expectLoginError('Username and password do not match');
      await pause();
    });

    await test.step('Locked out user cannot access the app', async () => {
      await resetSession();
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
      await loginPage.expectLoginError('Sorry, this user has been locked out');
      await pause();
    });

    await test.step('Product can be added to and removed from the cart', async () => {
      await resetSession();
      await loginAsStandardUser();
      await inventoryPage.addProduct(productName);
      await inventoryPage.expectCartCount(1);
      await pause();
      await inventoryPage.removeProduct(productName);
      await inventoryPage.expectCartCount(0);
      await pause();
    });

    await test.step('Products can be sorted by price', async () => {
      await inventoryPage.sortBy('lohi');
      await inventoryPage.getDisplayedPrices();
      await pause();
    });

    await test.step('Cart keeps the item after navigating away and back', async () => {
      await inventoryPage.addProduct(productName);
      await inventoryPage.openCart();
      await cartPage.expectProduct(productName);
      await pause();
      await cartPage.continueShopping();
      await inventoryPage.expectLoaded();
      await inventoryPage.expectCartCount(1);
      await pause();
    });

    await test.step('Checkout requires customer information', async () => {
      await inventoryPage.openCart();
      await cartPage.expectProduct(productName);
      await cartPage.checkout();
      await checkoutPage.continueWithoutCustomerInformation();
      await checkoutPage.expectCheckoutError('First Name is required');
      await pause();
    });

    await test.step('Customer can complete a successful purchase', async () => {
      await checkoutPage.fillCustomerInformation(checkoutCustomer);
      await pause();
      await checkoutPage.finishOrder();
      await checkoutPage.expectOrderCompleted();
      await page.waitForTimeout(1400);
    });
  });
});
