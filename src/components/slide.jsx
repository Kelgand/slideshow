import React from 'react';
import ReactMarkdown from 'react-markdown';

const slide = (props) => (
	<div className='slide'>
		<ReactMarkdown source={props.text} escapeHtml={false} />
	</div>
);

export default slide;