#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" distribute- and pip-enabled setup.py for plotsk """

from distribute_setup import use_setuptools
use_setuptools()
from setuptools import setup, find_packages

import os
import re


def recursive_get_paths(base_path):
    
    paths = []
    for root, dirnames, filenames in os.walk(base_path):
        # shift off the first path element
        split_root = root.split(os.sep)
        print split_root
        r = os.path.join(*split_root[1:])
        print r
        for filename in filenames:
            paths.append(os.path.join(r, filename))

    return paths

print recursive_get_paths('plotsk/resources')

setup(
    name='plotsk',
    version='dev',
    packages=['plotsk'],
    
    include_package_data=True,
    package_data= { 'plotsk' : recursive_get_paths('plotsk/resources') }
)
