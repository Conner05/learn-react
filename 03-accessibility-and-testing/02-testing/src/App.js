import React from 'react'
import Start from './start'
import Solution from './solution'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { activeLesson: 'Clear' }
  }
  lessons = [
    { name: 'Start', component: <Start /> },
    { name: 'Solution', component: <Solution /> },
    { name: 'Clear', component: <></> }
  ]
  handleClick = (lessonName) => this.setState({ activeLesson: lessonName })

  render() {
    const { component: activeLesson } = this.lessons.find((lesson) => lesson.name === this.state.activeLesson)
    return (
      <div className="App">
        <div className="col col-center">
          <div className="row">
            <h3>Select Lesson</h3>
          </div>
          <div className="row lesson-select">
            {this.lessons.map(({ name }) => {
              return <button key={name} onClick={() => this.handleClick(name)}>{name}</button>
            })}
          </div>
          {this.state.activeLesson !== 'Clear' && <div data-testid={`${this.state.activeLesson}-lesson`} className="row lesson">
            {activeLesson}
          </div>}
        </div>
      </div>)
  }
}

export default App
