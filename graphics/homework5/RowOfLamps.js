// Street Lamp built from primitives, demonstrating hierarchy & transforms.
// Uses only flat colors (MeshBasicMaterial). Designed for clarity and teaching.

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ---------------------------------------------------------
// 1) Basic scene setup
// ---------------------------------------------------------
const scene = new THREE.Scene();

// A neutral camera looking slightly down at the origin
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(5, 4, 8);
camera.lookAt(0, 1, 0);

// WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Keep pixel ratio reasonable for performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // can change to 2
document.body.appendChild(renderer.domElement);  // add the canvas created automatically in memory

// Orbit controls for exploration
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0); // Normally, right after creating your OrbitControls object, you call controls.target.set(x, y, z) once — to place the orbit center at the same point your camera is looking at.
controls.update();//controls.update() recalculates the camera’s orientation so that it looks at the current controls.target, and applies any pending parameter changes (like damping, zoom limits, etc.).
                  // it synchronizes the camera with the new target — that’s the one-time alignment

// Helpers 
// adding axes
const axes = new THREE.AxesHelper(1); // X=red, Y=green, Z=blue
axes.position.y = 3.6;            // above the 0.1-tall ground box
axes.position.x = 2;
axes.renderOrder = 999;

scene.add(axes);

// adding grid
const grid = new THREE.GridHelper(40, 40, 0x666666, 0x444444);
grid.position.y = 0.001;         // tiny lift above ground
scene.add(grid);

// 2) Materials (flat colors only)
const matDarkGrey  = new THREE.MeshBasicMaterial({ color: 0x444b52 });
const matLightGrey = new THREE.MeshBasicMaterial({ color: 0xa0a8b0 });
const matAccent    = new THREE.MeshBasicMaterial({ color: 0xf0c040 }); // "light" color
const matBlack     = new THREE.MeshBasicMaterial({ color: 0xaaeeaa });
const matBlue      = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });


// 3) Build a simple ground for context
{
  const groundGeo = new THREE.BoxGeometry(25, 0.1, 6);
  const ground = new THREE.Mesh(groundGeo, matBlack);
  ground.position.set(0, 0.05, 0);   // sit slightly above y=0 grid lines
  scene.add(ground);
}

// ---------------------------------------------------------
// 4) Build the street lamp with hierarchy
//    lampRoot
//      ├─ base (cylinder)
//      ├─ pole (cylinder)
//      └─ armPivot (empty group at hinge height) 
//          ├─ arm (box)
//          └─ headPivot (empty group at end of arm)
//             └─ headGroup
//                ├─ shade (cone)
//                ├─ bulb (sphere)
//                └─ rim (torus) 
// ---------------------------------------------------------
function buildLamp({
  baseHeight = 0.3,
  poleHeight = 3.0,
  poleRadius = 0.12, //along z-radius
  armLength = 1.2, //
  armThickness = 0.08,
  armPivotHeight = [0.9, 0.9],
  dbgAx = false,

} = {}) {

  const lampRoot = new THREE.Group();
  scene.add(lampRoot);

  // -- Base: wide cylinder near the ground
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.8, baseHeight, 32),
    matDarkGrey
  );
  base.position.set(0, baseHeight / 2, 0);
  lampRoot.add(base);

  // -- Pole: tall, slender cylinder rising from the base
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 20),
    matLightGrey
  );
  pole.position.set(0, baseHeight + poleHeight / 2, 0);
  lampRoot.add(pole);

  function createArm(setHeight, direction = 1){
    // -- Arm pivot: an EMPTY group located near the top of the pole.
    //    Rotating this group swings the arm up/down around the hinge point.
    const y = baseHeight + poleHeight * setHeight; // hinge 90% up the pole
    const armPivot = new THREE.Group();
    armPivot.position.set(0, y, 0);  // the whole armPivot group is raised along y axis
    //lampRoot.add(armPivot);

    // Visualize the hinge with a small sphere "bolt" 
    const hingeBolt = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      matBlue
    );
    //hingeBolt.position.set(0, 0, 0);
    armPivot.add(hingeBolt);

    // -- Arm: a thin rectangular box that extends forward from the hinge.
    //    We build it around its own center, then move it so the near end sits at the pivot.
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(armThickness, armThickness, armLength),
      matLightGrey
    );
    // By default, the box is centered; shift it so its left end touches the pivot.
    arm.position.set(0, 0, (armLength / 2) * direction);
    armPivot.add(arm);

    // -- Head pivot: another EMPTY group at the far end of the arm.
    //    Rotating this pivot tilts the lamp head around its "neck."

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0, armLength * direction);
    armPivot.add(headPivot);

    const headGroup = new THREE.Group();
    headPivot.add(headGroup);

    const shadeHeight = 0.45;
    const shadeRadius = 0.28;
    const bulbRadius  = 0.14;

    // a short neck between arm and shade apex
    const neckLen = 0.06;
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, neckLen, 16),
      matLightGrey
    );
    neck.position.set(0, -neckLen / 2, 0); // hangs down a bit from the pivot
    headGroup.add(neck);

    // Shade: apex at pivot -> move cone down by h/2 + half neck
    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(shadeRadius, shadeHeight, 24, 1, true, 0, Math.PI * 2), // open ended cone 
      matDarkGrey
    );

    shade.position.set(0, -(neckLen + shadeHeight) / 2, 0);  // hang down half neck length, another half shade height
    headGroup.add(shade);

    // Bulb: inside the shade, just above the rim
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(bulbRadius, 24, 16),
      matAccent
    );
    // lift a bit more so it doesn't poke out
    bulb.position.set(0, -(neckLen + shadeHeight) / 2 - 0.1, 0); // bulb should be down a little more than shade
    headGroup.add(bulb);

    // Rim: lies on the cone's open edge (y = -h/2 relative to shade center)
    // Torus is in XY by default -> rotate to XZ
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(shadeRadius * 0.98, 0.015, 12, 48),
      matLightGrey
    );
    rim.rotation.x = Math.PI / 2;                 // <-- key fix
    rim.position.set(0, -(neckLen + shadeHeight) / 2 - 0.2, 0); // move rim further down from bulb, adjust to fit properly
    headGroup.add(rim);

    return {armPivot, headPivot, headGroup};

  }
  //Build out the two arms
  const topArm = createArm(armPivotHeight[0], +1);
  const botArm = createArm(armPivotHeight[1], -1);

  lampRoot.add(topArm.armPivot);
  lampRoot.add(botArm.armPivot);

  if (dbgAx)
    lampRoot.add(new THREE.AxesHelper(0.35));

  //store reference for control
  lampRoot.userData = {topArm, botArm};

  return lampRoot;

}

