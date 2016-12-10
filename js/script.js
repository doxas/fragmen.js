
class Fragmen {
    constructor(option){
        this.target = null;
        this.eventTarget = null;
        this.canvas = null;
        this.gl = null;
        this.source = '';
        this.resize = false;
        this.mouse = false;
        this.mousePosition = null;
        this.run = false;
        this.startTime = 0;
        this.nowTime = 0;
        this.state = {
            program: null,
            uniLocation: null,
            attLocation: null,
            VS: '',
            FS: '',
            postProgram: null,
            postUniLocation: null,
            postAttLocation: null,
            postVS: '',
            postFS: '',
            fFront: null,
            fBack: null,
            fTemp: null,
        };
        this.init(option);
    }

    init(option){
        // option check
        if(option === null || option === undefined){return;}
        if(!option.hasOwnProperty('target') || option.target === null || option.target === undefined){return;}
        if(!(option.target instanceof HTMLElement)){return;}
        // init canvas
        this.target = this.eventTarget = option.target;
        if(this.target.tagName.match(/canvas/i)){
            this.canvas = target;
        }else{
            this.canvas = document.createElement('canvas');
            this.target.appendChild(this.canvas);
        }
        // init webgl context
        this.gl = this.canvas.getContext('webgl');
        if(this.gl === null || this.gl === undefined){
            console.log('webgl unsupported');
            return;
        }
        // check event
        if(option.hasOwnProperty('eventTarget') && option.eventTarget !== null && option.eventTarget !== undefined){
            this.eventTarget = option.eventTarget;
        }
        if(option.hasOwnProperty('mouse') && option.mouse === true){
            this.eventTarget.addEventListener('mousemove', this.mouseMove, false);
        }
        // fix size
        const bound = this.target.getBoundingClientRect();
        this.canvas.width = bound.width;
        this.canvas.height = bound.height;
        this.canvas.style.margin = '0';
    }

    render(){
        var err = null;
        run = false;
        timeout = null;
        if(shaderSource == null || shaderSource === ''){
            console.log('shader source not found');
            return;
        }
        fBufferWidth = window.innerWidth;
        fBufferHeight = window.innerHeight;
        if(!gl){
            gl = canvas.getContext('webgl');
            this.gl.getExtension('OES_standard_derivatives');
            tPrg = this.gl.createProgram();
            vSource = bid('vs').textContent;
            fSource = bid('fs').textContent;
            shader(tPrg, 0, vSource); shader(tPrg, 1, fSource);
            this.gl.linkProgram(tPrg);
            tUni = {};
            tUni.texture = this.gl.getUniformLocation(tPrg, 'texture');
            bAttLocation = this.gl.getAttribLocation(tPrg, 'position');
            fFront = fBack = fTemp = null;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), this.gl.STATIC_DRAW);
            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.disable(this.gl.CULL_FACE);
            this.gl.disable(this.gl.BLEND);
            this.gl.clearColor(0, 0, 0, 1);
        }else{
            this.gl.deleteProgram(prg);
            prg = null;
        }
        resetBuffer(fFront);
        resetBuffer(fBack);
        resetBuffer(fTemp);
        canvas.width = fBufferWidth;
        canvas.height = fBufferHeight;
        fFront = create_framebuffer(fBufferWidth, fBufferHeight);
        fBack  = create_framebuffer(fBufferWidth, fBufferHeight);
        prg = this.gl.createProgram();
        vSource = 'attribute vec3 p;void main(){gl_Position=vec4(p,1.);}';
        fSource = shaderSource;
        if(shader(prg, 0, vSource) && shader(prg, 1, fSource)){
            this.gl.linkProgram(prg);
        }else{
            return;
        }
        err = this.gl.getProgramParameter(prg, this.gl.LINK_STATUS);
        if(!err){alert(this.gl.getProgramInfoLog(prg)); return;}

        this.gl.useProgram(prg);
        uni = {};
        uni.mouse = this.gl.getUniformLocation(prg, 'mouse');
        uni.time = this.gl.getUniformLocation(prg, 'time');
        uni.resolution = this.gl.getUniformLocation(prg, 'resolution');
        uni.sampler = this.gl.getUniformLocation(prg, 'buckbuffer');
        aAttLocation = this.gl.getAttribLocation(prg, 'p');

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, fBufferWidth, fBufferHeight);

        timeout = setTimeout(function(){
            console.log('render: ', shaderSource);
            run = true;
            mousePosition = [0.0, 0.0];
            startTime = Date.now();
            render();
        }, 2000);
    }

    draw(){
        if(!run){return;}
        requestAnimationFrame(render);
        nowTime = (Date.now() - startTime) * 0.001;
        this.gl.useProgram(prg);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fFront.f);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, fBack.t);
        this.gl.enableVertexAttribArray(aAttLocation);
        this.gl.vertexAttribPointer(aAttLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.uniform2fv(uni.mouse, mousePosition);
        this.gl.uniform1f(uni.time, nowTime);
        this.gl.uniform2fv(uni.resolution, [fBufferWidth, fBufferHeight]);
        this.gl.uniform1i(uni.sampler, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        this.gl.useProgram(tPrg);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, fFront.t);
        this.gl.enableVertexAttribArray(bAttLocation);
        this.gl.vertexAttribPointer(bAttLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.uniform1i(tUni.texture, 1);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        this.gl.flush();
        fTemp = fFront;
        fFront = fBack;
        fBack = fTemp;
    }

    shader(p, i, j){
        if(!gl){return;}
        k = this.gl.createShader(this.gl.VERTEX_SHADER - i);
        this.gl.shaderSource(k, j);
        this.gl.compileShader(k);
        if(!this.gl.getShaderParameter(k, this.gl.COMPILE_STATUS)){
            alert(this.gl.getShaderInfoLog(k));
            return false;
        }
        this.gl.attachShader(p, k);
        var message = this.gl.getShaderInfoLog(k);
        if(message !== ''){console.info('message: ' + message);}
        return true;
    }

    resetBuffer(obj){
        if(!gl || !obj){return;}
        if(obj.hasOwnProperty('f') && obj.f != null && this.gl.isFramebuffer(obj.f)){
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.deleteFramebuffer(obj.f);
            obj.f = null;
        }
        if(obj.hasOwnProperty('d') && obj.d != null && this.gl.isRenderbuffer(obj.d)){
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            this.gl.deleteRenderbuffer(obj.d);
            obj.d = null;
        }
        if(obj.hasOwnProperty('t') && obj.t != null && this.gl.isTexture(obj.t)){
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.deleteTexture(obj.t);
            obj.t = null;
        }
        obj = null;
    }

    create_framebuffer(width, height){
        const frameBuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);
        const depthRenderBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthRenderBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthRenderBuffer);
        const fTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, fTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, fTexture, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        return {f: frameBuffer, d: depthRenderBuffer, t: fTexture};
    }

    mouseMove(eve){
        const bound, x, y, w, h;
        if(this.eventTarget === window){
            x = eve.clientX; y = eve.clientY;
            w = window.innerWidth; h = window.innerHeight;
        }else{
            bound = this.eventTarget.getBoundingClientRect();
            x = eve.clientX - (bound.left - window.scrollX);
            y = eve.clientY - (bound.top - window.scrollY);
            w = bound.width; h = bound.height;
        }
        this.mousePosition = [x / w, 1.0 - y / h];
    }

    keyDown(eve){
        if(this.gl === null){return;}
        this.run = (eve.keyCode !== 27);
    }
}

