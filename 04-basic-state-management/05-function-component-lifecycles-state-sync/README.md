# Learn React - Hooks - useEffect

We've already discussed the `useState` hook. Now let's look at another common hook, `useEffect`. 

`useEffect` is the replacement for all of the lifecycle methods in class components - think `componentDidMount`, `componentDidUnmount`, etc. However, it's not *just* a replacement for lifecycle methods. `useEffect` can be used for more than that. We have to shift our thinking from *`useEffect` is just a replacement for lifecycle methods* to *`useEffect` allows us to synchronize our state*. Let's take a look at how it's written.

```jsx
useEffect(() => {
  // some action
  return () => {
    // cleanup
  }
}, [])
```

`useEffect` takes a function that runs every time the effect is triggered. The `return` statement is optional. The `return` is essentially only for *cleanup*. For example, let's say in your effect you create a timer with `setTimeout()`. You'd want to clean that up otherwise you'll have a memory leak.

```jsx
useEffect(() => {
  const destroyTimer = setTimeout(() => action(), 1000)
  return () => {
    destroyTimer()
  }
}, [])
```

Another common scenario would be using something like the RxJS library and subscribing to an `Observable`. Observables always to need to unsubscribed, lest you'll create a memory leak. That's another use-case for the `return` statement in `useEffect`.

You'll notice that `useEffect` not only takes a function as a parameter, it also takes an array. That array is the list of items, sometimes referred to as *dependencies*, to watch so that the effect knows when to run. You can think of the items in the array as *triggers*. Each time an item changes, the effect is triggered. In our previous examples that array has been empty. There are essentially three states for that array to be in, and each state tells the effect to behave differently. Let's look at those.

## *Empty array*

```jsx
useEffect(() => {
  // some action
  return () => {
    // cleanup
  }
}, [] /* runs once on render */)
```

An empty array gives nothing for the effect to trigger from. That means the effect will run once and not run again until the component is re-rendered. You can think of the `[]` as the replacement for `componentDidMount`. Notice I **didn't** say `componentWillMount`. Effects are ran *after* the component has been mounted.

## *No array*

```jsx
useEffect(() => {
  // some action
  return () => {
    // cleanup
  }
})
```

Interestingly enough, the array is optional. The *effect* of this scenario is even more interesting. When there is no array, `useEffect` just runs on every re-render.

**You will likely rarely want to do this.**

## *Array with items (dependencies)*

```jsx
useEffect(() => {
  // some action
  return () => {
    // cleanup
  }
}, [value1, value2])
```

When `useEffect` has items in the array it treats those items as triggers. Sometimes you'll hear these items referred to as *dependencies*. Each item is *watched*, waiting for it to change. When a change occurs in any one item the effect then runs. 

## Common Use Cases

`useEffect` is very flexible and can certainly be used for all kinds of things. However, it's most common use case is **data fetching**. Data fetching is perfect for `useEffect` because it only fires after the component has mounted and it gives us the ability to control when the data fetching is re-triggered, if at all.

## Best Practices

There are some best practices to abide by when it comes to using `useEffect`. We'll talk in more detail about this later in a section specifically dedicated to best practices. For now, though, here are some highlights to get started

## *Referenced Values Should Be Dependencies*

This means that for every value you reference in the effect function it should be listed as a dependency.

```jsx
// wrong way
const [value, setValue] = useState('')
useEffect(() => {
  setValue(value)
}, [])

// right way
useEffect(() => {
  setValue(value)
}, [value])
```

Note we didn't reference `setValue` as a dependency. That's because the method will always be static because it came from `useState`. Because it's static we didn't reference it, however it would be totally fine to add it to the dependency array `[value, setValue]`. However, if another method were that we created, say, `updateValue`, then we would want to include it in the array.

```jsx
const updateValue = (value) => setValue(value)
useEffect(() => {
  updateValue(value)
}, [value, updateValue])
```

## *Actions & Updates Should Be Decoupled*

You may be thinking, *"Wait a minute, haven't we been putting update logic in our effect action method this whole time?!"* And you'd be correct. We have been. *Actions and updates should be decoupled* is not a hard and fast rule. It's more a pattern to be aware of. When you only have one value as a dependency not much can go wrong, so it's kosher to just update it directly from the effect itself. However, when dependencies start to grow, a need arises to decouple our update logic from action logic. 

