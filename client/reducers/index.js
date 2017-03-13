import * as ActionTypes from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

const user = ( state = {isfetching: false}, action ) => {
	switch (action.type) {
		case ActionTypes.LOGIN_REQUEST:
			return Object.assign({}, state, {
				isfetching: true
			})
		case ActionTypes.LOGIN_RECEIVE:
			return Object.assign({}, state, {
				isfetching: false,
				userinfo: action.user,
				login: action.login,
				lastUpdated: action.receiveAt
			})
		default:
			return state
	}
}

const task = (state = {isfetching: false}, action) => {
	switch (action.type) {
		case ActionTypes.H5_REQUEST:
			return Object.assign({}, state, {
				isfetching: true
			})
		case ActionTypes.H5_SUCCESS:
			return Object.assign({}, state, {
				isfetching: false,
				taskinfo: action.taskinfo,
				lastUpdated: action.receiveAt
			})
		case ActionTypes.H5_FAILURE:
			return Object.assign({}, state, {
				isfetching: false,
				errorMessage: action.errorMessage
			})
		case ActionTypes.ADDPAGE_SUCCESS:
			return Object.assign({}, state, {
				isfetching: false,
				taskinfo: action.taskinfo,
				lastUpdated: action.receiveAt
			})
		case ActionTypes.PUBLISH_SUCCESS:
			return Object.assign({}, state, {
				publish: true
			})
		default:
			return state
	}
}

const pc = (state = {isfetching: false}, action) => {
	switch (action.type) {
		case ActionTypes.PC_REQUEST:
			return Object.assign({}, state, {
				isfetching: true
			})
		case ActionTypes.PC_SUCCESS:
			return Object.assign({}, state, {
				isfetching: false,
				taskinfo: action.taskinfo,
				lastUpdated: action.receiveAt
			})
		case ActionTypes.PC_FAILURE:
			return Object.assign({}, state, {
				isfetching: false,
				errorMessage: action.errorMessage
			})
		case ActionTypes.ADDBLOCK_SUCCESS:
			return Object.assign({}, state, {
				isfetching: false,
				taskinfo: action.taskinfo,
				lastUpdated: action.receiveAt
			})
		case ActionTypes.PC_PUBLISH:
			return Object.assign({}, state, {
				isfetching: false,
				taskinfo: action.taskinfo,
				publish: action.publish
			})
		default:
			return state
	}
}

const rootReducer = combineReducers({
  user,
  task,
  pc,
  routing
})

export default rootReducer
