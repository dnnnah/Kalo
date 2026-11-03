import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de Laboratorios y Bioquímica (Kalo)', () => {
  test('debe navegar a la vista de bioquímica y renderizar el encabezado', async ({ page }) => {
    await page.goto('/bioquimica');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Laboratorios y Bioquímica/i })
    ).toBeVisible();
  });

  test('debe calcular HOMA-IR y evaluar glucosa e insulina en tiempo real', async ({ page }) => {
    await page.goto('/bioquimica');

    // Llenar glucosa e insulina
    await page.locator('#campo-glucosa').fill('105');
    await page.locator('#campo-insulina').fill('12');

    // Verificar que HOMA-IR muestre el valor calculado: (105 * 12) / 405 = 3.11
    await expect(page.getByText('3.11')).toBeVisible();
    await expect(page.getByText(/Resistencia a la Insulina Leve/i)).toBeVisible();

    // Llenar perfil lipídico
    await page.locator('#campo-colesterol-total').fill('220');
    await page.locator('#campo-trigliceridos').fill('180');

    // Verificar que los chips de analitos se listen en el semáforo
    await expect(page.getByText('Colesterol Total').first()).toBeVisible();
    await expect(page.getByText('Triglicéridos').first()).toBeVisible();
  });
});
