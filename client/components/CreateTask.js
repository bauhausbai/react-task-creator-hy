import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import style from './styles/createtask.css'

export default class CreateTask extends Component {
  render() {
  	const { taskType, onCreate, onDocNameChange, value } = this.props
 
    return (
      <div className={style.layer}>
          <input type='text' placeholder='输入文件名' value={value} onChange={onDocNameChange}/>
          <input type='button' value='创建' onClick={onCreate}/>
      </div>
    )
  }
}

CreateTask.propTypes = {
	taskType: PropTypes.string,
  onCreate: PropTypes.func.isRequired,
  onDocNameChange: PropTypes.func.isRequired
}
