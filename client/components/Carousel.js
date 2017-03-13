import React, { Component, PropTypes } from 'react'
import style from './styles/carousel.css'

export default class Carousel extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentSlide: 0,
			autoPlayTimer: null
		}
		this.play = this.play.bind(this)
	}

	componentWillMount() {
		this.setState({
			autoPlayTimer: setTimeout(this.play, 2000)
		}) 
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			currentSlide: 0,
			autoPlayTimer: setTimeout(this.play, 2000)
		})
	}

	play() {
		let {width, imgs} = this.props.eleProps
		let {currentSlide} = this.state

		if (currentSlide == (imgs.length-1)){
			currentSlide = 0
		}else{
			currentSlide++
		}
		this.setState({
			currentSlide: currentSlide,
			autoPlayTimer: setTimeout(this.play, 2000)
		})
	}

	render() {
		let {width, height, top, left, imgs, eleid} = this.props.eleProps
		let {currentSlide} = this.state
		let w = width + 'px'
		let h = height + 'px'
		let t = top + 'px'
		let l = left + 'px'

		if (imgs[0]) {
			return (
					<div className={style.wrapper} onClick={this.props.handleChange} key={eleid} data-eleid={eleid} style={{width: w, height: h, top: t, left: l}}>
						<div className={style.carousel}>
							<div style={{width: w, height: h}}><img src={imgs[currentSlide]}/></div>
						</div>
					</div>
				)
		}else{
			return (
				<div className={style.wrapper} onClick={this.props.handleChange} key={eleid} data-eleid={eleid} style={{width: w, height: h, top: t, left: l}}>
					<div className={style.carousel}>
					</div>
				</div>
			)
		}
		
	}
}

Carousel.PropTypes = {
	eleProps: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired
}
