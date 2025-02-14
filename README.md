# LCD Extension for MakeCode

This extension allows you to control an I2C LCD1602 display with the micro:bit.

## 🚀 Features

- Easily control I2C LCD1602 display from microcontroller
- Can display numbers, strings using MakeCode blocks
- Also supports LCD backlight and screen pan function
- Can be registered as a MakeCode extension for easy use

## Blocks

### 🔍 Summary: What each block does

| **Block ID**                                  | **Function**                                      |
|----------------------------------------------|--------------------------------------------------|
| [`I2C_LCD1620_SET_ADDRESS`](#1-lcd-initialization-block) | Initialize LCD and set I2C address              |
| [`I2C_LCD1620_SHOW_NUMBER`](#2-number-display-block)     | Show a number in a specific location            |
| [`I2C_LCD1620_SHOW_STRING`](#3-string-display-block)     | Show a string at a specific location            |
| [`I2C_LCD1620_ON`](#4-lcd-onoff-block)                 | Switch on the LCD screen                        |
| [`I2C_LCD1620_OFF`](#4-lcd-onoff-block)                | Switch off the LCD screen                       |
| [`I2C_LCD1620_CLEAR`](#5-screen-clear-block)           | Clear the screen                                |
| [`I2C_LCD1620_BACKLIGHT_ON`](#6-backlight-onoff-block)  | Turn on the backlight                           |
| [`I2C_LCD1620_BACKLIGHT_OFF`](#6-backlight-onoff-block) | Turn off the backlight                          |
| [`I2C_LCD1620_SHL`](#7-screen-shift-block)             | Shift screen to the left                        |
| [`I2C_LCD1620_SHR`](#7-screen-shift-block)             | Shift screen to the right                       |

### 1. LCD Initialization Block

```typescript
//% blockId='I2C_LCD1620_SET_ADDRESS' block="LCD initialize with Address %addr'
export function LCDInit(Addr: number)
```

- 🔹 Description

  - Initializes the LCD and sets the I2C address.
  - If Addr == 0, it will automatically seek the I2C address.
  - Sets to 4-bit mode and performs basic LCD setup.

- 🔹 Internal behavior

  - Call AutoAddr() to auto-detect I2C address (or use entered address)
  - Set 4-bit mode (cmd(0x33), cmd(0x28))
  - Enable backlight (BK = 8)
  - Clear screen (cmd(0x01))
  - Set Cursor Movement Mode (cmd(0x06))
  - Enable LCD (cmd(0x0C))

- ✅ Usage examples

  ```typescript
  LCD.LcdInit(39) // Initialize the LCD with I2C address 39 (0x27)
  LCD.LcdInit(0) // Initialize LCD after autodetection
  ```

### 2. Number display block

```typescript
//% blockId='I2C_LCD1620_SHOW_NUMBER' block="show number %n|at x %x|y %y'
export function ShowNumber(n: number, x: number, y: number): void
```

- 🔹 Description

  - This block outputs a number at a specific position (x, y).
  - It calls ShowString() after converting the number to a string.

- ✅ Usage example

  ```typescript
  LCD.ShowNumber(123, 0, 0) // print '123' at position (0,0)
  ```

### 3. String display block

```typescript
//% blockId='I2C_LCD1620_SHOW_STRING' block="show string %s|at x %x|y %y'
export function ShowString(s: string, x: number, y: number): void
```

- 🔹 Description

  - Displays a string at a specific position (x, y).

- 🔹 Internal behavior

  - cmd(a) → set cursor position (0x80 + x or 0xC0 + x)
  - dat(s.charCodeAt(i)) → Send character to LCD one by one

- ✅ Usage example

  ```typescript
  LCD.ShowString('Hello', 0, 0) // print 'Hello' at position (0,0)
  LCD.ShowString('World', 5, 1) // Displays 'World' at position (5,1)
  ```

### 4. LCD ON/OFF block

```typescript
//% blockId='I2C_LCD1620_ON' block="turn on LCD'
export function on(): void

//% blockId='I2C_LCD1620_OFF' block="turn off LCD'
export function off(): void
```

- 🔹 Description

  - on() → command to switch on the LCD screen (cmd(0x0C))
  - off() → Command to switch off the LCD screen (cmd(0x08))

- ✅ Usage example

  ```typescript
  LCD.on() // Switch on the LCD
  LCD.off() // switch off the LCD
  ```

### 5. Screen clear block

```typescript
//% blockId='I2C_LCD1620_CLEAR' block="clear LCD'
export function clear(): void
```

- 🔹 Description

  - Initializes the LCD screen by sending the cmd(0x01) command.
  - Move the cursor to the (0,0) position.

- ✅ Usage example

  ```typescript
  LCD.clear() // Clear the screen
  ```

### 6. Backlight ON/OFF block

```typescript
//% blockId='I2C_LCD1620_BACKLIGHT_ON' block="turn on backlight'
export function BacklightOn(): void

//% blockId='I2C_LCD1620_BACKLIGHT_OFF' block="turn off backlight'
export function BacklightOff(): void
```

- 🔹 Description

  - BacklightOn() → LCD backlight on (BK = 8)
  - BacklightOff() → turn off LCD backlight (BK = 0)

- ✅ Usage example

  ```typescript
  LCD.BacklightOn() // switch the backlight on
  LCD.BacklightOff() // switch off the backlight
  ```

### 7. Screen Shift block

```typescript
//% blockId='I2C_LCD1620_SHL' block="Shift Left'
export function shl(): void

//% blockId='I2C_LCD1620_SHR' block="Shift Right'
export function shr(): void
```

- 🔹 Description

  - shl() → Shift LCD screen left (cmd(0x18))
  - shr() → Shift the LCD screen to the right (cmd(0x1C))

- ✅ Usage example

  ```typescript
  LCD.shl() // Move the screen to the left
  LCD.shr() // move the screen to the right
  ```

> Open this page at [https://bplab-dev.github.io/pxt-bplab-lcd/](https://bplab-dev.github.io/pxt-bplab-lcd/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

- open [https://makecode.microbit.org/](https://makecode.microbit.org/)
- click on **New Project**
- click on **Extensions** under the gearwheel menu
- search for **[https://github.com/bplab-dev/pxt-bplab-lcd]** and import

## Edit this project

To edit this repository in MakeCode.

- open [https://makecode.microbit.org/](https://makecode.microbit.org/)
- click on **Import** then click on **Import URL**
- paste **[https://github.com/bplab-dev/pxt-bplab-lcd]** and click import

### Metadata (used for search, rendering)

- for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
