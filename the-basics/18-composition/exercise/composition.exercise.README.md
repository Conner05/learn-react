# The Basics - Composition - Exercise

In this app you are greeted when you enter. Now, new requirements have come in to say goodbye when you leave. See the acceptance criteria below:

- Use the containment pattern to create a `PrettyBorder` component.
- Use the specialization pattern to create one, general, message component.
- That message component should be *composed* or *implemented* for each type of message - in our case, greeting and goodbye.
- The goodbye message should display when the Leave button is clicked.
- Only one message is displayed at a time.
- No message is displayed on startup (this makes it a little tricky)

## Solution Explanation

There was quite a bit refactoring going on here. Let's talk about it.