import React, { useState } from 'react'
import './App.css'

function Header() {
  return <h2 style={{ color: 'limegreen' }}>Now we're in the app header.</h2>
}

function Content({ children }) {
  return (
    <div>
      <h2 style={{ color: 'limegreen' }}>Now we're in the content.</h2>
      {children}
    </div>
  )
}

function ContentBody({ children }) {
  return (
    <div>
      <h3 style={{ color: 'lightgreen' }}>Now we're in the content body.</h3>
      {children}
    </div>
  )
}

function ContentBodyHeader({ user }) {
  return <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>
}

function AppWithComposition() {
  const [user, setUser] = useState()
  return (
    <div className="App">
      <h1 style={{ color: 'green' }}>Now we're in the App</h1>
      <Header />
      {user
        ? <Content>
          <ContentBody>
            <ContentBodyHeader user={user} />
          </ContentBody>
          <button onClick={() => setUser(null)}>Logout</button>
        </Content>
        : <button onClick={() => setUser({ name: 'Conner' })}>Login</button>
      }
    </div>
  )
}

export default AppWithComposition