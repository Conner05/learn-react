import React, { useState } from 'react'
import Start from './start'
import Solution from './solution'
import './App.css'

function App() {
  const [activeLesson, setActiveLesson] = useState('Clear')
  const lessons = [
    { name: 'Start', component: <Start /> },
    { name: 'Solution', component: <Solution /> },
    { name: 'Clear', component: <></> }
  ]
  const handleClick = (lessonName) => setActiveLesson(lessonName)
  const { component } = lessons.find((lesson) => lesson.name === activeLesson)
  return (
    <div className="App">
      <div className="col col-center">
        <div className="row">
          <h3>Select Lesson</h3>
        </div>
        <div className="row lesson-select">
          {lessons.map(({ name }) => {
            return <button key={name} onClick={() => handleClick(name)}>{name}</button>
          })}
        </div>
        {activeLesson !== 'Clear' && <div data-testid={`${activeLesson}-lesson`} className="row lesson">
          {component}
        </div>}
      </div>
    </div>)
}

export default App
