import test, { expect } from "playwright/test";

test.describe("All tests", () => {
  test("Manage portfolio", async ({ page }) => {
    await login(page, process.env.E2E_USERNAME, process.env.E2E_PASSWORD);

    const portfolioName = "Test portfolio" + Date.now();

    // should create portfolio
    await page.getByRole("textbox", { name: "Enter portfolio name" }).click();
    await page
      .getByRole("textbox", { name: "Enter portfolio name" })
      .fill(portfolioName);
    await page.getByRole("button", { name: "Create Portfolio" }).click();
    await expect(
      page.getByRole("heading", { level: 2, name: portfolioName })
    ).toBeVisible();

    // should redirect to portfolio
    await page.getByRole("button", { name: "View Details" }).first().click();

    await page.waitForTimeout(2000);

    // should add coin to portfolio
    await addCoinToPortfolio(page, "BTC", 1, 100000);

    // should add second transaction to portfolio
    await addCoinToPortfolio(page, "BTC", 1, 50000);
    await expect(page.getByTestId("amount")).toHaveText("2 BTC");
    await expect(page.getByTestId("price")).toHaveText("$75000.00 USDT");
  });
});

export async function login(page, username, password) {
  await page.goto("http://localhost:3000/login");
  await page.getByTestId("login-email").click();
  await page.getByTestId("login-email").fill(username);
  await page.getByTestId("login-password").click();
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
  await expect(
    page.getByRole("heading", { name: "My Portfolios" })
  ).toBeVisible();
}

const addCoinToPortfolio = async (
  page: Page,
  ticker: string,
  amount: number,
  price: number
) => {
  await page.getByRole("button", { name: "Add coin" }).click();
  await page.fill('input[name="ticker"]', ticker);
  await page.fill('input[name="amount"]', `${amount}`);
  await page.fill('input[name="price"]', `${price}`);
  await page.getByRole("button", { name: "Add Transaction" }).click();

  await page.waitForTimeout(2000);
  await expect(page.getByTestId("ticker")).toBeVisible();
};
