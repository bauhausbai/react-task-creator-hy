import React, { Component, PropTypes } from 'react'
import style from './styles/pagination.css'

export default class Pagination extends Component {
    constructor (props) {
        super(props)
        this.renderItem = this.renderItem.bind(this)
    }

    renderItem (page, index) {
        const ind = ++index
        const current = this.props.current
        return  (
            <div key={page._id} onClick={this.props.onChangeCurrent} data-num={ind} className={current == ind ? style.cur_pagi : style.pagi}>
                第{ind}页
                {current == ind && <span className={style.delete}></span>}
            </div>
        )
    }

    render() {
        const { items, current, onChangeCurrent, addNewPage } = this.props
        
        return (
            <div>
                {items.map(this.renderItem)}
                <div onClick={addNewPage} className={style.add}>新建一页</div>
            </div>
        )
    }
}

Pagination.propTypes = {
  onChangeCurrent: PropTypes.func.isRequired,
  addNewPage: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  current: PropTypes.number.isRequired
}