# Learn React - Reducers

We've already talked about `useState` and `useContext` as means of state management. There exists yet another means of managing state in React hooks called `useReducer`. Like `useState` and `useContext`, `useReducer` is new twist on a familiar concept. State reducers have been very popular within the React community for years. The popularity of the Redux library is a testament to this fact. Redux actually became so popular that it was almost seen as synonymous with React. In other words, if you were writing a React app you were likely pairing it with the Redux state reducer library.

Fast forward to now, the React team has given us the state reducer pattern baked into React itself. Since the introduction of hooks many are now reconsidering their use of Redux. Even the creator of Redux himself, Dan Abramov, wrote an article titled [You Might Not Need It](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367), talking about Redux. And that was _way_ before hooks came along.

So, all this talk of reducers begs the question, what are they?! Reducers are functions that help us update state based on actions. A common example is a counter that increments and decrements. Incrementing and decrementing are actions. The count is the state. Another common example is a toggle switch. The actions would be _on_ and _off_. The state is, well, _on_ or _off_ - `true` or `false` we might say. A reducer allows us to add a layer of abstraction to our state management.

Let's start look at some code. Instead of using the typical counter example, we're going to do something a little different. In fact, most examples only focus on two states, _up_ or _down_, _left_ or _right_, _on_ or _off_. We're going to be a little more complex and look at a value with three states. Consider a door, once inside you're greeted with a message welcoming you. Once you leave, you're dismissed with a message thanking you for coming. That gives us two states: _entered_ and _left_. But wait! What about when you've neither entered or left? What state is that? Call it what you want, that doesn't really matter. For our purposes we'll call it _pending_.

First, let's implement this with only `useState`. After we'll see how we could write the same code with `useReducer`.

```jsx
const statuses = {
  pending: { value: "pending", message: "" },
  entered: { value: "entered", message: "Welcome!" },
  left: { value: "left", message: "Goodbye!" },
}

function Door() {
  const [status, setStatus] = useState(statuses.pending)

  return (
    <div className="App">
      {status.value === statuses.entered.value ? (
        <button aria-label="Leave" onClick={() => setStatus(statuses.left)}>
          Leave
        </button>
      ) : (
        <button aria-label="Enter" onClick={() => setStatus(statuses.entered)}>
          Enter
        </button>
      )}
      <p aria-label="message">{status.message}</p>
    </div>
  )
}
```

First we declared a constant `statuses` to reference the different states we would need. We did this to make it easier to update state. Since the `value` and `message` properties need to stay in sync with each other it makes sense to have objects to reference them as a pair, instead of managing state individually for both values. This is a good pattern to follow for synchronized state values. It makes the code more readable and allows less opportunity for the two states to get out of sync.

From there the rest of the code looks pretty simple. The only real logic is choosing which button to display, _Enter_ or _Leave_. You may be thinking, why do we need to add another layer of abstraction here? What makes using a reducer any better? The short answer is - _it doesn't_. However, most examples you'll find for `useReducer` as equally contrived. There's nothing that screams a need for abstraction in such a simplistic example. That's not the purpose. The purpose is to show how to implement `useReducer` with a simple example. It is worth noting that typically it's only in complex scenarios that `useReducer` is warranted, though.

Let's go ahead and refactor our state with `useReducer`.

```jsx
// omitted for brevity
const statuses = { ... }

function Door() {
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
```

Starting with `App`, we replaced our `useState` with `useReducer`. `useReducer` returns two variables, the state, in our case `status`, and a `dispatch` method that accepts an action. That action is made useful in our reducer method. `useReducer` first accepts the reducer function, which we defined outside of our `App` component, followed by the initial state, which is `pending` in our example. The `reducer` method accepts a `state` and an `action` parameter. The `action` parameter is what holds the value we pass into `dispatch`. The `state` parameter is not something we pass in. Rather, it is a reference to the current state managed by the reducer. The `reducer` method's main purpose is to update state based on the `action` provided.

So, that means under the hood, when we call `dispatch({ type: 'left' })` React is making a call to `reducer` with the current state and the action coming from `dispatch`.

What did we achieve by managing our state with `useReducer` as opposed to `useState`? We achieved a layer of abstraction regarding the updating of our state. We also centralized our state updating logic to one method, `reducer`. Finally, `useReducer` gives us the ability to invert the control of our component, a pattern called _inversion of control_. How would that work? `App` could be a standalone component and accept a `reducer` method as a prop, for example, allowing another component to control how `status` is updated. That essentially _inverts_ the control to some other component, which opens up many possibilities for more generic components. Abstraction, centralized state management, and inversion of control - those are the three big wins for `useReducer`.

## _Abstraction_

In our coverage of `useEffect` we briefly made reference to the practice of decoupling actions and updates. Let's talk about that now because `useReducer` is typically our starting point for achieving such a decoupling. We can see this play out in the implementations of the `reducer` and `dispatch` methods. They work together to add a layer of abstraction to our component. Something to note here, when we say _decouple actions from updates_ we are not talking specifically about reducer actions. Actions, in this sense, refer to app behaviors. Updates are the actual updates to the state.

To really drive this point home, let's look at a scenario where adding this abstraction actually helps us resolve a bug!

