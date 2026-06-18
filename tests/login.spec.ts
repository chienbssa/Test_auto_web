import { test, expect } from "@playwright/test";
import { login } from "../utils/helper";

test.describe("Login thành công", () => {

    test("TC12 - Đăng nhập đúng thông tin", async ({ page }) => {
        await login(page, "user1", "123456");
        await expect(page.getByText('Đăng nhập thành công!')).toBeVisible();
 

    });
});

test.describe("Login thất bại", () => {

    test("TC13 - Đăng nhập sai username", async ({ page }) => {
            await login(page, "userA", "123456");
            await expect(page.getByText('Tên đăng nhập hoặc mật khẩu không đúng')).toBeVisible();
    });

    test("TC14 - Đăng nhập sai password", async ({ page }) => {
        await login(page, "user1", "wrongpassword");
        await expect(page.getByText('Tên đăng nhập hoặc mật khẩu không đúng')).toBeVisible();
    });

    test("TC15 - Bỏ trống username", async ({ page }) => {
        await login(page, "", "123456");
        await expect(page.getByText('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu')).toBeVisible();
    });

    test("TC16 - Bỏ trống password", async ({ page }) => {
        await login(page, "user1", "");
        await expect(page.getByText('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu')).toBeVisible();
    });

    test("TC17 - SQL Injection login", async ({ page }) => {
        await login(page, "' OR 1=1 --", "123456");
        await expect(page.locator('body')).toContainText(/403|Forbidden|blocked/);
    });

    test("TC18 - XSS login", async ({ page }) => {
        await login(page, "<script>alert(1)</script>", "123456");
        await expect(page.locator('text=không đúng')).toBeVisible();
    });

    test("TC19 - Đăng nhập rồi refresh", async ({ page }) => {
        await login(page, "user1", "123456");
        await page.reload();
        await expect(page).toHaveURL('/');
    });

    test("TC22 - Đăng nhập sau đó đăng xuất tài khoản", async ({ page }) => {
        await login(page, "user1", "123456");
        await page.getByRole('link', { name: 'Đăng xuất' }).click();
        await expect(page).toHaveURL('/');
    });

});