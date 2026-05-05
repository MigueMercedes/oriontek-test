import { test, expect } from '@playwright/test';

test.describe('Navegación general', () => {
  test('dashboard muestra KPIs y clientes recientes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(/total clientes/i)).toBeVisible();
    await expect(page.getByText(/total direcciones/i)).toBeVisible();
    await expect(page.getByText(/direcciones \/ cliente/i)).toBeVisible();
    await expect(page.getByText(/nuevos esta semana/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /clientes recientes|recently added/i })).toBeVisible();
  });

  test('lista de clientes carga registros del seed', async ({ page }) => {
    await page.goto('/clients');
    await expect(page.getByRole('heading', { name: /directorio de clientes/i })).toBeVisible();
    await expect(page.getByText('admin@oriontek.com')).toBeHidden();
    await expect(page.getByText('@example.do').first()).toBeVisible();
  });

  test('locations lista direcciones globales y enlaza al cliente', async ({ page }) => {
    await page.goto('/locations');
    await expect(page.getByRole('heading', { name: /^direcciones$/i })).toBeVisible();
    const firstLink = page.locator('table a').first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/clients\/\d+$/);
  });
});
