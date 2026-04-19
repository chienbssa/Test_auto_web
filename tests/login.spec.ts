import { test, expect } from "@playwright/test";
import { login } from "../utils/helper";

test.describe("Login thành công", () => {

    test("TC09 - Đăng nhập đúng thông tin", async ({ page }) => {
        await login(page, "user1", "123456");
        await expect(page.getByText('Đăng nhập thành công!')).toBeVisible();
 

    });
});

test.describe("Login thất bại", () => {

    test("TC10 - Đăng nhập sai username", async ({ page }) => {
            await login(page, "userA", "123456");
            await expect(page.getByText('Tên đăng nhập hoặc mật khẩu không đúng')).toBeVisible();
    });

    test("TC11 - Đăng nhập sai password", async ({ page }) => {
        await login(page, "user1", "wrongpassword");
        await expect(page.getByText('Tên đăng nhập hoặc mật khẩu không đúng')).toBeVisible();
    });

    test("TC12 - Bỏ trống username", async ({ page }) => {
        await login(page, "", "123456");
        await expect(page.getByText('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu')).toBeVisible();
    });

    test("TC13 - Bỏ trống password", async ({ page }) => {
        await login(page, "user1", "");
        await expect(page.getByText('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu')).toBeVisible();
    });

    test("TC14 - SQL Injection login", async ({ page }) => {
        await login(page, "' OR 1=1 --", "123456");
        await expect(page.locator('body')).toContainText(/403|Forbidden|blocked/);
    });

    test("TC15 - XSS login", async ({ page }) => {
        await login(page, "<script>alert(1)</script>", "123456");
        await expect(page.locator('text=không đúng')).toBeVisible();
    });

    test("TC16 - Đăng nhập rồi refresh", async ({ page }) => {
        await login(page, "user1", "123456");
        await page.reload();
        await expect(page).toHaveURL('/');
    });

});