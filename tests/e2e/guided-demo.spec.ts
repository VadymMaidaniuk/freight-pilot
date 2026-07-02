import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("smoke flow управляемого демо", async ({ page }) => {
  await page.request.post("/api/demo/reset");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Превращайте запросы/i })).toBeVisible();
  await page.getByRole("link", { name: /Открыть демо/i }).click();

  await expect(page.getByRole("heading", { name: "Входящие RFQ" })).toBeVisible();
  await page.goto("/workspace/cases/case-cl-001");

  await expect(page.getByText("Сравнение ставок")).toBeVisible();
  await expect(page.getByRole("table").getByText("Andes Link Freight")).toBeVisible();
  await page.getByRole("button", { name: /Создать Quote v1/i }).click();

  await expect(page.getByText("Quote v1")).toBeVisible();
  await page.getByRole("button", { name: /Получить позднюю Excel-ставку/i }).click();
  await expect(page.getByText("Потенциальная экономия")).toBeVisible();
});

test("сценарные риски управляются данными", async ({ page }) => {
  await page.request.post("/api/demo/reset");
  await page.goto("/workspace/cases/case-cn-001");
  await expect(page.getByText("Выбрано последнее явное количество")).toBeVisible();
  await expect(page.getByText("Пожалуйста, измените на 2 x 40HC")).toBeVisible();

  await page.goto("/workspace/cases/case-za-002");
  await expect(page.getByRole("heading", { name: "Требуется ручная проверка" })).toBeVisible();
  await expect(page.getByText(/Температурный или рефрижераторный груз/i)).toBeVisible();
});

test("ручная вставка создает RFQ, подбирает агентов Китая и обрабатывает ответы", async ({ page }) => {
  await page.request.post("/api/demo/reset");
  await page.goto("/workspace/new");

  await expect(page.getByRole("button", { name: /Проверить почту/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Проверить мессенджеры/i })).toBeVisible();
  await page.getByRole("button", { name: /Проверить мессенджеры/i }).click();
  await expect(page.getByText(/Интеграция мессенджеров пока не подключена/i)).toBeVisible();

  await page.getByRole("button", { name: /Создать RFQ из текста/i }).click();

  await expect(page.getByRole("heading", { name: /Живой RFQ · Ningbo -> Hamburg/i })).toBeVisible();
  await expect(page.getByText("Ningbo Harbor Partners")).toBeVisible();

  await page.getByRole("button", { name: /Согласовать и имитировать отправку/i }).click();
  await expect(page.getByText("Черновики RFQ отправлены агентам")).toBeVisible();

  await page.getByRole("button", { name: /Обработать имитированные ответы/i }).click();
  await expect(page.getByText("Имитированные ответы агентов обработаны")).toBeVisible();
  await expect(page.getByRole("button", { name: /Создать Quote v1/i })).toBeVisible();
});
