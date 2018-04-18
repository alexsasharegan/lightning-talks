# 03 Writing Components

## `vue-flex`: Flexbox wrapper

Below we have a simplified version of the flexbox component from the `vue-flex`
library.

```js
import Vue from "vue";
import { mergeData } from "vue-functional-data-merge";

const Shared = ["start", "end", "center"];
const JustifyContent = Shared.concat("between", "around");
const AlignItems = Shared.concat("baseline", "stretch");
const AlignAxes = Shared.concat("between", "baseline", "stretch");

export default Vue.extend({
  functional: true,
  props: {
    inline: Boolean,
    column: Boolean,
    reverse: Boolean,
    noWrap: Boolean,
    wrapReverse: Boolean,
    grow: Boolean,
    tag: {
      type: String,
      default: "div",
    },
    justify: {
      type: String,
      default: null,
      validator: type => JustifyContent.indexOf(type) !== -1,
    },
    align: {
      type: String,
      default: null,
      validator: type => AlignItems.indexOf(type) !== -1,
    },
    alignH: {
      type: String,
      default: null,
      validator: type => AlignAxes.indexOf(type) !== -1,
    },
    // Cannot prefix with `v` because it's parsed as directive.
    alignV: {
      type: String,
      default: null,
      validator: type => AlignAxes.indexOf(type) !== -1,
    },
  },
  render(h, ctx) {
    let { props, data, children } = ctx;
    let classMap = {};
    let componentData = { class: [classMap] };
    let hAxis = "justify-content";
    let hProp = "justify";
    let vAxis = "align-items";
    let vProp = "align";

    if (props.column) {
      hAxis = "align-items";
      hProp = "align";
      vAxis = "justify-content";
      vProp = "justify";
    }

    componentData.class.push(`vf__flex${props.inline ? "--inline" : ""}`);
    componentData.class.push(
      `vf__flex-dir--${props.column ? "column" : "row"}${
        props.reverse ? "-reverse" : ""
      }`
    );
    classMap[
      `vf__flex-wrap${props.wrapReverse ? "-reverse" : ""}`
    ] = !props.noWrap;
    classMap[`vf__flex-nowrap`] = props.noWrap;
    classMap[`vf__grow-children`] = props.grow;
    classMap[`vf__justify-content-${props.justify}`] = props.justify;
    classMap[`vf__align-items-${props.align}`] = props.align;
    classMap[`vf__${hAxis}-${props.alignH}`] = props.alignH && !props[hProp];
    classMap[`vf__${vAxis}-${props.alignV}`] = props.alignV && !props[vProp];

    return h(props.tag, mergeData(data, componentData), children);
  },
});
```

```html
<template>
  <flex-col id="root" class="100vh" no-wrap>
    <flex-row class="h-100" align-v="center" align-h="center">
      <my-hello>Hello λλλ</my-hello>
    </flex-row>
    <flex-row class="h-100" align-v="center" align-h="center">
      <my-hello>Hello λλλ</my-hello>
    </flex-row>
    <flex-row class="h-100" align-v="center" no-wrap>
      <flex-row class="w-100 h-100" align-v="center" align-h="center">
        <my-hello>Hello λλλ</my-hello>
      </flex-row>
      <flex-row class="w-100 h-100" align-v="center" align-h="center">
        <my-hello>Hello λλλ</my-hello>
      </flex-row>
    </flex-row>
  </flex-col>
</template>
```

## Merging Component Data

```js
const BillMurray = Vue.extend({
  props: {
    w: [Number, String],
    h: [Number, String],
  },
  functional: true,
  render(createElement, context) {
    const { data, props, children } = context;

    return createElement(
      "img",
      {
        attrs: {
          src: `https://www.fillmurray.com/${props.w}/${props.h}`,
          alt: "Bill Murray",
        },
      },
      children
    );
  },
});
```
