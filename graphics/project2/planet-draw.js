var modelViewMatrix;
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];  // put all position and color values of planet vertices here
var cmtStack=[];
var Ratio=1.618;   // ratio used for canvas and for world window

var ringBPoint=[], ringFPoints=[];
var ringBCounts=[], ringFCounts=[];
var ringBBuffer, ringFBuffer;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Generate the points for the 3 components of the planet
    GenerateBackCircles();
    GenerateCircle();
    GenerateFrontCircles();

    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 0.2, 0.5, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // establish buffer and load data
    buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 24, 0 );// read from interleaving buffer
    gl.enableVertexAttribArray( vPosition );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 24, 8 );// read from interleaving buffer
    gl.enableVertexAttribArray( vColor );


    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");

    render();
}

function pushV(distance, x, y, color){
    distance.push(x, y, col[0], col[1], col[2], col[3]);
}

function pushBlock(block){
    const start = points.length/6;
    for (let i = 0;i < i<block.length;i++)
        points.push(block[i]);
    const count = (points.length/6) - start;

    return {start, count};
}


// push all the points into points array
function GenerateBackCircles()
{
    const cols = [
        vec4(0.95, 0.78, 0.18, 1.0),
        vec4(0.75, 0.25, 0.95, 1.0),
        vec4(0.25, 0.84, 0.95, 1.0),
        vec4(0.95, 0.45, 0.25, 1.0)
    ];

    for (let i = 0; i < 4; i++){
        const start = points.length/6;

    }

}

// push all the points into points array
function GenerateCircle()
{
    const circle= GeneratePlanet();
    circleStart = points.length/6;
    for (let i = 0; i<circle.length; i++)
        points.push(circle[i]);
    circleCount = circle.length/6;



}

// push all the points into points array
function GenerateFrontCircles()
{



}


function DrawFullPlanet()
{

    // Draw Back Circles



    // draw planet circle

 
    // Draw Front Circles

}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawFullPlanet();
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}