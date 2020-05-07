# Learn React - Hooks - useState

Hooks are the new hotness in React. Hooks combined with functional components allow us to move away from class components. Take a look at the `App` component to see how the same component from our previous module on Testing was converted from a class component to a function component. 

Follow along with the **TODO** section below to really get a good understanding of the `useState` hook.

## TODO

In this module we're going to refactor the example from the Testing module to use hooks. What's so cool about this is that we're going to demonstrate the importance of *expectations not implementations* testing. Because we tested our expectations and we are only refactoring, not changing any behaviors, we shouldn't have to add, modify, or remove any tests! In fact, we can have a reasonable amount of confidence our refactor works without even running the app! Let's dive in.

### `useState`

The most common hook you'll run into is the `useState` hook. It's intent is to replace `this.state` in `class` components. Let's take a look at how we would go about replacing `this.state` in our `Start` component.

```javascript
this.state = { status: this.STATUS.neverEntered }
```

Our state only has one property, `status`. It's also a primitive type, a `string`. This will be a good first example for `useState`. Here's how we declare a `useState` hook:

```javascript
const { status, setStatus } = useState(STATUS.neverEntered)
```

This looks quite different. Let's take it piece by piece. On the right-hand side of the equation we have `useState(STATUS.neverEntered)`. `useState()` comes from the `React` library. Sometimes you'll also see this referenced as `React.useState()`. Notice we also passed in a value to `useState()`, `STATUS.neverEntered`. `useState()` takes an **optional** default value. `useState()` can also do something called **lazy initialization**. It looks like this: 

```javascript
const { someState, setSomeState } = useState(() => getInitialValue())
```

Lazy initialization will fetch the initial state on the **initial** render of a component. This is useful for "expensive" initialization code that doesn't need to happen on every re-render.

Okay, **back to our `Start` component now**. Moving to the left side of the equation, `const { status, setStatus }`, we are using **destructuring** and giving names to the two items produced from the `useState` function. The first, `status`, is the actual state value. This is the equivalent to `this.state.status`. The second value, `setStatus`, is a function used to update the `status` value. It's equivalent to `this.setState()`. So, each `useState` gives us our our `this.state` and `this.setState()`. This means that if we wanted to, we could have another state, and another, and another - you get it. Let's look at that. Also, the **names do not matter**. They're variables. It's convention, though, to use `val` and `setVal`.

```javascript
this.state = { value1: '', value2: '', value3: '' }
```

Above is how we would declare three values managed by `class` component state.

```javascript
const { value1, setValue1 } = useState('')
const { value2, setValue2 } = useState('')
const { value3, setValue3 } = useState('')
```

Above is behaviorally the same as the previous example, just using `useState` inside a function component. It's important to note that `useState` can handle objects, too. So, if it made sense, we could also declare the same state like this:

```javascript
const { valueObj, setValueObj } = useState({ value1: '', value2: '', value3: '' })
```

It's important to note that `setValueObj` from above does not necessarily work as one might expect. For example, let's take a look at two pieces of code:

```javascript
// using useState to manage a primitive type
const { value1, setValue1 } = useState('')

// updating the value of a primitive type is relatively easy and straight forward
const updateValue1 = (val) => setValue1(val)

// here's a state managed object
const { valueObj, setValueObj } = useState({ value1: '', value2: '', value3: '' })

// if we now want to update value2 it looks a little different
const updateValue2 = (val) => setValueObj((currentState) => return { ...currentState, value2: val })
```

That last line is a doosey, eh? You may be thinking, *But, it wasn't that hard in class components!* Well, actually, it's the same. In our class component state each value inside `this.state` was treated as separate variables by `this.setState`. That's why you could do this `this.setState({ value1: 'newValue' })` when `this.state` looked like `this.state = { value1: '', value2: '', value: '' }`. They were three separate primitives. That's not the same as `const { valueObj, setValueObj } = useState({ value1: '', value2: '', value3: '' })`. `valueObj` is an `object`, not a `string`!. That would be the equivalent of `this.state = { valueObj: { value1: '', value2: '', value3: '' }}`. 

Hopefully that little excursion helps along the way while we learn more about Hooks.

**Back to our `Start` component**, again. Before we can actually change our state to `useState` we need to change our component from a class component to a function component.

```javascript
// from this
class Start extends React.Component { ... }

// to this
function Start() { ... }
```

Now let's manage state with a hook:

```javascript
// from this
this.state = { status: this.STATUS.neverEntered }

// to this
const [status, setStatus] = useState(STATUS.neverEntered)
```

Next, we'll update all our references to `this.setState()`.

```javascript
// from this
handleEnter = () => this.setState({ status: this.STATUS.entered })
handleLeave = () => this.setState({ status: this.STATUS.left })

// to this
const handleEnter = () => setStatus(STATUS.entered)
const handleLeave = () => setStatus(STATUS.left)
```

Here we had to do a few things. Notice we declared the functions with `const`. That's important because now we're in a function, not a class. Similarly, because we're no longer in a class we no longer have to reference all outside methods and variables with `this`. Also, because our state is a primitive type we don't have to use `{ }` in our `setStatus()` method like we did using `this.setState()`.

Since React function components don't have a render method (the entire function gets re-rendered), the next thing we need to do is move our code out of the render method and into the function.

```javascript
function Start() {
  const STATUS = { neverEntered: 'neverEntered', entered: 'entered', left: 'left' }
  const [status, setStatus] = useState(STATUS.neverEntered)

  const handleEnter = () => setStatus(STATUS.entered)
  const handleLeave = () => setStatus(STATUS.left)

  let message
  let button = <Outside handleClick={this.handleEnter} />
  const status = this.state.status
  if (status === this.STATUS.entered) {
    message = <GreetingMessage />
    button = <Inside handleClick={this.handleLeave} />
  } else if (status === this.STATUS.left) {
    message = <GoodbyeMessage />
    button = <Outside handleClick={this.handleEnter} />
  }
  return (
    <>
      {button}
      {message}
    </>
  )
}
```

We've still got some refactoring to do. We need to update all our references to our `status` state and the `handleEnter` and `handleLeave` methods.

```javascript
let message
let button = <Outside handleClick={handleEnter} />
if (status === STATUS.entered) {
  message = <GreetingMessage />
  button = <Inside handleClick={handleLeave} />
} else if (status === STATUS.left) {
  message = <GoodbyeMessage />
  button = <Outside handleClick={handleEnter} />
}
```

We're done. Let those tests rip! 

```javascript
yarn test
```
