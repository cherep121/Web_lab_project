export type RGBColor = [number, number, number]

export enum ColorName {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}

const namedColors: Record<ColorName, RGBColor> = {
  [ColorName.Red]: [255, 0, 0],
  [ColorName.Green]: [0, 128, 0],
  [ColorName.Blue]: [0, 0, 255]
}

function validateChannel(channel: number): void {
  if (!Number.isInteger(channel) || channel < 0 || channel > 255) {
    throw new RangeError(`Канал RGB должен быть целым числом от 0 до 255: ${channel}`)
  }
}

export function rgbToHex(color: RGBColor): string {
  color.forEach(validateChannel)
  return `#${color.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

export function getColorDetails(name: ColorName): { rgb: RGBColor; hex: string } {
  const rgb: RGBColor = [...namedColors[name]]
  return { rgb, hex: rgbToHex(rgb) }
}

for (const colorName of Object.values(ColorName)) {
  console.log(colorName, getColorDetails(colorName))
}

try {
  console.log(rgbToHex([256, 20, 30]))
} catch (error: unknown) {
  if (error instanceof RangeError) console.log('Ожидаемая ошибка:', error.message)
}
