#!/usr/bin/env node

import Whiskers from 'catppuccin-whiskers-js'
import mdThemes from '../mangadex-themes.json' assert { type: "json" }
import { readFile } from 'node:fs/promises'

readFile(process.argv[2] ?? "template-README.hbs.md", "utf-8").then(template => {
  process.stdout.write(Whiskers.compile(template)({ mdThemes }), "utf-8")
})
