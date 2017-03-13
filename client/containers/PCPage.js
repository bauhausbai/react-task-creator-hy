import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import style from './styles/pcpage.css'
import { pcLoadTask, addBlockIfNeeded, pcImgUploadIfNeeded, updatePCTask, subPcFile } from '../actions'
import List from '../components/List'
import PcEleSetting from '../components/PcEleSetting'
import DialogBg from '../components/DialogBg'
import Carousel from '../components/Carousel'


class PCPage extends Component {
	constructor (props) {
		super(props)
		this.state = {
			docname: "",
			currentBlock: 0,
			task: {},
			currentEle: 0,
			dialogType: "",
			mousedown: false,
			toLastPage: false
		}
		this.renderBlocks = this.renderBlocks.bind(this)
		this.renderEle = this.renderEle.bind(this)
		this.changeCurrentEle = this.changeCurrentEle.bind(this)
		this.addBlock = this.addBlock.bind(this)
		this.renderModalDialog = this.renderModalDialog.bind(this)
		this.createBg = this.createBg.bind(this)
		this.addBg = this.addBg.bind(this)
		this.handleImgUpload = this.handleImgUpload.bind(this)
		this.addBtn = this.addBtn.bind(this)
		this.handleEleMove = this.handleEleMove.bind(this)
		this.handleEleDown = this.handleEleDown.bind(this)
		this.handleEleUp = this.handleEleUp.bind(this)
		this.handleEleSetting = this.handleEleSetting.bind(this)
		this.changeCurrentBlock = this.changeCurrentBlock.bind(this)
		this.deleteCurrentBlock = this.deleteCurrentBlock.bind(this)
		this.addCarousel = this.addCarousel.bind(this)
		this.addCarouselImg = this.addCarouselImg.bind(this)
		this.changeDialogToCarousel = this.changeDialogToCarousel.bind(this)
		this.fileSub = this.fileSub.bind(this)
	} 