What does that really mean, though? It effectively means reducing the number of dependencies by **abstraction**. This is typically achieved by using the `useReducer` hook. Since we haven't covered that hook yet - trust me, it warrants its own explanation outside of this scope - we won't dive any deeper into this best practice. It'll be covered in more detail in the Best Practices lesson after we've learned some more hooks.

## *Functions Only Used By An Effect Should Live In The Effect*

I'll admit, this one looks a little weird. But, it makes sense. If a function is referenced in `useEffect` and it is **only** referenced there, then the function should live inside the effect itself.

```jsx
useEffect(() => {
  const updateValue = (value) => setValue(value)
  updateValue(value)
}, [value])
```

This is good for two reasons:
- it keeps us from breaking the **Referenced Values Should Be Dependencies** best practice.
- it clearly shows the method is not used anywhere but inside the effect.

## **TODO**

Now that we've learned the basics of the `useEffect` hook let's look at a real life example where `useEffect` solves our additional requirements.

## The App

The app takes a number and displays the Pokemon corresponding to that number. Currently, you type in a number and click **Find Pokemon**. There are also buttons that toggle the sprite to different orientations as well as the Pokemon's shiny version.

## Additional Work

- Replace the **Find Pokemon** button with **Previous** and **Next** toggles, using `<` for **Previous** and `>` for **Next**.
- When the number is entered, the pokemon updates. This is necessary because of the removal of the **Find Pokemon** button, where the functionality was previously.
- Change the Clear button to Reset. When clicked it should reset the Pokemon # to 1.
- The Pokemon # is set to 1 by default.
- Do not allow non-numbers in the Pokemon # field.
- Do not update Pokemon if the number is out of range.

That's a lot of work to do! Let's take on the requirements one-by-one.


## *Replace the **Find Pokemon** button with **Previous** and **Next** toggles, using `<` for **Previous** and `>` for **Next**.*

Let's start with our `Start.spec.js` file. We've got tests for the **Find Pokemon** button. Those won't be necessary anymore. We can delete them. Let's start with the `waitForPokemon()` method. 

```javascript
const waitForPokemon = async () => {
  const { getByTestId, queryByTestId } = render(<Start />)
  fireEvent.change(getByTestId('pokemonid-input'), { target: { value: '1' } })
  fireEvent.click(queryByTestId('find-pokemon'))
  await waitForElement(() => queryByTestId('pokemon'))
  return { getByTestId, queryByTestId }
}
```

It's purpose is to do some initial setup so we don't have to repeat it in all our tests. It gets us in a state where we're ready to test.

Since we're removing the **Find Pokemon** button, we're going to need to make some changes to this method. We need to remove the click event `fireEvent.click(queryByTestId('find-pokemon'))`.

```javascript
const waitForPokemon = async () => {
  const { getByTestId, queryByTestId } = render(<Start />)
  fireEvent.change(getByTestId('pokemonid-input'), { target: { value: '1' } })
  await waitForElement(() => queryByTestId('pokemon'))
  return { getByTestId, queryByTestId }
}
```

Now we broke a lot of tests. It looks like all of the Sprite Button tests timed out waiting for the Pokemon `div` to load. Why didn't it load? Because we removed our button click event, of course. How can we fix this? We'll need to modify the `onChange` event for the `pokemon-input` element to run the code that `find-pokemon` button was running. Let's head over to `Start.js` to fix that.

```javascript
const handleFindPokemonClick = async () => {
  const pokemon = await utils.getPokemon(pokemonId)
  setPokemon(pokemon)
}
const handleIdChange = (e) => setPokemonId(e.target.value)
```

These are the two methods in question. We'll move the logic from `handleFindPokemonClick` to `handleIdChange` and remove `handleFindPokemonClick`

```javascript
const handleIdChange = async (e) => {
  setPokemonId(e.target.value)
  const pokemon = await utils.getPokemon(pokemonId)
  setPokemon(pokemon)
}
```

A couple of things to note here: We modified the method to be `async`. Also, we placed the logic from the `find-pokemon` button *below* the current logic that sets the `pokemonId`. We did that because the `utils.getPokemon()` method makes use of that value.

Our tests pass now. BUT WAIT! Something has gone terribly wrong. If you run the app and actually try it out you'll see the displayed Pokemon and # are off by 1. This is because we're using `pokemonId` to get the pokemon, but `setPokemonId` hasn't had time to update the value of `pokemonId` before it's used. *But, it's used **after** the `setPokemonId` method!* Welcome to world of asynchronous programming and non-blocking methods. 

