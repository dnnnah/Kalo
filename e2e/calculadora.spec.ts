import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de la Calculadora Energética (Kalo)', () => {
  test('debe cargar el dashboard y navegar a la calculadora', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kalo/i);

    // Navegar a la calculadora rápida
    const botonCalculadora = page.getByRole('link', { name: /Calculadora Rápida GET/i });
    await expect(botonCalculadora).toBeVisible();
    await botonCalculadora.click();

    await expect(page).toHaveURL(/.*calculadora/);
    await expect(page.getByRole('heading', { name: /Requerimiento Energético/i })).toBeVisible();
  });

  test('debe calcular el GET reactivamente al ingresar datos antropométricos', async ({ page }) => {
    await page.goto('/calculadora');

    // Llenar campos base
    const inputPeso = page.locator('#campo-peso');
    const inputTalla = page.locator('#campo-talla');
    const inputEdad = page.locator('#campo-edad');

    await inputPeso.fill('75');
    await inputTalla.fill('175');
    await inputEdad.fill('28');

    // Verificar que el GET se calcule y muestre la cifra energética
    await expect(page.getByText('Gasto Energético Total (GET)')).toBeVisible();
    await expect(page.getByText('kcal/día')).toBeVisible();

    // Seleccionar NAF "Muy Intenso" y verificar que la etiqueta se muestre legible sin guión bajo
    await page.getByRole('button', { name: /Muy Intenso/i }).click();
    await expect(page.getByText('Muy Intenso').first()).toBeVisible();
    await expect(page.getByText('muy_intenso')).toHaveCount(0);

    // Cambiar la fórmula a Mifflin-St Jeor
    await page.getByText('Mifflin-St Jeor').click();
    await expect(page.getByText('Mifflin MD et al.')).toBeVisible();
  });
});