	componentWillMount() {
		this.props.pcLoadTask(this.props.taskid)
		if (this.props.pc.taskinfo) {
	    	this.setState({
	    		task: this.props.pc.taskinfo
	    	})
	    }
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.pc && nextProps.pc.publish) {
			let url = 'http://www.kuafuu.com:8080/pc/' + nextProps.pc.taskinfo.docname + '/'
			console.log(this.state)
			window.open(url)
		}
        this.setState({
	    	task: nextProps.pc.taskinfo
        })
        if (this.state.toLastPage) {
        	let cur = nextProps.pc.taskinfo.blocks.length - 1
        	this.setState({
        		currentBlock: cur,
        		currentEle: 0
        	})
        }    
    }

	renderBlocks(val, ind) {
		const currentBlock = this.state.currentBlock

		return (
			<div className={style.block} key={val._id}>
				<div className={ind == currentBlock ? style.onedit : style.edit} onClick={this.changeCurrentBlock} data-ind={ind}>编辑</div>
				<div className={style.delete} data-ind={ind} onClick={this.deleteCurrentBlock}>删除</div>
				<List 
					renderItem={this.renderEle}
					items={val.eles}/>
			</div>
		)
	}

	changeCurrentBlock(e) {
		let currentBlock = e.currentTarget.getAttribute('data-ind')
		this.setState({currentBlock: currentBlock})
	}

	deleteCurrentBlock(e) {

	}

	renderEle(ele) {
		let current = this.state.currentEle
		let width = ele.width + 'px'
		let height = ele.height + 'px'
		let top = ele.top + 'px'
		let left = ele.left + 'px'
		
		if (ele.eleid !== current) {
			switch(ele.eletype) {
				case 'bg':
					return <img 
					key={ele.eleid}
					src={ele.url}
					draggable="false"
					className={style.blockBg}
					onClick={this.changeCurrentEle}
					data-eleid={ele.eleid} />
				case 'btn':
					return (<div key={ele.eleid}
							   draggable="false"
							   onClick={this.changeCurrentEle}
							   className={style.btn}
							   style={{width: width, height: height, top: top, left: left}}
							   data-eleid={ele.eleid}></div>)
				case 'carousel':
					return <Carousel eleProps={ele}
							key={ele.eleid}
							handleChange={this.changeCurrentEle}/>
			}
		}
		else if(ele.eleid == current) {
			switch(ele.eletype) {
				case 'bg':
					return <img 
					key={ele.eleid}
					src={ele.url}
					draggable="false"
					className={style.cur_blockBg}
					onClick={this.changeCurrentEle}
					data-eleid={ele.eleid} />
				case 'btn':
					return (<div key={ele.eleid}
							   draggable="false"
							   onClick={this.changeCurrentEle}
							   className={style.cur_btn}
							   onMouseMove={this.handleEleMove}
							   onMouseDown={this.handleEleDown}
							   onMouseUp={this.handleEleUp}
							   style={{width: width, height: height, top: top, left: left}}
							   data-eleid={ele.eleid}></div>)
				case 'carousel':
					return <Carousel eleProps={ele}
							key={ele.eleid}
							handleChange={this.changeCurrentEle}/>
			}
		}
	}

	changeCurrentEle(e) {
		let eleid = e.currentTarget.getAttribute('data-eleid')
		this.setState({currentEle: parseInt(eleid)})
	}

	addBlock() {
		this.props.addBlockIfNeeded(this.props.taskid, this.state.task)
		this.setState({toLastPage: true})
	}

	createBg() {
		this.setState({dialogType: "bg", toLastPage: false})
		this.props.updatePCTask(this.props.taskid, this.state.task)
	}

	addBg(e) {
		let {task, currentBlock} = this.state
		let dom = e.currentTarget.firstChild
		let imgUrl = dom.src
		let timeStamp = +new Date()
		let eles = task.blocks[currentBlock].eles

		if (eles[0] && eles[0].eletype == "bg") {
			eles[0].url = imgUrl
		}else{
			eles.unshift({
				url: imgUrl,
				eleid: timeStamp,
				eletype: 'bg'
			})
		}
		this.setState({
			task: task,
			dialogType: "",
			currentEle: timeStamp
		})
	}

	addBtn() {
		let {task, currentBlock} = this.state
		let timeStamp = +new Date()
		let eles = task.blocks[currentBlock].eles

		eles.push({
			eleid: timeStamp,
			eletype: 'btn',
			width: 100,
			height: 30,
			top: 0,
			left: 0
		})

		this.setState({
			currentEle: timeStamp
		})
	}

	addCarousel() {
		let {task, currentBlock} = this.state
		let timeStamp = +new Date()
		let eles = task.blocks[currentBlock].eles

		eles.push({
			eleid: timeStamp,
			eletype: 'carousel',
			width: 350,
			height: 250,
			top: 0,
			left: 0,
			imgs: []
		})

		this.setState({
			currentEle: timeStamp
		})
	}

	handleImgUpload() {
		let formdata = new FormData()
		formdata.append("image", document.getElementById("dialogBgUpload").files[0])
		this.props.pcImgUploadIfNeeded(this.props.taskid, formdata)
	}
	
	addCarouselImg(e) {
		let {task, currentBlock, currentEle} = this.state
		let dom = e.currentTarget.firstChild
		let imgUrl = dom.src
		let eles = task.blocks[currentBlock].eles
		let ind = getEleInd(currentEle, eles)
		eles[ind].imgs.push(imgUrl)
		this.setState({
			task: task,
			dialogType: ""
		})
	}

	renderModalDialog(images) {
		const type = this.state.dialogType
		if (type === "") {
			return null
		}

		switch(type) {
			case "bg":
				return <DialogBg 
					imgs={images}
					imgUpload={this.handleImgUpload}
					imgClicked={this.addBg}/>
				break
			case "carousel":
				return <DialogBg 
					imgs={images}
					imgUpload={this.handleImgUpload}
					imgClicked={this.addCarouselImg}/>
				break
			default:
				return null
		}
	}

	handleEleMove (e) {
		e.preventDefault()
		let {task, currentBlock, currentEle, mousedown} = this.state
		if (mousedown === true) {
			let pos = e.target.parentNode.getBoundingClientRect()
			let x = pos.left
			let y = pos.top
			let eles = task.blocks[currentBlock].eles
			eles.map(function(val, ind) {
				if (val.eleid == currentEle) {
					val.top = e.clientY - y - 5
					val.left = e.clientX - x - 5
				}
			})
			this.setState({task: task})
		}
	}

	handleEleDown (e) {
		e.preventDefault()
		this.setState({mousedown: true})
	}

	handleEleUp (e) {
		e.preventDefault()
		this.setState({mousedown: false})
	}

	handleEleSetting(prop, val) {
		let {task, currentBlock, currentEle} = this.state
		let eles = task.blocks[currentBlock].eles
		let ele = getEleProps(currentEle, eles)

		ele[prop] = val
		this.setState({task: task})
	}

	changeDialogToCarousel() {
		this.setState({
			dialogType: 'carousel',
			toLastPage: false
		})
		this.props.updatePCTask(this.props.taskid, this.state.task)
	}

	fileSub() {
		console.log('subfile99999999999999999999')
		this.props.subPcFile(this.props.taskid, this.state.task)
	}

	render () {
		const {task, currentBlock, currentEle} = this.state
		const blocks = task.blocks || [{}]
		const currentEles = blocks[currentBlock].eles
		const eleProps = currentEle != 0 ? getEleProps(currentEle, currentEles) : {}

		return (
			<div>
				<div className={style.bg}>
					<div className={style.content}>
						<List 
							renderItem={this.renderBlocks}
							items={blocks}/>
					</div>
				</div>
				<div className={style.cushion}></div>

				<div className={style.controlBar}>
					<div className={style.docInfo}>
						<span>文档名：</span><span>{task.docname}</span>
					</div>
					<div className={style.addEle}>
						<button onClick={this.addBlock}>添加块</button>
						<button onClick={this.createBg}>添加背景</button>
						<button onClick={this.addBtn}>按钮</button>
						<button>文字链接</button>
						<button onClick={this.addCarousel}>轮播</button>
						<button onClick={this.fileSub}>提交</button>
					</div> 
					{
						this.state.currentEle !== 0 &&
						<PcEleSetting 
							eleProps={eleProps}
							setEle={this.handleEleSetting}
							showModalDialog={this.changeDialogToCarousel}/>
					}
				</div>

				{this.renderModalDialog(task.images || [])}
			</div>
		)
	}
}

PCPage.propTypes = {
  //injected by react Router
  //children: PropTypes.node
  user: PropTypes.object,
  pc: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  const { user, pc } = state
  const taskid = ownProps.params.taskid

  return {
    user,
    pc,
    taskid
  }
}

export default connect(mapStateToProps, {
	pcLoadTask,
	addBlockIfNeeded,
	pcImgUploadIfNeeded,
	updatePCTask,
	subPcFile
})(PCPage)

const getEleProps = (eleid, eles) => {
	let ele = {}
	eles.map((val) => {
		if (val.eleid == eleid) {
			ele = val
		}
	})
	return ele
}

const getEleInd = (eleid, eles) => {
	let ind
	eles.map((val, index) => {
		if (val.eleid == eleid) {
			ind = index
		}
	})
	return ind
}
