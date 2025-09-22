var gl, program;

function makeCircleOutline(radius, segments) {
  var data = new Float32Array(2 * segments);
  for (var i = 0; i < segments; ++i) {
    var a = (2.0 * Math.PI * i) / segments;
    data[2*i]   = radius * Math.cos(a);
    data[2*i+1] = radius * Math.sin(a);
  }
  return data;
}

// n = number of star points (6 points), R = outer radius, r = inner radius
function makeStarOutline(n, R, r) {
  var verts = new Float32Array(2 * n * 2); // 2n vertices
  var step = Math.PI / n;                  
  var idx = 0;
  var angle0 = Math.PI / 2.0;              // start pointing up

  for (var k = 0; k < 2*n; ++k) {
    var useR = (k % 2 === 0) ? R : r;
    var a = angle0 + k * step;
    verts[idx++] = useR * Math.cos(a);
    verts[idx++] = useR * Math.sin(a);
  }
  return verts;
}

function main() {
  var canvas = document.getElementById("webgl");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { console.log("WebGL isn't available"); return; }

  //  Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // --- geometry ---
  var circle = makeCircleOutline(1.0, 512);   
  var star   = makeStarOutline(6, 1.0, 0.5);     

  // one buffer, two draws
  var total = new Float32Array(circle.length + star.length);
  total.set(circle, 0);
  total.set(star, circle.length);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, total, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var u_Color = gl.getUniformLocation(program, "u_Color");

  // draw circle
  gl.uniform4f(u_Color, 0.2, 0.35, 1.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, 0, circle.length / 2);

  // draw star
  gl.uniform4f(u_Color, 0.2, 0.35, 1.0, 1.0);
  gl.drawArrays(gl.LINE_LOOP, circle.length / 2, star.length / 2);
}
