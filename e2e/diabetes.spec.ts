import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico de Diabetes, Carga Glucémica, Síndrome Metabólico y FINDRISC (Kalo)', () => {
  test('debe navegar a la vista de diabetes y renderizar el encabezado y secciones', async ({ page }) => {
    await page.goto('/diabetes');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Diabetes & Síndrome Metabólico/i })
    ).toBeVisible();
  });

  test('debe calcular Carga Glucémica (CG) dinámicamente', async ({ page }) => {
    await page.goto('/diabetes');

    // Llenar IG 72 y 50g HC disponibles
    await page.locator('#campo-cg-ig').fill('72');
    await page.locator('#campo-cg-hc').fill('50');

    // CG = (72 * 50) / 100 = 36.0 (Alta)
    await expect(page.getByText('36')).toBeVisible();
    await expect(page.getByText(/CG ALTA/i)).toBeVisible();
  });

  test('debe calcular Ratio Insulina:CH y cobertura por unidad', async ({ page }) => {
    await page.goto('/diabetes');

    // Dosis 3 U, HC 45 g
    await page.locator('#campo-ratio-dosis').fill('3');
    await page.locator('#campo-ratio-hc').fill('45');

    // Ratio = 3/45 = 0.067 U/g; Cobertura = 15 g/U
    await expect(page.getByText('0.067')).toBeVisible();
    await expect(page.getByText('15')).toBeVisible();
  });

  test('debe diagnosticar Síndrome Metabólico por criterios ATP-III', async ({ page }) => {
    await page.goto('/diabetes');

    // Glucosa 108 mg/dL, TG 165 mg/dL, HDL 38 mg/dL
    await page.locator('#campo-sm-glucosa').fill('108');
    await page.locator('#campo-sm-tg').fill('165');
    await page.locator('#campo-sm-hdl').fill('38');

    // Debe mostrar SM Positivo
    await expect(page.getByText(/Positivo/i).first()).toBeVisible();
    await expect(page.getByText(/Criterios ATP-III/i).first()).toBeVisible();
  });

  test('debe calcular la escala de tamizaje FINDRISC y riesgo a 10 años', async ({ page }) => {
    await page.goto('/diabetes');

    // Llenar edad 50, peso 78, talla 168, cintura 98
    await page.locator('#campo-findrisc-edad').fill('50');
    await page.locator('#campo-findrisc-peso').fill('78');
    await page.locator('#campo-findrisc-talla').fill('168');
    await page.locator('#campo-findrisc-cintura').fill('98');

    // Debe calcular puntuación FINDRISC
    await expect(page.getByText('Puntuación FINDRISC Total')).toBeVisible();
    await expect(page.getByText(/Probabilidad de DM2 a 10 Años/i)).toBeVisible();
    await expect(page.getByText(/Rigor Clínico \(@source\)/i).first()).toBeVisible();
  });
});
