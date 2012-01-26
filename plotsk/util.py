import os
import re
from pkg_resources import resource_filename, resource_string
import simplejson as json
import shlex
import shutil
import subprocess
from mako.template import Template
import urllib
import time
from contextlib import contextmanager
from ConfigParser import SafeConfigParser

top_level_module_name = 'plotsk'

# Configuration details

def read_config(cfg_path):
    cp = SafeConfigParser()
    cp.read(cfg_path)
    
    d = {}
    for section in cp.sections():
        d.update(dict(cp.items(section)))
    return d

def default_config():
    return read_config(resource_filename(top_level_module_name, 
                                  'resources/config/default.config'))

def load_config():
    # check for .plotsk in ~/
    user_config_filename = os.path.expanduser('~/.plotsk')
    if os.path.exists(user_config_filename):
        return read_config(user_config_filename)
    # shortcut
    return default_config()

config = load_config()

# work around bizarro pkg_resources / MACOSX_DEPLOYMENT_TARGET insanity
def syscall(cmd):
    os.unsetenv('MACOSX_DEPLOYMENT_TARGET')
    return subprocess.call(shlex.split(str(cmd)))


def rsync(src, dst):
    cmd = Template(config['sync_cmd']).render(src_path=src, dst_path=dst)
    syscall(cmd)
    
def coffeescript_compile(src_path):
    script_path = os.path.join(src_path, 'scripts')
    cmd = Template(config['script_compile_cmd']).render(script_path=script_path)
    syscall(cmd)
