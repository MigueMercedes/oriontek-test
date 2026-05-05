import { test, expect, Page } from '@playwright/test';

const stamp = Date.now();
const cliente = {
  nombre: 'Test',
  apellido: `E2E${stamp}`,
  email: `e2e.${stamp}@oriontek.test`,
  telefono: '+1 809 555 9999',
};
const direccion1 = {
  calle: 'Calle Test 1',
  ciudad: 'Santo Domingo',
  provincia: 'Distrito Nacional',
  codigoPostal: '10100',
};
const direccion2 = {
  calle: 'Av. Prueba 200',
  ciudad: 'Santiago',
  provincia: 'Santiago',
  codigoPostal: '51000',
};
const direccion3 = {
  calle: 'Calle Nueva 50',
  ciudad: 'La Vega',
  provincia: 'La Vega',
  codigoPostal: '41000',
};

const fillDireccion = async (
  page: Page,
  index: number,
  d: { calle: string; ciudad: string; provincia: string; codigoPostal?: string },
) => {
  const block = page.locator('[data-testid="direccion-row"], section').filter({ hasText: `Dirección ${index + 1}` }).first();
  const scope = (await block.count()) > 0 ? block : page;
  await scope
    .getByRole('textbox', { name: /^calle$/i })
    .nth((await block.count()) > 0 ? 0 : index)
    .fill(d.calle);
  await scope
    .getByRole('textbox', { name: /^ciudad$/i })
    .nth((await block.count()) > 0 ? 0 : index)
    .fill(d.ciudad);
  await scope
    .getByRole('textbox', { name: /^provincia$/i })
    .nth((await block.count()) > 0 ? 0 : index)
    .fill(d.provincia);
  if (d.codigoPostal) {
    await scope
      .getByRole('textbox', { name: /código postal|codigo postal/i })
      .nth((await block.count()) > 0 ? 0 : index)
      .fill(d.codigoPostal);
  }
};

test.describe('CRUD de clientes', () => {
  test.describe.configure({ mode: 'serial' });

  test('crea un cliente con 2 direcciones y aparece en la lista', async ({ page }) => {
    await page.goto('/clients/new');
    await expect(page.getByRole('heading', { name: /nuevo cliente/i })).toBeVisible();

    await page.getByRole('textbox', { name: /^nombre$/i }).fill(cliente.nombre);
    await page.getByRole('textbox', { name: /^apellido$/i }).fill(cliente.apellido);
    await page.getByRole('textbox', { name: /^email$/i }).fill(cliente.email);
    await page.getByRole('textbox', { name: /^teléfono$|^telefono$/i }).fill(cliente.telefono);

    await fillDireccion(page, 0, direccion1);
    await page.getByRole('button', { name: /agregar dirección|agregar direccion/i }).click();
    await fillDireccion(page, 1, direccion2);

    await page.getByRole('button', { name: /^crear cliente$/i }).click();

    await expect(page).toHaveURL(/\/clients$/);
    await expect(page.getByText(`${cliente.nombre} ${cliente.apellido}`)).toBeVisible();
    await expect(page.getByText(cliente.email)).toBeVisible();
  });

  test('detalle del cliente muestra sus direcciones', async ({ page }) => {
    await page.goto('/clients');
    await page.getByText(`${cliente.nombre} ${cliente.apellido}`).first().click();
    await expect(page.getByRole('heading', { name: `${cliente.nombre} ${cliente.apellido}` })).toBeVisible();
    await expect(page.getByText(direccion1.calle)).toBeVisible();
    await expect(page.getByText(direccion2.calle)).toBeVisible();
  });

  test('editar cliente: renombra, agrega y elimina direcciones', async ({ page }) => {
    await page.goto('/clients');
    await page.getByText(`${cliente.nombre} ${cliente.apellido}`).first().click();
    await page.getByRole('button', { name: /editar/i }).click();

    await expect(page).toHaveURL(/\/clients\/\d+\/edit$/);

    const nombreField = page.getByRole('textbox', { name: /^nombre$/i });
    await nombreField.fill('');
    await nombreField.fill('TestEditado');

    await page.getByRole('button', { name: /agregar dirección|agregar direccion/i }).click();
    const calleFields = page.getByRole('textbox', { name: /^calle$/i });
    const total = await calleFields.count();
    await calleFields.nth(total - 1).fill(direccion3.calle);
    const ciudadFields = page.getByRole('textbox', { name: /^ciudad$/i });
    await ciudadFields.nth(total - 1).fill(direccion3.ciudad);
    const provinciaFields = page.getByRole('textbox', { name: /^provincia$/i });
    await provinciaFields.nth(total - 1).fill(direccion3.provincia);

    const deleteButtons = page.getByRole('button', { name: /eliminar dirección|eliminar direccion/i });
    if ((await deleteButtons.count()) > 1) {
      await deleteButtons.first().click();
    }

    await page.getByRole('button', { name: /guardar cambios|guardar/i }).click();
    await expect(page).toHaveURL(/\/clients\/\d+$/);

    await expect(page.getByRole('heading', { name: `TestEditado ${cliente.apellido}` })).toBeVisible();
    await expect(page.getByText(direccion3.calle)).toBeVisible();
    await expect(page.getByText(direccion1.calle)).not.toBeVisible();
  });

  test('eliminar cliente lo retira de la lista', async ({ page }) => {
    await page.goto('/clients');
    await page.getByText(`TestEditado ${cliente.apellido}`).first().click();
    await page.getByRole('button', { name: /^eliminar$/i }).click();
    await page.getByRole('button', { name: /^eliminar$|^confirmar$/i }).last().click();
    await expect(page).toHaveURL(/\/clients$/);
    await expect(page.getByText(`TestEditado ${cliente.apellido}`)).toHaveCount(0);
  });
});
