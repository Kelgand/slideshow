import React from 'react';

const settings = (props) => (
	<div className='settingsContainer' >
		<div className='navigation'>
			<button onClick={() =>  props.navigate(props.currentIndex - 1)}> &lt;-- </button>
			<button onClick={() => props.addSlide()}> Add New </button>
			{props.currentIndex + 1}
			<button onClick={() => props.deleteSlide(props.currentIndex)}>Delete Slide</button>
			<button onClick={() => props.navigate(props.currentIndex + 1)}> --&gt; </button>
		</div>
		<label className='settingsRow'>
			Font Size: 
			<input type='number' min='0' step='1' value={props.settings.fontSize} onChange={(e) => props.updateSetting('fontSize', Number(e.target.value))} />
		</label>
		<label className='settingsRow'>
			Font Family:
			<input type='text' value={props.settings.fontFamily} onChange={(e) => props.updateSetting('fontFamily', e.target.value)} />
		</label>
		<label className='settingsRow'>
			Background Image URL:
			<input type='text' value={props.settings.backgroundImage} onChange={(e) => props.updateSetting('backgroundImage', e.target.value)} />
		</label>
		Aspect ratio:
		<div className='settingsRow'>
			<label>
				Width: <input type='number' min='0' step='1' value={props.settings.width} onChange={(e) => props.updateSetting('width', Number(e.target.value))} />
			</label>
			<label>
				Height: <input type='number' min='0' step='1' value={props.settings.height} onChange={(e) => props.updateSetting('height', Number(e.target.value))} />
			</label>
		</div>
	</div>
);

export default settings;