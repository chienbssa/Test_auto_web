import { test, expect } from '@playwright/test';

test('Tìm kiếm từ khóa hợp lệ', async ({ request }) => {
  const res = await request.get('/menu?search=bánh');
  expect(res.status()).toBe(200);
  const text = await res.text();
  expect(text).toContain('Bánh');
});

test('Tìm kiếm từ khóa không tồn tại', async ({ request }) => {
  const res = await request.get('/menu?search=butbi');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html.toLowerCase()).not.toContain('butbi');
});

test('Tìm kiếm rỗng', async ({ request }) => {
  const res = await request.get('/menu?search=');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toMatch(/Bánh|Kẹo|Snack/i);
});

test('Tìm kiếm bằng số', async ({ request }) => {
  const res = await request.get('/menu?search=160');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toContain('160');
});

test('refresh sau khi tìm kiếm', async ({ request }) => {
  const res1 = await request.get('/menu?search=bánh');
  const res2 = await request.get('/menu?search=bánh');
  expect(res1.status()).toBe(200);
  expect(res2.status()).toBe(200);
  const html1 = await res1.text();
  const html2 = await res2.text();
  expect(html1).toContain('Bánh');
  expect(html2).toContain('Bánh');
});

test('SQL Injection search', async ({ request }) => {
  const res = await request.get("/menu?search=' OR 1=1 --");
  expect([403]).toContain(res.status());
  const html = await res.text();
  expect(html.length).toBeGreaterThan(0);
});

test('XSS search', async ({ request }) => {
  const res = await request.get('/menu?search=<script>alert(1)</script>');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).not.toContain('<script>alert(1)</script>');
});

test('Tìm kiếm ký tự đặc biệt', async ({ request }) => {
  const res = await request.get('/menu?search=@#$%');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html.toLowerCase()).not.toContain('@#$%');
});

test('Lấy danh sách sản phẩm', async ({ request }) => {
  const res = await request.get('/menu');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toMatch(/Bánh|Kẹo|Snack/i);
});

test('refresh nhiều lần', async ({ request }) => {
  for (let i = 0; i < 3; i++) {
    const res = await request.get('/menu');
    expect(res.status()).toBe(200);
  }
});


  