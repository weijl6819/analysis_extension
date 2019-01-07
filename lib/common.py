import zipfile
import os
import re 
from config import conf

def log(text):
    def decorator(func):
        def wrapper(*args, **kw):
            print("{} {}".format(text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator


def zip2filelist(filepath=""):
    with open(filepath, "r") as zip_ref:
        return zip_ref.namelist()

@log("execute")
def readFile2txt(filename=""):
    with open(filename, "r") as rf:
        return rf.read()

@log("execute")
def zip2file(filename):
    """ filepath = "tmp/nalnkmjbaomnpcdlajhghkaolligpfkg.crx" """
    if(zipfile.is_zipfile(filename)):
        _zipfile = zipfile.ZipFile(filename, "r")
        try:
            filepath = conf["storepath"] + filename.split("/")[-1].split(".")[0]
            os.system("mkdir " + filepath)
            _zipfile.extractall(filepath)
        except Exception as e:
            print(e)
        finally:
            _zipfile.close

        return True
    else:
        return False
    

    
#     with open(filepath, "r") as zip_ref:
#         filename = conf["storepath"] + filepath.split("/")[-1].split(".")[0]
#         os.system("mkdir " + filename)
#         zip_ref.extractall(filename)

@log("inject to file")
def injectfile2file(file, inject_file):
    """check if injected, tag is sn00ker_ahahaha"""
    content = readFile2txt(file)
    inject_tag = conf["inject_tag"]
    inject_data = readFile2txt(inject_file)
    if(re.findall(inject_tag, content) == []):
        
        content = inject_data + '\n//' + inject_tag + '\n' + content
        print(content)
    else:
        content = content.split(inject_tag)[-1]
        content = inject_data + '\n//' + inject_tag + '\n' + content
        print(content)
    
    with open(file, "w") as wf:
        wf.write(content)

