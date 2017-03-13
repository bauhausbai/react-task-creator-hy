import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import style from './styles/publish.css'

class Publish extends Component {
	constructor (props) {
		super(props)
		this.handleLoad = this.handleLoad.bind(this)
	}

	handleLoad() {

	}

	render() {
		const docname = this.props.docname
		let url = 'http://www.kuafuu.com:8080/' + docname + '/'

		return (
			<div>
				<div><img src={'http://www.kuafuu.com:8080/qrcode?text=' + url}/></div>
				<button onClick={this.handleLoad}>下载文件</button>
			</div>
		)
	}
}

Publish.propTypes = {
  //injected by react Router
  //children: PropTypes.node
  user: PropTypes.object,
  task: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  const { user, task } = state
  const docname = ownProps.params.docname

  return {
    user,
    task,
    docname
  }
}

export default connect(mapStateToProps)(Publish)
