#!/bin/bash

IMAGEURL=$1
IMAGENAME=$2
TITLE=$3
TEXT=$4

DEFNAME=$(LC_ALL=C TZ='America/New_York' date +%b%d)

command -v convert >/dev/null 2>&1 || { echo >&2 "Imagemagick convert is required."; exit 1; }

read -ep "Image URL: " IMAGEURL
read -ep "Image name (in stylesheet, will be prefixed with SB-, default $DEFNAME): " IMAGENAME
read -ep "Title: " TITLE
read -ep "Text body (may be blank): " TEXT

echo "IMAGEURL=$IMAGEURL"
echo "IMAGENAME=$IMAGENAME"
echo "TITLE=$TITLE"
echo "TEXT=$TEXT"

if [ -z "$IMAGENAME" ]; then
    IMAGENAME=$DEFNAME
fi
if [ -z "$TITLE" -o -z "$IMAGEURL" ]; then
    echo "Title or URL can not be empty"
    exit 1
fi

set -e
set -x

IMAGEWIDTH=300
BRANCH="develop"

git checkout $BRANCH
git pull

if [ $? -gt 0 ]; then
    exit 1
fi

temploc=$(mktemp --tmpdir sbpic.XXXXXX)
temploc_sbwidth=$(mktemp --tmpdir sbpic_sbwidth.XXXXXX)
finalloc=src/assets/temp-img/SB-$IMAGENAME.jpg
DOUBLEIMAGEWIDTH=$(expr $IMAGEWIDTH \* 2)

wget -O $temploc "$IMAGEURL"
convert -resize "${DOUBLEIMAGEWIDTH}>x" "$temploc" "$finalloc"
convert -resize "${IMAGEWIDTH}x" "$temploc" "$temploc_sbwidth"
HEIGHT=$(identify -format "%h" "$temploc_sbwidth")
rm -f "$temploc" "$temploc_sbwidth"

sed -i src/scss/_controls.scss \
    -e "s#^\$sidebarImage: .*#\$sidebarImage: \"../img/SB-$IMAGENAME.jpg\";#" \
    -e "s#^\$sidebarHeader: .*#\$sidebarHeader: \"$TITLE\";#" \
    -e "s|^\$sidebarText: .*|\$sidebarText: \"$TEXT\";|" \
    -e "s#^\$sidebarPicHeight: .*#\$sidebarPicHeight: ${HEIGHT}px;#"

git add "$finalloc"
git add src/scss/_controls.scss

set +x

echo
echo "Sidebar added, now commit and push it"
