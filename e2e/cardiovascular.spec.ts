import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de Riesgo Cardiovascular & TyG (Kalo)', () => {
  test('debe navegar a la vista de riesgo cardiovascular y renderizar el encabezado', async ({ page }) => {
    await page.goto('/cardiovascular');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Riesgo Cardiovascular & Metabolismo Lipídico/i })
    ).toBeVisible();
  });

  test('debe calcular Framingham a 10 años de forma reactiva', async ({ page }) => {
    await page.goto('/cardiovascular');

    // Llenar parámetros de alto riesgo: 55 años, CT 240, HDL 40, PAS 145, Fumador Sí, Antihipertensivo Sí
    await page.locator('#campo-cardio-edad').fill('55');
    await page.locator('#campo-cardio-ps').fill('145');
    await page.locator('#campo-cardio-ct').fill('240');
    await page.locator('#campo-cardio-hdl').fill('40');

    // Activar Fumador Sí y Tratamiento Sí
    await page.getByRole('button', { name: 'Sí' }).first().click();
    await page.getByRole('button', { name: 'Sí' }).nth(1).click();

    // Validar cálculo de Framingham: 40% a 10 años
    await expect(page.getByText('40%')).toBeVisible();
    await expect(page.getByText(/Alto \(≥20%\)/i)).toBeVisible();
    await expect(page.getByText(/\+12 pts/i)).toBeVisible();
  });

  test('debe calcular índices aterogénicos de Castelli, No-HDL y TyG', async ({ page }) => {
    await page.goto('/cardiovascular');

    // Llenar perfil lipídico y glucosa
    await page.locator('#campo-cardio-ct').fill('200');
    await page.locator('#campo-cardio-hdl').fill('50');
    await page.locator('#campo-cardio-tg').fill('140');
    await page.locator('#campo-cardio-glucosa').fill('90');

    // Verificar Castelli I (200 / 50 = 4.00)
    await expect(page.getByText('Castelli I (CT / HDL)')).toBeVisible();
    await expect(page.getByText('4.00')).toBeVisible();

    // Verificar No-HDL (200 - 50 = 150 mg/dL)
    await expect(page.getByText('Colesterol No-HDL')).toBeVisible();
    await expect(page.getByText('150')).toBeVisible();

    // Verificar TyG (ln((140 * 90)/2) = ln(6300) = 8.75 -> Resistencia)
    await expect(page.getByText('Índice TyG (Glucosa-TG)')).toBeVisible();
    await expect(page.getByText('8.75')).toBeVisible();
    await expect(page.getByText('Resistencia')).toBeVisible();
  });
});
