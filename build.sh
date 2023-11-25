#!/usr/bin/env bash

FLAVOR=(
  latte
  frappe
  macchiato
  mocha
)

ACCENT=(
  rosewater
  flamingo
  pink
  mauve
  red
  maroon
  peach
  yellow
  green
  teal
  sky
  sapphire
  blue
  lavender
)

for flavor in ${FLAVOR[@]}; do
  for accent in ${ACCENT[@]}; do
    whiskers theme-template.json "$flavor" --override accent="$accent" |
      mangadex-theme encode -u
  done
done
