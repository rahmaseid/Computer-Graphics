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
var mountainPoints=[];
var starPoints=[];
var stars=[];
var starBuffer;
var groundBuffer;
var skyBuffer;
var mountainBuffer;

var bowPoints=[];
var bowBuffer;
var bowCt = 0; //count
var bowStOfst = 0; //String Offset
var bowGrOfst = 0; //Grip Offset

var arrowPoints=[];
var arrowBuffer;
var arrowShaftCt = 0;
var arrowHeadOfst = 0; 
var arrowFletchOfst = 0;
var arrowFletchCt = 0;

var flowerPoints=[];
var flowerPlacement=[];
var flowerBuffer;
var flowerStemOfst = 0, flowerStemCt = 0;
var flowerPetalOfst = 0, flowerPetalCt = 0;
var flowerCenterOfst = 0, flowerrCenterCt = 0;



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

        //mountains
    const mBottom = vec4(0.24, 0.14, 0.06, 1.0);
    const mTop = vec4(0.43, 0.28, 0.15, 1.0);
    PushTriangle(mountainPoints, worL+1.0, yHorizon, -5.8, yHorizon, -7.0, 3.6, mBottom, mTop);
    PushTriangle(mountainPoints, -5.3, yHorizon, -1.2, yHorizon, -2.0, 3.4, mBottom, mTop);
    PushTriangle(mountainPoints, 0.8, yHorizon, 5.8, yHorizon, 2.2, 3.0, mBottom, mTop);
    PushTriangle(mountainPoints, 6.5, yHorizon, worR-1.0, yHorizon, 7.0, 3.3, mBottom, mTop );

        //stars
    //starPoints = GenerateStars();

    const PlanetCx = -4.5, PlanetCy = 5.9, PlanetM = 1.5;
    const mABCDs=[];
    function addABCD(x1, y1, x2, y2, x3, y3, mat){
        const minX = Math.min(x1, x2, x3) - mat;
        const maxX = Math.max(x1, x2, x3) + mat;
        const minY = Math.min(y1, y2, y3) - mat;
        const maxY = Math.max(y1, y2, y3) + mat;

        mABCDs.push({minX, maxX, minY, maxY});
    }

    addABCD(worL+1.0, yHorizon, -5.8, yHorizon, -7.0, 3.6, 0.15);
    addABCD(-5.3, yHorizon, -1.2, yHorizon, -2.0, 3.4, 0.15);
    addABCD(0.8, yHorizon, 5.8, yHorizon, 2.2, 3.0, 0.15);
    addABCD(6.5, yHorizon, worR-1.0, yHorizon, 7.0, 3.3, 0.15);

    const N = 24;
    const skyHigh = worT - yHorizon;
    const tMin = yHorizon + skyHigh / 3;
    const margin_set = 0.4;
    const starScale = 1.0;

    let tries = 0;
    while(stars.length < N && tries < N * 300){
        tries++;
        const x = randRange(worL + margin_set, worR - margin_set);
        const y = randRange(tMin, worT - margin_set);
        const z = randRange(0.08, 0.16);
        const dx = x - PlanetCx;
        const dy = y - PlanetCy;
        const mClear = PlanetM + z * starScale + 0.15;

        if(dx*dx + dy*dy < mClear*mClear)
            continue;
        let stopped = false;
        
        if((x > worL + 0.5 && x < -5.5 && y < 3.6) || (x > -5.5 && x < -1.0 && y < 3.4) || (x > 0.8 &&  x < 5.8 && y < 3.0) || (x > 6.5 && x < worR - 0.5 && y < 3.3))
            continue;
        
        stars.push({x,y,z});
    }

        //flowers
    flowerPlacement = [
       { x: worL + 1.6, y: yHorizon - 0.15, z: 1.0},
       { x:-5.2, y: yHorizon - 0.10, z: 1.2},
       { x: -1.8, y: yHorizon - 0.12, z: 0.9},
       { x: 2.0, y: yHorizon - 0.10, z: 1.1},
       { x: worR - 1.8, y: yHorizon - 0.12, z: 0.95}
    ];
    

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

    // load mountain data in buffer
    mountainBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, mountainBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(mountainPoints), gl.STATIC_DRAW );

    // load star data in buffer
    starBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, starBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(starPoints), gl.STATIC_DRAW );

    // load bow data in buffer
    bowBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bowBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(bowPoints), gl.STATIC_DRAW );

    // load arrow data in buffer
    arrowBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, arrowBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(arrowPoints), gl.STATIC_DRAW );

    // load flower data in buffer
    flowerBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, flowerBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(flowerPoints), gl.STATIC_DRAW );

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
    starPoints = GenerateStars();
    bowPoints = GenerateBow();
    arrowPoints = GenerateArrow();
    flowerPoints = GenerateFlowers();
}

