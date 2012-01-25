import simplejson as json
from pkg_resources import resource_filename, resource_string
import os
from util import *

class Plot (object):
    
    def __init__(self, skeleton='range_frame'):
        self.skeleton = skeleton
        
        self.data_series = {}
        self.plot_spec = {}
        self.load_default_plot_spec()
        self.plot_spec['lines'] = []
        
    def add_data(self, data, name, label=None, units=None):
        
        if label is None:
            label = name
        
        if units is None:
            units = ''
            
        self.data_series[name] = {'values' : list(data),
                                  'label' : label,
                                  'units' : units}
        
    def add_line(self, d1, d2, name=None, style=None):
        
        # if d1 refers to an existing data set
        if self.lookup_data(d1) is not None:
            d1 = self.lookup_data(d1)
        else:
            # choose a name for the new data set
            base_name = 'x'
            self.add_data(d1, self.new_valid_name(base_name))
        
        # if d2 refers to an existing data set
        if self.lookup_data(d2):
            d2 = self.lookup_data(d2)
        else:
            # choose a name for the new data set
            base_name = 'y'
            self.add_data(d1, self.new_valid_name(base_name))
        
        if style is None:
            style = {}
        
        if name is None:
            name = 'line_%d' % len(self.plot_spec['lines'])
        
        self.plot_spec['lines'].append({'name': name,
                                        'abscissa': d1,
                                        'ordinate': d2,
                                        'style': style})
    
    def lookup_data(self, d):
        
        # check if d is the "name" of an existing data set
        try:
            self.data_series[d]
            return d
        except:
            pass
        
        # check if d is a data object already in use in this plot
        for (key, val) in self.data_series:
            if d == val:
                return key
        
        return None
    
    def new_valid_data_name(self, base_name):
        ''' Generate a new, unique data set name using base_name as the
            stem for the name
        '''
        
        i = 0
        while True:
            name = "%s%d" % (base_name, i)
            if not name in self.data_series.keys():
                break
            i += 1
        
        return name
    
    @property
    def skeleton_path(self):
        # work out the skeleton path
        resource_path = resource_filename(top_level_module_name, 
                                          'resources/skeletons')
        skeleton_path = os.path.join(resource_path, self.skeleton)
        return skeleton_path
    
    def load_default_plot_spec(self):
        with open(os.path.join(self.skeleton_path, 
                               'default_plot_spec.json'), 'r') as f:
            dps = json.load(f)
            self.plot_spec.update(dps)
    
    def deploy_skeleton(self, target_path):
        'Copy the plot skeleton into the specified path'
        
        if not os.path.exists(self.skeleton_path):
            raise ValueError('Unknown plotsk skeleton')
        
        # check the proposed deployment path
        rsync(self.skeleton_path + '/', target_path)
            
        
    
    def show(self):
        "Display the plot in a web browser"
        
        pth = self.bake()
        print(pth)
        syscall('open %s/plot.html' % pth)
        
        
    def bake(self, target_path=None):
        "Bake the plot to a given local path"
        
        if target_path is None:
            import tempfile
            target_path = tempfile.mkdtemp()
        
        self.deploy_skeleton(target_path)
        
        data_path = os.path.join(target_path, 'data.json')
        plot_spec_path = os.path.join(target_path, 'plot_spec.json')
        
        with open(data_path, 'w') as f:
            json.dump(self.data_series, f)
            
        with open(plot_spec_path, 'w') as f:
            json.dump(self.plot_spec, f)
            
        return target_path