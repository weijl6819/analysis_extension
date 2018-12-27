from lib.common import readFile2txt
from config import conf
import json

class chromeStaticAnalysis(object):
    
    def __init__(self):
        super(chromeStaticAnalysis, self).__init__()
        self.manifest = conf["manifest"]

    def process_background(self, bks_arr):
        # 处理 background 代码
        pass
    
    def process_content(self, cts_arr):
        # 处理 content_scripts 代码
        pass

    def process_permission(self, pm_arr):
        # 处理 permissions 代码
        pass

    def analysis_manifest(self):
        manifest_data = readFile2txt(self.manifest)
        manifest_data_json = json.loads(manifest_data)
        # import pdb;pdb.set_trace()

        if("background" in manifest_data_json):
            print(manifest_data_json["background"]["scripts"])
            self.process_background(manifest_data_json["background"]["scripts"])

        if("content_scripts" in manifest_data_json):
            print(manifest_data_json["content_scripts"])

        if("permissions" in manifest_data_json):
            print(manifest_data_json["permissions"])

    def run(self):
        self.analysis_manifest()