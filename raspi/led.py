import RPi.GPIO as GPIO
import time

Led = 11

def setup():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(Led, GPIO.OUT)
    GPIO.output(Led, GPIO.HIGH)

def loop():
    while True:
        print('...led on')
        GPIO.output(Led, GPIO.LOW)
        time.sleep(0.5)
        print('led off...')
        GPIO.output(Led, GPIO.HIGH)
        time.sleep(0.5)

def destroy():
    GPIO.otput(Led, GPIO.HIGH)
    GPIO.cleanup()

if __name__ == '__main__':
    setup()
    try:
        loop()
    except KeyboardInterrupt:
        destroy()
