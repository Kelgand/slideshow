import React from 'react';

export default class ImportExport extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			slideJSON: props.text
		};
	}

	updateImportJson(text){
		this.setState({
			slideJSON: text
		});
	}

	render(){
		return(
			<div className='modalContainer' name='modalContainer' onClick={(e) => {if(e.target.getAttribute('name') === 'modalContainer'){ this.props.toggle(false)}}}>
				<div className='modal'>
					Please copy the JSON here to externally save your slides, or enter previously created JSON to import slides.
					<input type='text' onChange={(e) => this.updateImportJson(e.target.value)} value={this.state.slideJSON} />
					<div className='modalButtonsContainer'>
						<button onClick={() => this.props.import(this.state.slideJSON)}>Import</button>
						<button onClick={() => this.props.toggle(false)}>Close</button>
					</div>
				</div>
			</div>
		);
	}
}