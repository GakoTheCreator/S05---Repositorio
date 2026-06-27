import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const output = path.join(root, ".qa");
await fs.mkdir(output, { recursive: true });

const browserPaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const executablePath = browserPaths.find((candidate) => fsSync.existsSync(candidate));
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  headless: true,
});

const report = { mobile: {}, desktop: {}, consoleErrors: [] };

async function attachDiagnostics(page, surface) {
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(`${surface}: ${message.text()}`);
  });
  page.on("pageerror", (error) => report.consoleErrors.push(`${surface}: ${error.message}`));
}

async function measure(page) {
  return page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    bodyHeight: document.body.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
}

async function waitForMotion(page) {
  await page.waitForTimeout(350);
}

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobile.newPage();
await attachDiagnostics(mobilePage, "mobile");
await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" });
await waitForMotion(mobilePage);
await mobilePage.screenshot({ path: path.join(output, "mobile-login.png"), fullPage: false });
report.mobile.login = await measure(mobilePage);

await mobilePage.getByRole("button", { name: "Entrar", exact: true }).click();
await mobilePage.getByRole("heading", { name: "Precisa de ajuda com o app?" }).waitFor();
await waitForMotion(mobilePage);
await mobilePage.screenshot({ path: path.join(output, "mobile-home.png"), fullPage: false });
report.mobile.home = await measure(mobilePage);

await mobilePage.locator("nav.mobile-nav").getByRole("button", { name: "Atendimento", exact: true }).click();
await mobilePage.getByRole("heading", { name: "Atendente virtual" }).waitFor();
await waitForMotion(mobilePage);
await mobilePage.screenshot({ path: path.join(output, "mobile-atendimento.png"), fullPage: false });
report.mobile.support = await measure(mobilePage);

await mobilePage.getByRole("textbox", { name: "Digite sua mensagem" }).fill("Como justifico uma falta?");
await mobilePage.getByRole("button", { name: "Enviar mensagem" }).click();
await mobilePage.waitForTimeout(950);
await mobilePage.screenshot({ path: path.join(output, "mobile-atendimento-resposta.png"), fullPage: false });
report.mobile.supportResponse = await measure(mobilePage);

await mobilePage.locator("nav.mobile-nav").getByRole("button", { name: "Início", exact: true }).click();
await mobilePage.getByRole("heading", { name: "Precisa de ajuda com o app?" }).waitFor();
await mobilePage.getByRole("button", { name: "Ativar tema escuro" }).click();
await waitForMotion(mobilePage);
await mobilePage.screenshot({ path: path.join(output, "mobile-home-dark.png"), fullPage: false });
report.mobile.darkHome = await measure(mobilePage);

await mobilePage.locator("nav.mobile-nav").getByRole("button", { name: "Atendimento", exact: true }).click();
await mobilePage.getByRole("heading", { name: "Atendente virtual" }).waitFor();
await waitForMotion(mobilePage);
await mobilePage.screenshot({ path: path.join(output, "mobile-atendimento-dark.png"), fullPage: false });
report.mobile.darkSupport = await measure(mobilePage);

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const desktopPage = await desktop.newPage();
await attachDiagnostics(desktopPage, "desktop");
await desktopPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
await desktopPage.getByRole("button", { name: "Entrar", exact: true }).click();
await desktopPage.getByRole("heading", { name: "Precisa de ajuda com o app?" }).waitFor();
await waitForMotion(desktopPage);
await desktopPage.screenshot({ path: path.join(output, "desktop-home.png"), fullPage: false });
report.desktop.home = await measure(desktopPage);

await fs.writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2), "utf8");
await browser.close();
console.log(JSON.stringify(report, null, 2));
