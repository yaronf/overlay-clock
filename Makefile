version = $(shell jq -r .version manifest.json)

overlay-clock-$(version).zip:
	cd ..;  zip overlay-clock-$(version).zip overlay-clock/*
