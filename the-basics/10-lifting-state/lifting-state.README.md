# The Basics - Lifting State

Oftentimes, components will need to communicate with each other and reflect the same changes in data.

This is where the concept of Lifting State comes in. 

Lifting State essentially means moving state to the closest common ancestor. If you remember learning fractions in school, it's similar to finding the "greatest common demoninator".

We're going to make a small app that accepts an input of kilometers or miles and determines whether or not we've ran a 5K. It'll help us understand how important and useful Lifting State is.

Let's start with a component `FivekDecision`. It accepts a kilometer value as the prop and returns a div displaying whether or not 5 kilometers have been completed.

```javascript
function FivekDecision(props) {
  return props.kilometers >= 5
  ? <div>You completed the 5k!</div>
  : <div>Keep going! You're not done yet!</div>
}
```

Next, we'll create a component called `Run`, where we will have an input to enter how many kilometers we've ran. It'll render the `FivekDecision` component to output whether we've completed the 5k or not.

```javascript
class Run extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = { distance: 0 }
  }

  handleChange(e) {
    this.setState({ distance: e.target.value })
  }

  render() {
    return (
      <fieldset>
        <legend>Kilometers ran:</legend>
        <input value={this.state.distance} onChange={this.handleChange} />
        <FivekDecision kilometers={parseFloat(this.state.distance)} />
      </fieldset>
    )
  }
}
```

Let's say we now want to add the ability to enter miles ran, but still return whether or not we're finished with the 5K.

Since we're going to need a separate input, we'll start by creating a component out of the `fieldset` we created for the kilometers input.

```javascript
class DistanceInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = { distance: 0 }
  }

  handleChange(e) {
    this.setState({ distance: e.target.value })
  }
  render() {
  return (
    <>
      <fieldset>
        <legend>Kilometers ran:</legend>
        <input value={this.state.distance} onChange={this.handleChange} />
      </fieldset>
      <FivekDecision kilometers={parseFloat(this.state.distance)} />
    </>
  )
  }
}
```

Next, we'll render `DistanceInput` in the `Run` component:

```javascript
class Run extends React.Component {
  render() {
    return (
      <>
        <DistanceInput />
      </>
    )
  }
}
```

Now, the component still says "kilometers ran". We'll need to make the distance type variable. To do that, we'll add `distanceType` as a prop inside `DistanceInput`.

```javascript
<fieldset>
  <legend>{this.props.distanceType} ran:</legend>
  <input value={this.state.distance} onChange={this.handleChange} />
</fieldset>
```

In our `Run` component now we can render multiple `DistanceInput` components and pass the distance type as a prop.

```javascript
class Run extends React.Component {
  render() {
    return (
      <>
        <DistanceInput distanceType="Kilometers" />
        <DistanceInput distanceType="Miles" />
      </>
    )
  }
}
```

As part of this, we only want to display the output rendered from `FivekDecision` once. So, we'll need to move that out of the `DistanceInput` component and into the parent component `Run`.

```javascript
class Run extends React.Component {
  render() {
    return (
      <>
        <DistanceInput distanceType="Kilometers" />
        <DistanceInput distanceType="Miles" />
        <FivekDecision kilometers={parseFloat(this.state.distance)} />
      </>
    )
  }
}
```

Now, the problem is we're referencing state in the parent component `Run`, but it's managed in the child component `DistanceInput`. Here is where the Lifting State pattern occurs. We are going to move our state from `DistanceInput` "up" to `Run`.

```javascript
class DistanceInput extends React.Component {
  render() {
    return (
      <>
        <fieldset>
          <legend>{this.props.distanceType} ran:</legend>
          <input value={this.props.distance} onChange={this.props.onDistanceChange} />
        </fieldset>
      </>
    )
  }
}
class Run extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = { distance: 0 }
  }

  handleChange(e) {
    this.setState({ distance: e.target.value })
  }

    render() {
    return (
      <>
        <DistanceInput distanceType="Kilometers" distance={this.state.distance} onDistanceChange={this.handleChange} />
        <DistanceInput distanceType="Miles" distance={this.state.distance} onDistanceChange={this.handleChange} />
        <FivekDecision kilometers={parseFloat(this.state.distance)} />
      </>
    )
  }
}
```

