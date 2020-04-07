# The Basics - Composition - Exercise

In this app you are greeted when you enter. Now, new requirements have come in to say goodbye when you leave. See the acceptance criteria below:

- Use the containment pattern to create a `PrettyBorder` component.
- Use the specialization pattern to create one, general, message component.
- That message component should be *composed* or *implemented* for each type of message - in our case, greeting and goodbye.
- The goodbye message should display when the Leave button is clicked.
- Only one message is displayed at a time.
- No message is displayed on startup (this makes it a little tricky)

## Solution Explanation

There was quite a bit of refactoring going on here. Let's talk about it.

### Containment

First, we used **containment** to pull out the `div` that styled the *Hello there!* message into its own component `PrettyBorder`. Now, any time we need a pretty boder, we just wrap our content inside `<PrettyBorder></PrettyBorder>` tags.

### Specialization

The next thing we did was use the **specialization** pattern to house our message. We first made the generic `Message` component, followed by the two *implementation* components `GreetingMessage` and `GoodbyeMessage`. Now when we need to display a greeting we can simply call `<GreetingMessage />`. All of its content is owned inside that one implementation component.

### The App render() method

Notice the only modified code is here. Everything else stayed the same. We only added methods. And, most of those could've existed in the original solution (the `Message` and `GreetingMessage` components), but at the time it didn't seem necessary because there was only one message). 

The reason it's important to note that the only code modification happening in the `render()` method is because it highlights the importants of paying attention where state is being managed. Notice all of our components are *dumb*, except for the main `App` component, they do nothing but render HTML. This is what has allowed us to be flexible now that we have new requirements. We have successfully followed two important SOLID principles: **single responsibility** and the **open-closed** principles. We obeyed **single responsibility** by only allowing our components to do **one** thing. We obeyed the **open-closed principle**, the most important in this example, by keeping our state management contained. We could've easily chosen to combine our `Inside` and `Outside` components, pass in some state, and determine whether to display *Enter* or *Leave* with a ternary. After all, the only difference is the HTML anyway, right? Oh, and now we could combine the two `handle` methods into one and just add some ternary logic there, too. However, if we had done that we would've now been sharing state management among two components, the parent, `App`, and the child, whatever you name the combination of `Inside` and `Outside`, as well as moving around more state management inside the `App` component to this new `handle` method. I hope you can see now how that would be a bad idea. 

So, instead, we contain all our logic to our `render` method. We now only have one place to modify code if, in the future, new requirements for another state other than *in* or *out* are requested.

*note, though, that the idea of 'one place to modify code' only holds true for code that makes sense to live together. If you're questioning that, refer back to the **single responsibility principle** to guide you*

Why did we move away from the ternary in the original app to using the `if () else if()`? We did this because of the requirement to not display any message on startup. This required us to utilize the third state `STATUS.neverEntered`. So, we defaulted `message` to `undefined` with `let message`. Then, we only set `message` if the state was either `entered` or `left`. Certainly, we could've left `button` to be in a ternary, since it only has two states. However, this goes back to the idea of not spreading out your logic unnecessarily. Since we already had the `if() else if()` statement we might as well utilize instead of rewriting it as a ternary in the `return`.

### What's with the STATUS object?

The `STATUS` object is meant to be treated as an `enum`, hence why it's all caps. We picked an `enum` over a `boolean` because we have three app states: *entered, left, and neverEntered*. If we had tried to manage our state with just a boolean it would not have covered all three states, thus opening the window for another `boolean` (maybe `hasEntered`). Now, instead of looking at one state, you've got to have a bunch of `&&`s and `||`s everywhere to deal with the third state managed by a second boolean. It's really not a good idea.

We're done! I hope you learned some valuable lessons about composition and overall code reusability and maintenance.