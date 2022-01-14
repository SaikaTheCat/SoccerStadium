import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { create_field } from './field.js';
import { create_goals } from './goal.js';
import { create_lightpost } from './lightpost.js';
import { create_seats } from './seats.js';
import { create_person } from './person.js';


// ---- Scene, canvas, renderer, camera and ambient light initialization
const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("midnightblue"); 

camera.position.y = 100;
camera.position.z = 200;
camera.lookAt(scene.position);
 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.24);
scene.add(ambientLight);

// Ground/field dimensions
const ground_width = 3000;
const ground_height = 2000;
const field_width = 200;
const field_height = 150;

// Number of grass stripes in the field
const num_stripes = 12;

// Ground is a group that contains all other stuff in the scene
var ground = new THREE.Group();

// Create the ground plane
function create_ground() {
  const geometry = new THREE.PlaneGeometry(ground_width, ground_height);   
  const material = new THREE.MeshPhongMaterial({ color: 0x202020 , side: THREE.DoubleSide});
  const plane = new THREE.Mesh(geometry, material);
  ground.add(plane);
  
  // Rotate the ground -90 degrees around the X-axis, so that the positive Y-axis points upward
  ground.rotation.x = - Math.PI / 2;
  
  // Add the ground to the scene
  scene.add(ground);
}

// Keyboard input
document.onkeydown = function(event){
  var key = event.code;
  switch(key) {
      // pressing F the crowd will make a wave
      case "KeyF":
        making_wave = true;
      break;
      // Move the camera farther away or closer to the scene's center, or rotates it around the scene's center
      // using the arrow keys and Numpad + and -, or using the keys W, A, S, D and Q, E. 
      case "KeyA":
      case "ArrowLeft":
        camera.position.x -= 3;
        camera.lookAt(0,0,0);
      break;
      case "KeyD":
      case "ArrowRight":
        camera.position.x += 3;
        camera.lookAt(0,0,0);
      break;
      case "KeyW":
      case "ArrowUp":
        camera.position.y += 3;
        camera.lookAt(0,0,0);
      break;
      case "KeyS":
      case "ArrowDown":
        camera.position.y -= 3;
        camera.lookAt(0,0,0);
      break;
      case "KeyQ":
      case "NumpadAdd":
        camera.position.z -= 3;
        camera.lookAt(0,0,0);
      break;
      case "KeyE":
      case "NumpadSubtract":
        camera.position.z += 3;
        camera.lookAt(0,0,0);
      break;
      default:
      break;      
  }
}

// Draw the scene

// ---- Ground
create_ground();

// ---- Field
create_field (ground, ground_width, ground_height, field_width, field_height, num_stripes);

// ---- Goals
create_goals (ground, ground_width, ground_height, field_width, field_height, num_stripes); 

// ---- Seats

// Distances between seats and the field, vertically and horizontally; sizes of the seats.
const seat_dist_x = field_width / 4;
const seat_dist_y = field_height / 8; 
const seat_depth = 4;
const seat_height = 6;
create_seats (ground, seat_height, seat_depth, seat_dist_x, seat_dist_y, field_width, field_height, num_stripes);

// ---- Light posts

// Some field proportions to adjust the placement of light posts
const dist_x = field_width/4;
const dist_y = field_height/6;
const stripe_width = field_width/12;

// Top light post - rotation: 0 degrees (facing towards us)
create_lightpost (ground, new THREE.Vector3(0, field_height/2 + seat_dist_x + 3*seat_depth, 0 ),  0);  
// Bottom light post - rotation: 180 degrees
create_lightpost (ground, new THREE.Vector3(0, -field_height/2 - seat_dist_x - 3*seat_depth, 0 ), Math.PI);  
    
