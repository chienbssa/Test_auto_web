import {test, expect} from '@playwright/test';

test("TC30 - Thêm sản phẩm", async ({ page }) => {
    await page.goto("/menu");
    await page.click('text=Thêm vào giỏ hàng');
    await expect(page.getByText('Đã thêm sản phẩm vào giỏ hàng')).toBeVisible();
});

test("TC31 - Thêm sản phẩm nhiều lần", async ({ page }) => {
    await page.goto("/menu");
    const addBtn = page.locator('text=Thêm vào giỏ').first();
    const cartBadge = page.locator('.badge.bg-danger');
    const clickTimes = 3;
        for (let i = 0; i < clickTimes; i++) {
        await addBtn.click();
    }
    await expect(cartBadge).toHaveText(String(clickTimes));
});

test("TC33 - số lượng =0", async ({ page }) => {
    await page.goto("/menu");
    await page.click('text=Thêm vào giỏ hàng');
    await page.goto("/cart");
    const qty = page.getByRole('spinbutton').first();
        page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Số lượng phải lớn hơn hoặc bằng 1!');
        await dialog.accept();
    });
    await qty.fill('0');
    await qty.press('Enter');
});

test("TC34 - số lượng âm", async ({ page }) => {
     await page.goto("/menu");
    await page.click('text=Thêm vào giỏ hàng');
    await page.goto("/cart");
    const qty = page.getByRole('spinbutton').first();
        page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Số lượng phải lớn hơn hoặc bằng 1!');
        await dialog.accept();
    });
    await qty.fill('-1');
    await qty.press('Enter');
});

test("TC36 - Xóa sản phẩm", async ({ page }) => {
    await page.goto("/menu");
    await page.click('text=Thêm vào giỏ hàng');
    await page.goto("/cart");
    await page.locator('.btn.btn-sm.btn-outline-danger').click();
    await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
});

test("TC37 - Giỏ trống", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
});

test("TC38 - refresh giỏ hàng", async ({ page }) => {
    await page.goto("/menu");
    await page.click('text=Thêm vào giỏ hàng');
    await page.goto("/cart");
    const items = page.locator('.cart-item');
    const before = await items.count();
    await page.reload();
    await expect(items).toHaveCount(before);
});

test("TC40 - Tổng tiền đúng", async ({ page }) => {
  await page.goto("/menu");
  await page.click('text=Thêm vào giỏ hàng');
  await page.goto("/cart");
  const qtyInput = page.getByRole('spinbutton').first();
  const unitPriceLocator = page.locator('.unit-price').first();
  const subtotalLocator = page.locator('.subtotal').first();
  // cập nhật số lượng
  await qtyInput.fill('2');
  await qtyInput.press('Enter');
  // lấy giá gốc
  const unitPriceText = await unitPriceLocator.textContent();
  // ví dụ: "10.000 VND" -> 10000
  const unitPrice = Number(
    unitPriceText!
      .replace(/\./g, '')
      .replace('VND', '')
      .trim()
  );
  // expected subtotal
  const expectedSubtotal = unitPrice * 2;
  // verify subtotal
  await expect(subtotalLocator).toContainText(
    expectedSubtotal.toLocaleString('vi-VN')
  );
  // reload kiểm tra vẫn đúng
  await page.reload();
  await expect(page.locator('.subtotal').first()).toContainText(
    expectedSubtotal.toLocaleString('vi-VN')
  );
});