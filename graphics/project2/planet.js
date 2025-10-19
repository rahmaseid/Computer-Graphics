function GeneratePlanet() {
	let Radius=1.0;
	let numPoints = 80;
    let color=vec4(0.7, 0.7, 0, 1);

    let points=[];

    // add the first point, center of circle
    points.push(0, 0);
    points.push(color[0], color[1], color[2], color[3]);

	// TRIANGLE_FAN : for solid circle
	for( var i=0; i<=numPoints; i++ ) {
		var Angle = i * (2.0*Math.PI/numPoints);
		var X = Math.cos( Angle )*Radius;
		var Y = Math.sin( Angle )*Radius;
	    
       	points.push(X, Y);  // store position
        points.push(color[0], color[1], color[2], color[3]); // store color (interleaving mode)

		// use 360 instead of 2.0*PI if // you use d_cos and d_sin
	}

    return points;
}