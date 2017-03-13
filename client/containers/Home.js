import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'

class HomePage extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<p>Home</p>
				<Link to='/login'>注册</Link>
			</div>
		)
	}
}

HomePage.propTypes = {
	//injected by react Router
	//children: PropTypes.node
}

function mapStateToProps(state, ownProps) {
  return {
  }
}

export default connect(mapStateToProps)(HomePage)

