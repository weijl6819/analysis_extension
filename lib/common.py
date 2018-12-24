import zipfile
import os

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

def readFile2txt(filename=""):
    with open(filename, "r") as rf:
        return rf.read()

@log("execute")
def zip2file(filepath):
    """ filepath = "tmp/sdfasdfadsfasfdasf.crx" """
    with open(filepath, "r") as zip_ref:
        filename = "snooker/" + filepath.split("/")[1].split(".")[0]
        os.system("mkdir " + filename)
        zip_ref.extractall(filename)


