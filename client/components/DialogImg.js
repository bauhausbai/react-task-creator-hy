import React, { Component, PropTypes } from 'react'
import style from './styles/funcpanel.css'

export default class FuncPanel extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { createBg, createPic, createMusic } = this.props

		return (
			<ul className={style.func_panel}>
				<li onClick={createBg}>背景</li>
				<li onClick={createPic}>图片</li>
				<li onClick={createMusic}>音乐</li>
			</ul>
		)
	}
}

FuncPanel.propTypes = {
  createBg: PropTypes.func.isRequired,
  createPic: PropTypes.func.isRequired,
  createMusic: PropTypes.func.isRequired
}