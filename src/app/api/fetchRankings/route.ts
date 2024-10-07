/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from 'next/server';
// import puppeteer from 'puppeteer';

// const puppeteer = require("puppeteer");
const puppeteer = require("puppeteer-core");

// const chromium = require("@sparticuz/chromium");
const chromium = require("@sparticuz/chromium-min");

async function fetchRankings(url: string) {
  // const browser = await puppeteer.launch({
  //   headless: true, // Ensure it's running headless
  // });

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      // "https://github.com/Sparticuz/chromium/releases/download/v129.0.0/chromium-v129.0.0-pack.tar"
      "https://chromium.armelpingault.com/chromium-v119.0.0-pack.tar"
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });


  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const title = await page.$eval('h1', (element: any) => element.innerText.trim());

  const rankings = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    return rows.map(row => {
      const cells = row.querySelectorAll('td');
      return {
        position: cells[0]?.innerText.trim(),
        team: cells[1]?.innerText.trim(),
        points: cells[2]?.innerText.trim(),
        matchesPlayed: cells[3]?.innerText.trim(),
        wins: cells[4]?.innerText.trim(),
        draws: cells[5]?.innerText.trim(),
        losses: cells[6]?.innerText.trim(),
        goalsFor: cells[7]?.innerText.trim(),
        goalsAgainst: cells[8]?.innerText.trim(),
        goalDifference: cells[9]?.innerText.trim(),
      };
    });
  });

  await browser.close();
  return { title, rankings };
}

export async function GET() {
  const urls = [
    'https://normandie.fff.fr/competitions?tab=ranking&id=420957&phase=1&poule=2&type=ch',
    'https://foot14.fff.fr/competitions?tab=ranking&id=426991&phase=1&poule=3&type=ch'
  ];

  try {
    const rankings = await Promise.all(urls.map(fetchRankings));
    return NextResponse.json(rankings);
  } catch (err) {
    console.error('Failed to fetch rankings:', err); // Log the error
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
  }
}
