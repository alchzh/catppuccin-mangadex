#!/usr/bin/env node

import sharp from "sharp"
import * as fs from "node:fs/promises"
import * as pathLib from "node:path"

// https://stackoverflow.com/q/76380120
async function roundCorners(image, radius = 0.03) {
  const { width, height } = await image.metadata()
  const borderRadius = (height > width)
    ? Math.round(width * radius)
    : Math.round(height * radius)

  const mask = Buffer.from(
    `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" ry="${borderRadius}" /></svg>`
  )

  return image.composite([{
    input: mask,
    blend: 'dest-in'
  }])
}

async function gridLayout({ images, cols, roundRadius, scale = 1.0, gap = 50} ) {
  let width, height
  const buffers = []
  for (const image of images) {
    const { width: iWidth, height: iHeight } = await image.metadata()
    if (width == null && height == null) {
      width = iWidth
      height = iHeight
    } else {
      if (iWidth != width || iHeight != height) {
        throw new error("Input name the same dimensions!")
      }
    }
    buffers.push(await (await roundCorners(image, roundRadius)).toBuffer())
  }


  const rows = Math.ceil(images.length / cols)

  const gridWidth = cols * (width + gap) + gap
  const gridHeight = rows * (height + gap) + gap
  const newImage = {
    create: {
      width: gridWidth,
      height: gridHeight,
      channels: 4, // RGBA
      background: { r: 0, b: 0, g: 0, alpha: 0 } // transparent
    }
  }

  const canvas = sharp(newImage)

  const composites = buffers.map((input, index) => {
    const x = gap + (index % cols) * (width + gap)
    const y = gap + (Math.floor(index / cols)) * (height + gap)
    return {
      input,
      left: x,
      top: y,
      blend: 'over'
    }
  })

  const composite = canvas.composite(composites)
  if (scale != 1) {
    return sharp(await (await composite.png().toBuffer())).resize(gridWidth * scale, null)
  } else {
    return composite
  }
}

async function main() {
  const path = process.argv[2] ?? "./assets"
  const sourcePngs = (await fs.readdir(path)).map(s => Object.assign(pathLib.parse(s), { dir: path })).filter(path => path.ext === ".png")

  const flavorTasks = sourcePngs.filter(path => path.name.startsWith("flavor-")).map(async flavorPreview => {
    const image = sharp(await fs.readFile(pathLib.format(flavorPreview)))
    const rounded = await roundCorners(image)
    const outPath = pathLib.format({...flavorPreview, base: '', ext: '.webp'})
    console.log("Writing to", outPath)
    await fs.writeFile(outPath, await rounded.webp({lossless:true, quality: 100, force: true}).toBuffer())
  })

  const gridTask = async () => {
    const images = sourcePngs
      .filter(path => path.name.startsWith("grid-"))
      .map(async f => sharp(await fs.readFile(pathLib.format(f))))
    const outPath = pathLib.join(path, "preview.webp")
    console.log("Writing to", outPath)
    await fs.writeFile(pathLib.join(path, "preview.webp"), await (await gridLayout({
      images: await Promise.all(images),
      cols: 2,
      scale: 0.5
    })).webp({lossless:true, quality: 100, force: true}).toBuffer())
  }

  await Promise.all([...flavorTasks, gridTask()])
}

main()
