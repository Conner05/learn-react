import React, { useState } from 'react'
import './App.css'

function Header() {
  return <h2 style={{ color: 'limegreen' }}>Now we're in the app header.</h2>
}

function Content({ user }) {
  return (
    <div>
      <h2 style={{ color: 'limegreen' }}>Now we're in the content.</h2>
      <ContentBody user={user} />
    </div>
  )
}

function ContentBody({ user }) {
  return (
    <div>
      <h3 style={{ color: 'lightgreen' }}>Now we're in the content body.</h3>
      <ContentBodyHeader user={user} />
    </div>
  )
}

function ContentBodyHeader({ user }) {
  return <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>
}

function App() {
  const [user, setUser] = useState()
  return (
    <div className="App">
      <h1 style={{ color: 'green' }}>Now we're in the App</h1>
      <Header />
      {user
        ? <Content user={user} />
        : <button onClick={() => setUser({ name: 'Conner' })}>Login</button>
      }
      {user && <button onClick={() => setUser(null)}>Logout</button>}
    </div>
  )
}

export default App