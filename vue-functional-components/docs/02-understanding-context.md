# 02 Understanding Context

[Basic example](http://localhost:3000/02.html)

## Lexical `this`

Functional components are really just functions that return javascript objects.
These objects are the virtual dom data structures that get turned into real dom
elements. The same thing happens for regular components, but with functional
components, no reactive component object is created, so there is no `this` to
resolve familiar data, properties, or methods. This also has performance
benefits. Functional components don't carry the initialization cost of regular
components, so repetitive usage is cheap.

Let's take a look at the context of `this` inside two components:

```js
const whoami = (name, self) => {
  console.log(`Who am I: ${name}`, self);
  console.assert(self instanceof Vue, "'this' is not Vue instance.");
  console.assert(self === window, "'this' is not the global context.");
};

// Our functional component
const λ = Vue.extend({
  functional: true,
  render(createElement, context) {
    whoami("λ", this);

    return createElement("h1", context.data, context.children);
  },
});

// Our, regular instance component
window.app = new Vue({
  el: "#root",
  components: {
    MyHello: λ,
  },
  mounted() {
    whoami("app", this);
  },
});
```

[Next ->](./03-writing-components.md)
