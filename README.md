# fragmen.js

very simple fragment shader importer.

![](fragmen.jpg)

[fragmen.js DEMO](https://doxas.org/work/fragmen.js/)

## get started

```javascript
window.addEventListener('DOMContentLoaded', ()=>{
    const source = 'your fragment shader source (compatible with glslsandbox)';
    const target = document.getElementById('target_element');
    const option = {
        target: target,
        eventTarget: window,
        mouse: true,
        resize: true,
        escape: true
    };
    const frag = new Fragmen(option).render(source);
}, false);
```

easy!

## options

| name        | type                   |                                          |
|-------------|------------------------|------------------------------------------|
| target      | HTMLElement            | insert target                            |
| eventTarget | HTMLElement or window  | target of mouse event                    |
| mouse       | boolean(default=false) | mouse event enable flag                  |
| resize      | boolean(default=false) | resize event enable flag                 |
| escape      | boolean(default=false) | bind an animation stop to the escape key |

## method

### Fragmen.render({string} source);

fragment shader source code. (compatible with glslsandbox)

## uniforms

### uniform vec2 resolution;

canvas resolution.

### uniform vec2 mouse;

mouse cursor coordinate. (range 0.0 to 1.0)

### uniform float time;

since Fragmen.render called.

### uniform sampler2D backbuffer;

previous scene.


## License

This software is released under the MIT License.

