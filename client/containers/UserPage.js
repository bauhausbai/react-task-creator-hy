import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { createH5IfNeeded, createPCIfNeeded } from '../actions'
import style from './styles/userpage.css'
import List from '../components/List'
import Task from '../components/Task'
import CreateTask from '../components/CreateTask'

class UserPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 'unfinished',
      creating: '',
      docvalue: ''
    }
    this.handleNav = this.handleNav.bind(this)
    this.renderTask = this.renderTask.bind(this)
    this.handleCreateH5 = this.handleCreateH5.bind(this)
    this.handleCreatePC = this.handleCreatePC.bind(this)
    this.createNewTask = this.createNewTask.bind(this)
    this.handleDocNameChange = this.handleDocNameChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    console.log('66666666666666666666666666666666')
    console.log(nextProps)
    console.log('99999999999999999999999999999999')
    if (nextProps.task.taskinfo) {
      let id = nextProps.task.taskinfo._id
      browserHistory.push(`/H5/${id}`)
    }
    if (nextProps.pc.taskinfo) {
      let pcid = nextProps.pc.taskinfo._id
      browserHistory.push(`/pc/${pcid}`)
    }
  }

  handleNav(event) {
    event.preventDefault()
    //event.target和event.currentTarget的区别
    this.setState({current: event.currentTarget.title})
  }

  handleCreateH5(e) {
    e.preventDefault()
    this.setState({creating: 'h5'})
  }

  handleCreatePC(e) {
    e.preventDefault()
    this.setState({creating: 'pc'})
  }

  handleDocNameChange(e) {
    this.setState({docvalue: e.currentTarget.value})
  }

  createNewTask(e) {
    e.preventDefault()
    let creating = this.state.creating
    let docname = this.state.docvalue
    if (creating === 'h5') {
      this.props.createH5IfNeeded(docname)
    }else if (creating === 'pc') {
      this.props.createPCIfNeeded(docname)
    }
  }

  renderTask(task) {
    return <Task task={task} key={task._id}/>
  }

  render() {
    const userinfo = this.props.user.userinfo[0]
    const taskList = this.props.taskList
    const current = this.state.current
    const creating = this.state.creating
    let unfinished = selectUnfinished(taskList)
    let mobile = taskList.mobile
    let pc = taskList.pc
    let tasks
    switch (current) {
      case 'unfinished':
        tasks = unfinished
        break
      case 'mobile':
        tasks = mobile
        break
      case 'PC':
        tasks = pc
        break
      default:
        tasks = []
    }
    
    return (
      <div>
        <div className={style.header}>
          <ul className={style.space_center}>
            <li><Link to='/Home'>首页</Link></li>
            <li className={current == 'unfinished' ? style.current : ''} onClick={this.handleNav} title='unfinished'><div>编辑项目</div></li>
            <li className={current == 'mobile' ? style.current : ''} onClick={this.handleNav} title='mobile'><div>移动</div></li>
            <li className={current == 'PC' ? style.current : ''} onClick={this.handleNav} title='PC'><div>PC</div></li>
            <li><Link to='/login'>{userinfo.username}</Link></li>
          </ul>
        </div>
        
        <div className={style.create}>
          <div className={style.space_center}>
            <div onClick={this.handleCreateH5} className={style.pointer}>新建H5</div>
            <div onClick={this.handleCreatePC} className={style.pointer}>新建专题</div>
          </div>
        </div>

        <div className={style.task_area}>
          <List renderItem={this.renderTask} items={tasks}/>
        </div>

        {creating && <CreateTask 
          value={this.state.docvalue}
          taskType={creating} 
          onCreate={this.createNewTask}
          onDocNameChange={this.handleDocNameChange}
          />}
      </div>
    )
  }
}

UserPage.propTypes = {
  //injected by react Router
  //children: PropTypes.node
  user: PropTypes.object, 
  taskList: PropTypes.object,
  task: PropTypes.object
}

function mapStateToProps(state) {
  const user = state.user 
  const taskList = user.userinfo[0]
  const task = state.task
  const pc = state.pc
  return {
    user,
    taskList,
    task,
    pc
  }
}

export default connect(mapStateToProps, {
  createH5IfNeeded,
  createPCIfNeeded
})(UserPage)

//taskList是user.userinfo[0]
const selectUnfinished = taskList => {
  let unfinished = []

  taskList.mobile.map(obj => {
    if (!obj.finished) {
      unfinished.push(obj)
    }
  })
  taskList.pc.map(obj => {
    if (!obj.finished) {
      unfinished.push(obj)
    }
  })

  return unfinished
}