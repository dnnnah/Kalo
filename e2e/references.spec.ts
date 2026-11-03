import { test, expect } from '@playwright/test';

test.describe('Flujo de Consulta: Biblioteca de Referencias Clínicas Offline (Kalo)', () => {
  test('debe navegar a la vista de referencias y renderizar las pestañas principales', async ({ page }) => {
    await page.goto('/referencias');
    await expect(page).toHaveTitle(/Kalo/i);
    await expect(
      page.getByRole('heading', { name: /Biblioteca de Referencias Clínicas/i })
    ).toBeVisible();

    // Verificar presencia de las pestañas
    await expect(page.getByRole('button', { name: /Laboratorio/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /IDR por Edad/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Medidas Caseras MX/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /NAF & Estrés/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Fórmulas Clínicas/i })).toBeVisible();
  });

  test('debe filtrar analitos de laboratorio interactivamente', async ({ page }) => {
    await page.goto('/referencias');

    const searchInput = page.getByPlaceholder(/Buscar analito/i);
    await searchInput.fill('Glucosa');

    // Debe mostrar la fila correspondiente
    await expect(page.getByText('Glucosa En Ayuno')).toBeVisible();
    await expect(page.getByText('Glucemia')).toBeVisible();
    await expect(page.getByText('70 – 99')).toBeVisible();
  });

  test('debe conmutar a IDR y mostrar recomendaciones nutricionales', async ({ page }) => {
    await page.goto('/referencias');

    await page.getByRole('button', { name: /IDR por Edad/i }).click();

    // Verificar presencia de la tabla de IDR
    await expect(page.getByText(/Ingestas Diarias Recomendadas/i)).toBeVisible();
    await expect(page.getByText('Calcio')).toBeVisible();
    await expect(page.getByText('Hierro')).toBeVisible();
  });

  test('debe buscar equivalencias de medidas caseras mexicanas', async ({ page }) => {
    await page.goto('/referencias');

    await page.getByRole('button', { name: /Medidas Caseras MX/i }).click();

    const searchInput = page.getByPlaceholder(/Buscar alimento o medida/i);
    await searchInput.fill('Tortilla');

    // Verificar que muestre opciones de tortilla con sus gramos
    await expect(page.getByText(/Tortilla/i).first()).toBeVisible();
    await expect(page.getByText(/Granos Cereales/i).first()).toBeVisible();
  });

  test('debe visualizar el compendio de fórmulas clínicas con fuentes', async ({ page }) => {
    await page.goto('/referencias');

    await page.getByRole('button', { name: /Fórmulas Clínicas/i }).click();

    await expect(page.getByText(/Valencia \(Población Mexicana\)/i)).toBeVisible();
    await expect(page.getByText(/Mifflin-St Jeor/i)).toBeVisible();
    await expect(page.getByText(/CKD-EPI 2021/i)).toBeVisible();
    await expect(page.getByText(/Rigor Clínico & Citas Oficiales/i)).toBeVisible();
  });
});
