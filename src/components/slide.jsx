import React from 'react';
import ReactMarkdown from 'react-markdown';

const slide = (props) => (
	<div className='slide' style={{
		...props.settings,
		backgroundImage: `url(${props.settings.backgroundImage})`
	}}>
		<ReactMarkdown source={props.text} escapeHtml={false} />
	</div>
);

export default slide;