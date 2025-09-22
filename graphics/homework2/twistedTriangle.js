var gl, canvas;
var points = [];
var theta=45/180*Math.PI;
var NumTimesToSubDivide = 6;

function main() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
    
    // Three Vertices
    var A = vec2(0.0, 1.0);
    var B = vec2(-Math.sqrt(3)/2, -0.5);
    var C = vec2(Math.sqrt(3)/2, -0.5);;

    divideTriangle(A, B, C, NumTimesToSubDivide);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(uColor, new Float32Array([1.0, 0.0, 0.0, 1.0]));
    render();
}

function twistVertex(v, theta) {
    var x = v[0];
    var y = v[1];
    var d = x*x + y*y;
    var ang = d * theta;
    var c = Math.cos(ang);
    var s = Math.sin(ang);
    return vec2(
        x*c - y*s,
        x*s + y*c
    );
}

//geometry, Twist starts here
function triangle(a, b, c){
    points.push(
        twistVertex(a, theta),
        twistVertex(b, theta),
        twistVertex(c, theta)   
    );
}

function divideTriangle(a, b, c, count){
    if (count == 0){
        triangle(a, b, c);
        return;
    }

    var ab = mix(a, b, 0.5);
    var bc = mix(b, c, 0.5);
    var ca = mix(c, a, 0.5);

    count--;

    //Sub-triangles
    divideTriangle(a, ab, ca, count);
    divideTriangle(ab, b, bc, count);
    divideTriangle(ca, bc, c, count);
    divideTriangle(ab, bc, ca, count);
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}