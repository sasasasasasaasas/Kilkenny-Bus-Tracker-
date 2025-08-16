import React from 'react';

export default function BusMap() {
	return (
		<iframe
			src="https://maps.app.goo.gl/pECLc9eicUPGchFu5?g_st=ipc"
			allowFullScreen
			title="Live Bus Map"
			style={{ width: '100%', height: '100%', border: '0' }}
		/>
	);
}