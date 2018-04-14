# 01 Component Options

[Basic example](http://localhost:3000/01.html)

## The Options Object

Let's use the type definitions from Vue itself to learn the API for functional
components. We'll start with the options object:

```ts
export interface FunctionalComponentOptions<
  Props = DefaultProps,
  PropDefs = PropsDefinition<Props>
> {
  name?: string;
  props?: PropDefs;
  inject?: InjectOptions;
  functional: boolean;
  render?(
    this: undefined,
    createElement: CreateElement,
    context: RenderContext<Props>
  ): VNode;
}
```

_\* Note: the `?` in the syntax `{ key?: value }` defines optional properties._

Functional component options omit much of the instance component options like
`data`, `methods`, `computed`, `watchers`, etc. Adding `functional` as `true`
and a render method are all we need to get started. Per the definition above, we
know that the render will be called with the `CreateElement` function and a
`RenderContext` object.

```js
const λ = Vue.extends({
  functional: true,
  render(createElement, context) {
    //
  },
});
```

_\*Note: Given the popularity of JSX and the nature of it's internals, it is
very common to see the `CreateElement` function aliased to `h`, as this is
expected to be in scope in JSX transpiled output._

## `CreateElement`

The function signature for `createElement` defines two signatures, or overloads.
The first has a length _(or arity)_ of two and accepts a tag and children. The
second accepts a tag, data, and children. All of the arguments are optional, but
since they are positional and conditional based on arity, you'll encounter
different behavior accordingly.

```ts
export interface CreateElement {
  (
    tag?:
      | string
      | Component<any, any, any, any>
      | AsyncComponent<any, any, any, any>
      | (() => Component),
    children?: VNodeChildren
  ): VNode;

  (
    tag?:
      | string
      | Component<any, any, any, any>
      | AsyncComponent<any, any, any, any>
      | (() => Component),
    data?: VNodeData,
    children?: VNodeChildren
  ): VNode;
}
```

### `tag`

From the above we can see that `tag` is a flexible type. It could be one of the
following:

* `string`
  * the tagname for a standard HTMLElement or a custom, registered vue component
    tagname.
* `Component`
  * the Component Options object
  * the returned Component type from `Vue.extend(Options)`
* `AsyncComponent`
  * a Promise-like `Component` _(basically `Component` wrapped in a Promise)_
* `() => Component`
  * a function that returns `Component`

### `children`

The `children` argument is also a flexible type. For the scope of this document
it will suffice to say that this could be one of:

* `string`
  * a basic `string` is tantamount to a text node in HTML
* `Array<VNode | string>`
  * `VNode` is the virtual DOM data structure that represents a DOM Node.
  * again, strings get treated as a shorthand to text nodes

### `data`

Finally for `CreateElement` we'll look at `VNodeData`. This is basically where
all the Vue & node attributes are placed--everything from Vue directives to DOM
event listeners.

```ts
export interface VNodeData {
  key?: string | number;
  slot?: string;
  scopedSlots?: { [key: string]: ScopedSlot };
  ref?: string;
  tag?: string;
  staticClass?: string;
  class?: any;
  staticStyle?: { [key: string]: any };
  style?: object[] | object;
  props?: { [key: string]: any };
  attrs?: { [key: string]: any };
  domProps?: { [key: string]: any };
  hook?: { [key: string]: Function };
  on?: { [key: string]: Function | Function[] };
  nativeOn?: { [key: string]: Function | Function[] };
  transition?: object;
  show?: boolean;
  inlineTemplate?: {
    render: Function;
    staticRenderFns: Function[];
  };
  directives?: VNodeDirective[];
  keepAlive?: boolean;
}
```

## Virtual DOM

One interesting side-effect of deep diving into the `CreateElement` signature is
that we've covered the basic API of almost all popular virtual dom
implementations. Libraries like
[`snabbdom`](https://github.com/snabbdom/snabbdom),
[`Maquette`](https://maquettejs.org/),
[`virtual-dom`](https://github.com/Matt-Esch/virtual-dom), as well as
[`React.createElement`](https://reactjs.org/docs/react-api.html#createelement)
utilize this `tag, ?data, ?children` approach. This is why all of them can be
expressed via JSX.

All Vue components are compiled into `createElement` calls. The full Vue.js UMD
build includes the template compiler. The leaner production builds don't include
the compiler in the runtime, so ahead of time (AOT) compilation must be done.
Single-file components are always AOT compiled.

> _"It's just JavaScript."_ -- HorseJS

![horse-js](./horse-js_100x100.png)

## `RenderContext`

```ts
export interface RenderContext<Props = DefaultProps> {
  props: Props;
  children: VNode[];
  slots(): any;
  data: VNodeData;
  parent: Vue;
  listeners: { [key: string]: Function | Function[] };
  injections: any;
}
```

```js
const λ = Vue.extend({
  functional: true,
  render(createElement, context) {
    return createElement("h1", context.data, context.children);
  },
});

window.app = new Vue({
  el: "#root",
  components: {
    MyHello: λ,
  },
});
```

[Next &rarr;](./example-02.md)
