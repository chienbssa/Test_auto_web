import { test, expect } from "@playwright/test";

// test.describe("Đăng ký thành công", () => {

//     test("TC01 - Đăng ký thành công", async ({ page }) => {
//         await page.goto("/register");
//         await page.fill('input[name="username"]', "user1");
//         await page.fill('input[name="email"]', "user1@gmail.com");
//         await page.fill('input[name="pass1"]', "123456");
//         await page.fill('input[name="pass2"]', "123456");
//         await page.getByRole('button', { name: 'Đăng kí' }).click();
//         await expect(page.getByText('Đăng ký thành công!')).toBeVisible();
//     });
// });

test.describe("Đăng ký thất bại", () => {
    test("TC02 - Đăng ký với username đã tồn tại", async ({ page }) => {
        await page.goto("/register");
        await page.fill('input[name="username"]', "user1");
        await page.fill('input[name="email"]', "user1@gmail.com");
        await page.fill('input[name="pass1"]', "123456");
        await page.fill('input[name="pass2"]', "123456");
        await page.getByRole('button', { name: 'Đăng kí' }).click();
        await expect(page.getByText('Tên người dùng đã tồn tại')).toBeVisible();
    });


    test("TC03 - Đăng ký email đã tồn tại", async ({ page }) => {
        await page.goto("/register");
        await page.fill('input[name="username"]', "user2");
        await page.fill('input[name="email"]', "user1@gmail.com");
        await page.fill('input[name="pass1"]', "123456");
        await page.fill('input[name="pass2"]', "123456");
        await page.getByRole('button', { name: 'Đăng kí' }).click();
        await expect(page.getByText('Email đã được sử dụng')).toBeVisible();
    });

    test("TC04 - Bỏ trống username", async ({ page }) => {
        await page.goto("/register");
        await page.fill('input[name="email"]', "user1@gmail.com");
        await page.fill('input[name="pass1"]', "123456");
        await page.fill('input[name="pass2"]', "123456");
        await page.getByRole('button', { name: 'Đăng kí' }).click();
        await expect(page.getByText('Vui lòng điền tên đăng nhập')).toBeVisible();
    });

    test("TC05 - Bỏ trống password", async ({ page }) => {
        await page.goto("/register");
        await page.fill('input[name="username"]', "user1");
        await page.fill('input[name="email"]', "user1@gmail.com");
        await page.getByRole('button', { name: 'Đăng kí' }).click();
        await expect(page.getByText('Vui lòng điền đầy đủ mật khẩu')).toBeVisible();
    });

    test("TC07 - Đăng ký với email sai định dạng", async ({ page }) => {
        await page.goto("/register");
        await page.fill('input[name="username"]', "user1");
        await page.fill('input[name="email"]', "user1#abc.vn");
        await page.fill('input[name="pass1"]', "123456");
        await page.fill('input[name="pass2"]', "123456");
        await page.getByRole('button', { name: 'Đăng kí' }).click();
        const message = await page.locator('input[name="email"]').evaluate((el: any) => el.validationMessage);
        expect(message).toMatch(/@|Please enter an email address/);
    });

    test("TC08 - Đăng ký với password và confirm password không khớp", async ({ page }) => {
        await page.goto("/register");
        await page.fill('input[name="username"]', "user1");
        await page.fill('input[name="email"]', "user1@gmail.com");
        await page.fill('input[name="pass1"]', "123456");
        await page.fill('input[name="pass2"]', "654321");
        await page.getByRole('button', { name: 'Đăng kí' }).click();
        await expect(page.getByText('Mật khẩu nhập lại không khớp')).toBeVisible();
    });
});