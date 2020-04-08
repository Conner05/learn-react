# Testing

Testing is a crucial weapon of any developer's arsenal. Testing ensures your code actually does what you coded it to do. Therefore, understanding how to write *good* tests is vital.

Having said that, this is not an article on what testing *is*, nor is it intended to teach you *how* write tests. The intention of this is teach you how to write tests *in React*. Now, along with that, you may learn some things about what testing *is* or *how* to write tests in general. But, if in the course of learning how to test *in React* you may end up learning some of the fundamentals, as well.

## Why Write Tests?

We can all agree testing is important. After all, there are entire divisions of IT departments specifically devoted to testing software. Why, then, should *we* test? If there are people paid to do it, why should we? Well, first of all, programmatic testing is faster than manual testing. So, increased efficiency is one reason. Secondly, programmatic testing is more deterministic, less error prone. Which, in turn, means increased accuracy. A by-product of increased efficiency and accuracy is peace of mind. And that peace of mind extends from the hands developing the software all the way to end user using the software. 

There's also the idea of *professionalism* at play here. As a software developer, you are a professional. Much like any other professional: doctors, lawyers, architects, scientists, we are the experts. That's worth repeating: **When it comes to developing software, we are the experts.** That said, there's a degree of responsibility that comes along with being an expert in some field. Writing good, working software is part of that responsibility. Since writing tests increases the likelihood of good, working software, we *ought* to write tests. Even further, one could say, with some valid degree of authority, that *not* writing tests is unprofessional. And, in certain fields, such as where good, working software could very well be the determining factor of someone's life, for example, medical software or transportation (plane, train, car, truck, spaceship) software, one could say *not* writing tests is dangerous and reckless.

