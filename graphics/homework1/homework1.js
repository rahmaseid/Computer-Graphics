// Rahma Seid
// Homework 1
// A.I. Disclaimer: All work for this assignment was completed by myself and entirely without the use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc.

var gl;
var program;

function main(){
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    function makeSquare(cx, cy, s){
        var h = s/2.0; 
        return [
            vec2(cx - h, cy - h),
            vec2(cx - h, cy + h),
            vec2(cx + h, cy + h),
            vec2(cx + h, cy - h),
        ];
    }

    function makeupTriangle(cx, cy, s){
        var h = s/2.0; 
        return [
            vec2(cx - h, cy - h), //base left
            vec2(cx + h, cy - h), //base right
            vec2(cx, cy + h)
        ];
    }

    var s = 0.5; //length of each square is 0.5
    var ofs = 0.25; //ofs = offset
    var TL = [-ofs, ofs]; //TL = top-left
    var TR = [ofs, ofs]; //TR = top-right
    var BL = [-ofs, -ofs]; //BL = bottom-left
    var BR = [ofs, -ofs]; //BR = bottom-right


    var vertices = [];

    //Top left - Square A
    vertices = vertices.concat(makeSquare(TL[0], TL[1], s));

    //Bottom right - Square B
    vertices = vertices.concat(makeSquare(BR[0], BR[1], s));

    //Top right - Triangle A
    vertices = vertices.concat(makeupTriangle(TR[0], TR[1], s));

    //Bottom left - Triangle B
    vertices = vertices.concat(makeupTriangle(BL[0], BL[1], s));


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function setColor(r, g, b, a){
    var uColorLoc = gl.getUniformLocation(program, "uColor");
    gl.uniform4f(uColorLoc, r, g, b, a);
}

function render() {
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Squares
    setColor(0.0, 0.2, 1.0, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // TL Square
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4); // BR Square

    // Triangles
    setColor(1.0, 0.3, 0.7, 1.0);
    gl.drawArrays(gl.TRIANGLES, 8, 3); // TR Triangle
    gl.drawArrays(gl.TRIANGLES, 11, 13); // BL Triangle
}
