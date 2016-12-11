# fragmen.js

very simple shader importer.

## get started

```
window.addEventListener('load', ()=>{
    const source = 'your fragment shader source (compatible with glslsandbox)';
    const target = document.getElementById('target_element');
    const option = {
        target: target,
        eventTarget: window,
        mouse: true,
        escape: true,
        resize: true
    };
    const frag = new Fragmen(option).render(source);
}, false);
```

| name   | type                   |                                   |
|--------|------------------------|-----------------------------------|
| mouse  | boolean(default=false) | mouse event enable flag           |
| escape | boolean(default=false) | stop animation bind to escape key |
| resize | boolean(default=false) | resize event enable flag          |

easy!

enjoy!