// Top-left light post - rotation: 45 degrees
create_lightpost (ground, new THREE.Vector3(-field_width/2 - dist_x - stripe_width/2, field_height/2 + dist_y, 0), Math.PI/4); 
// Top-right light post - rotation: -45 degrees
create_lightpost (ground, new THREE.Vector3(field_width/2 + dist_x, field_height/2+ dist_y, 0 ), -Math.PI/4); 
// Bottom-right light post - rotation: -135 degrees
create_lightpost (ground, new THREE.Vector3(field_width/2 + dist_x, -field_height/2- dist_y, 0 ), -Math.PI + Math.PI/4);  
// Bottom-left light post - rotation: 135 degrees
create_lightpost (ground, new THREE.Vector3(-field_width/2 - dist_x - stripe_width/2, -field_height/2- dist_y, 0 ), Math.PI - Math.PI/4 ) 
  
// ---- People

// Rows of people in each part of the seats, used in the wave animation
var people_row_1 = []
var people_row_2 = []
var people_row_3 = []

const person_height = 8;
const person_width = 3;  

// returns a random color, between 0x000000 and 0xFFFFFF, with 16 million possibilities
function random_color() {
  return Math.floor(Math.random()*16777215);
}

// -- seats
{ 
  // top seats
  {
    const num_people = 10; // number of people in this set of seats
    const x = -field_width/2; // initial X position, first person in the row
    const dist = (7*person_width); // spacing between people
    var y = field_height/2 + (seat_depth*3)/2 + seat_dist_y; // initial Y position, starting by the bottom row
  
    // We loop backwards to add the people to the row array in the right order, in both the top and left seats
    // People in the lower seats 
    for (var i = num_people - 1; i >= 0; i--) {
      const person = create_person(ground, person_width, person_height, 0xE2C597, random_color(), new THREE.Vector3(x + i * dist, y, seat_height));
      people_row_1.push(person);
    }
 
    // People in the middle seats 
    // Y position is pushed a little forward, based on the seat's depth
    y += seat_depth*2; 
    for (var i = num_people - 1; i >= 0; i--) {
      const person = create_person(ground, person_width, person_height, 0xF7E9A7, random_color(), new THREE.Vector3(x + i * dist, y, seat_height*2));
      people_row_2.push(person);
    }
  
    // People in the upper seats 
    y += seat_depth*2; 
    for (var i = num_people - 1; i >= 0; i--) {
      const person = create_person(ground, person_width, person_height, 0xF7E9A7, random_color(), new THREE.Vector3(x + i * dist, y, seat_height*3));
      people_row_3.push(person);
    }
  }
  
  // left seats
  {
    const num_people = 9;
    const y = -field_width/2;
    const dist = (7*person_width);
  
    var x = -field_width/2 + (seat_depth*3)/2 - seat_dist_x;
  
    // People in the lower seats 
    for (var i = num_people - 1; i > 0; i--) {
      const person = create_person(ground, person_width, person_height, 0xF7E9A7, random_color(), new THREE.Vector3(x, y + i * dist, seat_height), Math.PI/2);
      people_row_1.push(person);
    }
    x -= seat_depth*2;
    // People in the middle seats 
    for (var i = num_people - 1; i > 0; i--) {
      const person = create_person(ground, person_width, person_height, 0xE2C597, random_color(), new THREE.Vector3(x, y + i * dist, seat_height*2), Math.PI/2);
      people_row_2.push(person);
    }
    x -= seat_depth*2;
    // People in the upper seats 
    for (var i = num_people - 1; i > 0; i--) {
      const person = create_person(ground, person_width, person_height, 0xE2C597, random_color(), new THREE.Vector3(x, y + i * dist, seat_height*3), Math.PI/2);
      people_row_3.push(person);
    }
  }
  
  // bottom seats
  {
    const num_people = 10;
    const x = -field_width/2;
    const dist = (7*person_width);
    var y = -field_height/2 - (seat_depth*3)/2 - seat_dist_y;
  
    // People in the lower seats 
    for (var i = 0; i < num_people; i++) {
      const person = create_person(ground, person_width, person_height, 0xF7E9A7, random_color(), new THREE.Vector3(x + i * dist, y, seat_height));
      people_row_1.push(person);
    }
    // People in the middle seats
    y -= seat_depth*2;
    for (var i = 0; i < num_people; i++) {
      const person = create_person(ground, person_width, person_height, 0xCC9933, random_color(), new THREE.Vector3(x + i * dist, y, seat_height*2));
      people_row_2.push(person);
    }
    // People in the upper seats
    y -= seat_depth*2;
    for (var i = 0; i < num_people; i++) {
      const person = create_person(ground, person_width, person_height, 0xF7E9A7, random_color(), new THREE.Vector3(x + i * dist, y, seat_height*3));
      people_row_3.push(person);
    }
  }  
  
  // right seats
  {
    const num_people = 9;
    const y = -field_width/2;
    const dist = (7*person_width);
  
    var x = field_width/2 - stripe_width - (seat_depth*3)/2 + seat_dist_x;
  
    // People in the lower seats 
    for (var i = 1; i < num_people; i++) {
      const person = create_person(ground, person_width, person_height, 0xE2C597, random_color(), new THREE.Vector3(x, y + i * dist, seat_height), Math.PI/2);
      people_row_1.push(person);
    }
    x += seat_depth*2;
    // People in the middle seats 
    for (var i = 1; i < num_people; i++) {
      const person = create_person(ground, person_width, person_height, 0xE2C597, random_color(), new THREE.Vector3(x, y + i * dist, seat_height*2), Math.PI/2);
      people_row_2.push(person);
    }
    x += seat_depth*2;
    // People in the upper seats 
    for (var i = 1; i < num_people; i++) {
      const person = create_person(ground, person_width, person_height, 0xE2C597, random_color(), new THREE.Vector3(x, y + i * dist, seat_height*3), Math.PI/2);
      people_row_3.push(person);
    }
  }  
}

