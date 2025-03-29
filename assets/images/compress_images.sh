#!/bin/bash

find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read img; do
    width=$(identify -format "%w" "$img")
    height=$(identify -format "%h" "$img")

    if [ "$width" -gt "$height" ]; then
	mogrify -resize 1920x1080 -quality 75 "$img"
    elif [ "$width" -lt "$height" ]; then
	mogrify -resize 1080x1920 -quality 75 "$img"
    else
	mogrify -resize 1080x1080 -quality 75 "$img"
    fi
done
