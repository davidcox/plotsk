#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" distribute- and pip-enabled setup.py for plotsk """

from distribute_setup import use_setuptools
use_setuptools()
from setuptools import setup

import re

setup(
    name='plotsk',
    version='dev',
    include_package_data=True,
)
