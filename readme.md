# Plotsk: a python/coffeescript/d3.js-based library for plotting data in a web browser

## Why?

* Plotting is really important for science --- both exploratory analysis and for publication quality figures

* Cross-platform plotting is hard.  Many existing solutions either produce bad looking results, or are painful to get working in a cross-platform way, or (usually) both.  Matplotlib is the primary tool available for numpy/scipy users, but it is periodically a nightmare to get working (esp. on Mac OS X), and the output is frequently not pretty.  Getting things looking the way I want them often feels like trying to type with chopsticks taped to my fingers from a foot away.

* Web browsers are just about the only reliable cross platform GUI tools.  Thankfully, in combination with javascript libraries like D3.js, they are also super awesome.

**BUT**

* I don't want to analyze my data in Javascript in a browser... I just want to plot it there; the tools just aren't available in JS for the analysis side of things. Also, using D3 directly, while rewarding in its own way, is not something I want to do every time I want to see "x" plotted versus "y".

## What?

**Plotsk** is a python library that bridges between numpy/scipy analysis and plotting in a web browser.  Plotsk stands for "PLOT SKeletons": it allows you to specify (or create your own) JS or coffeescript skeleton into which your data is plotted.  The python layer itself is very very thin, with an emphasis of getting reasonable looking plots up on the screen with as little fuss as possible.  At the same time, for publication figures, or for presentation showpieces, you have the option of "baking" the figure skeleton and editing it directly (e.g. to add as much interactive JS/D3 stuff as you like)


## Caveats

I *just* started writing this.  It's not complete.  Support for many of the standard plot types isn't there yet, since skeletons for them haven't been written yet.  Lots of potential features that I want to add (including very basic ones) aren't there yet.