For more insights into *why* developers should be writing tests, see [Uncle Bob Martin's talk on Professionalism](https://youtu.be/p0O1VVqRSK0). It's well-worth the 45 minutes.

## Not All Testing Is Created Equal

Programmatic testing falls under a few different categories. Those categories have different names depending who you ask. For our purposes we'll call them **unit, functional, and integration** tests. All three serve different purposes. Our focus will mainly be on **unit** and **functional** tests. 

## Tools

Just as this is not an article on what testing *is* or *how* to write tests, this is also not intended to teach you all about the specific libraries we'll be using. You'll learn stuff about them, sure. But, if you want to understand them any more than a working capacity then you'll need to seek that out yourself.

We'll be using [Jest](https://jestjs.io/) as our test runner. Under the hood it uses a tool called [jsdom](https://github.com/jsdom/jsdom), which is basically a browser imitator built in Javascript, running on Node.js.

We'll also introduce [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) as a way to help us write better tests without relying on implementation details. More on that later.

## TODO

For our testing example we'll take some code we did in The Basics module for learning about **composition**. We're going to start with the same code and implement the same solution. However, this time, we want to do it TDD (test-driven development) style. Let's get started.

Before we start writing code, test or not, we need to understand what we're going to implement. Here are the requirements taken from the **composition** `README.md`

    In this app you are greeted when you enter. Now, new requirements have come in to say goodbye when you leave. See the acceptance criteria below:

    - Use the containment pattern to create a `PrettyBorder` component.
    - Use the specialization pattern to create one, general, message component.
    - That message component should be *composed* or *implemented* for each type of message - in our case, greeting and goodbye.
    - The goodbye message should display when the Leave button is clicked.
    - Only one message is displayed at a time.
    - No message is displayed on startup (this makes it a little tricky)

With these new requirements we can now write some tests. Let's take them line by line:

### Use the containment pattern to create a `PrettyBorder` component.

This is an implementation detail. It has no bearing on the app's functionality. **We do not need to test this.**

### Use the specialization pattern to create one, general, message component.

Again, this is an implmentation detail, no need to test it.

### That message component should be *composed* or *implemented* for each type of message - in our case, greeting and goodbye.

This simply refers to the requirement from above. No test.

### The goodbye message should display when the Leave button is clicked.

Finally, our first "action". This is something that is testable. Do you see the difference in this requirement over the others? It's a new *expectation*. 

You'll hear that a lot when dealing with frontend testing. *Expectations Over Implementations*. It's a phrase used to indicate we write tests according to expectations, not implementations.

So, we'll start by adding a test.

```javascript
it('should show Goodbye message after clicking Leave', () => {
  const { getByText, queryByText } = render(<Solution />)   // this simply renders the components and pulls out some useful methods from the @testing-library/react library
  const enterButton = getByText(/Enter/i)                   // first, we get the Enter button
  enterButton.click()                                       // then we click the Enter button
  const leaveButton = getByText(/Leave/i)                   // once the Enter button is clicked, the Leave button should be available
  leaveButton.click()                                       // then we click it, hopefully displaying our new goodbye message
  const goodbye = queryByText(/See you later!/i)            // next, we'll get that goodbye message and verify it exists (the purpose of the test)
  expect(goodbye).toBeInTheDocument()                       // all we want to do it make sure it exists on the page
})
```

The name of the test says it all. `it('should show Goodbye message after clicking Leave'`. Walking through the code (see the comments), you can see what we're doing is just programmatically doing what it would take to manually test this requirement. 

We haven't coded this yet, so this test *should fail*. 

You can run your tests with `yarn test` from within the `02-testing` directory.

I won't go over how to implement the solution here. For that, take a look at the **composition** exercise README `composition.exercise.README.md`.

Now, though, we can write code to attempt to make this test pass. We never even have to load the browser! *- you should always take a look, though. It's possible to write the wrong test!*

### Only one message is displayed at a time.

Here we have another expectation. We need to make sure that for each button click, `Enter` or `Leave`, that the proper message is displayed. Now, we already have one test like this for the `Start` component. Because, this really isn't a *new* requirement. It's simply there to ensure the behavior stays that way. Here's what we have already:

```javascript
it('should show Greeting message after clicking Enter', () => {
  const { getByText } = render(<Start />)
  const enterButton = getByText(/Enter/i)
  enterButton.click()
  const greeting = getByText(/Hello there!/i)
  expect(greeting).toBeInTheDocument()
})

it('should hide Greeting message after clicking Leave', () => {
  const { getByText, queryByText } = render(<Start />)
  const enterButton = getByText(/Enter/i)
  enterButton.click()
  const leaveButton = getByText(/Leave/i)
  leaveButton.click()
  const greeting = queryByText(/Hello there!/i)
  expect(greeting).toBeNull()
})
```

The two tests above ensure that when `Enter` is clicked the Greeting message is displayed and that when the `Leave` button is clicked the message goes away.

Let's look at how we would test that the Goodbye message goes away when we click `Leave`.

```javascript
it('should hide Goodbye message after clicking Enter/Leave/Enter', () => {
  const { getByText, queryByText } = render(<Solution />)
  let enterButton = getByText(/Enter/i)
  enterButton.click()
  const leaveButton = getByText(/Leave/i)
  leaveButton.click()
  let goodbye = queryByText(/See you later!/i)
  expect(goodbye).toBeInTheDocument()
  enterButton = getByText(/Enter/i)
  enterButton.click()
  goodbye = queryByText(/See you later!/i)
  expect(goodbye).toBeNull()
})
```

This test runs a little longer. You get an indication that it will take more steps performed to test this behavior just by the title `it('should hide Goodbye message after clicking Enter/Leave/Enter'`. The clearly lays out we'll need three button clicks to achieve our desired state. 

Notice the first `expect()`, `expect(goodbye).toBeInTheDocument()`. That's not really part of the test. However, I chose to put it there because it verifies an expectation that we need in order to get to the state we want to be in. Let's imagine I left that line out. Now, the test is that the Goodbye message does *not* exist when we're finished with our actions. If that first `expect()` did not exist and the test passed, then we never know if clicking `Leave` *actually* hid the message. The message could've never existed in the first place! Now, I understand this is actually tested in the prior requirement. So, having that line there isn't necessary, nor is it even considered a *best practice*, from what I know. It's simply something I do to give me more peace of mind when writing tests.

Here's something important to note, that might otherwise get overlooked. Notice that `enterButton` is declared with `let`. That's because we need to *go get it* again, it needs a second assignment. That's because that instance of the `enterButton` actually went away after it was clicked and the `Leave` button took its place. So, after clicking `Leave` with `leaveButton.click()` and before clicking `Enter` again with `enterButton.click()` we need to *go get* `Enter` button again. This is an important point to remember, as it could cause some headache trying to debug a busted test.

### No message is displayed on startup (this makes it a little tricky)

Here we also have another behavior or expectation. However, it also existed in the `Start` component so we already have a test for it. 

```javascript
it('should not show Greeting message on render', () => {
  const { queryByText } = render(<Start />)
  const greeting = queryByText(/Hello there!/i)
  expect(greeting).toBeNull()
})
```

The *(this makes it a little tricky)* note is really only for the development portion. However, having the test already there can give us confidence in what we're writing when implementing it.

**That's it!** We're done!