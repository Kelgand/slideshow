import React from 'react';

import Text from './components/text';
import Slide from './components/slide';

export default class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id: 'slideshow-testing',
			currentSlide: 0,
			slides: [{
				markdown: 'Markdown!',
				notes: 'notes!'
			}]
		}

		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.updateMarkdown = this.updateMarkdown.bind(this);
		this.updateNotes = this.updateNotes.bind(this);
		this.updateSlide = this.updateSlide.bind(this);
	}

	componentDidMount(){
		this.broadcastChannel = new BroadcastChannel(this.state.id);

		this.broadcastChannel.onmessage = this.receiveMessage;
	}

	receiveMessage(message){
		const {data} = message;
		switch(data.type){
			case 'updateSlide':{
				const {currentSlide, slideData} = data;

				let newSlides = [...this.state.slides];
				newSlides[currentSlide] = slideData;

				this.setState({
					slides: newSlides
				});
				break;
			}
			default:
				console.log(message)
		}
	}

	sendMessage(message){
		this.broadcastChannel.postMessage(message);
	}

	updateSlide(textType, newText){
		const currentSlide = this.state.currentSlide;

		let newSlides = [...this.state.slides];
		newSlides[currentSlide][textType] = newText;

		this.setState({
			slides: newSlides
		});

		this.sendMessage({
			type: 'updateSlide',
			currentSlide,
			slideData: newSlides[currentSlide]
		});
	}

	updateMarkdown(newMarkdown){
		this.updateSlide('markdown', newMarkdown);
	}

	updateNotes(newNotes){
		this.updateSlide('notes', newNotes);
	}

	render(){
		return (
			<div className='mainContainer'>
				<div className='inputFields'>
					<Text containerType='markdownContainer' text={this.state.slides[this.state.currentSlide].markdown} update={this.updateMarkdown} />
					<Text containerType='notesContainer' text={this.state.slides[this.state.currentSlide].notes} update={this.updateNotes} />
				</div>
				<div className='slidePreviewContainer'>
					<Slide text={this.state.slides[this.state.currentSlide].markdown} />
				</div>
			</div>
		);
	}
}