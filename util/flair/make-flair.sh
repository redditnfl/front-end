#!/bin/bash
# https://stackoverflow.com/a/4774063
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

missing=0
for cmd in make xsltproc inkscape montage convert mogrify pngcrush; do
    if ! command -v $cmd &>/dev/null; then
        echo "Missing command: $cmd"
        missing=1
    fi
done
if [ $missing -ne 0 ]; then
    exit
fi


outdir=output/$(date +%Y-%m-%d)

mkdir -p $outdir

(
while read url fn; do
    if [ ! -f "$outdir/$fn" ]; then
        wget -nv $url -O $outdir/$fn
    fi
done
) <<-URLS
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/application-shell/shield/default.svg 00_nfl_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/ARI.svg  01_cardinals_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/ATL.svg  02_falcons_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/BAL.svg  03_ravens_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/BUF.svg  04_bills_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/CAR.svg  05_panthers_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/CHI.svg  06_bears_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/CIN.svg  07_bengals_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/CLE.svg  08_browns_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/DAL.svg  09_cowboys_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/DEN.svg  10_broncos_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/DET.svg  11_lions_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/GB.svg   12_packers_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/HOU.svg  13_texans_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/IND.svg  14_colts_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/JAX.svg  15_jaguars_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/KC.svg   16_chiefs_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/LV.svg   17_raiders_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/LAC.svg  18_chargers_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/LA.svg   19_rams_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/MIA.svg  20_dolphins_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/MIN.svg  21_vikings_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/NE.svg   22_patriots_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/NO.svg   23_saints_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/NYG.svg  24_giants_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/NYJ.svg  25_jets_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/PHI.svg  26_eagles_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/PIT.svg  27_steelers_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/SF.svg   28_49ers_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/SEA.svg  29_seahawks_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/TB.svg   30_buccaneers_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/TEN.svg  31_titans_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/teams/WAS.svg  32_redskins_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/league/NFC.svg 33_nfc_logo.svg
    https://static.nfl.com/static/content/public/static/wildcat/assets/img/logos/league/AFC.svg 34_afc_logo.svg
URLS

pushd "$outdir"
# The Giants are... special.
xsltproc -o temp $SCRIPTPATH/giants-red-blue.xslt 24_giants_logo.svg && mv -f temp 24_giants_logo.svg
make -f $SCRIPTPATH/Makefile -j8
popd
