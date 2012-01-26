#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" distribute- and pip-enabled setup.py """

import logging
import os

setup_tools_fallback = False # fallback to setuptools if distribute isn't found
skip_tests = True # don't include subdir named 'tests' in package_data

debug = True

if debug: logging.basicConfig(level=logging.DEBUG)
# distribute import and testing
try:
    import distribute_setup
    distribute_setup.use_setuptools()
    logging.debug("distribute_setup.py imported and used")
except ImportError:
    # fallback to setuptools?
    # distribute_setup.py was not in this directory
    if not (setup_tools_fallback):
        import setuptools
        if not (hasattr(setuptools,'_distribute') and \
                setuptools._distribute):
            raise ImportError("distribute was not found and fallback to setuptools was not allowed")
        else:
            logging.debug("distribute_setup.py not found, defaulted to system distribute")
    else:
        logging.debug("distribute_setup.py not found, defaulting to system setuptools")

import setuptools


def package_to_path(package):
    """
    Convert a package (as found by setuptools.find_packages)
    e.g. "foo.bar" to usable path
    e.g. "foo/bar"

    No idea if this works on windows
    """
    return package.replace('.','/')

def find_subdirectories(package):
    """
    Get the subdirectories within a package
    This will include resources (non-submodules) and submodules
    """
    try:
        subdirectories = os.walk(package_to_path(package)).next()[1]
    except StopIteration:
        subdirectories = []
    return subdirectories

def subdir_findall(dir, subdir):
    """
    Find all files in a subdirectory and return paths relative to dir

    This is similar to (and uses) setuptools.findall
    However, the paths returned are in the form needed for package_data
    """
    strip_n = len(dir.split('/'))
    path = '/'.join((dir, subdir))
    return ['/'.join(s.split('/')[strip_n:]) for s in setuptools.findall(path)]

def find_package_data(packages):
    """
    For a list of packages, find the package_data

    This function scans the subdirectories of a package and considers all
    non-submodule subdirectories as resources, including them in
    the package_data

    Returns a dictionary suitable for setup(package_data=<result>)
    """
    package_data = {}
    for package in packages:
        package_data[package] = []
        for subdir in find_subdirectories(package):
            if '.'.join((package, subdir)) in packages: # skip submodules
                logging.debug("skipping submodule %s/%s" % (package, subdir))
                continue
            if skip_tests and (subdir == 'tests'): # skip tests
                logging.debug("skipping tests %s/%s" % (package, subdir))
                continue
            package_data[package] += subdir_findall(package_to_path(package), subdir)
    return package_data

packages = setuptools.find_packages()

package_data = find_package_data(packages)

package_name = packages[0]

if debug:
    logging.debug("Module name: %s" % package_name)
    for package in packages:
        logging.debug("Package: %s" % package)
        logging.debug("\tData: %s" % str(package_data[package]))

setuptools.setup(
    name = package_name,
    version = 'dev',
    packages = packages,
    
    package_data = package_data,
    include_package_data = True
)
