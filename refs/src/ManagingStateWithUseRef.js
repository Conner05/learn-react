import React, { useRef, useState } from 'react'
import './App.css'

function FirstName(props) {
  return (
    <>
      <label>First Name</label>
      <input ref={props.inputRef} />
    </>
  )
}

function LastName(props) {
  return (
    <>
      <label>Last Name</label>
      <input ref={props.inputRef} />
    </>
  )
}

function ManagingStateWithUseRef() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  
  const handleClick = () => {
    setFirstName(firstNameRef.current.value)
    setLastName(lastNameRef.current.value)
  }
  return (
    <div>
      <FirstName inputRef={firstNameRef} />
      <LastName inputRef={lastNameRef} />
      <button onClick={handleClick}>Display input state</button>
      <hr />
      <span>{`${firstName} ${lastName}`}</span>
    </div>
  )
}

export default ManagingStateWithUseRef