How do we fix this? Well, we could use the `e.target.value` again instead of `pokemonId` in the `utils.getPokemon()` method. We can do that *for now* to get it working. However, we'll soon see a better solution. But first, let's update our tests to account for this bug we've introduced so if it ever occurs in the future we'll know.

The reason our test isn't catching the bug is because of our mock for `utils.getPokemon()`.

```javascript
beforeEach(() => {
  const bulbasaur = {
    name: 'bulbasaur',
    sprites: { 'front_default': 'front_default', 'back_default': 'back_default', 'front_shiny': 'front_shiny', 'back_shiny': 'back_shiny' }
  }
  utils.getPokemon = jest.fn(() => bulbasaur)
})
```

No matter what we pass in our mock returns the same Pokemon. We need to add at least one more to makes sure it's behaving properly.

```javascript
beforeEach(() => {
  const bulbasaur = {
    name: 'bulbasaur',
    sprites: { 'front_default': 'front_default', 'back_default': 'back_default', 'front_shiny': 'front_shiny', 'back_shiny': 'back_shiny' }
  }
  const ivysaur = {
    name: 'ivysaur',
    sprites: { 'front_default': 'front_default', 'back_default': 'back_default', 'front_shiny': 'front_shiny', 'back_shiny': 'back_shiny' }
  }
  utils.getPokemon = jest.fn((id) => {
    if (!id) return
    return id == 1 ? bulbasaur : ivysaur
  })
})
```

We did two things:
- Added another pokemon
- Updated the mock with some simple logic to accept a parameter and determine which pokemon to return

Awesome. We've broken our tests. Now, let's make that change we mentioned earlier to `handleIdChange`.

```javascript
const handleIdChange = async (e) => {
  setPokemonId(e.target.value)
  const pokemon = await utils.getPokemon(e.target.value)
  setPokemon(pokemon)
}
```

Our tests pass. Now let's add some tests for those new buttons. There are some basic things each button *should* do. Each button *should* show on render, have either '<' or '>' as its text, update the input value to either the previous or next number, and display either the previous or next pokemon. There might be some other behaviors you could think of that the buttons *should* or *should not* do, but this will be enough to get the functionality for this requirement.

```javascript
describe('Next Pokemon button', () => {
    const button = 'next-button'
    it('should show on render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button)).toBeInTheDocument()
    })
    it('should have text >', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button).textContent).toBe('>')
    })
    it('should update input to next value', async () => {
      const { queryByTestId } = await waitForPokemon()
      fireEvent.click(queryByTestId(button))
      expect(queryByTestId('pokemonid-input').value).toBe('2')
      await waitForElement(() => queryByTestId('pokemon'))
    })
    it('should display the next pokemon', async () => {
      const { queryByTestId } = await waitForPokemon()
      fireEvent.click(queryByTestId(button))
      await waitForElement(() => queryByTestId('pokemon'))
      expect(queryByTestId('pokemon-name').textContent).toBe('ivysaur')
    })
  })

  describe('Previous Pokemon button', () => {
    const button = 'prev-button'
    it('should show on render', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button)).toBeInTheDocument()
    })
    it('should have text >', async () => {
      const { queryByTestId } = await waitForPokemon()
      expect(queryByTestId(button).textContent).toBe('<')
    })
    it('should update input to previous value', async () => {
      const { queryByTestId } = await waitForPokemon(2)
      fireEvent.click(queryByTestId(button))
      expect(queryByTestId('pokemonid-input').value).toBe('1')
      await waitForElement(() => queryByTestId('pokemon'))
    })
    it('should display the previous pokemon', async () => {
      const { queryByTestId } = await waitForPokemon(2)
      fireEvent.click(queryByTestId(button))
      await waitForElement(() => queryByTestId('pokemon'))
      expect(queryByTestId('pokemon-name').textContent).toBe('bulbasaur')
    })
  })
```

While implementing this we had to make some modifications to `waitForPokemon`. First, we need to allow an optional parameter of `id` to be passed to the method. Why? So we can quickly toggle between Pokemon. For example, to test the `prev-button` we just default the starting pokemon to be #2, that way when `prev-button` is clicked it goes back to 1, which is also a valid Pokemon. Starting at 1 would mean clicking `prev-button` takes us to 0, which is not a valid Pokemon.

```javascript
const waitForPokemon = async (id = 1) => {
  const { getByTestId, queryByTestId } = render(<Start />)
  fireEvent.change(getByTestId('pokemonid-input'), { target: { value: id } })
  await waitForElement(() => queryByTestId('pokemon'))
  return { getByTestId, queryByTestId }
}
```

