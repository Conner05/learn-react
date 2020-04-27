# The Basics - JSX

`React.createElement()` can be a little verbose. That's why React created **JSX**. What is JSX? It's essentially a way to write HTML in Javascript. 
That may sound weird, but it's really great. Here's a link to the official React docs explaining JSX - https://reactjs.org/docs/introducing-jsx.html

Let's look at the code from the previous lesson on `createElement()`.

```javascript
const root = document.getElementById('root')
const newDiv = React.createElement('div', { className: '' }, 'Hello World')
ReactDOM.render(newDiv, root)
```

We can take that and transform it into JSX by doing the following:

```javascript
const root = document.getElementById('root')
const newDiv = <div className=''>Hello World</div>
ReactDOM.render(newDiv, root)
```

Notice what we did. We went from `React.createElement('div', { className: '' }, 'Hello World')` to `<div className=''>Hello World</div>`. That's the magic of JSX. It reads like HTML but has all the power of Javascript. 

## Babel

This is made possible by Babel. Babel is a compiler for Javascript. It takes, what it refers to as, next-gen Javascript and compiles it to Javascript that the browser can natively understand. See their docs for more info: https://babeljs.io/docs/en/

To get the code working, we need to make reference to the Babel library. To do so, we'll add the following inside our `<head></head>` tag.

```HTML
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

Babel offers [an online compiler](https://babeljs.io/repl/#?presets=react&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA) you can use to see how it actually compiles JSX into `createElement()` calls. [Check it out](https://babeljs.io/repl/#?presets=react&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA).

## Interpolation

Let's understand what **interpolation** looks like in JSX.

If I want to put some Javascript in my JSX I can use curly braces `{ }` as a *window* into Javascript land. When I'm in Javascript land I can write any sort of Javascript I want. For example:

```javascript
const message = 'Hello World'
const newDiv = <div className=''>{message}</div>
```

Inside the `div` I rendered the variable `message` by way of the curly braces `{ }`.

Similarly, if I had a Javascript object that held, for example, attributes for my `div`, I could render them in my JSX using interpolation as well.

```javascript
const root = document.getElementById('root')
const props = { className: 'red', children: 'Hello World' }
const newDiv = <div {...props} />
ReactDOM.render(newDiv, root)
```

So, we did a couple of things there. Notice the `div` is self-closing `<div />`, yet, it will still render *Hello World* inside. That's because of the `children` property on the `props` object. JSX *knows* the `children` property, and therefore treats it as a special case. JSX knows that anything in the `children` property gets rendered inside the element, in this case, the `div`. Secondly, you'll notice the `className` property. `className` is also a *known* property by JSX. Since we placed `props` inside the self-contained `div` JSX attempts to render the properties in `props` as attributes on the `div` element. JSX reads attributes in `camelCase` style, whereas HTML reads as `lowercase`. Most attributes are either the same name or very similar. In this case, we have `className` instead of `class`. The React Docs have an excellent article on the in's and out's of JSX. It's worth a read: [JSX In Depth](https://reactjs.org/docs/jsx-in-depth.html).

### Overriding props

JSX provides a means of setting default attributes to be overridden by props, as well as attributes to override props. Here's what that looks like:

```javascript
const root = document.getElementById('root')
const props = { className: 'red', children: 'Hello World' }
const newDiv = <div className='blue' {...props} />
ReactDOM.render(newDiv, root)
```

Above, we have a default `className` of `blue`. However, in `props` we've also defined a class, `red`. Because `props` came *after* the `className` attribute on the `div` the `red` class will override the default class of `blue`. Now, if we did something like this:

```javascript
const root = document.getElementById('root')
const props = { className: 'red', children: 'Hello World' }
const newDiv = <div {...props} className='blue' />
ReactDOM.render(newDiv, root)
```

Now, no matter what we pass into `props` for `className` it won't matter. Because `className='blue'` is set *after* `{...props}` the `blue` class will always supersede.

Basically, if you haven't already noticed, **JSX renders the last occurrence of the attribute**.

**Remember**, there's a lot of nuance to JSX, maybe some of those questions are already surfacing for you, refer to the [React Docs JSX In Depth article](https://reactjs.org/docs/jsx-in-depth.html) for all kinds of good stuff.