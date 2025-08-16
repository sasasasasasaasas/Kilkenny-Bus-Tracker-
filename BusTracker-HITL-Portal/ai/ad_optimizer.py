#!/usr/bin/env python3
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ADS_FILE = ROOT / 'server' / 'data' / 'ads.json'


def load_ads():
	if ADS_FILE.exists():
		return json.loads(ADS_FILE.read_text())
	return []


def save_ads(ads):
	ADS_FILE.parent.mkdir(parents=True, exist_ok=True)
	ADS_FILE.write_text(json.dumps(ads, indent=2))


def sort_ads_by_underexposure(ads):
	return sorted(ads, key=lambda a: a.get('views', 0))


def main():
	ads = load_ads()
	if not ads:
		print('No ads yet.')
		return
	ads = sort_ads_by_underexposure(ads)
	save_ads(ads)
	print('Ads reordered by views (ascending)')

if __name__ == '__main__':
	main()