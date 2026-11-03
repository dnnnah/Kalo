import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de Nutrición Renal, CKD-EPI y KDOQI (Kalo)', () => {
  test('debe navegar a la vista de nutrición renal y renderizar el encabezado', async ({ page }) => {
    await page.goto('/renal');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Nutrición Renal & Tasa de Filtrado Glomerular/i })
    ).toBeVisible();
  });

  test('debe calcular TFG con CKD-EPI 2021 y prescripción proteica KDOQI', async ({ page }) => {
    await page.goto('/renal');

    // Llenar parámetros: Hombre, 58 años, Creatinina 1.4 mg/dL, Peso 72 kg
    await page.locator('#campo-renal-edad').fill('58');
    await page.locator('#campo-renal-cr').fill('1.4');
    await page.locator('#campo-renal-peso').fill('72');

    // Verificar cálculo de TFG y estadio
    await expect(page.getByText('mL/min/1.73m²')).toBeVisible();
    await expect(page.getByText(/Estadio G3/i)).toBeVisible();

    // Verificar prescripción de proteína KDOQI
    await expect(page.getByText('Proteína KDOQI 2020')).toBeVisible();
    await expect(page.getByText('g/día').first()).toBeVisible();
  });

  test('debe calcular técnica de remojo de potasio y PRAL score', async ({ page }) => {
    await page.goto('/renal');

    // Llenar potasio original de alimento: 800 mg
    await page.locator('#campo-renal-potasio').fill('800');
    // Seleccionar Doble Cocción (~50%)
    await page.getByRole('button', { name: /Doble Cocción/i }).first().click();

    // Verificar potasio residual (-50% = 400 mg)
    await expect(page.getByText('400')).toBeVisible();
    await expect(page.getByText('-50% reducido')).toBeVisible();

    // Llenar parámetros para PRAL
    await page.locator('#campo-pral-proteina').fill('20');
    await page.locator('#campo-pral-fosforo').fill('200');
    await page.locator('#campo-pral-potasio').fill('800');
    await page.locator('#campo-pral-calcio').fill('100');
    await page.locator('#campo-pral-magnesio').fill('50');

    // Verificar que PRAL Score muestre etiqueta calculada
    await expect(page.getByText('PRAL Score Calculado')).toBeVisible();
    await expect(page.getByText(/mEq\/día/i)).toBeVisible();
  });
});
