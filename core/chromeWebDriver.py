#!/usr/bin/env python
# coding=utf-8
from selenium import webdriver 
from selenium.webdriver.chrome.options import Options 
from config import conf
import time

class chromeWebDriver(object):
    def __init__(self, path):
        self.path = path
        self.weblist = conf["weblist"]

    

    def chromeDriver(self):
        chromeOptions = Options()
        chromeOptions.add_argument("--load-extension=" + self.path)
        # chromeOptions.add_argument("--headless")

        driver = webdriver.Chrome(chrome_options=chromeOptions)
        # driver.set_page_load_timeout(5)

        for url in self.weblist:
            driver.get(url)
            print("[*] visiting: " + url)
            # time.sleep(1)
        driver.close()


    def run(self):
        self.chromeDriver()