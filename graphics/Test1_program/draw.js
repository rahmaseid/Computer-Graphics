var gl, program;
var modelViewStack=[];
var vertices=[];

// counts & offsets for draw calls
var circleOS = 0;   //circle offset
var circleCount = 0;
var spkOS = 0; //spike offset
var spkCount = 0;  //spike count

function main()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    initBuffers();

    render();
};

function initBuffers() {

    //  Configure WebGL
    gl.clearColor( 0.9, 0.9, 1.0, 1.0 );
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function GeneratePoints()
{
    var radius = 0.6;
    var vertices=[];

    // generate the points and store in array "vertices"
    circleOS = 0;
    var n = 200;
    for (var i = 0; i < n; i++){
        var theta = (2*Math.PI*i)/n;
        var x = Math.cos(theta) * radius;
        var y = Math.sin(theta) * radius;
        vertices.push(vec2(x,y));
    }
    circleCount = n;

    spkOS = vertices.length;
    vertices.push(vec2(0.2, 0.0));
    vertices.push(vec2(0.0, 0.35));
    vertices.push(vec2(-0.2, 0.0));
    vertices.push(vec2(0.0, -0.1));
    spkCount = 4;


    return vertices;
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    // make sure to send modelViewMatrix to the vertex shader before each draw command
    var RADIUS = 0.6;     //circle radius
    var S = scale4(0.90, 0.90, 1.0);

    var H = S;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(H));
    gl.drawArrays(gl.LINE_LOOP, circleOS, circleCount);

    //draw 8 spikes
    var OUT = RADIUS + 0.12;
    var T = translate(0.0, OUT, 0.0);
    var numSpks = 8;
    for (var i = 0; i < numSpks; i++){
        var R = rotate(i * (360/numSpks), vec3(0.0, 0.0, 1.0));

        H = mult(S, mult(R, T));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(H));
        gl.drawArrays(gl.LINE_LOOP, spkOS, spkCount);
    }

    /*var modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.LINE_LOOP, circleOS, circleCount);


    var translateOt = translate(0.0, 0.72, 0.0);
    var numSpks = 8; //number of spikes
    for (var i = 0; i < numSpks; i++){
        var S = rotate(i * (360/numSpks), vec3(0.0, 0.0, 1.0));
        modelViewMatrix = mult(S, translateOt);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.LINE_LOOP, spkOS, spkCount);
    } */

}