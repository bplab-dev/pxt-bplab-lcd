/**
 * I2C LCD 1602
 */
//% weight=1 color=#0fbc11 icon="\uf0ad"
namespace lcd {
    let i2cAddr: number // 0x3F: PCF8574A, 0x27: PCF8574
    let BK: number      // Backlight control (8: ON, 0: OFF)
    let RS: number      // Register selection(0: Command, 1: Data)

    export enum I2CLCDAddress {
        AutoDetect = 0,
        PCF8574 = 39,   // 0x27
        PCF8574A = 63   // 0x3f
    }

    export enum LCDCommand {
        NOP = 0x00,             // NOP(No Operation): Do nothing. Use for delay or synchronization
        ClearDisplay = 0x01,    // Clear everything on the screen and move the cursor to the home position (0,0). Wait 1.52 ms after execution
        EntryModeSet = 0x06,    // Set cursor movement direction to right. Cursor automatically moves to the right when typing text

        DisplayOff = 0x08,      // Turn off the display. Data is retained
        DisplayOn = 0x0C,       // Turn on the screen and hide the cursor
        ShiftDisplayLeft = 0x18,    // Move full-screen content one space to the left
        ShiftDisplayRight = 0x1C,    // Move full-screen content one space to the right

        Set4bitMode = 0x28,    // Set 4-bit mode, two-line display, 5x8 dot font
        Set4bitModeInit = 0x33, // Initiate 4-bit mode initialization.

        AddrTo0 = 0x80  // Move the cursor to the start of the first line Set the DDRAM address to 0
    }

    // LCD register setup
    function _setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    // Send data through I2C bus
    function _set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        _setreg(d)
        _setreg(d + 4)
        _setreg(d)
    }

    // Send command
    function _cmd(d: number) {
        RS = 0
        _set(d)
        _set(d << 4)
    }

    // Send data
    function _dat(d: number) {
        RS = 1
        _set(d)
        _set(d << 4)
    }

    // Auto detect LCD address
    function _autoAddr() {
        let k = true
        let addr = 0x20
        let d1 = 0, d2 = 0
        while (k && (addr < 0x28)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr

        addr = 0x38
        while (k && (addr < 0x40)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr
        else return 0
    }

    /**
     * Initialize LCD and set I2C address. PCF8574/PCF8574A address is 39/63
     * @param Addr LCD i2c address, eg: 0, 39, 63. 0 for auto detection
     */
    //% blockId="I2C_LCD1620_SET_ADDRESS" block="LCD initialize with Address %addr"
    //% weight=100 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    //% help=github:bplab-dev/pxt-bplab-lcd/README
    export function lcdInit(Addr: I2CLCDAddress) {
        if (Addr == 0) i2cAddr = _autoAddr()
        else i2cAddr = Addr
        BK = 8
        RS = 0
        _cmd(LCDCommand.Set4bitModeInit)       // Set 4-bit mode
        basic.pause(5)
        _set(0x30)
        basic.pause(5)
        _set(0x20)
        basic.pause(5)
        _cmd(LCDCommand.Set4bitMode)       // Set mode
        _cmd(LCDCommand.DisplayOn)
        _cmd(LCDCommand.EntryModeSet)
        _cmd(LCDCommand.ClearDisplay)       // Clear screen
    }

    /**
     * Display number at specified position on LCD
     * @param n number to display, eg: 10, 100, 200
     * @param x LCD column position, eg: 0
     * @param y LCD row position, eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_NUMBER" block="show number %n|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% parts=LCD1602_I2C trackArgs=0
    export function showNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        showString(s, x, y)
    }

    /**
     * Display string at specified position on LCD
     * @param s string to display, eg: "Hello"
     * @param x LCD column position, [0 - 15], eg: 0
     * @param y LCD row position, [0 - 1], eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_STRING" block="show string %s|at x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    //% parts=LCD1602_I2C trackArgs=0
    export function showString(s: string, x: number, y: number): void {
        let a: number

        if (y > 0)
            a = 0xC0
        else
            a = 0x80
        a += x
        _cmd(a)

        for (let i = 0; i < s.length; i++) {
            _dat(s.charCodeAt(i))
        }
    }

    /**
     * Turn on LCD
     */
    //% blockId="I2C_LCD1620_ON" block="turn on LCD"
    //% weight=81 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function on(): void {
        _cmd(LCDCommand.DisplayOn)
    }

    /**
     * Turn off LCD
     */
    //% blockId="I2C_LCD1620_OFF" block="turn off LCD"
    //% weight=80 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function off(): void {
        _cmd(LCDCommand.DisplayOff)
    }

    /**
     * Clear all display contents
     */
    //% blockId="I2C_LCD1620_CLEAR" block="clear LCD"
    //% weight=85 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function clear(): void {
        _cmd(LCDCommand.ClearDisplay)
    }

    /**
     * Turn on LCD backlight
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_ON" block="turn on backlight"
    //% weight=71 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function backlightOn(): void {
        BK = 8
        _cmd(LCDCommand.NOP)
    }

    /**
     * Turn off LCD backlight
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_OFF" block="turn off backlight"
    //% weight=70 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function backlightOff(): void {
        BK = 0
        _cmd(LCDCommand.NOP)
    }

    /**
     * Shift display left
     */
    //% blockId="I2C_LCD1620_SHL" block="Shift Left"
    //% weight=61 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function shl(): void {
        _cmd(LCDCommand.ShiftDisplayLeft)
    }

    /**
     * Shift display right
     */
    //% blockId="I2C_LCD1620_SHR" block="Shift Right"
    //% weight=60 blockGap=8
    //% parts=LCD1602_I2C trackArgs=0
    export function shr(): void {
        _cmd(LCDCommand.ShiftDisplayRight)
    }
}
