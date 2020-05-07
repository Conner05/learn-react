import React from 'react'
import './App.css'

class FirstName extends React.Component {
  render() {
    return (
      <>
      <label>First Name</label>
      <input id="firstName" onChange={(e) => this.props.onChange(e, 'firstName')} value={this.props.firstName} />
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

class ManagingFocusWithoutRefs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { firstName: '', lastName: '' }
  }
  handleChange = (e, key) => {
    this.setState({ [key]: e.target.value })
  }
  handleClick = () => {
    document.getElementById('firstName').focus()
  }
  render() {
    return (
      <div>
        <FirstName onChange={this.handleChange} value={this.state.firstName} />
        <LastName onChange={this.handleChange} value={this.state.lastName} />
        <button onClick={this.handleClick}>Focus First Name</button>
     </div>
    )
  }
}

export default ManagingFocusWithoutRefs
