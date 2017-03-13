import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import style from './styles/h5page.css'
import { createH5IfNeeded, addPageIfNeeded, loadTask, h5ImgUploadIfNeeded, updateH5Task, h5Publish } from '../actions'
import List from '../components/List'
import Pagination from '../components/Pagination'
import FuncPanel from '../components/FuncPanel'
import DialogBg from '../components/DialogBg'
import DialogImg from '../components/DialogImg'
import EleSetting from '../components/EleSetting'

class H5Page extends Component {
	constructor (props) {
		super(props)
		this.state = {
			docname: "",
			currentPageNum: 1,
			task: {},
			dialogType: "",
			currentEle: 0,
			mousedown: false, 
			toLastPage: false
		}
		this.subDocName = this.subDocName.bind(this)
		this.handleDocNameChange = this.handleDocNameChange.bind(this)
		this.handlePaginationClick = this.handlePaginationClick.bind(this)
		this.handleAddPage = this.handleAddPage.bind(this)
		this.handleCreateBg = this.handleCreateBg.bind(this)
		this.handleCreatePic = this.handleCreatePic.bind(this)
		this.handleCreateMusic = this.handleCreateMusic.bind(this)
		this.handleImgUpload = this.handleImgUpload.bind(this)
		this.handleEleMove = this.handleEleMove.bind(this)
		this.handleEleDown = this.handleEleDown.bind(this)
		this.handleEleUp = this.handleEleUp.bind(this)
		this.addPicOnPage = this.addPicOnPage.bind(this)
		this.addBg = this.addBg.bind(this)
		this.renderCurrentPage = this.renderCurrentPage.bind(this)
		this.changeCurrentEle = this.changeCurrentEle.bind(this)
		this.handleAnimateSetting = this.handleAnimateSetting.bind(this)
		this.handlePublish = this.handlePublish.bind(this)
	} 

