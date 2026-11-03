import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E de la Suite Clínica (Kalo)', () => {
  test('1. debe cargar el inicio de la aplicación y renderizar la interfaz clínica', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('2. debe calcular el requerimiento energético (GET / TMB) reactivamente en la calculadora', async ({ page }) => {
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

  test('3. debe cargar y renderizar la biblioteca de referencias clínicas offline', async ({ page }) => {
    await page.goto('/referencias');
    await expect(
      page.getByRole('heading', { name: /Biblioteca de Referencias Clínicas/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Laboratorio/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /IDR por Edad/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Medidas Caseras MX/i })).toBeVisible();
  });
});
