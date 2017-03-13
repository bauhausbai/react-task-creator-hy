import React, { Component, PropTypes } from 'react'
import style from './styles/elesetting.css'

export default class EleSetting extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "none",
			duration: 2,
			delay: 0,
			times: 1
		}
		this.handleAnimateChange = this.handleAnimateChange.bind(this)
		this.handleDurationChange = this.handleDurationChange.bind(this)
		this.handleDelayChange = this.handleDelayChange.bind(this)
		this.handleTimesChange = this.handleTimesChange.bind(this)
		this.animateSetting = this.animateSetting.bind(this)
	}

	componentWillMount() {
		const { eleProps } = this.props
		if (eleProps.animate) {
			this.setState({
				name: eleProps.animate.name,
				duration: eleProps.animate.duration,
				delay: eleProps.animate.delay,
				times: eleProps.animate.times
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (typeof nextProps.eleProps == 'object') {
			let animate = nextProps.eleProps.animate || false
			if (animate) {
				this.setState({
					name: animate.name,
					duration: animate.duration,
					delay: animate.delay,
					times: animate.times
				})
			}else{
				this.setState({
					name: 'none',
					duration: 2,
					delay: 0,
					times: 1
				})
			}
		}
	}

	handleAnimateChange(e) {
		this.setState({
			name: e.target.value
		})
	}

	handleDurationChange(e) {
		this.setState({
			duration: e.target.value
		})
	}

	handleDelayChange(e) {
		this.setState({
			delay: e.target.value
		})
	}

	handleTimesChange(e) {
		this.setState({
			times: e.target.value
		})
	}

	animateSetting() {
		const { name, duration, delay, times } = this.state
		this.props.setAnimate(name, duration, delay, times)
	}

	render() {
		const { name, duration, delay, times } = this.state

		return (
		  <div className={style.ele_setting}>
		  	<div className={style.cancel}>
		  		<span className={style.set_title}>组件设置</span>
		  		<span className={style.set_close}>X</span>
		  	</div>
		  	<div>
		  		<span>方式</span>
		  		<select name="animate" defaultValue={name} onChange={this.handleAnimateChange}>
		  			<option value="none">none</option>
		  			<option value="bounce">bounce</option>
		  			<option value="fadeIn">fadeIn</option>
		  			<option value="easeIn">easeIn</option>
			  	</select>
		  	</div>

		  	{name == "none" ? <div></div> : 
		  	<div>
			  	<div>
			  		<span>时间</span>
			  		<input type="text" maxLength="3" value={duration} onChange={this.handleDurationChange}/>
			  	</div>

			  	<div>
			  		<span>延迟</span>
			  		<input type="text" maxLength="3" value={delay} onChange={this.handleDelayChange}/>
			  	</div>

			  	<div>
			  		<span>次数</span>
			  		<input type="text" maxLength="3" value={times} onChange={this.handleTimesChange}/>
			  		<input type="checkbox"/>
			  		<span>循环</span>
			  	</div>
			  	<button onClick={this.animateSetting}>确定</button>
		  		<button>删除元素</button>
		  	</div>}
		  	
		  </div>
		)
	}
}

EleSetting.propTypes = {
	eleProps: PropTypes.object.isRequired,
	setAnimate: PropTypes.func.isRequired
}
