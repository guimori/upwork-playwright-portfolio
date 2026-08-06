import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  private readonly title: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly sortSelect: Locator;
  private readonly prices: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Products', { exact: true });
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.prices = page.locator('[data-test="inventory-item-price"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toBeVisible();
  }

  async addProduct(productName: string): Promise<void> {
    const product = this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: productName });

    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(productName: string): Promise<void> {
    const product = this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: productName });

    await product.getByRole('button', { name: 'Remove' }).click();
  }

  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
      return;
    }

    await expect(this.cartBadge).toHaveText(String(count));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(optionValue);
  }

  async getDisplayedPrices(): Promise<number[]> {
    const rawPrices = await this.prices.allTextContents();
    return rawPrices.map((price) => Number(price.replace('$', '')));
  }
}
