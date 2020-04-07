import React from 'react'
import One from './01/start'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { activeLesson: 0 }
  }
  lessons = [<></>, <One />]
  lessonsIndex = []

  handleClick = (lessonIndex) => this.setState({ activeLesson: lessonIndex })
  handleClearClick = () => this.setState({ activeLesson: 0 })

  render() {
    const activeLesson = this.lessons[this.state.activeLesson]
    return (
      <div className="App">
        <div className="col col-center">
          <div className="row">
            <h3>Select Lesson</h3>
          </div>
          <div className="row lesson-select">
            {this.lessons.map((lesson, index) => {
              return index > 0 ? <button data-testid="lesson-button" key={index} onClick={() => this.handleClick(index)}>{index}</button> : null
            })}
            <button onClick={this.handleClearClick}>Clear</button>
          </div>
          {this.state.activeLesson > 0 && <div data-testid="lesson" className="row lesson">
            {activeLesson}
          </div>}
        </div>
      </div>)
  }
}

export default App
