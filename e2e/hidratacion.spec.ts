import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de Hidratación y Tasa de Sudoración (Kalo)', () => {
  test('debe navegar a la vista de hidratación y renderizar el encabezado', async ({ page }) => {
    await page.goto('/hidratacion');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Hidratación & Tasa de Sudoración/i })
    ).toBeVisible();
  });

  test('debe calcular la prescripción hídrica basal y ajustada por factores clínicos', async ({ page }) => {
    await page.goto('/hidratacion');

    // Llenar peso corporal
    await page.locator('#campo-hidra-peso').fill('70');

    // Verificar volumen basal: 70 * 35 = 2450 ml (~2.45 L)
    await expect(page.getByText('2.45')).toBeVisible();
    await expect(page.getByText('L/día').first()).toBeVisible();

    // Activar factor de clima cálido (+500 ml) -> 2450 + 500 = 2950 ml (2.95 L)
    await page.getByRole('button', { name: 'Sí' }).nth(3).click();
    await expect(page.getByText('2.95')).toBeVisible();
  });

  test('debe calcular la tasa de sudoración y reposición al 150% según protocolo ACSM', async ({ page }) => {
    await page.goto('/hidratacion');

    // Llenar mediciones deportivas: Pre 72.0 kg, Post 70.8 kg, Ingesta 500 ml, Orina 100 ml, Duración 60 min
    await page.locator('#campo-hidra-pre').fill('72.0');
    await page.locator('#campo-hidra-post').fill('70.8');
    await page.locator('#campo-hidra-duracion').fill('60');
    await page.locator('#campo-hidra-liquido').fill('500');
    await page.locator('#campo-hidra-orina').fill('100');

    // Pérdida neta = (72 - 70.8)*1000 + 500 - 100 = 1600 ml -> 1600 ml/h
    await expect(page.getByText('Pérdida por Sudoración')).toBeVisible();
    await expect(page.getByText('1600 ml/h')).toBeVisible();

    // Tasa por minuto = 26.7 ml/min
    await expect(page.getByText('Tasa de Sudoración')).toBeVisible();
    await expect(page.getByText('26.7')).toBeVisible();

    // Reposición 150% ACSM = 2400 ml
    await expect(page.getByText('Reposición Recomendada')).toBeVisible();
    await expect(page.getByText('2400')).toBeVisible();
  });
});
