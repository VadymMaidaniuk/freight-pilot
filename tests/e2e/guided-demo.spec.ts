import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("guided demo smoke flow", async ({ page }) => {
  await page.request.post("/api/demo/reset");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Turn freight inquiries/i })).toBeVisible();
  await page.getByRole("link", { name: /Open Demo Workspace/i }).click();

  await expect(page.getByRole("heading", { name: "RFQ Inbox" })).toBeVisible();
  await page.goto("/workspace/cases/case-cl-001");

  await expect(page.getByText("Rate Comparison")).toBeVisible();
  await expect(page.getByRole("table").getByText("Andes Link Freight")).toBeVisible();
  await page.getByRole("button", { name: /Create Quote v1/i }).click();

  await expect(page.getByText("Quote v1")).toBeVisible();
  await page.getByRole("button", { name: /Receive late Excel rate/i }).click();
  await expect(page.getByText("Potential improvement")).toBeVisible();
});

test("scenario-specific risk views are data-driven", async ({ page }) => {
  await page.request.post("/api/demo/reset");
  await page.goto("/workspace/cases/case-cn-001");
  await expect(page.getByText("Latest explicit quantity selected")).toBeVisible();
  await expect(page.getByText("Please revise to 2 x 40HC")).toBeVisible();

  await page.goto("/workspace/cases/case-za-002");
  await expect(page.getByRole("heading", { name: "Manual Review Required" })).toBeVisible();
  await expect(page.getByText(/Temperature-controlled or reefer cargo/i)).toBeVisible();
});

test("new pasted chat creates RFQ, matches China agents, and processes simulated replies", async ({ page }) => {
  await page.request.post("/api/demo/reset");
  await page.goto("/workspace/new");

  await page.getByLabel(/Chat \/ Messenger/i).check();
  await page.getByRole("button", { name: /Create RFQ and match agents/i }).click();

  await expect(page.getByRole("heading", { name: /Live RFQ · Ningbo -> Hamburg/i })).toBeVisible();
  await expect(page.getByText("Ningbo Harbor Partners")).toBeVisible();

  await page.getByRole("button", { name: /Approve & simulate sending/i }).click();
  await expect(page.getByText("RFQ drafts sent to agents")).toBeVisible();

  await page.getByRole("button", { name: /Process simulated replies/i }).click();
  await expect(page.getByText("Simulated agent replies processed")).toBeVisible();
  await expect(page.getByRole("button", { name: /Create Quote v1/i })).toBeVisible();
});
