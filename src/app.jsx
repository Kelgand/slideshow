import React from 'react';

import Text from './components/text';
import Settings from './components/settings';
import Slide from './components/slide';

const defaultSlideInfo = {
	markdown: 'Markdown!',
	notes: 'notes!',
	settings: {
		fontSize: 32,
		fontFamily: 'Arial',
		backgroundImage: '',
		backgroundSize: 'auto'
	}
}

export default class App2 extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id: 'slideshow-testing',
			currentSlideIndex: 0,
			currentSlide: {...defaultSlideInfo},
			slides: [{...defaultSlideInfo}],
			isViewer: false
		}

		this.handleUpdateSlide = this.handleUpdateSlide.bind(this);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.updateMarkdown = this.updateMarkdown.bind(this);
		this.updateNotes = this.updateNotes.bind(this);
		this.updateSetting = this.updateSetting.bind(this);
	}
	
	componentDidMount(){
		const urlParams = new URLSearchParams(window.location.search);

		if(urlParams.has('id')){
			this.broadcastChannel = new BroadcastChannel(urlParams.get('id'));
		} else {
			this.broadcastChannel = new BroadcastChannel(this.state.id);
		}

		this.broadcastChannel.onmessage = this.receiveMessage;

		if(urlParams.get('viewer')){
			this.setState({isViewer: true});
			this.sendMessage({type: 'getState'})
		}
	}

	sendMessage(message){
		this.broadcastChannel.postMessage(message);
	}

	receiveMessage(message){
		if(message.data.type === 'state'){
			this.parseState(message.data);
		} else if(message.data.type === 'getState'){
			this.sendState();
		} else {
			this.handleUpdateSlide(message.data);
		}
	}

	sendState(){
		let message = {
			type: 'state',
			currentSlideIndex: this.state.currentSlideIndex,
			slides: this.state.slides
		}
		this.sendMessage(message);
	}

	parseState(data){
		this.setState({
			currentSlideIndex: data.currentSlideIndex,
			slides: data.slides,
			currentSlide: data.slides[data.currentSlideIndex]
		})
	}
	
	handleUpdateSlide(data){
		let {currentSlide} = this.state;

		switch(data.type){
			case 'updateMarkdown':
				currentSlide.markdown = data.markdown;
				break;

			case 'updateNotes':
				currentSlide.notes = data.notes;
				break;

			case 'updateSetting':
				currentSlide.settings[data.setting] = data.value;
				break;

			case 'changeToSlide':
				this.setState({
					currentSlideIndex: data.index,
					currentSlide: this.state.slides[data.index]
				});
				return

			default:
				console.log(data)
				break;
		}

		let slides = [...this.state.slides]
		slides[this.state.currentSlideIndex] = currentSlide;

		this.setState({
			currentSlide,
			slides
		});
	}

	updateMarkdown(markdown){
		const message = {
			type: 'updateMarkdown',
			markdown
		}
		this.handleUpdateSlide(message);
		this.sendMessage(message);
	}

	updateNotes(notes){
		const message = {
			type: 'updateNotes',
			notes
		}
		this.handleUpdateSlide(message);
		this.sendMessage(message);
	}
	
	updateSetting(setting, value){
		const message = {
			type: 'updateSetting',
			setting,
			value
		}
		this.handleUpdateSlide(message);
		this.sendMessage(message);
	}

	render(){
		const {currentSlide} = this.state;
		if(this.state.isViewer){
			return (
				<Slide text={currentSlide.markdown} settings={currentSlide.settings} />
			);
		} else {
			return (
				<div className='mainContainer'>
					<div className='inputFields'>
						<Text containerType='markdownContainer' text={currentSlide.markdown} update={this.updateMarkdown} />
						<Text containerType='notesContainer' text={currentSlide.notes} update={this.updateNotes} />
						<Settings settings={currentSlide.settings} updateSetting={this.updateSetting} />
					</div>
					<div className='slidePreviewContainer'>
						<Slide text={currentSlide.markdown} settings={currentSlide.settings} />
					</div>
				</div>
			);
		}
	}
}