// ---- Animation  

var current_col = 0;
var clock = new THREE.Clock();
var delta = 0;  
var making_wave = false;

function animate() {
  // 30 frames per second
  setTimeout(function() {
    requestAnimationFrame(animate);
    delta += clock.getDelta();
  }, 1000 / 30);
 
 if (making_wave) {
   if (delta > 0.035) {
 
      // number of 'columns' of people: 10 at the top, 10 at the bottom, 9 in the left seats, 9 in the right seats
    	if (current_col < 38) {
	    
  	    // current person stands
        if (people_row_1[current_col] !== undefined) {
      		people_row_1[current_col].position.z += 7;
      		people_row_2[current_col].position.z += 7;
      		people_row_3[current_col].position.z += 7;
      	}
   
        // previous person lowering
        if (people_row_1[current_col-1] !== undefined) {
      		people_row_1[current_col-1].position.z -= 3;
      		people_row_2[current_col-1].position.z -= 3;
      		people_row_3[current_col-1].position.z -= 3;
        }
      
        // the one before the last one returns to his place in the seat
        if (people_row_1[current_col-2] !== undefined) {
      		people_row_1[current_col-2].position.z = seat_height + person_height/2;
      		people_row_2[current_col-2].position.z = seat_height*2 + person_height/2;
      		people_row_3[current_col-2].position.z = seat_height*3 + person_height/2;
        }
    
      	current_col++; 
    	} else {
    	  // reached the end of the wave, reset the flag and column index
    	  making_wave = false;
    	  current_col = 0;
    	}
  	
    	// reset time counter
    	delta = 0;
  	}	 
	}
	
	// Draw the scene
	renderer.render (scene, camera);
}
  
animate(); 

// Draw the basis lines
/*
{
  const points = []; 
  points.push(new THREE.Vector3(1000, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  const material = new THREE.LineBasicMaterial({ color: 0xFF0000, linewidth: 0.1 });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}
{
  const points = []; 
  points.push(new THREE.Vector3(0, 1000, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  const material = new THREE.LineBasicMaterial({ color: 0x00FF00, linewidth: 0.1 });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}
{
  const points = []; 
  points.push(new THREE.Vector3(0, 0, 1000));
  points.push(new THREE.Vector3(0, 0, 0));
  const material = new THREE.LineBasicMaterial({ color: 0x0000FF, linewidth: 0.1 });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
} 
*/