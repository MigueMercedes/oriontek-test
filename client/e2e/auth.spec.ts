import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('credenciales inválidas muestran error', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill('admin@oriontek.com');
    await page.getByRole('textbox', { name: /contraseña|password/i }).fill('wrong-password');
    await page.getByRole('button', { name: /iniciar sesión|login/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('ruta protegida sin sesión redirige a login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('login exitoso lleva al dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email/i }).fill('admin@oriontek.com');
    await page.getByRole('textbox', { name: /contraseña|password/i }).fill('Admin123!');
    await page.getByRole('button', { name: /iniciar sesión|login/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /resumen del sistema|system overview/i })).toBeVisible();
  });
});

test.describe('Logout', () => {
  test('cerrar sesión limpia estado y vuelve a login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByRole('button', { name: /cuenta de usuario|user menu|account/i }).click().catch(async () => {
      const avatars = page.locator('header [role="button"]:has-text("AO"), header button:has-text("AO")');
      await avatars.first().click();
    });
    await page.getByRole('menuitem', { name: /cerrar sesión|logout/i }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
