#!/usr/bin/env python3
import time
import json
import os
import random
from datetime import datetime

STATE_FILE = os.path.join(os.path.dirname(__file__), 'hitl_state.json')

def load_state():
	if os.path.exists(STATE_FILE):
		with open(STATE_FILE, 'r') as f:
			return json.load(f)
	return { 'last_incident': None }

def save_state(state):
	with open(STATE_FILE, 'w') as f:
		json.dump(state, f, indent=2)


def simulate_event():
	messages = [
		"all clear",
		"suspicious activity near aisle",
		"customer needs assistance",
		"potential theft detected"
	]
	msg = random.choice(messages)
	sev = 8 if 'theft' in msg else (6 if 'suspicious' in msg else 2)
	return { 'type': 'monitor', 'message': msg, 'severity': sev, 'createdAt': datetime.utcnow().isoformat() }


def main():
	state = load_state()
	print('HITL monitor running. Press Ctrl+C to stop.')
	try:
		while True:
			event = simulate_event()
			if event['severity'] >= 6:
				state['last_incident'] = event
				save_state(state)
				print('Incident:', event)
			time.sleep(10)
	except KeyboardInterrupt:
		print('Stopping')

if __name__ == '__main__':
	main()