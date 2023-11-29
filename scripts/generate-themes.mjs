#!/usr/bin/env node

import yaml from "js-yaml"
import { encodeTheme, packAllColors } from "@alchzh/mangadex-theme"
import { accentLabels, flavors } from "catppuccin-whiskers-js/lib/catppuccin.js"

import themeYAMLTemplate from "../compiled/theme.yaml.mjs"

const mdThemes = {}

for (const label of accentLabels) {
  mdThemes[label] = {}
  for (const [flavor, scheme] of Object.entries(flavors)) {
    const themeYAMLstring = themeYAMLTemplate({ "accent-label": label }, { flavor })
    const themeObject = yaml.load(themeYAMLstring)
    mdThemes[label][flavor] = encodeTheme(packAllColors(themeObject))
    if (scheme.isDark) {
      const noirThemeYAMLstring = themeYAMLTemplate({ "accent": scheme[label] }, { flavor })
      const noirThemeObject = yaml.load(noirThemeYAMLstring)
      mdThemes[label][flavor + "-natural"] = encodeTheme(packAllColors(noirThemeObject))
    }
  }
}

console.log(JSON.stringify(mdThemes, null, 2))
