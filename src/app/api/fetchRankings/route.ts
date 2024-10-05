import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

async function fetchRankings(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
  
    const title = await page.$eval('h1', (element) => element.innerText.trim()); // Fetch the first <h1> tag
  
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
    return { title, rankings }; // Return title along with rankings
  }
  
export async function GET() {
  const urls = [
    'https://normandie.fff.fr/competitions?tab=ranking&id=420957&phase=1&poule=2&type=ch',
    'https://foot14.fff.fr/competitions?tab=ranking&id=426991&phase=1&poule=3&type=ch'
  ];
  
  try {
    const rankings = await Promise.all(urls.map(fetchRankings));
    return NextResponse.json(rankings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
  }
}
