import { NextResponse } from 'next/server';
// import puppeteer from 'puppeteer'; // Use Puppeteer which includes Chrome

import { Browser as CoreBrowser } from "puppeteer-core";
import {Browser} from "puppeteer";
// import chromium from "@sparticuz/chromium-min";
// const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium-min");
const puppeteer = require("puppeteer-core");


// 本地 Chrome 执行包路径
const localExecutablePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// 远程执行包
const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar";

// 运行环境
const isDev = process.env.NODE_ENV === "development";
export async function GET() {
  const urls = [
    'https://normandie.fff.fr/competitions?tab=ranking&id=420957&phase=1&poule=2&type=ch',
    'https://foot14.fff.fr/competitions?tab=ranking&id=426991&phase=1&poule=3&type=ch'
  ];

  // const browser = await puppeteer.launch({ headless: true }); // Use Puppeteer which includes Chrome

  // let browser: Browser | CoreBrowser;

  // const browser = await puppeteer.launch({
  //   args: chromium.args,
  //   defaultViewport: chromium.defaultViewport,
  //   executablePath: await chromium.executablePath(
  //     "https://www.example.com/chromiumPack.tar"
  //   ),
  //   headless: chromium.headless,
  // });
  let browser = null;

  browser = await puppeteer.launch({
    args: isDev ? [] : chromium.args,
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: isDev
      ? localExecutablePath
      : await chromium.executablePath(remoteExecutablePath),
    headless: chromium.headless,
  });


  // const puppeteer = await import("puppeteer-core");
  // browser = await puppeteer.launch({
  //     args: chromium.args,
  //     defaultViewport: chromium.defaultViewport,
  //     executablePath: await chromium.executablePath(),
  //     headless: chromium.headless,
  // });


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
