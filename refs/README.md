# Learn React - Refs

## Focus

React components allow us to essentially create custom elements that resemble HTML which we have complete control over. However, sometimes you actually need a little more control over an HTML element itself. Luckily, React has our back. `Ref` allows us to gain reliable access to DOM elements for manipulation much like the `document.getElementById()` API allows for in JavaScript. 

Note, though, this is out of the ordinary for the typical React dataflow. React operates uni-directional. Parent components render child components. And if a child element needs modification by the parent we use `props` to trigger a re-render. `Props` allow parent components to interact with their children, but to modify the child you have to trigger a re-render. What do we mean by that? Check out the following code.

```jsx
function ChildComponent(props) {
  // this component gets a re-render every time value is updated
  return <label>{props.value}</label>
}
class ParentComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
  }
  render() {
    return <ChildComponent value={this.state.value} />
  }
}
```

Now that we've visualized how `props` interact with children via re-renders, let's dream up another scenario where, instead of `ChildComponent`, we need to interact with an HTML element.

```jsx
class ParentComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { firstName: '', lastName: '' }
  }
  handleChange = (e, key) => {
    this.setState({ [key]: e.target.value })
  }
  focusFirstName = () => {
    // focus first name
  }
  render() {
    return (
      <div>
        <label>First Name</label>
        <input onChange={(e) => this.handleChange(e, 'firstName')} value={this.state.firstName} />
        <label>Last Name</label>
        <input onChange={(e) => this.handleChange(e, 'lastName')} value={this.state.lastName} />
        <button onClick={this.focusFirstName}>Focus First Name</button>
     </div>
    )
  }
}
```

We want to focus the `firstName` element with the button click. Well, that's done easily enough with vanilla JavaScript, right?

```javascript
focusFirstName = () => {
  document.getElementById('firstName').focus()
}
```

That works! However, what if our `input` was in a different component, but we wanted to control it from `ParentComponent`? Well, we can still use `document.getElementById()` for that, too.

```jsx
class FirstName extends React.Component {
  render() {
    return (
      <>
      <label>First Name</label>
      <input id="firstName" onChange={(e) => this.props.onChange(e, 'firstName')} value={this.props.firstName} />
      </>
    )
  }
}
class LastName extends React.Component {
  render() {
    return (
      <>
      <label>Last Name</label>
      <input id="lastName" onChange={(e) => this.props.onChange(e, 'lastName')} value={this.props.lastName} />
      </>
    )
  }
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { firstName: '', lastName: '' }
  }
  handleChange = (e, key) => {
    this.setState({ [key]: e.target.value })
  }
  handleClick = () => {
    document.getElementById('firstName').focus()
  }
  render() {
    return (
      <div>
        <FirstName onChange={this.handleChange} value={this.state.firstName} />
        <LastName onChange={this.handleChange} value={this.state.lastName} />
        <button onClick={this.handleClick}>Focus First Name</button>
     </div>
    )
  }
}
```

What's wrong with this? It works, right? Well, yes, but do you really want to be relying on the HTML `id` attribute of a DOM element that doesn't even exist in the component from which it's referenced? No, we certainly do not want to do that. All sorts of things could go wrong there.

