import { test, expect } from '@playwright/test';

test.describe('Calculadora Energética', () => {
  test('debe calcular el requerimiento energético (GET / TMB) reactivamente en la calculadora', async ({ page }) => {
    await page.goto('/calculadora');
    await expect(page.getByRole('heading', { name: /Requerimiento Energético/i })).toBeVisible();

    // Llenar campos antropométricos base
    await page.locator('#campo-peso').fill('75');
    await page.locator('#campo-talla').fill('175');
    await page.locator('#campo-edad').fill('28');

    // Verificar que el cálculo reactivo del GET esté presente
    await expect(page.getByText('Gasto Energético Total (GET)')).toBeVisible();
    await expect(page.getByText('kcal/día').first()).toBeVisible();
  });
});