	componentWillMount() {
	    this.props.loadTask(this.props.taskid)
	    if (this.props.task.taskinfo) {
	    	this.setState({
	    		task: this.props.task.taskinfo
	    	})
	    }
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.task.publish) {
			let docname = nextProps.task.taskinfo.docname
			browserHistory.push(`/publish/${docname}`)
		}
        this.setState({
	    	task: nextProps.task.taskinfo
        })
        if (this.state.toLastPage) {
        	this.setState({currentPageNum: nextProps.task.taskinfo.pages.length})
        }     
    }

	handleDocNameChange (e) {
		this.setState({docname: e.target.value})
	}

	subDocName (e) {
		e.preventDefault()
		let docname = this.state.docname
		this.props.createH5IfNeeded(docname)
	}

	handlePaginationClick (e) {
		let num = e.currentTarget.getAttribute('data-num')
		this.setState({
            currentPageNum: parseInt(num)
        })   
	}

	handleAddPage () {
		this.props.addPageIfNeeded(this.props.taskid, this.state.task)
		this.setState({toLastPage: true})
	}

	renderCurrentPage (ele) {
		let current = this.state.currentEle
		let width = ele.width * 320 / 750
		let top = ele.top || 0
		let left = ele.left || 0
		let animate = ele.animate || {name:"none", duration: 0, delay: 0, times: 0}
		let name = animate.name
		let duration = animate.duration
		let delay = animate.delay
		let times = animate.times
		let animation = name + " " + duration + "s ease " + delay + "s " + times

		if (ele.eletype === "bg") {
			return (
				<img 
					key={ele.eleid} 
					src={ele.url} 
					className={style.ele} 
					style={{width: width, top: 0, left: 0, animation: animation}}
					draggable="false"
					onClick={this.changeCurrentEle}
					data-eleid={ele.eleid}/>
			)
		}
		else if (ele.eleid !== current) {
			return (
				<img 
					key={ele.eleid} 
					src={ele.url} 
					className={style.ele} 
					style={{width: width, top: top+'px', left: left+'px', animation: animation}}
					draggable="false"
					onClick={this.changeCurrentEle}
					data-eleid={ele.eleid}/>
			)
		}else if (ele.eleid === current && ele.eletype === "bg") {
			return <img 
				key={ele.eleid} 
				src={ele.url} 
				className={style.cur_ele} 
				style={{width: width, top: 0, left: 0, animation: animation}}
				draggable="false"
				onClick={this.changeCurrentEle}
				data-eleid={ele.eleid}/>
		}

		return (
			<img 
				key={ele.eleid} 
				src={ele.url} 
				className={style.cur_ele} 
				style={{width: width, top: top+'px', left: left+'px', animation: animation}}
				draggable="false"
				onClick={this.changeCurrentEle}
				onMouseMove={this.handleEleMove}
				onMouseDown={this.handleEleDown}
				onMouseUp={this.handleEleUp}
				data-eleid={ele.eleid}/>
		)
	}

	changeCurrentEle (e) {
		let eleid = e.currentTarget.getAttribute('data-eleid')
		this.setState({currentEle: parseInt(eleid)})
	}

	handleCreateBg () {
		this.setState({dialogType: "bg", toLastPage: false})
		this.props.updateH5Task(this.props.taskid, this.state.task)
	}
	handleCreatePic () {
		this.setState({dialogType: "pic", toLastPage: false})
		this.props.updateH5Task(this.props.taskid, this.state.task)
	}
	handleCreateMusic () {}

	handleImgUpload () {
		let formdata = new FormData()
		formdata.append("image", document.getElementById("dialogBgUpload").files[0])
		this.props.h5ImgUploadIfNeeded(this.props.taskid, formdata)
	}

	handleEleMove (e) {
		e.preventDefault()
		let {task, currentPageNum, currentEle, mousedown} = this.state
		if (mousedown === true) {
			let pos = e.target.parentNode.getBoundingClientRect()
			let x = pos.left
			let y = pos.top
			let num = currentPageNum - 1
			let eles = task.pages[num].eles
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

	addPicOnPage (e) {
		let {task, currentPageNum} = this.state
		let dom = e.currentTarget.firstChild
		let imgUrl = dom.src
		let num = currentPageNum - 1
		let timeStamp = +new Date()

		task.pages[num].eles.push({
			url: imgUrl,
			eleid: timeStamp,
			eletype: 'ele',
			width: dom.naturalWidth,
			height: dom.naturalHeight,
			top: 0,
			left: 0
		})
		this.setState({
			dialogType: "",
			currentEle: timeStamp
		})
	}

	addBg (e) {
		let {task, currentPageNum} = this.state
		let dom = e.currentTarget.firstChild
		let imgUrl = dom.src
		let num = currentPageNum - 1
		let timeStamp = +new Date()
		let eles = task.pages[num].eles

		if (eles[0] && eles[0].eletype == "bg") {
			eles[0].url = imgUrl
		}else{
			eles.unshift({
				url: imgUrl,
				eleid: timeStamp,
				eletype: 'bg',
				width: 750,
				top: 0,
				left: 0
			})
		}

		this.setState({
			dialogType: "",
			currentEle: timeStamp
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
			case "pic":
				return <DialogBg 
					imgs={images}
					imgUpload={this.handleImgUpload}
					imgClicked={this.addPicOnPage}/>
				break
			default:
				return null
		}
	}

	handleAnimateSetting(name, duration, delay, times) {
		const currentPageNum = this.state.currentPageNum
		const currentEle = this.state.currentEle
		let num = currentPageNum - 1
		let task = this.state.task
		let eles = task.pages[num].eles
		let index
		eles.map((val, ind) => {
			if (val.eleid == currentEle) {
				index = ind
			}
		})
		task.pages[num].eles[index].animate = {name: name, duration: duration, delay: delay, times: times}
		this.setState({task: task})
	}

	handlePublish() {
		this.props.h5Publish(this.props.taskid, this.state.task)
	}

	render () {
		//const task = this.props.task.taskinfo
		const task = this.state.task
		const isfetching = this.props.task.isfetching
		const isEmpty = isEmptyObject(task)
		const currentPageNum = this.state.currentPageNum
		const pages = this.state.task.pages || [{}]
		const currentEle = this.state.currentEle
		let num = currentPageNum - 1 
		let currentPage
		if (isEmptyObject(pages[0])) {
			currentPage = [{}]
		}else{
			currentPage = pages[num].eles
		}
		const eleProps = currentEle != 0 ? getEleProps(currentEle, currentPage) : {}

		if (!task) {
			return <div>loading...</div>
		}

		return (
			<div>
				<div className={style.header}>
					<div className={style.create_con}>
						<FuncPanel 
							createBg={this.handleCreateBg}
							createPic={this.handleCreatePic}
							createMusic={this.handleCreateMusic}/>
					</div>
				</div>
				<div className={style.leftbar}>
					{!isEmpty ? <div><span>文档名：</span><span>{task.docname}</span></div> : <div><input type='text' placeholder='输入文件名' onChange={this.handleDocNameChange}/>
						<input type='button' value='新建h5' onClick={this.subDocName}/></div>}
					<div>
						<button>设置</button>
						<button>保存</button>
						<button onClick={this.handlePublish}>发布</button>
					</div>
					<Pagination  
						items={pages}
						current={currentPageNum}
						onChangeCurrent={this.handlePaginationClick}
						addNewPage={this.handleAddPage}/>
				</div>
				<div className={style.workspace}>
					<div className={style.edit_wrapper}>
						<div className={style.edit_area}>
							<List 
								renderItem={this.renderCurrentPage} 
								items={currentPage}/>
						</div>
					</div>

					{
						this.state.currentEle != 0 && 
						<EleSetting 
							eleProps={eleProps}
							setAnimate={this.handleAnimateSetting}/>
					}
				</div>

				{this.renderModalDialog(task.images || [])}

			</div>
		)
	}
}

H5Page.propTypes = {
  //injected by react Router
  //children: PropTypes.node
  user: PropTypes.object,
  task: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  const { user, task } = state
  const taskid = ownProps.params.taskid

  return {
    user,
    task,
    taskid
  }
}

export default connect(mapStateToProps, {
	createH5IfNeeded,
	addPageIfNeeded,
	h5ImgUploadIfNeeded,
	loadTask,
	updateH5Task,
	h5Publish
})(H5Page)

const isEmptyObject = (e) => {
	var i
	for(i in e) 
		return !1
	return !0
}

const isArray = obj => {
	  return Object.prototype.toString.call(obj) === '[object Array]';   
}

const getEleProps = (eleid, eles) => {
	let ele
	eles.map((val) => {
		if (val.eleid == eleid) {
			ele = val
		}
	})
	return ele
}

