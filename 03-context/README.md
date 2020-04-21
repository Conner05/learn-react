# Learn React - Context

The Context API, one may even call it a pattern as well, gives us a way to share data, or state, among components without having to pass the state as props.

Context is not something that has always existed in React. In fact, it's relatively new. It helps solve the problem of *prop drilling*. For more info on prop drilling and what is see [this article](https://kentcdodds.com/blog/prop-drilling). Since React's data-binding is **one-way**, **Context** allows us to be more flexible when sharing data between components.

## The Prop Drilling Method

Here's an example of *prop drilling*, a technique you may see used quite often. In it you'll notice the `user` trickles down three component layers before it's used.

```jsx
import React, { useState } from 'react'
import './App.css'

function Header() {
  return <h2 style={{ color: 'limegreen' }}>Now we're in the app header.</h2>
}
function Content({ user }) {
  return (
    <div>
      <h2 style={{ color: 'limegreen' }}>Now we're in the content.</h2>
      <ContentBody user={user} />
    </div>
  )
}
function ContentBody({ user }) {
  return (
    <div>
      <h3 style={{ color: 'lightgreen' }}>Now we're in the content body.</h3>
      <ContentBodyHeader user={user} />
    </div>
  )
}
function ContentBodyHeader({ user }) {
  return <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>
}
function App() {
  const [user, setUser] = useState()
  return (
    <div className="App">
      <h1 style={{ color: 'green' }}>Now we're in the App</h1>
      <Header user={user} />
      {user
        ? <Content user={user} />
        : <button onClick={() => setUser({ name: 'Conner' })}>Login</button>
      }
      {user && <button onClick={() => setUser(null)}>Logout</button>}
    </div>
  )
}

export default App
```

## The Context Way

The following code is the same as above, just refactored to use Context.

```jsx
/////////////////////////////////////////////////
// leaving out the other functions for brevity
/////////////////////////////////////////////////
const UserContext = React.createContext()

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
  return (
    <UserContext.Consumer>
      {user => <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>}
    </UserContext.Consumer>
  )
}

function AppWithContext() {
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
```

Notice the difference? First, we added `const UserContext = React.createContext()`. That is our declaration for the Context. Now, with that existing outside all the other components, we can reference the Context by a `Provider` or a `Consumer`. Let's take a look at each one.

The `Provider` is the wrapper for the context. It's from within that wrapper the context can be referenced. In our app, we wrapped the entire `AppWithContext` component. 

```jsx
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
```

However, we could have done something like this:

```jsx
return (
  <div className="App">
    <h1 style={{ color: 'green' }}>Now we're in the App</h1>
    <Header />
    <UserContext.Provider value={user}>
      {user
        ? <Content />
        : <button onClick={() => setUser({ name: 'Conner' })}>Login</button>
      }
    </UserContext.Provider>
    {user && <button onClick={() => setUser(null)}>Logout</button>}
  </div>
)
```

That would have scoped the `UserContext` to essentially the `Content` component. That means if we tried to reference the `UserContext` by way of a `Consumer` inside the `Header` component we would get an error. Why? Because `Header` is outside the `UserContext.Provider`. Doing this allows us to scope an app state to only the components that need it, and, by extension, keep components that shouldn't reference the state from doing so.

`Context.Provider` takes a prop called `value`. That's what gets managed by the context. In our example, we take the `user` object which we declared using the `useState` hook and send it to the `value` prop for `UserContext.Provider`. That means any changes to `user` via `setUser` inside `AppWithContext` will trigger `UserContext` to update its value. This update triggers *all* `Consumer` components to re-render.

`Context.Consumer` is the piece necessary to make use of the data managed by the `Context`. It works essentially that same as `Provider` in that the `value` can only be referenced *inside* the `Consumer`. Notice this small detail, though. `user` is accessed by invoking a `function` inside the `Consumer`.

```jsx
function ContentBodyHeader() {
  return (
    <UserContext.Consumer>
      {user => <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>}
    </UserContext.Consumer>
  )
}
```

`Context` is quite flexible in that we can actually nest multiple contexts if needed.

```jsx
return (
  <AppSettingsContext.Provider value={settings}>
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
  <AppSettingsContext.Provider>
)
```

Components can also handle multiple `Consumer` elements.

```jsx
function ContentBodyHeader() {
  return (
    <AppSettingsContext.Consumer>
      {settings => (
        <UserContext.Consumer>
          {user => <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>}
        </UserContext.Consumer>
      )}
    </AppSettingsContext.Consumer>
  )
}
```

