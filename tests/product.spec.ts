import {test, expect} from '@playwright/test';

test.describe('Xem sản phẩm', () => {

    test('TC19 - xem danh sach sản phẩm', async ({ page }) => {
        await page.goto('https://pythonweb-wymr.onrender.com/menu');
        await expect(page.getByRole('heading', { name: 'Sản phẩm' })).toBeVisible();
        await expect(page.getByRole('listitem')).toHaveCount(9);
    });
});

test.describe('Tìm kiếm sản phẩm', () => { 

    test("TC21 - Tìm kiếm từ khóa hợp lệ", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill('bánh');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=bánh').first()).toBeVisible();
    });

    test("TC22 - Tìm kiếm từ khóa không tồn tại", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill('bút bi');
        await page.click('button[type="submit"]');
        await expect(page.getByText('Không tìm thấy sản phẩm nào phù hợp')).toBeVisible();
    });

    test("TC23 - Tìm kiếm với input rỗng", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill('');
        await page.click('button[type="submit"]');
        await expect(page.getByRole('listitem')).toHaveCount(9);
    });

    test("TC24 - Tìm kiếm bằng số", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill('160');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=160').first()).toBeVisible();
    });

    test("TC25 - Refresh trang sau khi tìm kiếm", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill('bánh');
        await page.click('button[type="submit"]');
        await page.reload();
        await expect(page.locator('text=bánh').first()).toBeVisible();
    });

    test("TC26 - SQL Injection search", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill("' OR 1=1 --");
        await page.click('button[type="submit"]');
        await expect(page.locator('body')).toContainText(/403|Forbidden|blocked/);
    });

    test("TC27 - XSS search", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill("<script>alert(1)</script>");
        await page.click('button[type="submit"]');
        await expect(page.getByText('Không tìm thấy sản phẩm nào phù hợp')).toBeVisible();
    });

    test("TC28 - Nhập ký tự đặc biệt", async ({ page }) => {
        await page.goto('/menu');
        await page.getByRole('textbox', { name: 'Tìm sản phẩm' }).fill("@#$%");
        await page.click('button[type="submit"]');
        await expect(page.getByText('Không tìm thấy sản phẩm nào phù hợp')).toBeVisible();
    });
});