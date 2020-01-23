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
		backgroundSize: 'auto',
		width: screen.width,
		height: screen.height
	}
}

export default class App2 extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id: 'slideshow-testing',
			currentSlideIndex: 0,
			currentSlide: Object.assign({}, defaultSlideInfo),
			slides: [Object.assign({}, defaultSlideInfo)],
			isViewer: false
		}

		this.addSlide = this.addSlide.bind(this);
		this.handleUpdateSlide = this.handleUpdateSlide.bind(this);
		this.navigation = this.navigation.bind(this);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.updateMarkdown = this.updateMarkdown.bind(this);
		this.updateNotes = this.updateNotes.bind(this);
		this.updateSetting = this.updateSetting.bind(this);
	}
	
	componentDidMount(){
		this.setState({
			currentSlide: this.state.slides[0]
		})
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
		} else if(message.data.type === 'navigation'){
			this.navigation(message.data);
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

	addSlide(){
		const message = {type: 'addSlide'};
		this.sendMessage(message);
		this.handleUpdateSlide(message);
	}

	navigation(data){
		const numberOfSlides = this.state.slides.length;
		const currentSlideIndex = this.state.currentSlideIndex;
		let newSlideIndex = currentSlideIndex + data;

		if(newSlideIndex < 0){
			newSlideIndex = 0;
		} else if (newSlideIndex >= numberOfSlides){
			newSlideIndex = numberOfSlides - 1;
		}

		const message = {type: 'changeToSlide', index: newSlideIndex}
		this.handleUpdateSlide(message);
		this.sendMessage({type: 'changeToSlide', index: newSlideIndex});
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
			
			case 'addSlide':{
				const {currentSlideIndex} = this.state;
				let newSlides = [...this.state.slides];
				const newSlide = Object.assign({}, defaultSlideInfo);

				newSlides.splice(currentSlideIndex + 1, 0, newSlide);
				this.setState({
					slides: newSlides,
					currentSlide: newSlide,
					currentSlideIndex: currentSlideIndex + 1
				});
				return;
			}
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

		this.setState({
			currentSlide
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
						<Settings settings={currentSlide.settings} updateSetting={this.updateSetting} navigate={this.navigation} addSlide={this.addSlide} />
					</div>
					<div className='slidePreviewContainer'>
						<Slide text={currentSlide.markdown} settings={currentSlide.settings} />
					</div>
				</div>
			);
		}
	}
}