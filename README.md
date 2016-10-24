<h1 align="center">aframe-preact</h1>

<h5 align="center">
  Build virtual reality experiences with <b><a href="https://aframe.io">A-Frame</a></b> and <b><a href="https://preactjs.com/">Preact</a></b>.
</h5>

```js
import 'aframe';
import 'aframe-bmfont-text-component';
import {Entity, Scene} from 'aframe-preact';
import {h, Component} from 'preact';

class VRScene extends Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material="color: red" position={[0, 0, -5]}/>
        <Entity bmfont-text={{text: 'HELLO WORLD'}} position="{[0, 1, -5]}"/>
      </Scene>
    );
  }
}
```

See [aframe-preact-boilerplate](https://github.com/POWSTER/aframe-preact-boilerplate)
for a basic example.

## Installation

```
npm install --save aframe aframe-preact preact
```

## What `aframe-preact` Does

[A-Frame](https://aframe.io) is a web framework for building virtual reality
experiences. Since A-Frame is built on top of the DOM, Preact is able to sit
cleanly on top of A-Frame.

If you are not familiar with the specifics of A-Frame, A-Frame is an
[entity-component-system (ECS) framework on
HTML](https://aframe.io/docs/0.3.0/core/). ECS is a pattern used in game
development that favors composability over inheritance, which is more naturally
suited to 3D scenes where objects are built of complex appearance, behavior,
and functionality.

In A-Frame, HTML attributes map to *components* which are composable modules
that are plugged into **<a-entity>**s to attach appearance, behavior, and
functionality. `aframe-preact` is a very thin layer on top of A-Frame to bridge
with Preact. It provides an `<Entity/>` Preact component that serializes Preact
props to A-Frame components:

```js
// A-Frame + Preact
<Entity geometry={{primitive: 'box', width: 5}}/>

// to A-Frame.
<a-entity geometry="primitive: box; width: 5"></a-entity>
```

### Built with `aframe-preact`

<a href="http://360syria.com">
<img width="320" alt="Fear of the Sky by Amnesty International UK" src="https://cloud.githubusercontent.com/assets/674727/19344336/a5830bbe-90ee-11e6-9f68-2c23a9be4e95.png">
</a>

### Best Practices

For performance reasons, it is heavily recommended to let A-Frame handle the
3D, VR, rendering, and behavior pieces, and let Preact only handle what it's
good at: views and state binding.

For instance, if you wanted to do an animation, do not try to tween a property
in Preact land. This is slower due to creating another `requestAnimationFrame`,
being at the whims of Preact batched updates, and also due to the overhead of
passing a property from Preact to HTML. A-Frame already has a render loop and
`requestAnimationFrame` set up, write an A-Frame component using the `tick`
method to hook into the render loop.

Try to use Preact sparingly in regards to the actual 3D and VR bits. Preact has a
bit of overhead and some concerns with the batched updates since it was created
with the 2D DOM in mind. Do use it for as a view layer and to manage state.

### Why A-Frame with Preact?

Preact was built for large web apps to improve DOM performance. It wasn't meant
for development of 3D scenes by itself. By attempting to wrap Preact directly
over three.js or WebGL, you run into a lot of performance issues.

#### Hooks into the Render Loop

Without a framework focused around 3D and VR, there is **no structure to hook
into the render loop**. Preact implementations generally just create a new
`requestAnimationFrame` within the Preact components, which is very bad for
performance. Because Preact only wants data to flow down with no child-to-parent
communication, entities have a hard time communicating to the scene to hook new
behaviors into the render loop.

A-Frame, however, provides a `tick` method for components to hook into the
scene render loop, and these components can be attached to any entity. Here
is an example of using A-Frame to provide these facilities across multiple
Preact components. Note how we can write a component that can be applied to
different objects.

```js
AFRAME.registerComponent('rotate-on-tick', {
  tick: function (t, dt) {
    this.object3D.rotation.x += .001;
  }
});

<Scene>
  <Box rotate-on-tick/>  <!-- <Entity geometry="primitive: box" rotate-on-tick/> -->
  <Sphere rotate-on-tick/> <!-- <Entity geometry="primitive: sphere" rotate-on-tick/> -->
</Scene>
```

#### Provides a DOM

By providing a DOM, it gives Preact the purpose it was meant for, to provide
quicker DOM updates. Although ideally, we use A-Frame directly since there may
be performance quirks with Preact batching its updates which we don't want in
90fps+ real-time rendering.

#### Composability

A-Frame provides composability over inheritance.  Preact is based around
inheritance: to create a new type of object, we extend an existing one. In game
development where objects are more complex, it is more appropriate to compose
behavior in order to more easily build new types of objects.

#### Community and Ecosystem

Lastly, A-Frame is backed by a large community and ecosystem of tools and
components. Don't be limited by what an assorted library provides when an
extensible framework can provide much more.

`tl;dr`: Wrapping Preact directly around three.js/WebGL cuts corners and suffers
as a result. A-Frame provides a proper bridge.

### API

`aframe-preact` ships with `Scene` and `Entity` Preact components, which are all
we really need.

#### \<Scene {...components}/>

The `Scene` Preact component wraps `<a-scene>`:

```html
<Scene>
  <Entity/>
</Scene>
```

#### \<Entity {...components}/>

The `Entity` Preact component wraps `<a-entity>`.

```html
<Entity geometry={{primitive: 'box'}} material='color: red'/>
```

#### Primitives

To render A-Frame primitives with all of the `aframe-preact` magic, pass the
`primitive` prop with the name of the primitive:

```html
<Entity primitive='a-box' onClick={() => { console.log('Clicked!'); }}/>
```

#### `events`

To register an event handler, use the `events` prop:

```html
<Entity events={{click: () => { console.log('Clicked!'); }}}/>
```

Or use the Preact-style syntactic sugar, which will infer the event name to
register:

```html
<Entity
  onClick={() => { console.log('click event'); }}
  onChildAttached={() => { console.log('child-attached event'); }}
  onComponentinitialized={() => { console.log('componentinitialized event'); }}/>
```
