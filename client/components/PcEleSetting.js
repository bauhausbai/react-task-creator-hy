import React, { Component, PropTypes } from 'react'
import style from './styles/pcelesetting.css'

export default class PcEleSetting extends Component {
	constructor(props) {
		super(props)
		this.widthChange = this.widthChange.bind(this)
		this.heightChange = this.heightChange.bind(this)
		this.topChange = this.topChange.bind(this)
		this.leftChange = this.leftChange.bind(this)
		this.linkChange = this.linkChange.bind(this)
		this.showDialog = this.showDialog.bind(this)
	}

	widthChange(e) {
		let width = e.target.value
		this.props.setEle('width', width)
	}

	heightChange(e) {
		let height = e.target.value
		this.props.setEle('height', height)
	}

	topChange(e) {
		let top = e.target.value
		this.props.setEle('top', top)
	}

	leftChange(e) {
		let left = e.target.value
		this.props.setEle('left', left)
	}

	linkChange(e) {
		let linkTo = e.target.value
		this.props.setEle('linkTo', linkTo)
	}

	showDialog() {
		this.props.showModalDialog()
	}

	render() {
		const eletype = this.props.eleProps.eletype || ""
		const width = this.props.eleProps.width || 0
		const height = this.props.eleProps.height || 0
		const top = this.props.eleProps.top || 0
		const left = this.props.eleProps.left || 0
		const linkTo = this.props.eleProps.linkTo || ""
		const imgs = this.props.eleProps.imgs || []

		switch(eletype) {
			case 'btn':
				return (
				  <div className={style.ele_setting}>
				  		<span>width:</span>
				  		<input type="text" value={width} onChange={this.widthChange}/><span>px</span>
				  		<span className={style.indent}>height:</span>
				  		<input type="text" value={height} onChange={this.heightChange}/><span>px</span>
				  		<span className={style.indent}>top:</span>
				  		<input type="text" value={top} onChange={this.topChange}/><span>px</span>
				  		<span className={style.indent}>left:</span>
				  		<input type="text" value={left} onChange={this.leftChange}/><span>px</span>
				  		<span className={style.indent}>link:</span>
				  		<input type="text" value={linkTo} onChange={this.linkChange}/>

				  		{linkTo != "" && <a target='blank' href={linkTo}>测试链接</a>}
				  </div>
				)
			case 'carousel':
				return (
					<div className={style.ele_setting}>
						<span>width:</span>
				  		<input type="text" value={width} onChange={this.widthChange}/><span>px</span>
				  		<span className={style.indent}>height:</span>
				  		<input type="text" value={height} onChange={this.heightChange}/><span>px</span>
				  		<span className={style.indent}>top:</span>
				  		<input type="text" value={top} onChange={this.topChange}/><span>px</span>
				  		<span className={style.indent}>left:</span>
				  		<input type="text" value={left} onChange={this.leftChange}/><span>px</span>

				  		<button onClick={this.showDialog}>添加图片</button>
					</div>
				)
			default:
				return null
		}
	}
}

PcEleSetting.propTypes = {
	eleProps: PropTypes.object.isRequired,
	setEle: PropTypes.func.isRequired,
	showModalDialog: PropTypes.func.isRequired
}
