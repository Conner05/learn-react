import React from 'react'
import ManagingFocusWithRefs from './ManagingFocusWithRefs'
import ThirdPartyDOMlibrariesWithRefs from './ThirdPartyDOMlibrariesWithRefs'
import RefForwarding from './RefForwarding'
import ManagingFocusWithUseRef from './ManagingFocusWithUseRef'
import ManagingStateWithUseRef from './ManagingStateWithUseRef'

class App extends React.Component {
  render() {
    return <ManagingStateWithUseRef />
  }
}

export default App
