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

top_level_module_name = 'plotsk'

# Configuration details
def default_config():
    return json.loads(resource_string(top_level_module_name, 
                                      'resources/config/default.json'))

def load_config():
    # check for .showboat.json in ~/
    user_config_filename = os.path.expanduser('~/.plotsk')
    if os.path.exists(user_config_filename):
        with open(user_config_filename, 'r') as f:
            return json.load(f)
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