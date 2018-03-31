# Example 01

[Basic example](http://localhost:3000/01.html)

```js
const whoami = (name, self) => {
  console.log(`whoami: ${name}`);
  console.assert(self instanceof Vue, "'this' is not Vue instance.");
  console.assert(self === window, "'this' is not the global context.");
};

const λ = Vue.extend({
  functional: true,
  render(createElement, context) {
    whoami("λ", this);

    return createElement("h1", context.data, context.children);
  },
});

window.app = new Vue({
  el: "#root",
  components: {
    "my-hello": λ,
  },
  mounted() {
    whoami("app", this);
  },
});
```