import React from 'react';

const text = (props) => (
	<textarea className={props.containerType} onChange={(e) => props.update(e.target.value)} value={props.text} placeholder={props.placeholder} />
);

export default text;