All of these will fail because we haven't implemented the buttons in the `Start` component yet. Let's do that.

```jsx
<div className="row">
  <input data-testid="pokemonid-input" value={pokemonId} onChange={(e) => handleIdChange(e)} placeholder="Pokemon #" />
  &nbsp;
  <button className="btn btn-info" data-testid="prev-button" onClick={() => setPokemonId(pokemonId - 1)}>{'<'}</button>
  &nbsp;
  <button className="btn btn-info" data-testid="next-button" onClick={() => setPokemonId(pokemonId + 1)}>{'>'}</button>
  &nbsp;
  <button className="btn btn-primary" data-testid="clear" onClick={handleClearClick}>Clear</button>
</div>
```

Essentially, we just replaced the `find-pokemon` button with the `prev-button` and `next-button`. We also just implemented the logic for each in the `onClick` event itself. That will suffice for now.

Maybe you've noticed our tests are still failing. One of them in particular is pretty telling: 

    Start › Next Pokemon button › should update input to next value

        expect(received).toBe(expected) // Object.is equality

        Expected: "2"
        Received: "11"

That means when the `next-button` was clicked it took `pokemonId` from 1 to 11. Our `onClick` event looks like this `onClick={() => setPokemonId(pokemonId + 1)}`. So, that must mean it's adding a `string` instead of a `number`! Let's fix that at the source.

```javascript
const handleIdChange = async (e) => {
  setPokemonId(+e.target.value)
  const pokemon = await utils.getPokemon(e.target.value)
  setPokemon(pokemon)
}
```

Notice we added `+` to the `setPokemonId` method. That'll do what we want, but we still have failing tests. What's going on? 

    Start › Next Pokemon button › should display the next pokemon

        expect(received).toBe(expected) // Object.is equality

        Expected: "ivysaur"
        Received: "bulbasaur"

    Start › Previous Pokemon button › should display the previous pokemon

        expect(received).toBe(expected) // Object.is equality

        Expected: "bulbasaur"
        Received: "ivysaur"

If you run the app you'll see this play out. Our buttons don't work! Why? If you put a `console.log()` inside `handleIdChange` you'll quickly see. Our `handleIdChange` method, where the `utils.getPokemon` method lives, is not firing when we click `prev-button` or `next-button`. 

Wow. We've really created a mess haven't we? In order to fix this we *could* abstract the logic that fetches and updates the `pokemon` object into its own function, then create methods for the `next-button` and `prev-button` that runs it just like `handleIdChange` does. However, there's a simpler solution. 

`useEffect` will solve this problem and more. Let's see how we can update `pokemon` properly with `useEffect`.

```javascript
useEffect(() => {
  const updatePokemon = async () => {
    const newPokemon = await utils.getPokemon(pokemonId)
    if (!newPokemon) return
    setPokemon(newPokemon)
  }
  updatePokemon()
}, [pokemonId])
```

What we did here is simply say, *Every time `pokemonId` changes, go get that new pokemon*. And isn't that what we want to do, after all? This all goes back to thinking of `useEffect` as a means of **synchronization**. We're synchronizing our state based on changes to `pokemonId`. Now we can remove some code from our `handleIdChange` method.

```javascript
const handleIdChange = (e) => setPokemonId(+e.target.value)
```

Really, we can reduce it to one line.

All our tests pass now! Our buttons are working! See the power of `useEffect`? Let's head on to the next requirement.

## *When the number is entered, the Pokemon updates. This is necessary because of the removal of the **Find Pokemon** button, where the functionality was previously.*

Fortunately, we already know this works. First, it works because of our `handleIdChange` method setting `pokemonId` and our `useEffect` watching for changes to `pokemonId`. Second, we've tested it with our `waitForPokemon` method. It programmatically enters a value into the `pokemonid-input` and waits for the `pokemon` `div` to load. We can move on to the next requirement.

## *Change the Clear button to Reset. When clicked it should reset the Pokemon # to 1.*

All the `clear` button does is set `pokemon` to `null`. We're changing this functionality to set the `pokemonId` to 1. Combined with our `useEffect` this will work nicely.

We'll start with our tests. Let's change the `clear` button tests to reference the word **Reset** and also go ahead and test our new logic.

