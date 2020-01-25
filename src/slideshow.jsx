import React from 'react';

import ImportExportModal from './components/importExportModal'
import Settings from './components/settings';
import Slide from './components/slide';
import Text from './components/text';

const defaultSlideInfo = {
	markdown: '',
	notes: '',
	settings: {
		fontSize: 32,
		fontFamily: 'Arial',
		backgroundImage: '',
		backgroundSize: 'auto',
		width: screen.width,
		height: screen.height
	}
}

export default class Slideshow extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id: 'slideshow-testing',
			currentSlideIndex: 0,
			currentSlide: Object.assign({}, defaultSlideInfo),
			slides: [Object.assign({}, defaultSlideInfo)],
			isViewer: false,
			showImportExportModal: false,
		}

		this.addSlide = this.addSlide.bind(this);
		this.deleteSlide = this.deleteSlide.bind(this);
		this.handleUpdateSlide = this.handleUpdateSlide.bind(this);
		this.importSlides = this.importSlides.bind(this);
		this.navigation = this.navigation.bind(this);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
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

	deleteSlide(index){
		const message = {type: 'deleteSlide', index}
		this.handleUpdateSlide(message);
		this.sendMessage(message);
	}

	navigation(newSlideIndex){
		const numberOfSlides = this.state.slides.length;
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
				this.setState({currentSlide});
				return;

			case 'updateNotes':
				currentSlide.notes = data.notes;
				this.setState({currentSlide});
				return;

			case 'updateSetting':
				currentSlide.settings[data.setting] = data.value;
				this.setState({currentSlide});
				return;
			
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

			case 'deleteSlide': {
				let newSlides = [...this.state.slides];
				let newCurrent = this.state.currentSlide;
				let newIndex = this.state.currentSlideIndex;

				newSlides.splice(data.index, 1);
				if(newSlides.length === 0){
					newSlides = [Object.assign({}, defaultSlideInfo)];
					newCurrent = newSlides[0];
				} else if(newIndex >= newSlides.length){
					newIndex = newSlides.length - 1;
					newCurrent = newSlides[newIndex];
				} else if(newIndex === data.index){
					newCurrent = newSlides[newIndex];
				}

				this.setState({
					slides: newSlides,
					currentSlide: newCurrent,
					currentSlideIndex: newIndex
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

	toggleModal(shouldShow){
		this.setState({
			showImportExportModal: shouldShow
		});
	}

	importSlides(json){
		const newState = {
			slides: JSON.parse(json),
			currentSlideIndex: 0
		};

		this.sendMessage({
			type: 'state',
			...newState
		})
		this.parseState(newState);

		this.setState({
			showImportExportModal: false
		});
	}

	render(){
		const {currentSlide, currentSlideIndex, showImportExportModal, slides} = this.state;
		
		if(this.state.isViewer){
			return (
				<Slide text={currentSlide.markdown} settings={currentSlide.settings} />
			);
		} else {
			return (
				<div className='mainContainer'>
					<div className='slideThumbnails'>
						{
							slides.map((slide, index) => (
								<div className='thumbnailContainer' onClick={() => this.navigation(index)} key={index}>
									<Slide scale={125 / slide.settings.width} showBorder={true} text={slide.markdown} settings={slide.settings} />
								</div>
							))
						}
					</div>
					<div className='inputFields'>
						<Text containerType='markdownContainer' text={currentSlide.markdown} update={this.updateMarkdown} placeholder='Enter your markdown text here' />
						<Text containerType='notesContainer' text={currentSlide.notes} update={this.updateNotes} placeholder='Enter your notes here' />
						<Settings currentIndex={currentSlideIndex} settings={currentSlide.settings} updateSetting={this.updateSetting} navigate={this.navigation} addSlide={this.addSlide} deleteSlide={this.deleteSlide} />
						<button className='importExportButton' onClick={() => this.toggleModal(true)}>Import/Export JSON</button>
					</div>
					<div className='slidePreviewContainer'>
						<Slide scale='.5' text={currentSlide.markdown} showBorder={true} settings={currentSlide.settings} />
					</div>
					{showImportExportModal ? <ImportExportModal import={this.importSlides} toggle={this.toggleModal} text={JSON.stringify(slides)} /> : null}
				</div>
			);
		}
	}
}