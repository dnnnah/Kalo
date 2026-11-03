import { test, expect } from '@playwright/test';

test.describe('Inicio / Dashboard', () => {
  test('debe cargar el inicio de la aplicación y renderizar la interfaz clínica', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
