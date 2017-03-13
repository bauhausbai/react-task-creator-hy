import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { verifyLoginIfNeeded } from '../actions'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
			password: "",
			errorMessage: ""
		}
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user.login) {
			browserHistory.push(`/user/${nextProps.user.userinfo[0].username}`)
		}else if(nextProps.user.login === false){
			this.setState({errorMessage: '用户名或密码错误'})
		}
	}

	handleNameChange(e) {
		this.setState({name: e.target.value})
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value})
	}

	handleLogin(e) {
		e.preventDefault()
		let name = this.state.name
		let password = this.state.password
		if (!name) {

			this.setState({errorMessage: "未填写用户名"})

		}else if(!password) {

			this.setState({errorMessage: "请输入密码"})

		}else{
			this.props.verifyLoginIfNeeded(name, password)
		}
	}

	render() {
		return (
			<div>  
				<h3>登录</h3>
				<div><input placeholder="昵称" type="text" onChange={this.handleNameChange}/></div>
				<div><input placeholder="密码" type="password" onChange={this.handlePasswordChange}/></div>
				<button onClick={this.handleLogin}>登陆</button>
				<div style={{color: 'red'}}>{this.state.errorMessage}</div>
			</div>
		)
	} 
}

Login.propTypes = {
	//injected by react Router
	//children: PropTypes.node
	user: PropTypes.object,
	verifyLoginIfNeeded: PropTypes.func 
}

function mapStateToProps(state, ownProps) {
	const user = state.user 
	return {
		user
	}
}

export default connect(mapStateToProps, {
	verifyLoginIfNeeded
})(Login)
