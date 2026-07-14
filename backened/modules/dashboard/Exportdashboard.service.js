import { getBrowser } from "../../config/puppeteer.js";

export const exportDashboardpdfservice = async ({ datasetId, cookieValue, baseUrl }) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setCookie({
      name: "accesstoken",
      value: cookieValue,
      url: baseUrl,
    });

    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${baseUrl}/print/datasets/${datasetId}/dashboard`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForSelector('[data-dashboard-ready="true"]', { timeout: 15000 });

    // Measure the actual rendered height of the content — this is what
    // makes the PDF "one long page" instead of A4 pagination.
    const contentHeight = await page.evaluate(() => document.body.scrollHeight);

    const pdfBuffer = await page.pdf({
      width: "1280px",
      height: `${contentHeight}px`,   // one page, exact content height
      printBackground: true,
      pageRanges: "1",                // force single page — no page 2, no split
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    return pdfBuffer;
  } finally {
    await page.close();
  }
};