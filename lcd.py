import pygame
import os
from time import sleep
import RPi.GPIO as GPIO
from socketIO_client import SocketIO
base = []

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_reconnect():
    print('reconnect')

def uptime(*args):
    print('uptime', args)
    base = args

def load(*args):
    print('load', args)
    base = args

def upstart(*args):
    print('upstart', args)
    base = args

def upend(*args):
    print('upend', args)
    base = args

socketIO = SocketIO('localhost', 3000)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)
socketIO.on('reconnect', on_reconnect)

# Listen
socketIO.on('uptime', uptime)
socketIO.on('load', load)
socketIO.on('upstart', upstart)
socketIO.on('upend', upend)
#socketIO.emit('aaa')
#socketIO.emit('aaa')
#socketIO.wait(seconds=1)
#
## Stop listening
#socketIO.off('aaa_response')
#socketIO.emit('aaa')
#socketIO.wait(seconds=1)
#
## Listen only once
#socketIO.once('aaa_response', on_aaa_response)
#socketIO.emit('aaa')  # Activate aaa_response
#socketIO.emit('aaa')  # Ignore
#socketIO.wait(seconds=1)
#
##button_map = {23:(255,0,0), 22:(0,255,0), 27:(0,0,255), 18:(0,0,0)}

GPIO.setmode(GPIO.BCM)
#for k in button_map.keys():
#    GPIO.setup(k, GPIO.IN, pull_up_down=GPIO.PUD_UP)

#WHITE = (255,255,255)
os.putenv('SDL_FBDEV', '/dev/fb1')
pygame.init()
pygame.mouse.set_visible(False)
lcd = pygame.display.set_mode((480, 320))
lcd.fill((255,0,0))
pygame.display.update()

font_big = pygame.font.Font(None, 100)

while True:
    elapsed = math.floor((time.mktime(datetime.datetime.now().timetuple()) * 1000 - base[0][1])/1000)
    if((elapsed/60)/base[0][2] < .5):
        color = ( 0 , math.floor(((elapsed/60)/base[0][2])*128), math.floor((128 - ((elapsed/60)/base[0][2])*128)))
    elif((elapsed/60)/base[0][2] < 1):
        color = (255, math.floor(255-((((elapsed/60)/base[0][2])-.5)*2)*255), 0)
    elif((elapsed/60)/base[0][2] > 1):
        color = (255, 0, 0)
    lcd.fill((255,0,0))

    min = math.floor(elapsed/60);
    hour = math.floor(min/60);
    elapsed = elapsed - (min*60);
    min = min - (hour*60);


    text_surface = font_big.render(hour + ":" + min + ":" +elapsed, True, WHITE)
    rect = text_surface.get_rect(center=(160,120))
    lcd.blit(text_surface, rect)
    pygame.display.update()
    sleep(0.1)
