# The Basics - Composition

In React, we favor composition over inheritance. While all components inherit the `React.Component` class, that's as far as it goes. From there, we use composition. This is because React was built with composition in mind, and, therefore, is well-suited for it.

One use-case where a developer may want to use inheritance is that of **containment**. Let's look at how we would solve such a problem in React.

Maybe your app has several tables where the table skeleton is the same, but the content differs. In other words, the table doesn't know what children it contains. React has a special prop just for situations like this. It's called `children`.

```javascript
function PrettyTable(props) {
  return (
    <div style={{color: 'pink', fontSize: 16, margin: '0 auto', width: 200}}>
      {props.children}
    </div>
  )
}
```

From here we can now do something like this:

```javascript
class App extends React.Component {
  render() {
    return (
      <PrettyTable>
        <table>
          <thead>
            <tr><th>Some</th><th>Content</th></tr>
          </thead>
          <tbody>
            <tr><td>It's</td><td>Here</td></tr>
            <tr><td>And</td><td>Here</td></tr>
          </tbody>
        </table>
      </PrettyTable>
    )
  }
}
```

We've told `PrettyTable` to just render whatever we place inside, in this case, an HTML `table`.

So, we've talked abouut **Containment**. Now, we'll cover **Specialization**, another case where one may reach for inheritance. Again, though, React has us covered.

Here we have a general component followed by a more specific component. We could even call it an *implementation* component.

```javascript
function Message(props) {
    return (
      <>
        <h1>{props.title}</h1>
        <p>{props.content}</p>
      </>
    )
  }
  function WelcomeMessage() {
    return (
      <Message title='Hello' content='From the other side' />
    )
  }
```

The `WelcomeMessage` is essentially an implementation of the more generic `Message` component. This is pattern we see used quite often in React.

Check out the exercise to put what you learned to practice!