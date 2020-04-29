import React from 'react'
import './App.css'

class FirstName extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  focusInput = () => {
    this.inputRef.current.focus()
  }
  render() {
    return (
      <>
      <label>First Name</label>
      <input ref={this.inputRef} id="firstName" onChange={(e) => this.props.onChange(e, 'firstName')} value={this.props.firstName} />
      </>
    )
  }
}

class LastName extends React.Component {
  render() {
    return (
      <>
      <label>Last Name</label>
      <input id="lastName" onChange={(e) => this.props.onChange(e, 'lastName')} value={this.props.lastName} />
      </>
    )
  }
}

class ManagingFocusWithRefs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { firstName: '', lastName: '' }
    this.firstNameRef = React.createRef()
  }
  handleChange = (e, key) => {
    this.setState({ [key]: e.target.value })
  }
  handleClick = () => {
    this.firstNameRef.current.focusInput()
  }
  render() {
    return (
      <div>
        <FirstName ref={this.firstNameRef} onChange={this.handleChange} value={this.state.firstName} />
        <LastName onChange={this.handleChange} value={this.state.lastName} />
        <button onClick={this.handleClick}>Focus First Name</button>
     </div>
    )
  }
}

export default ManagingFocusWithRefs
