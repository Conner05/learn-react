import React, { useReducer } from "react"
import "./App.css"

const statuses = {
  pending: { value: "pending", message: "" },
  entered: { value: "entered", message: "Welcome!" },
  left: { value: "left", message: "Goodbye!" },
}

function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "pending":
        return statuses.pending
      case "entered":
        return statuses.entered
      case "left":
        return statuses.left
      default:
        return statuses.pending
    }
  }
  return <Door reducer={reducer} />
}

function Door({ reducer }) {
  const [status, dispatch] = useReducer(reducer, statuses.pending)

  return (
    <div className="App">
      {status.value === statuses.entered.value ? (
        <button aria-label="Leave" onClick={() => dispatch({ type: "left" })}>
          Leave
        </button>
      ) : (
        <button aria-label="Enter" onClick={() => dispatch({ type: "entered" })}>
          Enter
        </button>
      )}
      <p aria-label="message">{status.message}</p>
    </div>
  )
}

export default App
