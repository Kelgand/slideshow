import React from 'react';
import ReactMarkdown from 'react-markdown';
//import CodeBlock from '../resources/codeblock';

const slide = (props) => (
	<div className='slide' style={{
		...props.settings,
		backgroundImage: `url(${props.settings.backgroundImage})`,
		transform: props.scale ? `scale(${props.scale})` : null,
		border: props.showBorder ? '2px solid black' : null
	}}>
		<ReactMarkdown source={props.text} escapeHtml={false} />
	</div>
);

export default slide;