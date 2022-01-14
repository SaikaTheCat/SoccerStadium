import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

// Which goal to create: left or right?
const Goals = { LEFT : 1, RIGHT: -1 }

// Creates both goals
export function create_goals(ground, ground_width, ground_height, field_width, field_height, num_stripes) {
  create_goal(ground, ground_width, ground_height, field_width, field_height, num_stripes, Goals.LEFT);
  create_goal(ground, ground_width, ground_height, field_width, field_height, num_stripes, Goals.RIGHT);
}

// Creates the goal mesh which is added to the given 'ground' group 
export function create_goal(ground, ground_width, ground_height, field_width, field_height, num_stripes, goal) {

  const stripe_width = field_width / num_stripes;
  const goal_post_thickness = 0.5;
 
  const goal_width = field_height / 3   - goal_post_thickness*2;
  const goal_height = field_height / 12; 
 
  // material for all goal posts
  const material = new THREE.MeshBasicMaterial({color: 0xffffff});
  
  // When drawing the right goal, we use the 'multiplier' variable's value to, instead of subract, 
  // add variables' values when positioning the goal's posts and net.
  var multiplier = (goal == Goals.LEFT) ? 1 : -1;
  
  const goal_x = (multiplier * field_width)/2 - stripe_width / 2;
  // left post
  {
    const goal_y = -field_height/6; 
    const geometry = new THREE.CylinderGeometry(goal_post_thickness, goal_post_thickness, goal_height, 8 );
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(goal_x, goal_y, goal_height/2);
    cylinder.rotation.x = -Math.PI/2;
    ground.add(cylinder);
  }
  // right post
  {
    const goal_y = field_height/6; 
    const geometry = new THREE.CylinderGeometry(goal_post_thickness, goal_post_thickness, goal_height, 8 );
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(goal_x, goal_y, goal_height/2);
    cylinder.rotation.x = -Math.PI/2;
    ground.add(cylinder);
  }
  // top post
  {
    const goal_y = 0; 
    const geometry = new THREE.CylinderGeometry(goal_post_thickness, goal_post_thickness, goal_width, 8 );
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(goal_x, goal_y, goal_height);
    ground.add(cylinder);
  }
  const goal_depth = field_width / 16;
    
  // Goal net
  // Textures and material used left and right parts
  const netDiff = new THREE.TextureLoader().load('./textures/net_map.png');
  const netAlpha = new THREE.TextureLoader().load('./textures/net_alpha.png');
  netDiff.wrapS = netDiff.wrapT = THREE.RepeatWrapping; 
  netAlpha.wrapS = netAlpha.wrapT = THREE.RepeatWrapping; 
  netDiff.repeat.set (1, 1);
  netAlpha.repeat.set (1, 1);
        
  // left net 
  {
    const goal_y = -field_height/6; 
    const geometry = new THREE.PlaneGeometry(goal_depth, goal_height); 
    const plane = new THREE.Mesh(geometry);
    plane.material = new THREE.MeshStandardMaterial({map: netDiff, alphaMap: netAlpha, side: THREE.DoubleSide, alphaTest: 0.1});
   
  
    plane.position.set (goal_x + (multiplier * goal_depth)/2, goal_y, goal_height/2);
    plane.rotation.x = Math.PI/2;
    ground.add(plane);
  }
  // right net
  {
    const goal_y = field_height/6; 
    const geometry = new THREE.PlaneGeometry(goal_depth, goal_height); 
    const plane = new THREE.Mesh(geometry);
    plane.material = new THREE.MeshStandardMaterial({map: netDiff, alphaMap: netAlpha, side: THREE.DoubleSide, alphaTest: 0.1});
  
    plane.position.set (goal_x + (multiplier * goal_depth)/2, goal_y, goal_height/2);
    plane.rotation.x = Math.PI/2;
    ground.add(plane);
  }
    
  // top and back nets: their textures differ in that they repeat more times 
  {
    const netDiff = new THREE.TextureLoader().load('./textures/net_map.png');
    const netAlpha = new THREE.TextureLoader().load('./textures/net_alpha.png');
    netDiff.wrapS = netDiff.wrapT = THREE.RepeatWrapping; 
    netAlpha.wrapS = netAlpha.wrapT = THREE.RepeatWrapping; 
    netDiff.repeat.set (4, 1);
    netAlpha.repeat.set (4, 1);
    
    // top net
    {
      const goal_y = 0; 
      const geometry = new THREE.PlaneGeometry(goal_width, goal_depth); 
      const plane = new THREE.Mesh(geometry);
      plane.material = new THREE.MeshStandardMaterial({map: netDiff, alphaMap: netAlpha, side: THREE.DoubleSide, alphaTest: 0.1});
  
      plane.position.set (goal_x + (multiplier * goal_depth)/2, goal_y, goal_height);
      plane.rotation.z = Math.PI/2;
      ground.add(plane);
    }
    // back net
    {
      const goal_y = 0; 
      const geometry = new THREE.PlaneGeometry(goal_width, goal_height); 
      const plane = new THREE.Mesh(geometry);
      plane.material = new THREE.MeshStandardMaterial({map: netDiff, alphaMap: netAlpha, side: THREE.DoubleSide, alphaTest: 0.1});
  
      plane.position.set (goal_x + (multiplier * goal_depth), goal_y, goal_height/2);
      plane.rotation.z = 3*Math.PI/2;
      plane.rotation.y = Math.PI/2;
      ground.add(plane);
    }
  }
}