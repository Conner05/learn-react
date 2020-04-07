import React from 'react'
import '../App.css'

function PrettyBorder(props) {
  return (
    <div style={{ border: 'solid 5px pink', margin: 20, padding: 20, fontSize: 16 }}>
      {props.children}
    </div>
  )
}

function Message(props) {
  return (
    <PrettyBorder>
      {props.content}
    </PrettyBorder>
  )
}
function GreetingMessage() {
  return <Message content='Hello there!' />
}
function GoodbyeMessage() {
  return <Message content='See you later!' />
}

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
    let message
    let button = <Outside handleClick={this.handleEnter} />
    const status = this.state.status
    if (status === this.STATUS.entered) {
      message = <GreetingMessage />
      button = <Inside handleClick={this.handleLeave} />
    } else if (status === this.STATUS.left) {
      message = <GoodbyeMessage />
      button = <Outside handleClick={this.handleEnter} />
    }
    return (
      <>
        {button}
        {message}
      </>
    )
  }
}

export default One