Notice in `DistanceInput` we converted everything over from `this.state` to `this.props`. We moved the logic of the `handleChange` method to `Run` and passed it in as a prop, now referenced on the `input` in `DistanceInput`. **This is key.** With the `FivekDecision` moved outside `DistanceInput` we can now see the app *almost* works. Our text updates, the inputs are connected, but we still aren't doing any conversions. Let's fix that.

We'll start by adding methods for conversion. These do not necessarily belong in any one component, so we'll create them outside the components for now.

```javascript
const mileToKilometerConversion = 1.609
function toMiles(kilometers) {
  return kilometers / mileToKilometerConversion
}
function toKilometers(miles) {
  return miles * mileToKilometerConversion
}
```

Next, we'll replace the `handleChange` method with two new methods: `handleKilometerChange` and `handleMileChange`. We are doing that because we need to know which input is being changed. Therefore, we need separate methods to determine that. Also, notice we added `distanceType` to the state. This is how we'll know which input was modified. This will become more clear as we move along.

*Don't forget to bind these new methods.*

```javascript
handleKilometerChange(e) {
  this.setState({ distance: e.target.value, distanceType: 'Kilometers' })
}
handleMileChange(e) {
  this.setState({ distance: e.target.value, distanceType: 'Miles' })
}
```

Next, we modify the methods passed to the `DistanceInput` component to reflect the new methods:

```javascript
  <DistanceInput distanceType="Kilometers" distance={this.state.distance} onDistanceChange={this.handleKilometerChange} />
  <DistanceInput distanceType="Miles" distance={this.state.distance} onDistanceChange={this.handleMileChange} />
```

Now we need to update the value passed to the `distance` prop in `DistanceInput`. This will allow each input to reflect the proper value for its specific conversion. To do this we will introduce some local, calculated values inside the `render` method of `Run` based on the current `distanceType`.

```javascript
const distanceType = this.state.distanceType
const distance = this.state.distance
const kilometers = distanceType === 'Kilometers' ? distance : toKilometers(distance)
const miles = distanceType === 'Miles' ? distance : toMiles(distance)
```

We'll use the `kilometers` and `miles` variables to update the rest of our render method. Now it looks like this:

```javascript
render() {
  const distanceType = this.state.distanceType
  const distance = this.state.distance
  const kilometers = distanceType === 'Kilometers' ? distance : toKilometers(distance)
  const miles = distanceType === 'Miles' ? distance : toMiles(distance)

  return (
    <>
      <DistanceInput distanceType="Kilometers" distance={kilometers} onDistanceChange={this.handleKilometerChange} />
      <DistanceInput distanceType="Miles" distance={miles} onDistanceChange={this.handleMileChange} />
      <FivekDecision kilometers={parseFloat(kilometers)} />
    </>
  )
}
```

Congratulations! It works!

We can tidy everything up by adding some code to not attempt to calculate anything that's not a number. *Normally, this code would've already been written. However, it was left out as to not miss the point - which is the concept of Lifting State.*

To do this, we add a method, `tryConvert` that takes a distance and conversion function as properties and returns the converted value:

```javascript
function tryConvert(distance, convert) {
  if (Number.isNaN(Number(distance))) return 0
  const convertedDistance = convert(distance)
  const roundedConvertedDistance = Math.round(convertedDistance * 1000) / 1000
  return roundedConvertedDistance
}
```

Then we just have to update our calculated values in our `render` method:

```javascript
  const kilometers = distanceType === 'Kilometers' ? distance : tryConvert(distance, toKilometers)
  const miles = distanceType === 'Miles' ? distance : tryConvert(distance, toMiles)
```

We're done!

They key concept to take away from this is understanding when and how to move state out of its current component into a common component in order to be shared across multiple components.

If you feel like you've got this checkout the exercise!