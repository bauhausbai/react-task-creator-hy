export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_RECEIVE = 'LOGIN_RECEIVE'
export const H5_REQUEST = 'H5_REQUEST'
export const H5_FAILURE = 'H5_FAILURE'
export const H5_SUCCESS = 'H5_SUCCESS' 
export const ADDPAGE_SUCCESS = 'ADDPAGE_SUCCESS'
export const PUBLISH_SUCCESS = 'PUBLISH_SUCCESS'
export const PC_REQUEST = 'PC_REQUEST'
export const PC_SUCCESS = 'PC_SUCCESS'
export const PC_FAILURE = 'PC_FAILURE'
export const ADDBLOCK_SUCCESS = 'ADDBLOCK_SUCCESS'
export const PC_PUBLISH= 'PC_PUBLISH'


const API_ROOT = 'http://www.kuafuu.com:8080/'

export const requestLoign = name => ({
  type: LOGIN_REQUEST,
  name
})

export const receiveLogin = (name, json) => ({
  type: LOGIN_RECEIVE,
  name,
  login: json.login,
  user: json.user || {},
  receivedAt: Date.now()
})

const postLogin = (name, password) => dispatch => {
  dispatch(requestLoign(name))

  var data = new FormData()
  data.append( "name", name )   //注意这里是两个参数
  data.append( "password", password )

  return fetch(API_ROOT + 'login', {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    console.log(json)
    dispatch(receiveLogin(name, json))
  }).catch(e => console.log('loginfail:' + e))
}

export const verifyLoginIfNeeded = (name, password) => (dispatch, getState) => {
  var state = getState()
  if (!state.user.isfetching) {
    return dispatch(postLogin(name, password))
  }
}

export const requestH5 = docname => ({
  type: H5_REQUEST
})

export const successH5 = json => ({
  type: H5_SUCCESS,
  taskinfo: json.taskinfo,
  receivedAt: Date.now()
})

export const failH5 = json => ({
  type: H5_FAILURE,
  errorMessage: json.errorMessage
})

const createH5 = (docname, userid) => dispatch => {
  dispatch(requestH5(docname))

  let data = new FormData()
  data.append( "docname", docname)
  data.append( "userid", userid)

  return fetch(API_ROOT + 'createH5', {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    json.h5 ? dispatch(successH5(json)) : dispatch(failH5(json))
  })
}

export const createH5IfNeeded = docname => (dispatch, getState) => {
  let state = getState()
  let userid = state.user.userinfo[0]._id
  if (!state.task.isfetching && userid) {
    return dispatch(createH5(docname, userid))
  }
}

export const loadTask = taskid => (dispatch, getState) => {
  dispatch(requestH5())
  let data = new FormData()
  data.append( "taskid", taskid )

  return fetch(API_ROOT + 'loadH5', {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    json.h5 ? dispatch(successH5(json)) : dispatch(failH5(json))
  })
}

export const successAddPage = json => ({
  type: ADDPAGE_SUCCESS,
  taskinfo: json,
  receivedAt: Date.now()
})

export const successPublish = json => ({
  type: PUBLISH_SUCCESS
})

const addH5Page = (taskid, task) => dispatch => {
  dispatch(requestH5())
  let fullurl = API_ROOT + 'H5AddPage/' + taskid
  let data = new FormData()
  data.append( "task", JSON.stringify(task))

  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successAddPage(json))
  })
}

export const addPageIfNeeded = (taskid, task) => (dispatch, getState) => {
  let state = getState()
  if (!state.task.isfetching) {
    return dispatch(addH5Page(taskid, task))
  }
}

const h5ImgUpload = (taskid, formdata) => dispatch => {
  dispatch(requestH5())

  let fullurl = API_ROOT + 'H5ImgUpload/' + taskid
  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: formdata
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successH5(json))
  })
}

export const h5ImgUploadIfNeeded = (taskid, formdata) => (dispatch, getState) => {
  let state = getState()
  if (!state.task.isfetching) {
    return dispatch(h5ImgUpload(taskid, formdata))
  }
}

export const updateH5Task = (taskid, task) => (dispatch, getState) => {
  let fullurl = API_ROOT + 'H5UpdateTask/' + taskid
  let data = new FormData()
  data.append( "task", JSON.stringify(task))

  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successAddPage(json))
  })
}

export const h5Publish = (taskid, task) => (dispatch, getState) => {
  let fullurl = API_ROOT + 'H5MakeFile/' + taskid
  let data = new FormData()
  data.append( "task", JSON.stringify(task))

  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successPublish(json))
  })
}


/*********pc部分**********/
export const createPCIfNeeded = docname => (dispatch, getState) => {
  let state = getState()
  let userid = state.user.userinfo[0]._id
  if (!state.pc.isfetching && userid) {
    return dispatch(createPC(docname, userid))
  }
}

const createPC = (docname, userid) => dispatch => {
  dispatch(requestPC(docname))

  let data = new FormData()
  data.append( "docname", docname)
  data.append( "userid", userid)

  return fetch(API_ROOT + 'createPC', {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    json.pc ? dispatch(successPC(json)) : dispatch(failPC(json))
  })
}

export const requestPC = docname => ({
  type: PC_REQUEST
})

export const successPC = json => ({
  type: PC_SUCCESS,
  taskinfo: json.taskinfo,
  receivedAt: Date.now()
})

export const failPC = json => ({
  type: PC_FAILURE,
  errorMessage: json.errorMessage
})

export const publishPC = json => ({
  type: PC_PUBLISH,
  taskinfo: json.taskinfo,
  publish: json.publish
})

export const pcLoadTask = taskid => (dispatch, getState) => {
  let data = new FormData()
  data.append( "taskid", taskid )

  return fetch(API_ROOT+'PCload', {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successPC(json))
  })
}

export const addBlockIfNeeded = (taskid, task) => (dispatch, getState) => {
  let state = getState()
  if (!state.pc.isfetching) {
    return dispatch(addBlock(taskid, task))
  }
}

const addBlock = (taskid, task) => dispatch => {
  dispatch(requestPC())
  let fullurl = API_ROOT + 'PCAddBlock/' + taskid
  let data = new FormData()
  data.append( "task", JSON.stringify(task))

  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successAddBlock(json))
  })
}

export const successAddBlock = json => ({
  type: ADDBLOCK_SUCCESS,
  taskinfo: json.taskinfo,
  receivedAt: Date.now()
})

const pcImgUpload = (taskid, formdata) => dispatch => {
  dispatch(requestPC())

  let fullurl = API_ROOT + 'PCImgUpload/' + taskid
  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: formdata
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successPC(json))
  })
}

export const pcImgUploadIfNeeded = (taskid, formdata) => (dispatch, getState) => {
  let state = getState()
  if (!state.task.isfetching) {
    return dispatch(pcImgUpload(taskid, formdata))
  }
}

export const updatePCTask = (taskid, task) => (dispatch, getState) => {
  let fullurl = API_ROOT + 'PCUpdateTask/' + taskid
  let data = new FormData()
  data.append( "task", JSON.stringify(task))

  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(successPC(json))
  })
}

export const subPcFile = (taskid, task) => (dispatch, getState) => {
  let fullurl = API_ROOT + 'PCMakeFile/' + taskid
  let data = new FormData()
  data.append( "task", JSON.stringify(task))

  return fetch(fullurl, {
    method: "POST",
    mode: "cors",
    header: {
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    dispatch(publishPC(json))
  })
}