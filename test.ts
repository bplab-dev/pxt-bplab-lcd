namespace lcdTest {
    // Set LCD I2C Address
    const LCD_ADDR = lcd.I2CLCDAddress.PCF8574;  // 39 (0x27) or use lcd.I2CLCDAddress.PCF8574A (63)

    /**
     * Test LCD initialization
     * Expected: LCD initializes with no errors
     */
    function testInit(): boolean {
        basic.showString("INIT");
        lcd.lcdInit(LCD_ADDR);
        basic.pause(500);
        return true;
    }

    /**
     * Test displaying strings on LCD
     * Expected: "Hello" on row 0 and "World!" on row 1
     */
    function testShowString(): boolean {
        basic.showString("STR");
        lcd.showString("Hello", 0, 0);
        lcd.showString("World!", 0, 1);
        basic.pause(2000);
        return true;
    }

    /**
     * Test displaying numbers on LCD
     * Expected: "1234" displayed at (4,0)
     */
    function testShowNumber(): boolean {
        basic.showString("NUM");
        lcd.showNumber(1234, 4, 0);
        basic.pause(2000);
        return true;
    }

    /**
     * Test clearing the LCD screen
     * Expected: Screen is cleared
     */
    function testClear(): boolean {
        basic.showString("CLR");
        lcd.clear();
        basic.pause(1000);
        return true;
    }

    /**
     * Test turning LCD ON and OFF
     * Expected: LCD turns off and back on with no errors
     */
    function testOnOff(): boolean {
        basic.showString("ON");
        lcd.on();
        basic.pause(1000);
        lcd.showString("ON Test", 0, 0);
        basic.pause(1000);

        basic.showString("OFF");
        lcd.off();
        basic.pause(1000);

        lcd.on(); // Restore LCD ON state
        return true;
    }

    /**
     * Test LCD backlight control
     * Expected: Backlight turns on and off with no issues
     */
    function testBacklight(): boolean {
        basic.showString("BL");
        lcd.backlightOn();
        lcd.showString("BL ON", 0, 0);
        basic.pause(1000);

        lcd.backlightOff();
        lcd.showString("BL OFF", 0, 1);
        basic.pause(1000);

        lcd.backlightOn(); // Restore backlight
        return true;
    }

    /**
     * Test shifting the display left and right
     * Expected: Text shifts left and then back right
     */
    function testShift(): boolean {
        basic.showString("SFT");
        lcd.showString("Shift Test", 0, 0);
        for (let i = 0; i < 5; i++) {
            lcd.shl();
            basic.pause(500);
        }
        for (let i = 0; i < 5; i++) {
            lcd.shr();
            basic.pause(500);
        }
        return true;
    }

    /**
     * Run all LCD test cases
     * Expected: If all tests pass, show a checkmark (✔)
     * If any test fails, show a cross (✖)
     */
    export function runTests() {
        basic.showIcon(IconNames.Happy);
        basic.pause(500);

        let allPassed = true;

        if (!testInit()) allPassed = false;
        if (!testShowString()) allPassed = false;
        if (!testShowNumber()) allPassed = false;
        if (!testClear()) allPassed = false;
        if (!testOnOff()) allPassed = false;
        if (!testBacklight()) allPassed = false;
        if (!testShift()) allPassed = false;

        // Display final test result
        if (allPassed) {
            basic.showIcon(IconNames.Yes);  // ✔ All tests passed
        } else {
            basic.showIcon(IconNames.No);   // ✖ Some tests failed
        }
    }
}

// 📌 **Run all tests**
lcdTest.runTests();
