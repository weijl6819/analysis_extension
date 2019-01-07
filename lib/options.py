#!/usr/bin/env python
# coding=utf-8
import click
from core.chromeStaticAnalysis import chromeStaticAnalysis
from core.chromeWebDriver import chromeWebDriver


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



@option_init.command("webdriver", help="run webdriver with extension")
@click.pass_context
@click.option("-p", "--path", default="", type=str, help="input the extension path")
def webdriver(ctx, path):
    print(path)

    driver = chromeWebDriver(path)
    driver.run()