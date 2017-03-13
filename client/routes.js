import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import Home from './containers/Home'
import Login from './containers/Login'
import UserPage from './containers/UserPage'
import H5Page from './containers/H5Page'
import Publish from './containers/Publish'
import PCPage from './containers/PCPage'

export default (
	<Route path="/" component={App}>
	  	<IndexRoute component={Home} />
	    <Route path="login"
	           component={Login} />
	    <Route path="/user/:username"
	           component={UserPage} />
	    <Route path="/H5/:taskid"
	           component={H5Page} />
	    <Route path="/pc/:taskid"
	    	   component={PCPage} />
	    <Route path="/publish/:docname"
	    	   component={Publish} />       
  	</Route>
  )
