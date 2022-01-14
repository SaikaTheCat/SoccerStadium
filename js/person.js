import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

// Creates a person, returns the person group
export function create_person(ground, person_width, person_height, head_color, shirt_color, position, rotation = 0) {

  const person = new THREE.Group();

  // materials
  const headMaterial = new THREE.MeshPhongMaterial({ color: head_color }); 
  const shirtMaterial = new THREE.MeshLambertMaterial({ color: shirt_color }); 

  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(person_width / 2, 16, 8), headMaterial);
  head.position.y = person_height - person_width;
  person.add(head);

  // create body and arms with some proportions to the person's size
  const arm_width = person_width/2;

  const body = new THREE.Mesh(new THREE.BoxGeometry(person_width, person_height, person_width), shirtMaterial);
  const l_arm = new THREE.Mesh(new THREE.BoxGeometry(arm_width, person_height/3, person_width/2), shirtMaterial);
  const r_arm = new THREE.Mesh(new THREE.BoxGeometry(arm_width, person_height/3, person_width/2), shirtMaterial);

  l_arm.position.x = -person_width/2 - arm_width/1.75;
  r_arm.position.x = person_width/2 + arm_width/1.75;

  l_arm.position.y = person_height/4;
  r_arm.position.y = person_height/4;

  person.add(body);
  person.add(l_arm);
  person.add(r_arm);

  // translation
  person.position.x = position.x;
  person.position.y = position.y;
  person.position.z = position.z;
  
  // Center the body in the Z-axis
  person.position.z += person_height/2;
  
  // Make it stand on the ground
  person.rotation.x = Math.PI/2;  
  person.rotation.y = rotation;

  ground.add(person);
  
  return person;
}