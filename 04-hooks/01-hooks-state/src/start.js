import React from 'react'

function PrettyBorder(props) {
  return (
    <div style={{ border: 'solid 5px pink', margin: 20, padding: 20, fontSize: 16 }}>
      {props.children}
    </div>
  )
}

const Message = (props) => <PrettyBorder>{props.content}</PrettyBorder>
const GreetingMessage = () => <Message content='Hello there!' />
const GoodbyeMessage = () => <Message content='See you later!' />

const Inside = (props) => <button onClick={props.handleClick}>Leave</button>
const Outside = (props) => <button onClick={props.handleClick}>Enter</button>

class Start extends React.Component {
  constructor(props) {
    super(props)
    this.state = { status: this.STATUS.neverEntered }
  }

  STATUS = { neverEntered: 'neverEntered', entered: 'entered', left: 'left' }

  handleEnter = () => this.setState({ status: this.STATUS.entered })
  handleLeave = () => this.setState({ status: this.STATUS.left })

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

export default Start