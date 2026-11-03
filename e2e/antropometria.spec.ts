import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de Antropometría y Composición Corporal (Kalo)', () => {
  test('debe navegar a Antropometría desde el menú móvil o directo', async ({ page }) => {
    await page.goto('/antropometria');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Antropometría y Composición/i })
    ).toBeVisible();
  });

  test('debe calcular IMC, ICC e ICE con semáforos diagnósticos', async ({ page }) => {
    await page.goto('/antropometria');

    // Llenar medidas básicas
    await page.locator('#campo-peso').fill('70');
    await page.locator('#campo-talla').fill('175');
    await page.locator('#campo-edad').fill('30');

    // Verificar IMC
    await expect(page.getByText('22.9')).toBeVisible();
    await expect(page.getByText('Peso Normal')).toBeVisible();

    // Llenar circunferencias
    await page.locator('#campo-circunferencia-cintura').fill('80');
    await page.locator('#campo-circunferencia-cadera').fill('95');

    // Verificar que los chips de ICC e ICE muestren los resultados
    await expect(page.getByText('Cintura-Cadera (ICC)')).toBeVisible();
    await expect(page.getByText('Cintura-Estatura (ICE)')).toBeVisible();
    await expect(page.getByText('Sin Riesgo').first()).toBeVisible();
    await expect(page.getByText('Óptimo')).toBeVisible();
  });

  test('debe calcular composición corporal por pliegues y reserva proteica (AMB)', async ({ page }) => {
    await page.goto('/antropometria');

    // Cambiar a método Faulkner
    await page.getByRole('button', { name: /Faulkner 4P/i }).click();

    // Llenar datos de Faulkner
    await page.locator('#campo-tríceps').fill('10');
    await page.locator('#campo-subescapular').fill('12');
    await page.locator('#campo-suprailíaco').fill('14');
    await page.locator('#campo-abdomen').fill('16');

    // Verificar cálculo de composición corporal
    await expect(page.getByText('Composición Corporal').first()).toBeVisible();
    await expect(page.getByText('Grasa Corporal')).toBeVisible();
    await expect(page.getByText('Masa Magra')).toBeVisible();

    // Verificar reserva proteica AMB y CMB
    await expect(page.getByText('Área Muscular Brazo')).toBeVisible();
    await expect(page.getByText('Circunferencia Muscular')).toBeVisible();
  });
});
