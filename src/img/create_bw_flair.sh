#!/bin/bash
rm -f red_wagon_80.png bws.png logos-160x80--bw.png logos-160x80--bw_temp.png

# Create small bandwagon
convert -geometry 80x red_wagon.png red_wagon_80.png

# Create vertically tiled bandwagons
convert -size 80x2640 -compose Copy tile:red_wagon_80.png -fill transparent PNG32:bws.png

# Combine the two
montage logos-80x80.png bws.png -background none -tile 2x1 -gravity north -geometry +0+0 PNG32:logos-160x80--bw_temp.png
pngcrush -brute logos-160x80--bw_temp.png logos-160x80--bw.png

ls -l

rm -f red_wagon_80.png logos-160x80--bw_temp.png bws.png
