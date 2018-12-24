import click 
from core.chromeStaticAnalysis import chromeStaticAnalysis
# def log(text):
#     def decorator(func):
#         def wrapper(*args, **kw):
#             print("{} {}".format(text, func.__name__))    
#             return func(*args, **kw)
#         return wrapper
#     return decorator

@click.group()
@click.pass_context
def option_init(ctx):
    pass 


@option_init.command("run", help="I know nothing")
@click.pass_context
@click.option("-n", "--name", default = "", type=str, help="input your name")
def run(ctx, name):
    print(name)
    
    csanalysis = chromeStaticAnalysis()
    csanalysis.run()
    # print(name)

# @option_init.command("wtf",)