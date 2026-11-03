import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de Nutrición Materno-Fetal, Gestación e IOM 2009 (Kalo)', () => {
  test('debe navegar a la vista de gestación y renderizar el encabezado', async ({ page }) => {
    await page.goto('/embarazo');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Nutrición Materno-Fetal & Gestación/i })
    ).toBeVisible();
  });

  test('debe calcular adición calórica por trimestre de embarazo', async ({ page }) => {
    await page.goto('/embarazo');

    // Llenar GET base 1800 kcal
    await page.locator('#campo-pregnancy-get-base').fill('1800');

    // Seleccionar 2do Trimestre (+340 kcal)
    await page.getByRole('button', { name: /2do Trimestre/i }).click();

    // GET Total = 1800 + 340 = 2140 kcal
    await expect(page.getByText('2140')).toBeVisible();
    await expect(page.getByText('+340 KCAL')).toBeVisible();
  });

  test('debe calcular ganancia gestacional IOM 2009 y clasificar IMC pregestacional', async ({ page }) => {
    await page.goto('/embarazo');

    // Llenar semana 20, peso pregestacional 58 kg, talla 162 cm, peso actual 63.5 kg
    await page.locator('#campo-pregnancy-semana').fill('20');
    await page.locator('#campo-pregnancy-peso-pre').fill('58');
    await page.locator('#campo-pregnancy-talla').fill('162');
    await page.locator('#campo-pregnancy-peso-act').fill('63.5');

    // Verificar IMC normal (~22.1)
    await expect(page.getByText(/NORMAL/i).first()).toBeVisible();

    // Verificar ganancia calculada
    await expect(page.getByText('Ganancia Recomendada Acumulada')).toBeVisible();
    await expect(page.getByText(/Semana 20/i)).toBeVisible();
  });

  test('debe conmutar a lactancia y mostrar adición calórica de lactancia exclusiva', async ({ page }) => {
    await page.goto('/embarazo');

    // Cambiar a etapa Lactancia
    await page.getByRole('button', { name: /Lactancia/i }).first().click();

    // Verificar opción de lactancia exclusiva (+500 kcal)
    await expect(page.getByText('+500 kcal')).toBeVisible();
    await expect(page.getByText('Hierro')).toBeVisible();
    await expect(page.getByText(/Rigor Clínico \(@source\)/i).first()).toBeVisible();
  });
});
