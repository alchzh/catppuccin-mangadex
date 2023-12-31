---
repo: alchzh/catppuccin-mangadex
catppuccin-assets-url: https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/
mangadex-url: https://mangadex.org/?theme=
shield-flavor: macchiato
headers:
  latte: "🌻 Latte"
  frappe: "🪴 Frappé"
  macchiato: "🌺 Macchiato"
  mocha: "🌿 Mocha"
flavors-noir:
{{#each flavors}}{{#if this.isDark}}
  - key: {{{@key}}}
    natural: {{{@key}}}-natural
{{/if}}{{/each}}
---

<h3 align="center">
	<img src="{{{catppuccin-assets-url}}}/logos/exports/1544x1544_circle.png" width="100" alt="Logo"/><br/>
	<img src="{{{catppuccin-assets-url}}}/misc/transparent.png" height="30" width="0px"/>
	Catppuccin for <a href="https://mangadex.org/">MangaDex</a>
	<img src="{{{catppuccin-assets-url}}}/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/alchzh/catppuccin-mangadex/stargazers"><img src="https://img.shields.io/github/stars/{{{repo}}}?colorA={{get flavors shield-flavor 'surface0'}}&colorB={{get flavors shield-flavor 'lavender'}}&style=for-the-badge"></a>
	<a href="https://github.com/alchzh/catppuccin-mangadex/issues"><img src="https://img.shields.io/github/issues/{{{repo}}}?colorA={{get flavors shield-flavor 'surface0'}}&colorB={{get flavors shield-flavor 'peach'}}&style=for-the-badge"></a>
	<a href="https://github.com/alchzh/catppuccin-mangadex/contributors"><img src="https://img.shields.io/github/contributors/{{{repo}}}?colorA={{get flavors shield-flavor 'surface0'}}&colorB={{get flavors shield-flavor 'green'}}&style=for-the-badge"></a>
</p>

<p align="center">
	<img src="assets/preview.webp"/>
</p>

## Previews

{{#each headers}}
<details>
<summary>{{{this}}}</summary>
<img src="assets/flavor-{{@key}}.webp"/>
</details>
{{/each}}

## Usage

Click on the flavor and accent color you want below!

In order to accomodate the white text on accent-colored buttons, the dark themes have the accent color
pulled from the Latte flavor. If you want the paler flavor-native accent colors, go to the [Natural Accent](#accent-natural) section.

### Latte Accent
<table>
  <tr><th></th><th></th>{{#each headers}}<th><b>{{{this}}}</b></th>{{/each}}</tr>
  {{#each mdThemes}}
  <tr>
    <td><b>{{titlecase @key}}</b></td>
    <td><img src="{{{@root.catppuccin-assets-url}}}/palette/circles/latte_{{@key}}.png" height="23" width="23"></img></td>
    {{#each @root.flavors}}
    <!-- {{{@key}}} -->
    <td><a target="_blank" href="{{{@root.mangadex-url}}}{{{lookup ../this @key}}}">{{titlecase @key}}-{{titlecase @../key}}</a></td>
    {{/each}}
  </tr>
  {{/each}}
</table>

<a name="accent-natural"></a><h3>Nautral Accent</h3>
<details>
<summary>Click to show</summary>
<table>
  <tr><th></th>{{#each flavors-noir}}<th><b>{{{lookup @root.headers this.key}}}</b></th>{{/each}}</tr>
  {{#each mdThemes}}
  <tr>
    <td><b>{{titlecase @key}}</b></td>
    {{#each @root.flavors-noir}}
    <!-- {{{key}}} {{{noir}}} -->
    <td><img src="{{{@root.catppuccin-assets-url}}}/palette/circles/{{key}}_{{@../key}}.png" height="23" width="23"></img>
    <a target="_blank" href="{{{@root.mangadex-url}}}{{{lookup ../this natural}}}">{{titlecase natural}}-{{titlecase @../key}}</a>
    </td>
    {{/each}}
  </tr>
  {{/each}}
</table></details>


## 🙋 FAQ

-	Q: **_"Why is the required package `mangadex-theme` private?"_**\
	A: I ripped the code for generating the base64 encoded theme strings from the minimized source of [mangadex.org](https://mangadex.org), which I don't have the rights to be distributing publicly.

## 💝 Thanks to

- [alchzh](https://github.com/alchzh)

&nbsp;

<p align="center">
	<img src="{{{catppuccin-assets-url}}}/footers/gray0_ctp_on_line.svg?sanitize=true" />
</p>

<p align="center">
	Copyright &copy; 2021-present <a href="https://github.com/catppuccin" target="_blank">Catppuccin Org</a>
</p>

<p align="center">
	<a href="https://github.com/{{{repo}}}/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor={{get flavors shield-flavor 'overlay2'}}&colorA={{get flavors shield-flavor 'surface0'}}&colorB={{get flavors shield-flavor 'lavender'}}"/></a>
</p>
