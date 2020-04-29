import React, { useRef, useState } from 'react'
import './App.css'

function FirstName(props) {
  return (
    <>
      <label>First Name</label>
      <input ref={props.firstNameRef} id="firstName" onChange={(e) => props.onChange(e, 'firstName')} value={props.firstName} />
    </>
  )
}

function LastName(props) {
  return (
    <>
      <label>Last Name</label>
      <input id="lastName" onChange={(e) => props.onChange(e, 'lastName')} value={props.lastName} />
    </>
  )
}

function ManagingFocusWithUseRef() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const firstNameRef = useRef()
  
  const handleClick = () => {
    firstNameRef.current.focus()
  }
  return (
    <div>
      <FirstName firstNameRef={firstNameRef} onChange={(e) => setFirstName(e.target.value)} value={firstName} />
      <LastName onChange={(e) => setLastName(e.target.value)} value={lastName} />
      <button onClick={handleClick}>Focus First Name</button>
    </div>
  )
}

export default ManagingFocusWithUseRef
