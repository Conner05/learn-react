# The Basics - createElement API

React provides an API that can be used to inject HTML into the DOM. Consider the following vanilla Javascript code:

```javascript
const root = document.getElementById('root')
const newDiv = document.createElement('div')
newDiv.className = ''
newDiv.textContent = 'Hello World'
root.appendChild(newDiv)
```

That takes the element `root` and injects a `div` inside of it with the content *Hello World*.

React provides a way for us to do the same thing with a little less code:

```javascript
const root = document.getElementById('root')
const newDiv = React.createElement('div', { className: '' }, 'Hello World')
ReactDOM.render(newDiv, root)
```

See the API's docs for more detail - https://reactjs.org/docs/react-api.html#createelement