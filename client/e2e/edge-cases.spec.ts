import { test, expect } from '@playwright/test';

test.describe('Validaciones del formulario', () => {
  test('campos requeridos muestran error inline al enviar vacío', async ({ page }) => {
    await page.goto('/clients/new');
    await page.getByRole('button', { name: /^crear cliente$/i }).click();

    await expect(page.getByText('Nombre requerido')).toBeVisible();
    await expect(page.getByText('Apellido requerido')).toBeVisible();
    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('Calle requerida')).toBeVisible();
    await expect(page.getByText('Ciudad requerida')).toBeVisible();
    await expect(page.getByText('Provincia requerida')).toBeVisible();

    // Permanece en /clients/new
    await expect(page).toHaveURL(/\/clients\/new$/);
  });

  test('email mal formado muestra error inline', async ({ page }) => {
    await page.goto('/clients/new');
    await page.getByRole('textbox', { name: /^email$/i }).fill('no-es-email');
    await page.getByRole('textbox', { name: /^nombre$/i }).fill('A');
    await page.getByRole('textbox', { name: /^apellido$/i }).fill('B');
    await page.getByRole('button', { name: /^crear cliente$/i }).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
  });

  test('email duplicado muestra error inline en el campo', async ({ page }) => {
    await page.goto('/clients/new');
    await page.getByRole('textbox', { name: /^nombre$/i }).fill('Dup');
    await page.getByRole('textbox', { name: /^apellido$/i }).fill('Test');
    await page.getByRole('textbox', { name: /^email$/i }).fill('luisa.pena@example.do');
    await page.getByRole('textbox', { name: /^calle$/i }).fill('Calle X');
    await page.getByRole('textbox', { name: /^ciudad$/i }).fill('Ciudad');
    await page.getByRole('textbox', { name: /^provincia$/i }).fill('Prov');
    await page.getByRole('button', { name: /^crear cliente$/i }).click();

    await expect(page.getByText(/email ya registrado/i)).toBeVisible();
    await expect(page).toHaveURL(/\/clients\/new$/);
  });

  test('botón eliminar dirección está deshabilitado cuando solo hay una', async ({ page }) => {
    await page.goto('/clients/new');
    const deleteBtns = page.getByRole('button', { name: /eliminar dirección|eliminar direccion/i });
    await expect(deleteBtns).toHaveCount(1);
    await expect(deleteBtns.first()).toBeDisabled();
  });
});

test.describe('Estados de error en detalle', () => {
  test('id no numérico muestra mensaje "Identificador no válido"', async ({ page }) => {
    await page.goto('/clients/abc');
    await expect(
      page.getByRole('heading', { name: /identificador no válido/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /volver a clientes/i }),
    ).toBeVisible();
  });

  test('id inexistente muestra mensaje "Cliente no encontrado"', async ({ page }) => {
    await page.goto('/clients/99999999');
    await expect(
      page.getByRole('heading', { name: /cliente no encontrado/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /volver a clientes/i }),
    ).toBeVisible();
  });

  test('id negativo se trata como no encontrado', async ({ page }) => {
    await page.goto('/clients/-1');
    await expect(
      page.getByRole('heading', { name: /cliente no encontrado/i }),
    ).toBeVisible();
  });
});

test.describe('Filtros del directorio', () => {
  test('filtro "Sin direcciones" sin matches muestra empty state', async ({ page }) => {
    await page.goto('/clients');
    await page.getByRole('button', { name: /^filtros$/i }).click();
    await page.getByRole('radio', { name: /sin direcciones/i }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: /sin resultados/i })).toBeVisible();
  });

  test('limpiar filtros se deshabilita cuando todo está en defaults', async ({ page }) => {
    await page.goto('/clients');
    await page.getByRole('button', { name: /^filtros$/i }).click();
    const limpiar = page.getByRole('button', { name: /^limpiar$/i });
    await expect(limpiar).toBeDisabled();

    await page.getByRole('radio', { name: /con 2 o más/i }).click();
    await expect(limpiar).toBeEnabled();

    await limpiar.click();
    await expect(limpiar).toBeDisabled();
  });

  test('orden alfabético reordena la tabla', async ({ page }) => {
    await page.goto('/clients');
    await page.getByRole('button', { name: /^filtros$/i }).click();
    await page.getByRole('radio', { name: /alfabético/i }).click();
    await page.keyboard.press('Escape');

    const firstRowName = await page
      .locator('table tbody tr')
      .first()
      .locator('td')
      .first()
      .textContent();
    // El primer nombre alfabéticamente del seed empieza con A
    expect(firstRowName).toMatch(/^A/i);
  });
});

test.describe('Sesión y persistencia', () => {
  test('refresh de página mantiene la sesión', async ({ page }) => {
    await page.goto('/clients');
    await expect(page.getByRole('heading', { name: /directorio de clientes/i })).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(/\/clients$/);
    await expect(page.getByRole('heading', { name: /directorio de clientes/i })).toBeVisible();
  });

  test('token corrupto en localStorage redirige al login', async ({ page }) => {
    await page.goto('/clients');
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'totally-bogus');
      localStorage.setItem('refresh_token', 'also-bogus');
    });
    await page.reload();
    await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });
  });
});

test.describe('Layout responsive', () => {
  test('en mobile el sidebar se oculta y el hamburger lo abre', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/clients');
    await expect(page.getByRole('heading', { name: /directorio de clientes/i })).toBeVisible();

    // Sidebar permanente se oculta en mobile
    const sidebarLinks = page.locator('nav a:has-text("Dashboard")');
    await expect(sidebarLinks.first()).toBeHidden();

    // Drawer se abre con el hamburger
    await page.locator('header button').first().click();
    await expect(page.getByRole('link', { name: /^dashboard$/i })).toBeVisible();
  });
});
