var gl, program;
var uColorLoc, bufferId, vPositionLoc;
var currentFern = 0;   // 0 = fern #1, 1 = fern #2
var pointCount = 0;
var greenAlt = false;  // false = green A, true = green B


//Colors
const Green_A = [0.02, 0.70, 0.28];
const Green_B = [0.12, 0.92, 0.45];


// --- Fern Definitions (a, b, c, d, e, f, probability) ---
//Fern #1
const Fern1 = [
    {a: 0.0, b: 0.0, c: 0.0, d: 0.16, e: 0.0, f: 0.0, p: 0.10},
    {a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0.0, f: 1.6, p: 0.08},
    {a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0.0, f: 0.44, p: 0.08},
    {a: 0.75, b: 0.04, c: -0.04, d: 0.85, e: 0.0, f: 1.6, p: 0.74},
]

//Fern #1=2
const Fern2 = [
    {a: 0.0, b: 0.0, c: 0.0, d: 0.16, e: 0.0, f: 0.0, p: 0.01},
    {a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0.0, f: 1.6, p: 0.07},
    {a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0.0, f: 0.44, p: 0.07},
    {a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0.0, f: 1.6, p: 0.85},
]




function main() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	//  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
 	if (!program) { console.log('Failed to intialize shaders.'); return; }
	gl.useProgram( program );

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    // Associate out shader variables with our data buffer
    vPositionLoc = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPositionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionLoc );

    uColorLoc = gl.getUniformLocation(program, "uColor");

    window.addEventListener("mousedown", function(){
        currentFern = 1- currentFern;
          rebuildPointsAndRender();
    });

    
    window.addEventListener("keydown", (e) => {
        const key = e.key || String.fromCharCode(e.keyCode);
        if (key === 'c' || key === 'C' || e.keyCode === 67) {
                greenAlt = !greenAlt;
                render();

        } // end if
    });

    rebuildPointsAndRender();
};


//generate points
function GeneratePoints(iterations, defs, burn_in = 100){
    //build probability thresholds
    const thresholds = [];
    let acc = 0;
    
    for (let i = 0; i < defs.length; i++){
        acc += defs[i].p;
        thresholds.push(acc);
    }

    let x = 0.0;
    let y = 0.0;

    //first pass: generate and record min/max to normalize later
    const raw = [];

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < iterations; i++){
        //pick rule
        const r = Math.random();
        let k = 0;
        while(k < thresholds.length && r > thresholds[k])
            k++;
        const t = defs[Math.min(k, defs.length - 1)];

        //transform
        const nx = t.a * x + t.b * y + t.e;
        const ny = t.c * x + t.d * y + t.f;
        x = nx;
        y = ny;

        if (i >= burn_in){
            raw.push(x,y);
            if (x < minX)
                minX = x;
            if (x > maxX)
                maxX =x;
            if (y < minY)
                minY = y;
            if (y > maxY)
                maxY = y;
        }
    }

    //normalize to clip [-1, 1] with a small margin
    const margin = 0.05; //keep 5% of border
    const spanX = (maxX - minX) || 1;
    const spanY = (maxY - minY) || 1;

    const scaleX = 2 * (1-margin) / spanX;
    const scaleY = 2 * (1-margin) / spanY;
    const s = Math.min(scaleX, scaleY);

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const out = new Float32Array(raw.length);
    for (let i = 0; i < raw.length; i+=2){
        const X = (raw[i] - cx) * s;
        const Y = (raw[i+1] - cy) * s;
        out[i] = X;
        out[i+1] = Y;
    }

    return out;
}

function rebuildPointsAndRender(){
    const defs = currentFern === 0 ? Fern1 : Fern2;
    const pts = GeneratePoints(100000, defs, 100);
    pointCount = pts.length / 2;

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, pts, gl.STATIC_DRAW );

    render();

}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    const color = greenAlt ? Green_B : Green_A;
    gl.uniform3fv(uColorLoc, new Float32Array(color));

    gl.drawArrays(gl.POINTS, 0, pointCount);
    
}
