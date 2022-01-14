import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';

// rotation is around the post's vertical axis
export function create_lightpost(ground, position, rotation) {
  const lightpost = new THREE.Group();
  const lightpost_height = 50;
  const lightpost_width = 1;
  const lamp_size = 9.75;
  const light_intensity = 0.95;

  // Post
  {
    const geometry = new THREE.CylinderGeometry(lightpost_width, lightpost_width, lightpost_height, 8);
    const material = new THREE.MeshPhongMaterial({color: 0x303030, side: THREE.DoubleSide });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(0, 0, lightpost_height / 2);
    cylinder.rotation.x = -Math.PI / 2;
    lightpost.add(cylinder);
  }
  // Lamp
  {
    const geometry = new THREE.ConeGeometry(lamp_size, 8, 4, 4);
    const material = new THREE.MeshPhongMaterial({color: 0x202020, emissive: 0xFFFFFF, side: THREE.DoubleSide });
    const cone = new THREE.Mesh(geometry, material);
    cone.position.set(0, 0, lightpost_height);
    cone.rotation.y = Math.PI / 4;
    cone.rotation.x = Math.PI / 12;
    lightpost.add(cone);
    
    const light = new THREE.SpotLight(0xffffff, light_intensity, 100, Math.PI/3);
    light.position.set(cone.position.x, cone.position.y, cone.position.z);     
    light.distance = 350; 
    lightpost.add(light);
  }
  
  lightpost.rotation.z = rotation;
  lightpost.position.set(position.x, position.y, position.z);
  
  ground.add(lightpost);
}