import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer'; // Use Puppeteer which includes Chrome

export async function GET() {
  const urls = [
    'https://normandie.fff.fr/competitions?tab=ranking&id=420957&phase=1&poule=2&type=ch',
    'https://foot14.fff.fr/competitions?tab=ranking&id=426991&phase=1&poule=3&type=ch'
  ];

  const browser = await puppeteer.launch({ headless: true }); // Use Puppeteer which includes Chrome

  try {
    const rankings = await Promise.all(urls.map(async (url) => {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Get the title
      const title = await page.evaluate(() => document.querySelector('h1')?.innerText || '');

      // Get rankings table
      const tableData = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.map(row => {
          const columns = Array.from(row.querySelectorAll('td'));
          return columns.map(col => col.innerText);
        });
      });

      return { title, rankings: tableData };
    }));

    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Failed to fetch rankings:', error);
    return NextResponse.json({ error: 'Failed to fetch rankings' });
  } finally {
    await browser.close();
  }
}
