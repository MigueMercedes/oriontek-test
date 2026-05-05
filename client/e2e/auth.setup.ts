import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /email/i }).fill('admin@oriontek.com');
  await page.getByRole('textbox', { name: /contraseña|password/i }).fill('Admin123!');
  await page.getByRole('button', { name: /iniciar sesión|login/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /resumen del sistema|system overview/i })).toBeVisible();
  await page.context().storageState({ path: authFile });
});
