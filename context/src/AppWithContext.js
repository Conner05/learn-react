import React, { useState } from 'react'
import './App.css'

function Header() {
  return <h2 style={{ color: 'limegreen' }}>Now we're in the app header.</h2>
}

function Content() {
  return (
    <div>
      <h2 style={{ color: 'limegreen' }}>Now we're in the content.</h2>
      <ContentBody />
    </div>
  )
}

function ContentBody() {
  return (
    <div>
      <h3 style={{ color: 'lightgreen' }}>Now we're in the content body.</h3>
      <ContentBodyHeader />
    </div>
  )
}

function ContentBodyHeader() {
  return (
    <UserContext.Consumer>
      {user => <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>}
    </UserContext.Consumer>
  )
}

const UserContext = React.createContext()

function AppWithContext() {
  const [user, setUser] = useState()
  return (
    <UserContext.Provider value={user}>
      <div className="App">
        <h1 style={{ color: 'green' }}>Now we're in the App</h1>
        <Header />
        {user
          ? <Content />
          : <button onClick={() => setUser({ name: 'Conner' })}>Login</button>
        }
        {user && <button onClick={() => setUser(null)}>Logout</button>}
      </div>
    </UserContext.Provider>
  )
}

export default AppWithContext