Imagine we're building a counter. Every second that counter ticks, increasing the count by 1. But wait, there's a twist. We have a button on our counter that can alter the number of ticks taken each second. For example, we start out with 1 tick every second. We click our button and now we tick twice every second. Click it again and we're ticking three times every second. Let's build this out with `useState` and `useEffect`.

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setCount((currentCount) => currentCount + step)
    }, 1000)
    return () => clearInterval(tickInterval)
  }, [step])

  return (
    <>
      <span>{count}</span>
      <button onClick={() => setStep((currentStep) => currentStep + 1)}>Step</button>
    </>
  )
}
```

Can you spot the bug? It's in our `useEffect`. Because we are referencing `step` as a dependency our `tickInterval` will get destroyed every time `step` updates. That means our `count` will reset every time `step` is updated. That's not what we want, though. Now, there are likely many way to solve this - one being to simply remove `step` from the dependencies. However, that goes against the whole idea that `useEffect` should depend on the values it uses. We could also remove the teardown `return` method. Again, though, this goes against what `useEffect` was meant to do. Furthermore, that would create a memory leak. So, what can we do? We can look to `useReducer` to solve this.

```jsx
function reducer({ count, step }, action) {
  switch (action.type) {
    case "tick":
      return { count: count + step, step }
    case "step":
      return { count, step: action.step }
    default:
      return { count, step }
  }
}

const initialState = { count: 0, step: 1 }
const [state, dispatch] = useReducer(reducer, initialState)
const { count, step } = state

useEffect(() => {
  const tickInterval = setInterval(() => {
    dispatch({ type: "tick" })
  }, 1000)
  return () => clearInterval(tickInterval)
}, [])
```

Now we have successfully utilized _abstraction_ to refactor our action, the _tick_, from our update, the _step_. In doing so, we've removed `step` as a dependency from `useEffect` by replacing `setCount((currentCount) => currentCount + step)` with `dispatch({ type: "tick" })`.

Like the previous example, this is quite contrived. But, it is a simple enough example that allows us to focus on the _why_ and not get hung up on the details so that in the future you can solve a more complex problem with a similar implementation.

## _Centralized State Management_

Looking back at our previous example when state was managed with `useState` we'll see that the we're updating the state in-line inside the `button` `onClick` handler. This actually fairly common when the state is of a primitive data type and there is no logic deciding how it should be updated.

```jsx
function Door() {
  const [status, setStatus] = useState(statuses.pending)

  return (
    <div className="App">
      {status.value === statuses.entered.value ? (
        <button aria-label="Leave" onClick={() => setStatus(statuses.left)}>
          Leave
        </button>
      ) : (
        <button aria-label="Enter" onClick={() => setStatus(statuses.entered)}>
          Enter
        </button>
      )}
      <p aria-label="message">{status.message}</p>
    </div>
  )
}
```

It doesn't seem all that difficult in our example here, but imagine some more complex state, where there is logic involved in how it updates. That may require multiple methods, each handling a particular piece of the state updating puzzle.

Now, looking at our `useReducer` refactor, we can see that with the `reducer` method we have moved our state logic to a centralized location. This is not necessary. However, it might make sense depending on the complexity our the state management logic.

```jsx
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
```

Sometimes, it even makes sense to move the logic inside each `case` statement into its own method. That, though, is also something that is determined by how complex the logic is. In our case, an in-line update will suffice.

## _Inversion of Control_

You'll notice in each of our examples the `reducer` method was separated from `useReducer`. Neither of our examples necessitated that separation. It was merely to help read `useReducer(reducer, initialState)` better. However, our reducer could have been written like this:

```jsx
// omitted for brevity
const statuses = { ... }

function Door() {
  const [status, dispatch] = useReducer((state, action) {
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
}, statuses.pending)

  return ( ... ) // omitted for brevity
}
```

We moved our `reducer` method directly into `useReducer`. You'll actually see reducers written this way quite often and for good reason. At first glance it may seem a little more messy. And that's a valid critique. However, what it tells us is more important. It tells us the reducer callback is only used in this reducer. It signals that the method itself is scoped to the component and this component only. Now, you may also see it written this way:

```jsx
const statuses = { ... }

function Door() {
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
  const [status, dispatch] = useReducer(reducer, statuses.pending)

  return ( ... ) // omitted for brevity
}
```

This would also be a valid way to express the same thing, that the reducer is scoped to the component, because the `reducer` method exists inside the component, as opposed to outside.

Moving the reducer method outside of the component is an abstraction that is only necessary once the method itself is needed in at least _one more_ component. Doing so prematurely could set your code up for unnecessary confusion.

With that out of the way, let's talk about **inversion of control**. _IoC_, as it's sometimes referred to, is a means of _inverting_ control of a piece of code, maybe a component, to another piece of code, maybe another component. If you're familiar with any server-side languages such as Java or C# you've likely utilized IoC before. Typically its also paired with **Dependency Injection**, or _DI_. However, in React, we make use of `props` and _composition_ to solve the same problems that _DI_ solves.

So, how can `useReducer` help us invert control? How can `useReducer` help us give control of a component to another component? We'll revisit this topic when we cover **custom hooks**. For now, though, we'll introduce _IoC_ with a `useReducer` implementation.

Revisiting our `Door` component. Let's see how we could give control of the actions to a parent component.

```jsx
const statuses = { ... }  // omitted for brevity

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
  return ( ... )  // omitted for brevity
}
```

We just allowed `App` to have control over the updates for an action declared in the child component `Door`. We inverted control! Now, we could take a step further and a default reducer that could be overridden like `function Door({ reducer = defaultReducer }) { ... }` but we'll save that for another lesson where we take a deep dive into the **State Reducer Pattern**. For now, understanding the basics of inverting control of a component with `useReducer` will suffice.
