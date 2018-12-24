from lib.common import readFile2txt
from config import conf

class chromeStaticAnalysis(object):
    
    def __init__(self):
        super(chromeStaticAnalysis, self).__init__()
        self.manifest = conf["manifest"]
    
    def analysis_manifest(self):
        
        background_lists = readFile2txt(self.manifest)
        print(background_lists)

    def run(self):
        self.analysis_manifest()