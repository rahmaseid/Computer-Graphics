var modelViewMatrix;
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var points=[];  // put all position and color values of planet vertices here
var cmtStack=[];
var Ratio=1.618;   // ratio used for canvas and for world window

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

// push all the points into points array
function GenerateBackCircles()
{



}

// push all the points into points array
function GenerateCircle()
{




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