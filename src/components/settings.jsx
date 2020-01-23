import React from 'react';

const settings = (props) => (
	<div className='settingsContainer' >
		<label>
			Font Size: 
			<input type='number' min='0' step='1' value={props.settings.fontSize} onChange={(e) => props.updateSetting('fontSize', Number(e.target.value))} />
		</label>
		<label>
			Font Family:
			<input type='text' value={props.settings.fontFamily} onChange={(e) => props.updateSetting('fontFamily', e.target.value)} />
		</label>
		<label>
			Background Image URL:
			<input type='text' value={props.settings.backgroundImage} onChange={(e) => props.updateSetting('backgroundImage', e.target.value)} />
		</label>
		<div>
			Aspect ratio:
			<div>
				<label>
					Width: <input type='number' min='0' step='1' value={props.settings.width} onChange={(e) => props.updateSetting('width', Number(e.target.value))} />
				</label>
				<label>
					Height: <input type='number' min='0' step='1' value={props.settings.height} onChange={(e) => props.updateSetting('height', Number(e.target.value))} />
				</label>
			</div>
		</div>
	</div>
);

export default settings;