#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" distribute- and pip-enabled setup.py """

from distribute_setup import use_setuptools
use_setuptools()
import setuptools

def subdir_findall(dir, subdir):
    strip_n = len(dir.split('/'))
    path = '/'.join((dir, subdir))
    return ['/'.join(s.split('/')[strip_n:]) for s in setuptools.findall(path)]

setuptools.setup(
    name='plotsk',
    version='dev',
    packages=setuptools.find_packages(),
    
    package_data= { 'plotsk' : subdir_findall('plotsk', 'resources') },
    include_package_data=True
)
