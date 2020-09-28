version = $(shell jq -r .version manifest.json)

# Firefox
overlay-clock-$(version).xpi:
	cd ..; zip -r  --junk-paths overlay-clock-$(version).xpi ./overlay-clock/*

# Chrome
overlay-clock-$(version).zip:
	cd ..; zip overlay-clock-$(version).zip overlay-clock/*
