import React, { useState, useContext } from 'react'
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
  const user = useContext(UserContext)
  return <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>
}

const UserContext = React.createContext()

function AppWithUseContext() {
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

export default AppWithUseContext