function randRange(min, max){
    return Math.random() * (max - min) + min;
}

function GenerateStars(){
    const outer = 1.0, inner = 0.55;
    const color = vec4(1.0, 1.0, 0.75, 1.0);
    const position=[];

    position.push(0, 0, color[0], color[1], color[2], color[3]);
    for(let i = 0; i <= 10; i++){
        const b = (i * Math.PI) / 5;
        const t = (i % 2 == 0) ? outer : inner;
        position.push(Math.cos(b)*t, Math.sin(b)*t,
        color[0], color[1], color[2], color[3]);
    }

    return position;
}

function pushV(distance, x, y, col){
    distance.push(x, y, col[0], col[1], col[2], col[3]);
}

function GenerateBow(){
    const position = [];
    const col = vec4(0.93, 0.87, 0.15, 1.0);
    const k = 1.0;
    const steps = 40;

    bowCt = steps + 1;
    for(let i = 0; i <= steps; i++){
        const h = (i * Math.PI)/steps;
        pushV(position, k*Math.cos(h), k*Math.sin(h), col);
    }

    bowStOfst = position.length/6;
    pushV(position, -k, 0, col);
    pushV(position, k, 0, col);

    bowGrOfst = position.length/6;
    pushV(position, -0.20, -0.05, col);
    pushV(position, 0.20, -0.05, col);

    return position
}

function GenerateArrow(){
    const position =[];
    const shaft = vec4(0.20, 0.87, 0.95, 1.0);
    const head = vec4(1.0, 0.60, 0.20, 1.0);
    const flet = vec4(0.93, 0.87, 0.15, 1.0);

    //shaft
    pushV(position, -0.9, 0, shaft);
    pushV(position, 0.8, 0, shaft);
    arrowShaftCt = 2;

    //head
    arrowHeadOfst = position.length/6;
    pushV(position, 0.8, 0.12, head);
    pushV(position, 1.05, 0, head);
    pushV(position, 0.80, -0.12, head);

    
    arrowFletchOfst = position.length/6;
    pushV(position, -0.95, 0, flet);
    pushV(position, -0.80, 0.10, flet);
    pushV(position, -0.80, 0, flet);

    pushV(position, -0.95, 0, flet);
    pushV(position, -0.80, -0.10, flet);
    pushV(position, -0.80, 0, flet);
    arrowFletchCt = 6;

    return position;

}

function rotateNDegrees(degrees){
    var r = mat4();
    var d = degrees*Math.PI/180;
    var c = Math.cos(d), s = Math.sin(d);
    r[0][0]=c;
    r[0][1]=-s;
    r[1][0]=s;
    r[1][1]=c;

    return r;
}

