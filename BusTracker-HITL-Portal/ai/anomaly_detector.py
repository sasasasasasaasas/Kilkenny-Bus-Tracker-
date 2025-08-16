#!/usr/bin/env python3
import sys
import json

# Reads a JSON event from stdin and emits a severity score
# Example:
#   echo '{"message": "potential theft detected"}' | python ai/anomaly_detector.py

KEYWORDS = {
	"theft": 9,
	"weapon": 9,
	"fight": 8,
	"suspicious": 6,
	"smoke": 8,
	"fire": 9
}

def score_event(event):
	msg = (event.get('message') or '').lower()
	sev = 2
	for k, v in KEYWORDS.items():
		if k in msg:
			sev = max(sev, v)
	return { 'severity': sev }

if __name__ == '__main__':
	try:
		evt = json.loads(sys.stdin.read() or '{}')
		print(json.dumps(score_event(evt)))
	except Exception as e:
		print(json.dumps({ 'error': str(e) }))