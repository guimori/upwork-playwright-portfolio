import { test } from '../fixtures/click-highlight';
import { users } from '../data/test-data';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Authentication', () => {
  test('logs in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await test.step('Open the login page', async () => {
      await loginPage.goto();
    });

    await test.step('Submit valid credentials', async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step('Verify that the inventory is displayed', async () => {
      await inventoryPage.expectLoaded();
    });
  });

  test('shows a clear error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.expectLoginError('Username and password do not match');
  });

  test('blocks a locked out user from logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectLoginError('Sorry, this user has been locked out');
  });
});
