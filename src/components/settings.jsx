import React from 'react';

const settings = (props) => (
	<div className='settingsContainer' >
		<input type='number' min='0' step='1' value={props.fontSize} />
	</div>
);

export default settings;