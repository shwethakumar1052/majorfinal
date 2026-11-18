import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1400,900")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:3000/")
time.sleep(3)
title = driver.title
print("Page Title:", title)
driver.save_screenshot("results_figures/Figure_6_1_Home_Page.png")
print("Screenshot saved successfully!")
driver.quit()
