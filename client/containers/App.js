import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children } = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
}

App.propTypes = {
  // Injected by React Redux
  // Injected by React Router
  children: PropTypes.node
}

///state,ownProps由store提供
function mapStateToProps(state, ownProps) {
  return {
  }
}

///暴露经过connect处理过后的App组件
///errorMessage,inputValue将作为属性,resetErroeMessage作为方法
///传入到组件的Props里
///并且resetErrorMessage会被当做Redux action creator
export default connect(mapStateToProps)(App)
