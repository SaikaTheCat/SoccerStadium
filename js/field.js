import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

// Creates the grass field
// the field is a group of geometry containing the grass and all the markings on the grass
// this group is added to the given 'ground' group
export function create_field(ground, ground_width, ground_height, field_width, field_height, num_stripes) {
  var field = new THREE.Group();
  
  // Two grass textures, one light, one dark
  const grassTex = new THREE.TextureLoader().load('./textures/grass1.jpg');
  grassTex.wrapS = THREE.RepeatWrapping;
  grassTex.wrapT = THREE.RepeatWrapping;  
  grassTex.repeat.set(1, 10);
  
  const grassTex2 = new THREE.TextureLoader().load('./textures/grass2.jpg');
  grassTex2.wrapS = THREE.RepeatWrapping;
  grassTex2.wrapT = THREE.RepeatWrapping; 
  grassTex2.repeat.set(1, 10);
  
  // grass materials
  const material1 = new THREE.MeshPhongMaterial({map: grassTex, side: THREE.DoubleSide});
  const material2 = new THREE.MeshPhongMaterial({map: grassTex2, side: THREE.DoubleSide});
  
  // put the field slightly above the ground, to prevent z-fighting
  const field_z = 0.3;
  // markings slightly above the field
  const markings_z = 0.4;
   
  // The field's width is divided equally in the given number of grass portions. 
  const stripe_width = field_width / num_stripes;
  for (var i = 0; i < num_stripes; i++) { 
    const geometry = new THREE.PlaneGeometry(stripe_width, field_height); 
    const plane = new THREE.Mesh(geometry);
    
    // Start at minus half of the field's width, so that the origin is at the center; 
    plane.position.x = (-field_width / 2) + i * stripe_width;
     
    plane.position.z = field_z; 
    
    // Alternate the materials between even and odd numbers  
    if (i % 2 == 0)
      plane.material = material1;
    else
      plane.material = material2;

     field.add (plane);
  }  
  
  // Create white markings in the field.
  
  // Material used for all markings
  const markingMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
  
  // middle line
  {
    const points = []; 
    points.push(new THREE.Vector3(-stripe_width/2, field_height/2, markings_z));  
    points.push(new THREE.Vector3(-stripe_width/2, -field_height/2, markings_z)); 
    const geometry = new THREE.BufferGeometry().setFromPoints( points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
  }
  
  // top, bottom lines
  {
    const points = []; 
    points.push(new THREE.Vector3(-field_width/2 - stripe_width / 2, field_height/2, markings_z));  
    points.push(new THREE.Vector3(field_width/2 - stripe_width / 2, field_height/2, markings_z));
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    const geometry = new THREE.BufferGeometry().setFromPoints( points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
    }
    {
    const points = []; 
    points.push(new THREE.Vector3(-field_width/2 - stripe_width / 2, -field_height/2, markings_z));  
    points.push(new THREE.Vector3(field_width/2 - stripe_width / 2, -field_height/2, markings_z));
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
  }
  
  // left, right lines
  {
    const points = []; 
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2, field_height/2, markings_z));  
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2, -field_height/2, markings_z));
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
    }
    {
    const points = []; 
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2, field_height/2, markings_z)); 
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2, -field_height/2, markings_z));
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
  }
  
  // circle in the middle of the field, diameter is 1/3 of the field's height,
  // so its radius is one sixth of the field's height
  {
        const curve = new THREE.EllipseCurve(
      	-stripe_width/2,  0,            // ax, aY
      	field_height/6, field_height/6,           // xRadius, yRadius
      	0,  2 * Math.PI,  // aStartAngle, aEndAngle
      	false,            // aClockwise
      	0                 // aRotation
      );
      const points = curve.getPoints(50); 
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const circle = new THREE.Line(geometry, markingMaterial);
      circle.position.z = markings_z;
      field.add(circle);
  }
  
  // left goal lines
  {
    const points = []; 
    // dimensions are: width = one sixth of the field's width, height = one third of the field's height
    // top line
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2, field_height/3, markings_z));  
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2 + field_width / 6, field_height/3, markings_z));
    // front line
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2 + field_width / 6, -field_height/3, markings_z));
    // bottom line
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2, -field_height/3, markings_z));
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
  }
  
  // Left arc
  // x-position: same as the front line from above, y position = origin
  // 180 degrees: from pi/2 to 3*pi/2 in radians, clockwise direction
  // width: 1/12 of the field's width = half of the goal area above
  // height: 1/6 of the field's height = half of the goal area above
  {
      const curve = new THREE.EllipseCurve(
      	-field_width / 2 - stripe_width / 2 + field_width / 6,  0,            // ax, aY
      	field_width/12, field_height/6,           // xRadius, yRadius
      	Math.PI/2,  3*Math.PI/2,                   // aStartAngle, aEndAngle
      	true,                                      // aClockwise
      	0                                          // aRotation
      );
      const points = curve.getPoints(50); 
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const circle = new THREE.Line(geometry, markingMaterial);
      circle.position.z = markings_z;
      field.add(circle);
  }
  
  // right goal lines
  {
    const points = []; 
    // top line
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2, field_height/3, markings_z));  
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2 - field_width / 6, field_height/3, markings_z));
    // front line
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2 - field_width / 6, -field_height/3, markings_z));
    // bottom line
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2, -field_height/3, markings_z));
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
  }
  
  // Right arc
  // same as the left arc, but at the other front line, in counter-clockwise direction
  {
      const curve = new THREE.EllipseCurve(
      	field_width / 2 - stripe_width / 2 - field_width / 6,  0,            // ax, aY
      	field_width/12, field_height/6,           // xRadius, yRadius
      	Math.PI/2,  3*Math.PI/2,                   // aStartAngle, aEndAngle
      	false,                                      // aClockwise
      	0                                          // aRotation
      );
      const points = curve.getPoints(50); 
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const circle = new THREE.Line(geometry, markingMaterial);
      circle.position.z = markings_z;
      field.add(circle);
  }
  
  // Left inner goal lines: same as the outer lines, but smaller: 1/12 of the width, 1/6 of the height
  {
    const points = [];  
    // top line
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2, field_height/6, markings_z));  
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2 + field_width / 12, field_height/6, markings_z));
    // front line
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2 + field_width / 12, -field_height/6, markings_z));
    // bottom line
    points.push(new THREE.Vector3(-field_width / 2 - stripe_width / 2, -field_height/6, markings_z));
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
  }
  // Right inner goal lines
  {
    const points = []; 
    // top line
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2, field_height/6, markings_z));  
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2 - field_width / 12, field_height/6, markings_z));
    // front line
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2 - field_width / 12, -field_height/6, markings_z));
    // bottom line
    points.push(new THREE.Vector3(field_width / 2 - stripe_width / 2, -field_height/6, markings_z));
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, markingMaterial);
    field.add(line);
  }
  
  
  // Add all the field geometry to the ground
  ground.add(field);
}