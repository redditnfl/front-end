#!/bin/bash
BRANCH="r-nfldev"

git checkout $BRANCH
git pull

team=$1
file=src/scss/modules/_variables.scss
sed "s/\(.*$team.*eliminated: \)\(false\|true\)\(.*\)/\1false\3/" $file > $file.temp 
mv -f $file.temp $file
git diff
