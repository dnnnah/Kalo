import { test, expect } from '@playwright/test';

test.describe('Biblioteca de Referencias Clínicas', () => {
  test('debe cargar y renderizar la biblioteca de referencias clínicas offline', async ({ page }) => {
    await page.goto('/referencias');
    await expect(
      page.getByRole('heading', { name: /Biblioteca de Referencias Clínicas/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Laboratorio/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /IDR por Edad/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Medidas Caseras MX/i })).toBeVisible();
  });
});