React refs provide a much safer means for us to access these DOM elements. [The React docs](https://reactjs.org/docs/refs-and-the-dom.html) suggest the following as good use cases for refs.
- managing focus, text selection, or media playback
- triggering imperative animations
- integrating with third-party DOM libraries

Let's look at implementing the same `focus()` functionality, but with refs instead.

## *Managing Focus*

```jsx
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { firstName: '', lastName: '' }
    this.firstNameRef = React.createRef()
  }
  handleChange = (e, key) => {
    this.setState({ [key]: e.target.value })
  }
  handleClick = () => {
    this.firstNameRef.current.focus()
  }
  render() {
    return (
      <div>
        <label>First Name</label>
        <input ref={this.firstNameRef} onChange={(e) => this.handleChange(e, 'firstName')} value={this.state.firstName} />
        <label>Last Name</label>
        <input onChange={(e) => this.handleChange(e, 'lastName')} value={this.state.lastName} />
        <button onClick={this.handleClick}>Focus First Name</button>
     </div>
    )
  }
}
```

The first thing we did was declare our `ref`. That's in the `constructor()` - `this.firstNameRef = React.createRef()`. Now we can reference our input with `this.firstNameRef`. The second piece needed is on the `input` itself - `ref={this.firstNameRef}`. That's what ties our `ref` variable to the `input`. Then we access the `ref` via the `current` property, which returns the DOM element or component currently assigned to it, via the `handleClick()` method to focus the `input` - `this.firstNameRef.current.focus()`.

***IMPORTANT** - React refs created with `React.createRef()` can only be used in `class` components. This is because function components **do not** have instances. Fortunately, React has a means for us to use refs inside function components. We'll look at that later, though.*

Hold up, didn't we just break out those inputs into separate components? We did. However, oftentimes simple is better. There was really no need to abstract those elements to their own component other than for example purposes. 

It is possible, though, to reference a custom component with `ref`. Let's see how we'd implement that.

```jsx
class FirstName extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  focusInput = () => {
    this.inputRef.current.focus()
  }
  render() {
    return (
      <>
      <label>First Name</label>
      <input ref={this.inputRef} id="firstName" onChange={(e) => this.props.onChange(e, 'firstName')} value={this.props.firstName} />
      </>
    )
  }
}
class LastName extends React.Component {
  render() {
    return (
      <>
      <label>Last Name</label>
      <input id="lastName" onChange={(e) => this.props.onChange(e, 'lastName')} value={this.props.lastName} />
      </>
    )
  }
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { firstName: '', lastName: '' }
    this.firstNameRef = React.createRef()
  }
  handleChange = (e, key) => {
    this.setState({ [key]: e.target.value })
  }
  handleClick = () => {
    this.firstNameRef.current.focusInput()
  }
  render() {
    return (
      <div>
        <FirstName ref={this.firstNameRef} onChange={this.handleChange} value={this.state.firstName} />
        <LastName onChange={this.handleChange} value={this.state.lastName} />
        <button onClick={this.handleClick}>Focus First Name</button>
     </div>
    )
  }
}
```

Alright, so our parent component, `App`, basically stayed the same as our previous example, except now we have `<FirstName />` and `<LastName />` components. Notice, though, we still use `ref` on the `FirstName` component. Also, look at the difference between the `handleClick()` events.

```jsx
// DOM element ref
handleClick = () => {
  this.firstNameRef.current.focus()
}

// custom element ref
handleClick = () => {
  this.firstNameRef.current.focusInput()
}
```

Instead of `focus()` we called `focusInput()`. Why? `focus()` is a method on an HTML element that can be accessed by vanilla JavaScript. That's the method we're calling on the DOM element `ref`. However, `focusInput()` is a custom method we defined in our `FirstName` component. This was necessary because in the custom element `ref` we are referencing the component and the component only. There is no way to gain direct access to a child's DOM element from the parent via `ref`. There must be that intermediate step, as shown above.

For clarity, let's examine our `FirstName` component.

```jsx
class FirstName extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  focusInput = () => {
    this.inputRef.current.focus()
  }
  render() {
    return (
      <>
      <label>First Name</label>
      <input ref={this.inputRef} id="firstName" onChange={(e) => this.props.onChange(e, 'firstName')} value={this.props.firstName} />
      </>
    )
  }
}
```

First, we gained access to the element we want to manipulate in the `constructor()` - `this.inputRef = React.createRef()`. Next, we placed the `ref` attribute on the `input` - `ref={this.inputRef}`. Finally, we created a method, `focusInput()` that we expose on the class that actually runs the native `focus()` method we mentioned earlier. Now, that method is accessible via the `current` property on the `ref` created in the parent component. That's the intermediary step we mentioned earlier.

## *Triggering Imperative Animations*

 **Imperative animations** are animations which are handled by JavaScript, as opposed to CSS. CSS animations are referred to as **declarative animations**. Historically, developers reach for one vs. the other depending on the need. Imperative animations are great when you need flexibility, but has the trade-off of being less performant because it's being handled by JavaScript on the main thread of the CPU. Of course, this just gets better with time and likely isn't noticeable until you're doing some *real* haavy lifting. CSS animations, though, are much more light-weight in terms of footprint, having much better performance. The trade-off, though, is less flexibility.

 Refs allow us to manipulate animations imperatively. So, again, it's in the same vein as using refs to manage focus. You simply tie your `ref` to the element you want to manipulate and then you can perform any of the API operations you'd like. 

## *Integrating With Third-party DOM Libraries*

Refs are also a great way to handle third-party libraries that interact with the DOM. For example, the [Animejs DOM library](https://animejs.com/). Let's look at how we would integrate with it.

First, we install it.

```
yarn add animejs
```

Next, we import it.

```javascript
import anime from 'animejs/lib/anime.es.js'
```

Now we can integrate it. We'll create a `canvas` element and do some animation with it.

```jsx
class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }
  moveHorizontal = () => {
    anime({ targets: this.canvasRef.current, translateX: 250, duration: 1000, endDelay: 0, direction: 'alternate' })
  }
  render() {
    return <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height} style={{ border: '1px solid #d3d3d3' }}></canvas>
  }
}
```

Remember, we can only use `React.createRef()` with `class` components. So, the first thing we do is create our `ref` - `this.canvasRef = React.createRef()`. Next, we make reference to it in our JSX - `ref={this.canvasRef}`. Finally, we add our method to interact with the `Canvas` component - `moveHorizontal()`.

Notice, in `moveHorizontal()`, we pass `this.canvasRef.current` to `targets`. That's because `targets` is expecting a DOM element or elements. `current` is how we reference the DOM element tied to the `ref`.

Now, let's look at the parent component, `ThirdPartyDOMlibrariesWithRefs`.

```jsx
class ThirdPartyDOMlibrariesWithRefs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {top: 0, left: 0, width: 0, height: 0}
    this.canvasRef = React.createRef()
  }
  componentDidMount() {
    this.setCanvasDefault()
  }
  handleClick = () => this.setState({ width: this.state.width + 20, height: this.state.height + 20 })

  handleHorizontalClick = () => this.canvasRef.current.moveHorizontal()
  
  setCanvasDefault = () => this.setState({top: 0, left: 0, width: 20, height: 20})

  render() {
    return (
      <div style={{ width: '500px', margin: '50px auto' }}>
        <button onClick={this.handleClick}>Click to Enlarge</button>
        <button onClick={this.handleHorizontalClick}>Move Horizontal</button>
        <button onClick={this.setCanvasDefault}>Reset</button>
        <div style={{ margin: '200px' }}>
          <Canvas ref={this.canvasRef} width={this.state.width} height={this.state.height} />
        </div>
     </div>
    )
  }
}
```

The main part here is the `handleHorizontalClick()` method. It called the `moveHorizontal()` method from the `Canvas` component. 

So, as you can see, using `createRef()` is quite similar for all of the recommended scenarios by the React docs.

## Forwarding Refs

Ref forwarding is the means by which we pass refs through components to their children. The word *forwarding* is key here. Think of it kind of like *call forwarding* on your cell phone!

The most likely place you'll encounter ref forwarding is in very generic components that make use of the `children` prop. That's why a common use-case is in a library component.

So, remember when we said `React.createRef()` can only be utilized in `class` components? Well, that's true. But, you probably also made the assumption that refs in general could only be used in `class` components. That's not true, though! We'll see some powerful ways of doing this later. For now, though, let's dig into *ref forwarding*.

Ref forwarding allows us to *invert* the location of the actions that can be taken on a component. `React.createRef()` essentially forced us into encapsulating functionality to the component in which the `ref` lived. And this is good thing! Encapsulation is a good rule to follow when developing. However, there may be some circumstances, such as in very generic, library-type, child components where you may want to allow the parent component to control the its functionality. 

How does that work? Well, until now, we've seen that you can only reference the DOM element *directly* via `ref` if the element exists in the same component in which the `ref` was declared. If the DOM element exists in a child component you need to actually reference the child component, which itself has its own `ref` to the DOM element. Think, for example, of our `Canvas` component. We had to expose our own `moveHorizontal()` method to actually interact with the `canvas` DOM element from the parent component. That's an example of the *forced* encapsulation mentioned earlier. Ref forwarding is our means of bypassing that intermediary and directly access the `canvas` element from the parent component. Let's refactor our `Canvas` component to utilize *ref forwarding*.

```jsx
// from this
class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }
  moveHorizontal = () => {
    anime({ targets: this.canvasRef.current, translateX: 250, duration: 1000, endDelay: 0, direction: 'alternate' })
  }
  render() {
    return <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height} style={{ border: '1px solid #d3d3d3' }}></canvas>
  }
}

// to this
const Canvas = React.forwardRef(({width, height}, ref) => {
  return <canvas ref={ref} width={width} height={height} style={{ border: '1px solid #d3d3d3' }}></canvas>
})
```

Wow. That looks a lot different. Now our component is a function, not a class. Notice the syntax - `React.forwardRef(({width, height}, ref) => { ... })`. That's where the magic happens. The `ref` that's passed from the parent gets *forwarded* (like a phone call), to the `canvas` DOM element directly. Now, let's look at the parent component.

```jsx
class RefForwarding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {top: 0, left: 0, width: 0, height: 0}
    this.canvasRef = React.createRef()
  }
  componentDidMount() {
    this.setCanvasDefault()
  }
  handleClick = () => this.setState({ width: this.state.width + 20, height: this.state.height + 20 })

  handleHorizontalClick = () => {
    anime({ targets: this.canvasRef.current, translateX: 250, duration: 1000, endDelay: 0, direction: 'alternate' })
  }
  
  setCanvasDefault = () => this.setState({top: 0, left: 0, width: 20, height: 20})

  render() {
    return (
      <div style={{ width: '500px', margin: '50px auto' }}>
        <button onClick={this.handleClick}>Click to Enlarge</button>
        <button onClick={this.handleHorizontalClick}>Move Horizontal</button>
        <button onClick={this.setCanvasDefault}>Reset</button>
        <div style={{ margin: '200px' }}>
          <Canvas ref={this.canvasRef} width={this.state.width} height={this.state.height} />
        </div>
     </div>
    )
  }
}
```

Not much has changed here. The only difference is the `handleHorizontalClick()` method. Remember before we were calling the `moveHorizontal()` method that `Canvas` exposed. Our new `Canvas` component is a function component and therefore doesn't expose any methods. So, now with ref forwarding, we can access the `canvas` DOM element directly from the parent. So, we just moved the functionality from `moveHorizontal()` to `handleHorizontalClick()`. That's it! That's ref forwarding. 

Use ref forwarding wisely. Think about encapsulation and the reusability of your components. Here's some tips for deciding:

- use `React.createRef()` (maintain encapsulation) if...
  - the DOM element exists in the same component performing the action on it.
  - the functionality for the DOM element does not depend on the parent component(s) rendering it.
  - you do not want to expose the DOM element for manipulation.
- use ref forwarding (break encapsulation) if...
  - the functionality for the DOM element depends on the parent component(s) rendering it.
  - you're okay with exposing the DOM element for manipulation.

Forwarding refs also make a lot of sense for use in Higher Order Components (HOCs). However, we'll give an example of that when talk more about HOCs in depth. For now, just know that's a valid place for their use.

## `useRef()`