#!/usr/bin/env node

import puppeteer from 'puppeteer'
import { stat } from 'node:fs/promises'
import mdThemes from '../mangadex-themes.json' assert { type: 'json' }
import { flavors } from 'catppuccin-whiskers-js/lib/catppuccin.js'
import { join as pathJoin } from "node:path"

const MANGADEX_URL = new URL("https://mangadex.org")
const outPath = process.argv[2] ?? "./assets/"
const INIT_LOCALSTORAGE = {
  md: JSON.stringify({
    "feature-flags": { "ffOverridesLocal": { "SAFF_ANIM": false } },
    "userPreferences": { "showSafe": true, "showErotic": false, "showSuggestive": false, "showHentai": false }
  })
}

const screenshotSpec = {
  "grid-0-front": {
    path: "/",
    theme: mdThemes["mauve"]["latte"],
  },
  "grid-1-search": {
    path: "/titles?include=a3c67850-4684-404e-9b7f-c69850ee5da6",
    theme: mdThemes["peach"]["frappe"],
    extra: async (page) => {
      const viewSelect = await page.waitForSelector(".controls > .item:nth-child(3)")
      await viewSelect.click()
      await page.waitForSelector(".manga-card.cover-only")
      // await page.evaluate(el => {
      //   navbarBottom = window.document.querySelector(".nav-bar").getBoundingClientRect().bottom
      //   controlsBottom = el.parentElement.parentElement.getBoundingClientRect().bottom
      //   window.scrollTo(0, controlsBottom - navbarBottom)
      // }, viewSelect)
    }
  },
  "grid-2-series": {
    path: "/title/9d3d3403-1a87-4737-9803-bc3d99db1424/the-guy-she-was-interested-in-wasn-t-a-guy-at-all",
    theme: mdThemes["mauve"]["macchiato"],
  },
  "grid-3-chapter": {
    path: "/chapter/8886f97b-14cc-4a45-b624-986b2602e11d/2",
    theme: mdThemes["mauve"]["mocha"],
    extra: async (page) => {
      await page.click(".reader--meta.menu")
      await page.evaluate(() => {
        window.scroll(0, 0)
      })
      await page.waitForTimeout(500)
    }
  },
  ...Object.fromEntries(Object.keys(flavors).map(flavor => [`flavor-${flavor}`, {
    path: "/title/9d3d3403-1a87-4737-9803-bc3d99db1424/the-guy-she-was-interested-in-wasn-t-a-guy-at-all",
    theme: mdThemes["green"][flavor]
  }]))
}

async function main() {
  const browser = await puppeteer.launch({ headless: "new" })

  await Promise.all(Object.entries(screenshotSpec).map(async ([name, { path, theme, extra }]) => {
    const savePath = pathJoin(outPath, `${name}.png`)

    try {
      await stat(savePath)
      console.log(`Skipping existing file ${savePath}. Delete to regenerate.`)
      return
    } catch (_) {
      console.log(`Generating file ${savePath}.`)
    }
    const context = await browser.createIncognitoBrowserContext()
    await setDomainLocalStorage(context, MANGADEX_URL, INIT_LOCALSTORAGE)
    const page = await context.newPage()
    const url = new URL(path, MANGADEX_URL)
    url.searchParams.append("theme", theme)
    console.log("Screenshotting ", url.href)
    await page.goto(url.href)

    // Set screen size
    await page.setViewport({ width: 1600, height: 900 })

    // Can't be arsed to find a selector that works for every scenario
    await page.waitForTimeout(5000)
    await page.waitForNetworkIdle({ idleTime: 250, timeout: 15000 })

    await page.$$eval('#__nuxt > .md-modal', els => els.forEach(el => el.remove()))
    if (extra) {
      await extra(page)
    }

    await page.screenshot({ path: savePath })
    console.log("Screenshotted", url.href, "to", savePath)

    await page.close()
  }))

  await browser.close()
}


// https://stackoverflow.com/a/56141229
async function setDomainLocalStorage(browser, url, values) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', r => {
    r.respond({
      status: 200,
      contentType: 'text/plain',
      body: 'tweak me.',
    });
  });
  await page.goto(url);
  await page.evaluate(values => {
    for (const key in values) {
      localStorage.setItem(key, values[key]);
    }
  }, values);
  await page.close();
}

// https://stackoverflow.com/a/60254260
async function clickOnElement(page, elem, x = null, y = null) {
  const rect = await page.evaluate(el => {
    const { top, left, width, height } = el.getBoundingClientRect();
    return { top, left, width, height };
  }, elem);

  // Use given position or default to center
  const _x = x !== null ? x : rect.width / 2;
  const _y = y !== null ? y : rect.height / 2;

  await page.mouse.click(rect.left + _x, rect.top + _y);
}

main()
