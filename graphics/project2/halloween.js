var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

var cmtStack=[];

var planetPoints=[];
var ghostPoints=[];
// define additional arrays to hold vertices for other shapes 
yHorizon = -1.6;
var worL, worR, worT = 8, worB = -8; //wor = world; L=left, R=right, T=top, B=bottom
var groundPoints=[];
var skyPoints=[];
var groundBuffer;
var skyBuffer;


function main() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    if (!canvas.width || !canvas.height){
        canvas.width = 1216;
        canvas.height = 752;
    }

    GeneratePoints();

    const apt = gl.drawingBufferWidth/gl.drawingBufferHeight; //apt = aspect
    modelViewMatrix = mat4();
    projectionMatrix = ortho(-8*apt, 8*apt, -8, 8, -1, 1);   // orthographic projection matrix is generated
                                    // The orthographic projection viewing volume is defined to be
                                    // x: -8, 8; y:-8, 8, z:-1, 1

    //fix edge spaces in image
    worL = -8 * apt;
    worR = 8 * apt;

    //build out background
        //sky
    const skyBottom = vec4(0.58, 0.28, 0.64, 1.0);
    const skyTop = vec4(0.04, 0.02, 0.14, 1.0);
    skyPoints = Background(worL, worR, yHorizon, worT, skyBottom, skyTop);

        //ground
    const gBottom = vec4(0.10, 0.16, 0.06, 1.0);
    const gTop = vec4(0.33, 0.43, 0.23, 1.0);
    groundPoints = Background(worL, worR, worB, yHorizon, gBottom, gTop);


    initWebGL();

    render();
}

function initWebGL() {
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // load planet data in buffer
    planetBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, planetBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(planetPoints), gl.STATIC_DRAW );

    // load sky data in buffer
    skyBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, skyBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(skyPoints), gl.STATIC_DRAW );

    // load ground data in buffer
    groundBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, groundBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(groundPoints), gl.STATIC_DRAW );

    // set up vPosition vertex shader variable to read from buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 24, 0 );
    gl.enableVertexAttribArray( vPosition );

    // set up vColor vertex shader variable to read from buffer
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 24, 8 ); // stride 24(6*float(8bytes))
    gl.enableVertexAttribArray( vColor );

    // load gost data in buffer
    ghostBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ghostBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,  new Float32Array(ghostPoints), gl.STATIC_DRAW );

    // get modelview matrix and projection matrix onto the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");
}

function GeneratePoints() {
    planetPoints=GeneratePlanet();
    ghostPoints=GenerateGhost();
}


function DrawGhost() {

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(-9, -1, 0));
    modelViewMatrix=mult(modelViewMatrix, scale4(1.5, 1.5, 1));
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    modelViewMatrix=mult(modelViewMatrix, scale4(1/10, 1/10, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // update to read from buffer containing ghost data
    gl.bindBuffer( gl.ARRAY_BUFFER, ghostBuffer );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 24, 0 );
    //gl.enableVertexAttribArray( vPosition ); 
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 24, 8);
    //gl.enableVertexAttribArray( vColor ); 

    // draw ghost
    gl.drawArrays( gl.LINE_LOOP, 0, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 87, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 93, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 98, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 107, 7);  // left eye ball

    modelViewMatrix=mult(modelViewMatrix, translate(2.6, 0, 0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 98, 9);  // right eye
    gl.drawArrays( gl.TRIANGLE_FAN, 107, 7);  // right eye ball
}

function DrawFullPlanet() {
	modelViewMatrix=mat4();
	modelViewMatrix = mult(modelViewMatrix, translate(-4.5, 5.9, 0));
	modelViewMatrix=mult(modelViewMatrix, scale4(1.5, 1.5, 1));  // undo the projection view volume ratio
    
    // important!! always update modelview matrix with current transformation 
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    // update to read from buffer containing planet data
    gl.bindBuffer( gl.ARRAY_BUFFER, planetBuffer );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 24, 0 );
    gl.enableVertexAttribArray( vPosition ); 
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray( vColor ); 

    // draw planet circle
    const numVertices = planetPoints.length / 6;
    console.log("planet floats:", planetPoints.length, "vertices:", numVertices);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices);
}

function Background(left, right, bottom, top, colorBottom, colorTop){
    const position = [];

    position.push(left, bottom, colorBottom[0], colorBottom[1], colorBottom[2], colorBottom[3]);
    position.push(right, bottom, colorBottom[0], colorBottom[1], colorBottom[2], colorBottom[3]);
    position.push(right, top, colorTop[0], colorTop[1], colorTop[2], colorTop[3]);

    position.push(left, bottom, colorBottom[0], colorBottom[1], colorBottom[2], colorBottom[3]);
    position.push(right, top, colorTop[0], colorTop[1], colorTop[2], colorTop[3]);
    position.push(left, top, colorTop[0], colorTop[1], colorTop[2], colorTop[3]);

    return position;
}

function DrawSky(){
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(vColor);
    

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function DrawGround(){
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(vColor);
    

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky first
    DrawSky()
    DrawGround()

    // draw at least 20 stars, place them in random locations in the sky


    // draw groups of mountain, place them in horizon level


    // then, draw planet, add rings too
    DrawFullPlanet();

    // then, draw ghost
    DrawGhost();

    // add other things, like bow, arrow, spider, flower, tree ...
    
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}