```javascript
describe('Reset button', () => {
  it('should show on render', async () => {
    const { queryByTestId } = render(<Start />)
    expect(queryByTestId('reset-button')).toBeInTheDocument()
  })

  it('should have text Reset', async () => {
    const { queryByTestId } = render(<Start />)
    expect(queryByTestId('reset-button').textContent).toBe('Reset')
  })

  it('should reset pokemon', async () => {
    const { queryByTestId } = render(<Start />)
    fireEvent.change(queryByTestId('pokemonid-input'), { target: { value: '5' } })
    fireEvent.click(queryByTestId('reset-button'))
    expect(queryByTestId('pokemonid-input').value).toBe('1')
    await waitForElement(() => queryByTestId('pokemon'))
  })
})
```

Now we just need to implement the **Reset** button in our `Start` component.

```jsx
<button className="btn btn-primary" data-testid="reset-button" onClick={() => setPokemonId(1)}>Reset</button>
```

With this we can also get rid of the `handleClearClick` method.

## *The Pokemon # is set to 1 by default.*

This one is pretty simple. We just need to write a test to ensure `pokemonid-input` defaults to 1 and loads a Pokemon.

```javascript
// exists inside the main describe('Start', () => { ...
it('should render first pokemon', async () => {
  const { queryByTestId } = render(<Start />)
  await waitForElement(() => queryByTestId('pokemon'))
  expect(queryByTestId('pokemon')).toBeInTheDocument()
})

describe('Pokemon # input', () => {
  it('should default to 1', async () => {
    const { queryByTestId } = render(<Start />)
    expect(queryByTestId('pokemonid-input').value).toBe('1')
    await waitForElement(() => (queryByTestId('pokemon')))
  })
})
```

We can also get rid of the following test. It's no longer valid.

```javascript
// remove this
it('should not render default pokemon', () => {
  const { queryByTestId } = render(<Start />)
  expect(queryByTestId('pokemon')).not.toBeInTheDocument()
})
```

We should also modify all our **Sprite** button tests. We are currently testing that they *do not show on render*. This is no longer true. Each button *should not* show *before* the `pokemon` is rendered, but *should* show *after* `pokemon` is rendered. We'll remove the first button test and add the following:

```javascript
it('should not show before pokemon render', async () => {
  const { queryByTestId } = render(<Start />)
  expect(queryByTestId(buttonTestId)).not.toBeInTheDocument()
  await waitForElement(() => queryByTestId('pokemon'))
})

it('should show after pokemon render', async () => {
  const { queryByTestId } = await waitForPokemon()
  expect(queryByTestId(buttonTestId)).toBeInTheDocument()
})
```

And in `Start`, we will set our default `pokemonId` to `1`.

```javascript
 const [pokemonId, setPokemonId] = useState(1)
```

Now we get a lot of console errors in our tests. This is because we now have behavior in our components we're not accounting for in our tests. What's the unexpected behavior? Now that we're defaulting our `pokemonId` to `1` it means our `useEffect` is going to run automatically. So, in our tests, we need to wait for that process to finish. To do that, we'll add `await waitForElement(() => queryByTestId('pokemon'))` everywhere that doesn't currently have it.

Let's talk for just a moment why we need `await waitForElement(() => queryByTestId('pokemon'))` at the end of some of our tests even though that's not what we're testing. We do that because with the introduction of hooks React has added some important errors to our tests. If we remove that line we'll see an error telling us that something happened to our component that we didn't expect. It's not too big of a deal here, but it *could* be. Kent Dodds talks about this error in detail in his blog post [Fix the "not wrapped in act(...)" warning](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning). I won't go into any more detail. If you want to learn more, check out his blog post. It's really detailed.

## *Do not allow non-numbers in the Pokemon # field.*

If we type anything not a number in the `pokemonid-input` the text turns to `NaN` and we get some console errors. Let's add some tests around this.

```javascript
describe('Pokemon # input', () => {
  it('should default to 1', async () => { /* hiding for brevity */ })

  it('should only allow numbers in the input', async () => {
    const { queryByTestId } = render(<Start />)
    fireEvent.change(queryByTestId('pokemonid-input'), { target: { value: 'a' } })
    expect(queryByTestId('pokemonid-input').value).toBe('1')
    await waitForElement(() => (queryByTestId('pokemon')))
  })
})
```

Now that test fails. Let's implement the logic in `Start` by modifying our `handleIdChange` method to first check if the value coming in from `e.target.value` is a valid `Number`. If so, set `pokemonId`. If not, do nothing.

```javascript
const handleIdChange = (e) => !Number.isNaN(+e.target.value) && setPokemonId(+e.target.value)
```

And we're done! We've finished implementing the requirements. Stay tuned for the more information on `useEffect` in the **Best Practices** lesson.