function GenerateFlowers(){
    const position=[];
    const stem = vec4(0.10, 0.60, 0.20, 1.0);
    const petal = vec4(0.85, 0.20, 0.20, 1.0);
    const center = vec4(0.98, 0.85, 0.15, 1.0);

    //stems
    flowerStemOfst=position.length/6;
    pushV(position, 0, -0.60, stem);
    pushV(position, 0, 0, stem);
    flowerStemCt=2;

    //petals
    const P1=0.20, P2 = 0.38;
    flowerPetalOfst=position.length/6;
    for (let i = 0; i < 6; i++){
        const w0 = (Math.PI/3) * (i);
        const w1 = (Math.PI/3) * (i+0.5);
        const w2 = (Math.PI/3) * (i+1.0);
        
        pushV(position, Math.cos(w0)*P1, Math.sin(w0)*P1, petal);
        pushV(position, Math.cos(w1)*P2, Math.sin(w1)*P2, petal);
        pushV(position, Math.cos(w2)*P1, Math.sin(w2)*P1, petal);
    }

    flowerPetalCt = 18;

    //center
    flowerCenterOfst = position.length/6;
    const fSteps = 20, Ac = 0.12;
    pushV(position, 0, 0, center);
    for (let i = 0; i <= fSteps; i++){
        const h = (i * 2*Math.PI) / fSteps;
        pushV(position, Math.cos(h)*Ac, Math.sin(h)*Ac, center);
    }

    flowerrCenterCt = fSteps+2;

    return position;
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

function PushTriangle(distance, x1, y1, x2, y2, x3, y3, colorBottom, colorTop){
    //bottom vertices
    distance.push(x1, y1, colorBottom[0], colorBottom[1], colorBottom[2], colorBottom[3]);
    distance.push(x2, y2, colorBottom[0], colorBottom[1], colorBottom[2], colorBottom[3]);

    //top vertices
    distance.push(x3, y3, colorTop[0], colorTop[1], colorTop[2], colorTop[3]);
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

function DrawMountains(){
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, mountainBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(vColor);
    

    gl.drawArrays(gl.TRIANGLES, 0, mountainPoints.length/6);
}

function DrawStars(){
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(vColor);
    

    const v = starPoints.length/6;

    for (let i = 0; i < stars.length; i++){
        const s = stars[i];

        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(s.x, s.y, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(s.z, s.z, 1));

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, v);
    }
}

function DrawBow(){
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -6.2, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(0.9, 0.9, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, bowBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.LINE_STRIP, 0, bowCt); //arc
    gl.drawArrays(gl.LINES, bowStOfst, 2); //string
    gl.drawArrays(gl.LINES, bowGrOfst, 2); //grip
}

function DrawArrow(){
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -6.05, 0));
    modelViewMatrix = mult(modelViewMatrix, rotateNDegrees(90));
    modelViewMatrix = mult(modelViewMatrix, scale4(0.9, 0.9, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, arrowBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.LINES, 0, arrowShaftCt); //shaft
    gl.drawArrays(gl.TRIANGLES, arrowHeadOfst, 3); //head
    gl.drawArrays(gl.TRIANGLES, arrowFletchOfst, arrowFletchCt); //fletch
}

function DrawFlowers(){
    gl.bindBuffer(gl.ARRAY_BUFFER, flowerBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(vColor);

    for (let i = 0; i < flowerPlacement.length; i++){
        const j = flowerPlacement[i];
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(j.x, j.y, 0));
        modelViewMatrix = mult(modelViewMatrix, scale4(j.z, j.z, 1));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
        gl.drawArrays(gl.LINES, flowerStemOfst, flowerStemCt); //stem
        gl.drawArrays(gl.TRIANGLES, flowerPetalOfst, flowerPetalCt); //petals
        gl.drawArrays(gl.TRIANGLE_FAN, flowerCenterOfst, flowerrCenterCt); //center
    
    }
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // draw ground and sky first
    DrawSky();
    DrawGround();

    // draw at least 20 stars, place them in random locations in the sky
    DrawStars();

    // draw groups of mountain, place them in horizon level
    DrawMountains();

    // then, draw planet, add rings too
    DrawFullPlanet();

    // then, draw ghost
    DrawGhost();

    // add other things, like bow, arrow, spider, flower, tree ...
    DrawBow();
    DrawArrow();
    DrawFlowers();
}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}