

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { status: STATUS.neverEntered }
    this.handleEnter = this.handleEnter.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
  }
  STATUS = { neverEntered: 'neverEntered', entered: 'entered', left: 'left' }

  Inside(props) {
    return <button onClick={props.handleClick}>Leave</button>
  }
  Outside(props) {
    return <button onClick={props.handleClick}>Enter</button>
  }


  handleEnter() {
    this.setState({ status: STATUS.entered })
  }

  handleLeave() {
    this.setState({ status: STATUS.left })
  }

  render() {
    return (
      <>
        {this.state.status === STATUS.entered ? <Inside handleClick={this.handleLeave} /> : <Outside handleClick={this.handleEnter} />}
        {this.state.status === STATUS.entered &&
          <div style={{ border: 'solid 5px pink', margin: 20, padding: 20, fontSize: 16 }}>Hello there!</div>
        }
      </>
    )
  }
}
ReactDOM.render(<App />, root);