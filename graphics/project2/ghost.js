function GenerateGhost()
{
    let points=[];
    let color=vec4(1, 1, 1, 1);

    // begin body  (91 points)
    // each vertex/point is described by 1 position and 1 color
	points.push(3, 0, color[0], color[1], color[2], color[3]); 
	points.push(3.1, 1, color[0], color[1], color[2], color[3]); 
	points.push(3.5, 2, color[0], color[1], color[2], color[3]); 
	points.push(4, 3.6, color[0], color[1], color[2], color[3]); 
	points.push(4, 4, color[0], color[1], color[2], color[3]); 
	points.push(4.1, 3.3, color[0], color[1], color[2], color[3]); 
	points.push(4.5, 3, color[0], color[1], color[2], color[3]); 
	points.push(5.5, 3, color[0], color[1], color[2], color[3]); 
	points.push(6,3.5, color[0], color[1], color[2], color[3]); 
	points.push(6.5, 4, color[0], color[1], color[2], color[3]); 
	points.push(6.7, 4.2, color[0], color[1], color[2], color[3]); 
	points.push(6.8, 2.8, color[0], color[1], color[2], color[3]); 
	points.push(7, 2.4, color[0], color[1], color[2], color[3]); 
	points.push(7.5, 2, color[0], color[1], color[2], color[3]); 
	points.push(8, 2, color[0], color[1], color[2], color[3]); 
	points.push(8.5, 1.7, color[0], color[1], color[2], color[3]); 
	points.push(9, 1.2, color[0], color[1], color[2], color[3]); 
	points.push(10, 0.8, color[0], color[1], color[2], color[3]); 
	points.push(10, -2, color[0], color[1], color[2], color[3]); 
	points.push(10.4, -2.8, color[0], color[1], color[2], color[3]); 
	points.push(10.5, -3.5, color[0], color[1], color[2], color[3]); 
	points.push(10.7, -1.7, color[0], color[1], color[2], color[3]); 
	points.push(11, -1.4, color[0], color[1], color[2], color[3]); 
	points.push(11.2, -1.5, color[0], color[1], color[2], color[3]); 
	points.push(12, -2, color[0], color[1], color[2], color[3]); 
	points.push(12.5, -2.5, color[0], color[1], color[2], color[3]); 
	points.push(13, -3, color[0], color[1], color[2], color[3]); 
	points.push(13, -2, color[0], color[1], color[2], color[3]); 
	points.push(12.8, -0.5, color[0], color[1], color[2], color[3]); 
	points.push(12, 0, color[0], color[1], color[2], color[3]); 
	points.push(12.5, 0.5, color[0], color[1], color[2], color[3]); 
	points.push(11, 1, color[0], color[1], color[2], color[3]); 
	points.push(10.8, 1.4, color[0], color[1], color[2], color[3]); 
	points.push(10.2, 2.5, color[0], color[1], color[2], color[3]); 
	points.push(10, 4, color[0], color[1], color[2], color[3]); 
	points.push(9.8, 7.5, color[0], color[1], color[2], color[3]); 
	points.push(7.5, 9.5, color[0], color[1], color[2], color[3]); 
	points.push(6, 11, color[0], color[1], color[2], color[3]); 
	points.push(3, 12, color[0], color[1], color[2], color[3]); 
	points.push(.5, 15, color[0], color[1], color[2], color[3]); 
	points.push(0, 17, color[0], color[1], color[2], color[3]); 
	points.push(-1.8, 17.4, color[0], color[1], color[2], color[3]); 
	points.push(-4, 16.6, color[0], color[1], color[2], color[3]); 
	points.push(-5, 14, color[0], color[1], color[2], color[3]); 
	points.push(-6, 10.5, color[0], color[1], color[2], color[3]); 
	points.push(-9, 10, color[0], color[1], color[2], color[3]); 
	points.push(-10.5, 8.5, color[0], color[1], color[2], color[3]); 
	points.push(-12, 7.5, color[0], color[1], color[2], color[3]); 
	points.push(-12.5, 4.5, color[0], color[1], color[2], color[3]); 
	points.push(-13, 3, color[0], color[1], color[2], color[3]); 
	points.push(-13.5, -1, color[0], color[1], color[2], color[3]); 
	points.push(-13, -2.3, color[0], color[1], color[2], color[3]); 
	points.push(-12, 0, color[0], color[1], color[2], color[3]); 
	points.push(-11.5, 1.8, color[0], color[1], color[2], color[3]); 
	points.push(-11.5, -2, color[0], color[1], color[2], color[3]); 
	points.push(-10.5, 0, color[0], color[1], color[2], color[3]); 
	points.push(-10, 2, color[0], color[1], color[2], color[3]); 
	points.push(-8.5, 4, color[0], color[1], color[2], color[3]); 
	points.push(-8, 4.5, color[0], color[1], color[2], color[3]); 
	points.push(-8.5, 7, color[0], color[1], color[2], color[3]); 
	points.push(-8, 5, color[0], color[1], color[2], color[3]); 
	points.push(-6.5, 4.2, color[0], color[1], color[2], color[3]); 
	points.push(-4.5, 6.5, color[0], color[1], color[2], color[3]); 
	points.push(-4, 4, color[0], color[1], color[2], color[3]); 
	points.push(-5.2, 2, color[0], color[1], color[2], color[3]); 
	points.push(-5, 0, color[0], color[1], color[2], color[3]); 
	points.push(-5.5, -2, color[0], color[1], color[2], color[3]); 
	points.push(-6, -5, color[0], color[1], color[2], color[3]); 
	points.push(-7, -8, color[0], color[1], color[2], color[3]); 
	points.push(-8, -10, color[0], color[1], color[2], color[3]); 
	points.push(-9, -12.5, color[0], color[1], color[2], color[3]); 
	points.push(-10, -14.5, color[0], color[1], color[2], color[3]); 
	points.push(-10.5, -15.5, color[0], color[1], color[2], color[3]); 
	points.push(-11, -17.5, color[0], color[1], color[2], color[3]); 
	points.push(-5, -14, color[0], color[1], color[2], color[3]); 
	points.push(-4, -11, color[0], color[1], color[2], color[3]); 
	points.push(-5, -12.5, color[0], color[1], color[2], color[3]); 
	points.push(-3, -12.5, color[0], color[1], color[2], color[3]); 
	points.push(-2, -11.5, color[0], color[1], color[2], color[3]); 
	points.push(0, -11.5, color[0], color[1], color[2], color[3]); 
	points.push(1, -12, color[0], color[1], color[2], color[3]); 
	points.push(3, -12, color[0], color[1], color[2], color[3]); 
	points.push(3.5, -7, color[0], color[1], color[2], color[3]); 
	points.push(3, -4, color[0], color[1], color[2], color[3]); 
	points.push(4, -3.8, color[0], color[1], color[2], color[3]); 
	points.push(4.5, -2.5, color[0], color[1], color[2], color[3]); 
	points.push(3, 0, color[0], color[1], color[2], color[3]); 
    // end body

	// begin mouth (6 points)
	points.push(-1, 6, color[0], color[1], color[2], color[3]); 
	points.push(-0.5, 7, color[0], color[1], color[2], color[3]); 
	points.push(-0.2, 8, color[0], color[1], color[2], color[3]); 
	points.push(-1, 8.6, color[0], color[1], color[2], color[3]); 
	points.push(-2, 7, color[0], color[1], color[2], color[3]); 
	points.push(-1.5, 5.8, color[0], color[1], color[2], color[3]); 
    // end mouth

	// begin nose (5 points)
	points.push(-1.8, 9.2, color[0], color[1], color[2], color[3]); 
	points.push(-1, 9.8, color[0], color[1], color[2], color[3]); 
	points.push(-1.1, 10.6, color[0], color[1], color[2], color[3]); 
	points.push(-1.6, 10.8, color[0], color[1], color[2], color[3]); 
	points.push(-1.9, 10, color[0], color[1], color[2], color[3]); 

    // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
    // outer eye, draw line loop (9 points)
	points.push(-2.9, 10.8, color[0], color[1], color[2], color[3]); 
	points.push(-2.2, 11, color[0], color[1], color[2], color[3]); 
	points.push(-2, 12, color[0], color[1], color[2], color[3]); 
	points.push(-2, 12.8, color[0], color[1], color[2], color[3]); 
	points.push(-2.2, 13, color[0], color[1], color[2], color[3]); 
	points.push(-2.5, 13, color[0], color[1], color[2], color[3]); 
	points.push(-2.9, 12, color[0], color[1], color[2], color[3]); 
	points.push(-3, 11, color[0], color[1], color[2], color[3]); 
	points.push(-2.9, 10.5, color[0], color[1], color[2], color[3]); 

    // eye ball, draw triangle_fan (7 points)
	points.push(-2.5, 11.4, color[0], color[1], color[2], color[3]); // middle point
	points.push(-2.9, 10.8, color[0], color[1], color[2], color[3]); 
	points.push(-2.2, 11, color[0], color[1], color[2], color[3]); 
	points.push(-2, 12, color[0], color[1], color[2], color[3]); 
	points.push(-2.9, 12, color[0], color[1], color[2], color[3]); 
	points.push(-3, 11, color[0], color[1], color[2], color[3]); 
	points.push(-2.9, 10.5, color[0], color[1], color[2], color[3]); 
    // end left eye

    return points;
}