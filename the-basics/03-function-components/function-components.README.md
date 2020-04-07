# The Basics - Function Components

Up to this point our JSX elements have been variables. Now we will add some complexity by showing how we can move from variables to components - starting with **function components**.

A function component can be defined just like any other function in Javascript. Remember in our previous lesson we defined a JSX element like so:

```javascript
const newDiv = <div className=''>Hello World</div>
```

Let's look at how to define that same element, but treat it as a React function component.

```javascript
// function components can be defined this way
function Greeting() {
  return <div className=''>Hello World</div>
}

// and also this way (with arrow functions)
const Greeting = () => <div className=''>Hello World</div>
```

Note also the capitalization of the function name `Greeting`. JSX knows it's dealing with a React component if the element is capitalized. Otherwise, it is treated as an HTML element. You can do some `console.log()`ing to really see the difference in how the two are rendered.

## Props

We talked a little about `props` in the previous lesson on JSX. Now, we'll see how they're typically used out in the wild.

```javascript
function Greeting(props) {
  return <div {...props} />
}
ReactDOM.render(<Greeting className='' children='Hello World' />, document.getElementById('root'))
```

Notice the call to render `Greeting`: `<Greeting className='' children='Hello World' />`. It's a self closing element with the same attributes we've discussed before: `className` and `children`. 

In `Greeting()` the `div` gets rendered the same - by displaying `props` in a self-closing element. The `props`, though, are now coming in as a property on the method. You'll see this method of passing `props` used quite frequently in React.

Head over to the exercise and give that a try!