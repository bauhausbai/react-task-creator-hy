import React, { Component, PropTypes } from 'react'
import style from './styles/dialogbg.css'

export default class DialogBg extends Component {
	constructor(props) {
		super(props)
		this.renderItem = this.renderItem.bind(this)
	}

	renderItem(item, index) {
		const imgClicked = this.props.imgClicked
		return (
			<li key={item} className={style.item} onClick={imgClicked}>
				<img src={item} className={style.pic}/>
			</li>
		)
	}

	render() {
		const { imgs, imgUpload } = this.props
		
		return (
			<div className={style.layer}>
				<div className={style.container}>
					<div className={style.header}>
						<span className={style.dialogTitle}>图片列表</span>
						<span className={style.close}>X</span>
					</div>
					<ul className={style.everImg}>
						{imgs.map(this.renderItem)}
					</ul>
					<div className={style.footer}>
						<div className={style.imgUploadBg}>上传</div>
						<input type="file" id="dialogBgUpload" onChange={imgUpload} className={style.imgUploadBtn}  name="上传" accept="image/png,image/gif,image/jpg"/> 
					</div>
				</div>
			</div>
		)
	}
}

DialogBg.propTypes = {
	imgs: PropTypes.array,
	imgUpload: PropTypes.func
}