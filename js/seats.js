import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

export function create_seats (ground, seat_height, seat_depth, seat_dist_x, seat_dist_y, field_width, field_height, num_stripes) {
  create_top_bottom_seats (ground, seat_height, seat_depth, seat_dist_y, field_width, field_height, num_stripes, false);
  create_top_bottom_seats (ground, seat_height, seat_depth, seat_dist_y, field_width, field_height, num_stripes, true);
  create_left_right_seats (ground, seat_height, seat_depth, seat_dist_x, field_width, field_height, num_stripes, false);
  create_left_right_seats (ground, seat_height, seat_depth, seat_dist_x, field_width, field_height, num_stripes, true);
}

function create_top_bottom_seats(ground, seat_height, seat_depth, seat_dist, field_width, field_height, num_stripes, is_bottom) {
  const seats = new THREE.Group();
 
  const seats_length = field_width + seat_dist*2;
  
  // seat material
  const material = new THREE.MeshPhongMaterial({color: 0x202030});
  const stripe_width = field_width/num_stripes;
  
  // seats at the top of the field
  {
    // bottom seats
    {
      const geometry = new THREE.BoxGeometry(seats_length, seat_depth * 3, seat_height);
      const box = new THREE.Mesh(geometry, material);
      
      if (is_bottom) {
        box.position.x += stripe_width/2
      } else {
        box.position.x -= stripe_width/2;  // adjust its horizontal placement
      }
      box.position.z += seat_height/2;   // make it stand above the ground
      seats.add(box);
    }
    // middle seats
    {
      const geometry = new THREE.BoxGeometry(seats_length, seat_depth * 3, seat_height * 2);
      const box = new THREE.Mesh(geometry, material); 
      if (is_bottom) {
        box.position.x += stripe_width/2
      } else {
        box.position.x -= stripe_width/2;   
      }
      box.position.y += seat_depth * 3;
      box.position.z += (seat_height*2)/2;
      seats.add(box);
    }
    // top seats
    {
      const geometry = new THREE.BoxGeometry(seats_length, seat_depth * 3, seat_height * 3);
      const box = new THREE.Mesh(geometry, material); 
      if (is_bottom) {
        box.position.x += stripe_width/2
      } else {
        box.position.x -= stripe_width/2;   
      }
      box.position.y += seat_depth * 6;
      box.position.z += (seat_height*3)/2;
      seats.add(box);
    }
    
    // if drawing the bottom part, rotate it 180 degrees, and place it in a different position
    if (is_bottom) {
      seats.position.y = -field_height/2 - (seat_depth*3)/2 - seat_dist;
      seats.rotation.z = Math.PI;
    } else {
      seats.position.y = field_height/2 + (seat_depth*3)/2 + seat_dist;
    }
    
    ground.add(seats);
  }
}

function create_left_right_seats(ground, seat_height, seat_depth, seat_dist, field_width, field_height, num_stripes, is_right) {
  const seats = new THREE.Group();
    
  const top_bottom_seat_dist = field_height / 8; 
   
  // seat material
  const material = new THREE.MeshPhongMaterial({color: 0x102010});
  
  const seats_length = field_height + top_bottom_seat_dist *2 ;
  
  // width of a stripe in the field, used to subtract from the field's width  
  const stripe_width = field_width/num_stripes;
   
  // bottom seats
  {
    const geometry = new THREE.BoxGeometry(seats_length, seat_depth * 3, seat_height);
    const box = new THREE.Mesh(geometry, material); 
    box.position.x -= stripe_width/2;   
    box.position.z += seat_height/2;   // make it stand above the ground
    seats.add(box);
  }
  // middle seats
  {
    const geometry = new THREE.BoxGeometry(seats_length, seat_depth * 3, seat_height * 2);
    const box = new THREE.Mesh(geometry, material); 
    box.position.x -= stripe_width/2;
    box.position.y += seat_depth * 3;
    box.position.z += (seat_height*2)/2;
    seats.add(box);
  }
  // top seats
  {
    const geometry = new THREE.BoxGeometry(seats_length, seat_depth * 3, seat_height * 3);
    const box = new THREE.Mesh(geometry, material); 
    box.position.x -= stripe_width/2;
    box.position.y += seat_depth * 6;
    box.position.z += (seat_height*3)/2;
    seats.add(box);
  }
    
  // if drawing the bottom part, rotating it by 180 degrees around the upward-pointing axis (Z-axis, because the ground is rotated by 90 degrees)
  // , and place it in a different position
    
  if (is_right) { 
    seats.position.x = field_width/2 - stripe_width - (seat_depth*3)/2 + seat_dist;
    seats.position.y -= top_bottom_seat_dist/2;
    seats.rotation.z = 3*Math.PI/2;
    
  } else {
    seats.position.x = -field_width/2 + (seat_depth*3)/2 - seat_dist;
    seats.position.y += top_bottom_seat_dist/2;
    seats.rotation.z = Math.PI/2;
  }
    
  ground.add(seats);
}