// ---------------------------------------------------------
// 5) Demonstrate transforms
//    We'll expose a few live angles you can change via keyboard.
//    Everything is in *local* space thanks to group hierarchy.
// ---------------------------------------------------------
function linearLayout(nodes, spacing, centered = true){
  const n = nodes.length;
  const start = centered ? -((n-1) * spacing) / 2: 0;
  nodes.forEach((node, i) => {
    node.position.set(start + i * spacing, 0, 0);
  });
}

const countLamp = 10;
const spacingLamp = 2.5;

const lamps = Array.from({length: countLamp }, () =>
  buildLamp({
    armLength: 1.4,
    armThickness: 0.08,
    poleHeight: 3.0,
    armPivotHeight: [0.9, 0.9],
    dbgAx: false
  })
);

//arrange to scene
lamps.forEach(lamp => scene.add(lamp));
linearLayout(lamps, spacingLamp, true);

const lampRoot = lamps[0];
const {topArm, botArm} = lampRoot.userData;

const state = {
  armAngleTop: THREE.MathUtils.degToRad(-15),   // rotate arm up/down around the hinge (X axis)
  armAngleBot: THREE.MathUtils.degToRad(-10),
  headTiltTop: THREE.MathUtils.degToRad(10),    // tilt head around its pivot (Z axis or X axis; we'll use Z for a classic tilt)
  headTiltBot: THREE.MathUtils.degToRad(-5),
  rootYaw: THREE.MathUtils.degToRad(0)       // rotate entire lamp around Y axis
};

// Apply the current state to the scene graph
function applyTransforms() {
  lampRoot.rotation.y = state.rootYaw;

  // X axis tilt for raising/lowering arm (pivot is at armPivot.position)
  topArm.armPivot.rotation.x = state.armAngleTop;     // keep z stabilized for clarity
  botArm.armPivot.rotation.x = state.armAngleBot;

  // Head tilt at end of arm. We'll tilt around Z to show a "cocked" head look.
  topArm.headPivot.rotation.z = state.headTiltTop;
  botArm.headPivot.rotation.z = state.headTiltBot;
}
applyTransforms();

// ---------------------------------------------------------
// 6) Keyboard controls (simple & visible for students)
//    A/Z: arm up/down
//    S/X: head tilt +/-
//    D/C: rotate whole lamp ±
// ---------------------------------------------------------
window.addEventListener("keydown", (e) => {
  const step = THREE.MathUtils.degToRad(3);
  switch (e.key.toLowerCase()) {
    case "a":  //both arms up
      state.armAngleTop += step;
      state.armAngleBot += step; 
      break; 
    case "z": //both arms down
      state.armAngleTop -= step; 
      state.armAngleBot -= step; 
      break;
    case "s": //both arms tilt up
      state.headTiltTop += step;
      state.headTiltBot += step; 
      break; 
    case "x": //both arms down
      state.headTiltTop -= step; 
      state.headTiltBot -= step; 
      break;
    case "d": state.rootYaw += step; break;
    case "c": state.rootYaw -= step; break;
    default: return;
  }
  applyTransforms();
});

// ---------------------------------------------------------
// 7) Render loop & resize handling
// ---------------------------------------------------------
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // change to 2 for more precision
}
window.addEventListener("resize", onResize);

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});


/*
Key ideas to notice:

1) Parent-child transforms
   - Rotating armPivot rotates the arm AND everything attached to it (headPivot → headGroup).
   - Rotating headPivot affects only the headGroup, because it's deeper in the graph.

2) Local vs world space
   - Positions like arm.position.set(armLength/2, 0, 0) are in the armPivot’s local space.
   - The arm is modeled centered, then moved so the hinge is at its left end.

3) Pivots without math headaches
   - You don't need to manually translate to/from origins to rotate around a point.
   - Create an empty THREE.Group at the hinge point → add the rotating part as a child.

4) Primitives
   - CylinderGeometry: base, pole
   - BoxGeometry: arm
   - ConeGeometry: shade
   - SphereGeometry: bulb, hinge "bolt"
   - TorusGeometry: decorative rim 

5) Materials
   - MeshBasicMaterial is flat (no lights). Focus on shape + transforms.
*/
