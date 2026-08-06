import { expect, type Page } from '@playwright/test';

type Customer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async continueWithoutCustomerInformation(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async fillCustomerInformation(customer: Customer): Promise<void> {
    await this.page.getByPlaceholder('First Name').fill(customer.firstName);
    await this.page.getByPlaceholder('Last Name').fill(customer.lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(customer.postalCode);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async finishOrder(): Promise<void> {
    await expect(this.page.getByText('Checkout: Overview')).toBeVisible();
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  async expectOrderCompleted(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
  }

  async expectCheckoutError(message: string): Promise<void> {
    await expect(this.page.locator('[data-test="error"]')).toContainText(message);
  }
}
