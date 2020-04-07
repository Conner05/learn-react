import React from 'react'
import '../App.css'

function Inside(props) {
  return <button onClick={props.handleClick}>Leave</button>
}
function Outside(props) {
  return <button onClick={props.handleClick}>Enter</button>
}

class One extends React.Component {
  constructor(props) {
    super(props)
    this.state = { status: this.STATUS.neverEntered }
    this.handleEnter = this.handleEnter.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
  }

  STATUS = { neverEntered: 'neverEntered', entered: 'entered', left: 'left' }

  handleEnter() {
    this.setState({ status: this.STATUS.entered })
  }

  handleLeave() {
    this.setState({ status: this.STATUS.left })
  }

  render() {
    return (
      <div>
        {this.state.status === this.STATUS.entered ? <Inside handleClick={this.handleLeave} /> : <Outside handleClick={this.handleEnter} />}
        {this.state.status === this.STATUS.entered &&
          <div style={{ border: 'solid 5px pink', margin: 20, padding: 20, fontSize: 16 }}>Hello there!</div>
        }
      </div>
    )
  }
}

export default One
