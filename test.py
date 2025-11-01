import pyautogui
import time

pyautogui.keyDown('a')  # Hold 'a'
print("Holding 'a' — press any key...")
time.sleep(5)
pyautogui.keyUp('a')
print("Released.")   