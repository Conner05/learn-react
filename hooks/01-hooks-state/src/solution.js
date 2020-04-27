import React, { useState } from 'react'

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

function Start() {
  const STATUS = { neverEntered: 'neverEntered', entered: 'entered', left: 'left' }
  const [status, setStatus] = useState(STATUS.neverEntered)

  const handleEnter = () => setStatus(STATUS.entered)
  const handleLeave = () => setStatus(STATUS.left)

  let message
  let button = <Outside handleClick={handleEnter} />
  if (status === STATUS.entered) {
    message = <GreetingMessage />
    button = <Inside handleClick={handleLeave} />
  } else if (status === STATUS.left) {
    message = <GoodbyeMessage />
    button = <Outside handleClick={handleEnter} />
  }
  return (
    <>
      {button}
      {message}
    </>
  )
}

export default Start