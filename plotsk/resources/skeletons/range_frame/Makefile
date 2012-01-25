target_filename=plot

${target_filename}.html:
	jade ${target_filename}.jade

range_frame.js:
	coffee -c scripts/range_frame.coffee

html: ${target_filename}.html

scripts: range_frame.js

all: html scripts

view: html scripts
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --disk-cache-size=1 --media-cache-size=1 --allow-file-access-from-files  ${target_filename}.html

clean:
	rm ${target_filename}.html
	rm scripts/range_frame.js