## `useContext`

The Context API actually has an even easier method for consuming contexts, the `useContext` hook. `useContext` is a built in method for function components that they can use to gain access to the context value. As an example, let's look at the same `Consumer` from before, but refactored to use `useContext`.

```jsx
function ContentBodyHeader() {
  const user = useContext(UserContext)
  return <h5 style={{ color: 'greenyellow' }}>Now we're in the body header. Hi, {user?.name}</h5>
}
```

Wow. That's a lot cleaner. The component only needs access to the context itself, `UserContext` in our case, in order to pull this off. You can see the full code in the `AppWithUseContext` component.

It's possible to use `useContext` to clean up our code even more, but it involves some more advanced concepts that we'll cover later when we talk about Custom Hooks. Stay tuned.

## *With Great Power Comes Great Responsibility*

When it comes to using Context, we need to be careful not to *overuse* it. Sure, it's appropriate to solve some problems. However, **it's not a silver bullet for multi-component state management.** Far from it, actually. Let's talk about why.

At first glance the `Context` API looks great. It allows us to get rid of pesky prop drilling scenarios and simplify our state sharing among components. However, it actually **does not** get rid of prop drilling. It only masks it. You see, effectively what `Context` does is *hide* or *assume* (however you want to look at) the props for the value it's managing. Okay, so what? What's wrong with that? Well, a few things. 

- You couple your component to the context.
  - This means your component is no longer reusable outside of the `<Context.Provider></Context.Provider>`. Maybe you're ok with that. But you better be sure before you use it.
- You lose the explicit nature of a prop.
  - While it's true more props typically means more problems, it's also true that props are how we can identify what a component *needs* in order to operate. We lose this when we use `Context`. That's okay for some things. For others, though, it's not. You need to make that decision.
- It can potentially promote bad design patterns.
  - We'll dedicate the next section to this discussion.

### **Context can potentially promote bad design patterns**

Up to now it may appear as if our only options for achieving state management across multiple components is with either prop drilling or the Context API. However, *prop drilling vs. Context* is a false dichotomy. We have a third option available to us. And it's actually a fundamental concept in React - **Composition**.

We can use composition to solve this problem and avoid both *prop drilling* and the **Context** API. We've discussed composition before. It's the way in which React was made to share components. We'll make use of the **containment** pattern by utilizing the `children` prop to achieve our result. To do this, we'll go back to our first example, our `App` component, which uses prop drilling to solve the problem.

```jsx
function AppWithComposition() {
  const [user, setUser] = useState()
  return (
    <div className="App">
      <h1 style={{ color: 'green' }}>Now we're in the App</h1>
      <Header />
      {user
        ? <Content user={user} />
        : <button onClick={() => setUser({ name: 'Conner' })}>Login</button>
      }
      {user && <button onClick={() => setUser(null)}>Logout</button>}
    </div>
  )
}
```

Let's start with `Content`. The component is essentially a *black box*, right? If we expose some of the *innards* of `Content` and it's subsequent children using composition then we can get around our prop drilling problem.

```jsx
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
```

Notice what we did in the `return` for `AppWithComposition`. We utilized the `children` prop to nest our components. Why is this better, though? This implementation is better than prop drilling because it allows our components to be freed from the prop(s) they don't care about, making each component cleaner, more flexible, and more maintainable. This implementation is also better than Context because it doesn't *hide* the fact that `ContentBodyHeader` needs the `user` prop, and it allows `ContentBodyHeader` to be more flexible and live outside of any `Provider` for a `Context`. Also, it's better than both prop drilling and Context because we're being more explicit with what we're trying to render, avoiding the *black box* scenario.

We were also able to move the code rendering the `Logout` button inside `Content`, too.

As for the child components, we simply removed the props they were accepting and replaced them with `children`. 

Isn't that neat? You see, the prior implementations of `Content`, `ContentBody`, and `ContentBodyHeader` sealed their fate. What they contained was explicitly placed inside each component. Now, though, that we've implemented with composition, each component has been freed, freed to accept any content anyone wishes to provide. Thank you, composition.

## Conclusion

To wrap up, we've talked a lot about the benefits, power, and different implementations of the `Context` API. However, as we've seen, it's not a silver bullet. Some may go as far to say you probably *don't* need it. It's always a good idea to at least consider using composition as an alternative implementation. Use your newfound tools wisely.