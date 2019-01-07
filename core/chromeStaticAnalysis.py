#!/usr/bin/env python
# coding=utf-8
from lib.common import readFile2txt, injectfile2file, zip2file
from core.chromeWebDriver import chromeWebDriver
from config import conf
import json

class chromeStaticAnalysis(object):
    
    def __init__(self):
        super(chromeStaticAnalysis, self).__init__()
        self.path = conf["path"]
        self.manifest = ""
        self.extension_path = ""
        self.level = 'safe'

    def process_background(self, bks_arr):
        inject_file = conf["inject_background_path"]
        if "scripts" in bks_arr:
            for script in bks_arr["scripts"]:
                print(script)
                scriptpath = self.extension_path + "/" + script
                injectfile2file(scriptpath, inject_file)

        elif "page" in bks_arr:
            print(bks_arr["page"])

    
    def process_content(self, cts_arr):
        inject_file = conf["inject_content_path"]
        for scripts in cts_arr:
            if "js" in scripts:
                print(scripts["js"])
                for script in scripts["js"]:

                # print(script)
                    filename = self.extension_path + "/" + script
                    injectfile2file(filename, inject_file)
                
            # 处理 content_scripts 代码


    def process_permission(self, pm_arr):
        # 处理 permissions 代码
        
        pass

    def analysis_manifest(self):
        manifest_data = readFile2txt(self.manifest)
        
        manifest_data_json = json.loads(manifest_data)
        print(manifest_data_json)
        if("permissions" in manifest_data_json):
            print(manifest_data_json["permissions"])

        if("background_page" in manifest_data_json):
            print(manifest_data_json["background_page"])
            # self.process_background(manifest_data_json["background_page"])

        if("background" in manifest_data_json):
            print(manifest_data_json["background"])
            # print(manifest_data_json["background"]["scripts"])
            self.process_background(manifest_data_json["background"])

        if("content_scripts" in manifest_data_json):
            print(manifest_data_json["content_scripts"])
            self.process_content(manifest_data_json["content_scripts"])

        path = self.extension_path
        driver = chromeWebDriver(path)
        driver.run()

    def loader(self):
        with open(conf["namelist"], "r") as rf:
            lines = rf.readlines()
            for line in lines:
                filename = self.path + line.strip()
                if(zip2file(filename)):
                    self.extension_path = conf["storepath"] + line.split(".")[0].strip()
                    self.manifest = self.extension_path + "/manifest.json"
                    # import pdb;pdb.set_trace()
                    self.analysis_manifest()
                
                


    def run(self):
        self.loader()
        