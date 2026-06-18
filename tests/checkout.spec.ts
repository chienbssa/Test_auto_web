import { test, expect } from "@playwright/test";
import { login } from "../utils/helper";

test.beforeEach(async ({ page }) => {
    await login(page, "user1", "123456");
    await page.goto("/menu");
    await page.click('text=Thêm vào giỏ hàng');
});

test("TC46 - Đặt hàng thành công", async ({ page }) => {
    await page.goto("/cart");
    await page.fill('input[name="name"]', "Hoàng Chiến");
    await page.fill('input[name="phone"]', "0987654321");
    await page.locator('#district').selectOption('Thành phố Thái Nguyên');
    await page.fill('input[name="address"]', "Thái Nguyên");
    await page.click('text=Gửi đơn hàng');
    await expect(page.getByText('Đặt hàng thành công!')).toBeVisible();
});

test("TC47 - Bỏ trống trường họ tên", async ({ page }) => {
    await page.goto("/cart");
    await page.fill('input[name="phone"]', "0987654321");
    await page.locator('#district').selectOption('Thành phố Thái Nguyên');
    await page.fill('input[name="address"]', "Thái Nguyên");
    await page.click('text=Gửi đơn hàng');
    await expect(page.locator('input[name="name"]')).toBeFocused();
});

test("TC48 - Bỏ trống trường số điện thoại", async ({ page }) => {
    await page.goto("/cart");
    await page.fill('input[name="name"]', "Hoàng Chiến");
    await page.locator('#district').selectOption('Thành phố Thái Nguyên');
    await page.fill('input[name="address"]', "Thái Nguyên");
    await page.click('text=Gửi đơn hàng');
    await expect(page.locator('input[name="phone"]')).toBeFocused();
});

test("TC49 - Bỏ trống trường địa chỉ", async ({ page }) => {
    await page.goto("/cart");
    await page.fill('input[name="name"]', "Hoàng Chiến");
    await page.fill('input[name="phone"]', "0987654321");
    await page.locator('#district').selectOption('Thành phố Thái Nguyên');
    await page.click('text=Gửi đơn hàng');
    await expect(page.locator('input[name="address"]')).toBeFocused();
});

test("TC52 - Đặt hàng khi giỏ trống", async ({ page }) => {
    await page.goto("/cart");
    await page.locator('.btn.btn-sm.btn-outline-danger').click();
    await page.fill('input[name="name"]', "Hoàng Chiến");
    await page.fill('input[name="phone"]', "0987654321");
    await page.locator('#district').selectOption('Thành phố Thái Nguyên');
    await page.fill('input[name="address"]', "Thái Nguyên");
    await page.click('text=Gửi đơn hàng');
    await expect(page.getByText('vui lòng thêm sản phẩm trước khi đặt hàng')).toBeVisible();
});

test("TC53 - Đặt hàng số lượng lớn", async ({ page }) => {
    await page.goto("/cart");
    await page.getByRole('spinbutton').fill('9999');
    await page.reload();
    await page.fill('input[name="name"]', "Hoàng Chiến");
    await page.fill('input[name="phone"]', "0987654321");
    await page.locator('#district').selectOption('Thành phố Thái Nguyên');
    await page.fill('input[name="address"]', "Thái Nguyên");
    await page.click('text=Gửi đơn hàng');
    await expect(page.getByText('Đặt hàng thành công!')).toBeVisible();
});

test("TC55 - SQL Injection checkout", async ({ page }) => {
    await page.goto("/cart");
    await page.fill('input[name="name"]', "' OR 1=1 --");
    await page.fill('input[name="phone"]', "0987654321");
    await page.fill('input[name="address"]', "Thái Nguyên");
    await page.click('text=Gửi đơn hàng');
    await expect(page.locator('body')).toContainText(/403|Forbidden|blocked/);
});
