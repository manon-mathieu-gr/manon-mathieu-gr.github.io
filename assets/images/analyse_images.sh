#!/bin/bash

find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read img; do
    width=$(identify -format "%w" "$img")
    height=$(identify -format "%h" "$img")

    if [ "$width" -gt "$height" ]; then
        echo "Landscape: $img ($width x $height)"
	identify -format '%Q\n' $img
    elif [ "$width" -lt "$height" ]; then
        echo "Portrait: $img ($width x $height)"
	identify -format '%Q\n' $img
    else
        echo "Square: $img ($width x $height)"
	identify -format '%Q\n' $img
    fi
done
