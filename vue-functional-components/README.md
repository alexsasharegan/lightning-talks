# `Vue => Component`

```html
<λ>Hello World!</λ>
```

## Functional Components

Functional components (FC) are stateless, instance-less components that are
purely a function of their props. FC's offer great performance because they do
not incur a setup cost for reactive observation nor add a wrapper around the dom
elements at runtime.

### Stateless

* A _"stateless"_ component does not have a `data` property/method
* Renders using only `props`

### Instance-less

* No component object is instantiated
* _`this`_ is not bound to a component

[Next: About Me &rarr;](./docs/about.md)
