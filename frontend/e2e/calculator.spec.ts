import { test, expect } from '@playwright/test';

test.describe('Test the denomination of the amount in euros', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('The amount with a dot should be formatted in German when exiting (blur).', async ({ page }) => {
    const input = page.locator('#newAmount');
    await input.fill('150.5'); // amount with a dot
    await page.click('body'); // blur event
    await expect(input).toHaveValue('150,50'); // Check format
  });

  test('Changing the calculation type should clear the old amount and hide tables', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    const newAmountInput = page.locator('#newAmount');
    const oldAmountInput = page.locator('#oldAmount');
    const tables = page.locator('app-table');
    const selectType = page.locator('mat-select[formControlName="calculateType"]');

    await selectType.click();
    await page.getByRole('option', { name: 'Frontend', exact: true }).click(); // Select FRONTEND type

    // First setup
    await newAmountInput.fill('100');
    await submitButton.click();
    await expect(tables).toHaveCount(1); // only one table should be visible

    // Second setup
    await newAmountInput.fill('120');
    await submitButton.click();
    await expect(oldAmountInput).toHaveValue('100,00');
    await expect(tables).toHaveCount(2); // two tables should be visible

    await selectType.click();
    await page.getByRole('option', { name: 'Backend', exact: true }).click(); // back to BACKEND
    await expect(tables).toHaveCount(0); // no tables should be visible

    await expect(oldAmountInput).toHaveValue(''); // must be empty again
  });
});