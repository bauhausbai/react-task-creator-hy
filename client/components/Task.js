import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import style from './styles/task.css'

export default class Task extends Component {
  render() {
  	const { task } = this.props

    return (
      <div className={style.task}>
      	<Link to={`/H5/${task.taskid}`}>
      		<h3>{task.taskid}</h3>
      	</Link>
      </div>
    )
  }
}

Task.propTypes = {
	task: PropTypes.object
}
