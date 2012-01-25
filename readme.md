# Plotsk

## A python/coffeescript/d3.js-based library for plotting data in a web browser

## Why?

Plotting is really important for science --- both exploratory analysis and for publication quality figures.

However, cross-platform plotting is hard.  Many existing solutions either produce bad looking results, or are painful to get working in a cross-platform way, or (usually) both.  Matplotlib is the primary tool available for numpy/scipy users, but it is periodically a nightmare to get working (esp. on Mac OS X), and the output is frequently not pretty.  Getting things looking the way I want them often feels like trying to type with chopsticks taped to my fingers from a foot away.

Web browsers are just about the only reliable cross platform GUI tools.  Thankfully, in combination with javascript libraries like D3.js, they are also super awesome.

**BUT**

I don't want to analyze my data in Javascript in a browser... I just want to plot it there; the tools just aren't available in JS for the analysis side of things. Also, using D3 directly, while rewarding in its own way, is not something I want to do every time I want to see "x" plotted versus "y".

## What is Plotsk

**Plotsk** is a python library that bridges between numpy/scipy analysis and plotting in a web browser.  Plotsk stands for "PLOT SKeletons": it allows you to specify (or create your own) JS or coffeescript skeleton with which your data is plotted.  The python layer itself is very very thin, basically just deploying the skeleton and outputting the data-to-be-plotted in json format. The emphasis is on getting reasonable-looking plots up on the screen with as little fuss as possible.  At the same time, for publication figures, or for presentation showpieces, you have the option of "baking" the figure skeleton and editing it directly (e.g. to add as much interactive JS/D3 stuff as you like).  You can also create your own personal skeletons (either using the existing one as starting points, or starting from scratch) if you like things to look a particular way or if you want to build-in functionality or plot-types that Plotsk doesn't ship with.  Plotsk tries to exist as much as possible at the level of semantics, allowing the details of appearance to be under your control when you want them to be.

## Installation

To install plotsk, clone the project and then type the following command in the top-level directory:
  
    pip install -r requirements.txt .
    
    # ... or, if you want to edit things
    pip install -r requirements.txt -e .

## Usage

Plotsk endeavors to provide a simple clean interface:

    import plotsk
  
    p = plotsk.Plot()  # also possible to specify skeleton = 'xxx'
    p.add_line(x, y1, style_dict)  # implicitly name 'x' and 'y'
    p.add_line(x, y2)

    # ... or ...
    p.add_data(x, 'x')
    p.add_data(y1, 'y')
    p.add_line('x', 'y', '-*')

    # launch a browser and display the figure
    p.show()

    # save the figure html/js/css to a path
    bake_path = "/path/to/baked/figure/files"
    p.bake(bake_path)
  
More functionality on the way...

## Caveats

I *just* started writing this.  It's not complete.  Support for many of the standard plot types isn't there yet, since skeletons for them haven't been written yet.  Lots of potential features that I want to add (including very basic ones) aren't there yet.