INKSCAPE=inkscape
MONTAGE=montage
CONVERT=convert
MOGRIFY=mogrify
PNGCRUSH=pngcrush

SIZE=80x80+0+0

SVGS=$(sort $(wildcard *.svg))
FULLS=$(SVGS:.svg=.full.png)
FLAIRS=$(SVGS:.svg=.flair.png)
CROPPED=$(SVGS:.svg=.cropped.png)

OUTPUT=flair.png


%.full.png: %.svg
	$(INKSCAPE) $^ --export-png=$@ -w2000

%.cropped.png: %.full.png
	$(CONVERT) -verbose -trim -geometry 1000x +repage $^ $@

%.flair.png: %.cropped.png
	$(CONVERT) -filter lanczos -resize $(SIZE) $^ $@

$(OUTPUT): $(FLAIRS)
	$(MONTAGE) -verbose -geometry $(SIZE) -background none -tile 1x $^ "$@_unopt"
	$(PNGCRUSH) -brute "$@_unopt" "$@"
	$(RM) "$@_unopt"

all: $(OUTPUT)

.SECONDARY: $(FULLS) $(CROPPED) $(FLAIRS)
.PHONY: clean
clean:
	$(RM) $(FULLS) $(CROPPED) $(FLAIRS) $(OUTPUT)
