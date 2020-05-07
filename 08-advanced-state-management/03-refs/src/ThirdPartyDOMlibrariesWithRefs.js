import React from 'react'
import './App.css'
import anime from 'animejs/lib/anime.es.js'

class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }
  moveHorizontal = () => {
    anime({ targets: this.canvasRef.current, translateX: 250, duration: 1000, endDelay: 0, direction: 'alternate' })
  }
  render() {
    return <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height} style={{ border: '1px solid #d3d3d3' }}></canvas>
  }
}

class ThirdPartyDOMlibrariesWithRefs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {top: 0, left: 0, width: 0, height: 0}
    this.canvasRef = React.createRef()
  }
  componentDidMount() {
    this.setCanvasDefault()
  }
  handleClick = () => this.setState({ width: this.state.width + 20, height: this.state.height + 20 })

  handleHorizontalClick = () => this.canvasRef.current.moveHorizontal()
  
  setCanvasDefault = () => this.setState({top: 0, left: 0, width: 20, height: 20})

  render() {
    return (
      <div style={{ width: '500px', margin: '50px auto' }}>
        <button onClick={this.handleClick}>Click to Enlarge</button>
        <button onClick={this.handleHorizontalClick}>Move Horizontal</button>
        <button onClick={this.setCanvasDefault}>Reset</button>
        <div style={{ margin: '200px' }}>
          <Canvas ref={this.canvasRef} width={this.state.width} height={this.state.height} />
        </div>
     </div>
    )
  }
}

export default ThirdPartyDOMlibrariesWithRefs
