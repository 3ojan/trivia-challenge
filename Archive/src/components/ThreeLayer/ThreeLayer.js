import React, { useEffect, useState, useRef } from 'react';
import * as THREE from "three";
import * as OrbitControls from "three-orbitcontrols"

const fragmentShader = `

// yes i know webgl :)  
			uniform vec3 color;
			uniform float opacity;
			varying vec3 vColor;
      uniform float iTime;

			void main() {
				gl_FragColor = vec4( vColor * color , opacity );
			}
  `;

const vertexShader = `      
      uniform float amplitude;

			attribute vec3 displacement;
			attribute vec3 customColor;

			varying vec3 vColor;

			void main() {
				vec3 newPosition = position + amplitude * displacement;
				vColor = customColor;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

			}`;


function useDidUpdate(callback, deps) {
  const hasMount = useRef(false)
  useEffect(() => {
    if (hasMount.current) {
      callback()
    } else {
      hasMount.current = true
    }
  }, deps)
}

function ThreeLayer(props) {

  let mount = null;

  const didMountRef = useRef(false);
  const canvas = useRef(null);

  useDidUpdate(() => {
  });

  useEffect(() => {
    if (!didMountRef.current) {

      var w = 1400
      var h = 1400
      var y = 200;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(15, w / h, 12, 3000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const clock = new THREE.Clock();
      const title = "TRIVIA-CHALLENGE";
      const letters = title.split('');
      const meshes = [];


      camera.position.x = -5620;
      camera.position.x = -930;
      camera.position.z = -2090;

      camera.lookAt(new THREE.Vector3(0, 0, 0))
      renderer.setClearColor("#000000");
      renderer.setSize(w, h);

      canvas.current = renderer.domElement;
      mount.appendChild(canvas.current);
      didMountRef.current = true;

      let line;

      let uniforms = {

        amplitude: { value: 5.0 },
        opacity: { value: 0.1 },
        color: { value: new THREE.Color(0xffffff) },
        iTime: { type: 'f', value: 0. }

      };

      let shaderMaterial = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true

      });

      let material = new THREE.MeshPhongMaterial({ color: 0x123456, flatShading: true });

      const group = new THREE.Group();
      scene.add(group);

      const loader = new THREE.FontLoader();

      loader.load('font.json', function (font) {

        let geometry = new THREE.TextBufferGeometry(title, {

          font: font,

          size: 100,
          height: .1,
          curveSegments: 10,

          bevelThickness: 5,
          bevelSize: 1.5,
          bevelEnabled: true,
          bevelSegments: 10,

        });

        geometry.center();
        var count = geometry.attributes.position.count;
        var displacement = new THREE.Float32BufferAttribute(count * 3, 3);
        geometry.setAttribute('displacement', displacement);

        var customColor = new THREE.Float32BufferAttribute(count * 3, 3);
        geometry.setAttribute('customColor', customColor);

        var color = new THREE.Color(0xffffff);
        for (var i = 0, l = customColor.count; i < l; i++) {
          color.setHSL(i / l, 0.5, 0.5);
          color.toArray(customColor.array, i * customColor.itemSize);
        }

        line = new THREE.Line(geometry, shaderMaterial);
        line.rotation.x = 0.2;
        group.add(line);

        //cubes
        letters.map((item, index) => {
          const size = index * 40;

          const segments = 5;
          let boxGeometry = new THREE.BoxBufferGeometry(size, size, size, segments, segments, segments);
          material = new THREE.PointsMaterial({ color: Math.round(Math.random() * 0xffffff), size: 10 });
          var points = new THREE.Points(boxGeometry, material);
          points.position.set(Math.random() * 1000 - 500, Math.random() * 200 - 100, Math.random() * 30 - 30);
          meshes.push(points)
          group.add(points);

        })
      });

      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }
      function render(time) {
        const fps = 1 / 60;
        time += fps;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        if (group && line) {
          camera.lookAt(new THREE.Vector3(0, 0, 0))
          let time = Date.now() * 0.0005;
          let delta = clock.getDelta();

          // group.position.x = -300 - dirLight.position.x * 5;
          meshes.forEach((box, index) => {

          });

          time = Date.now() * 0.001;

          group.rotation.y = 0.25 * time;
          line.rotation.y = 0.25 * time / 3;

          uniforms.amplitude.value = Math.sin(0.5 * time);
          uniforms.color.value.offsetHSL(0.0005, 0, 0);
          uniforms.iTime.value += fps;
          let attributes = line.geometry.attributes;
          let array = attributes.displacement.array;

          for (var i = 0, l = array.length; i < l; i += 3) {

            array[i] += 0.3 * (0.5 - Math.random());
            array[i + 1] += 0.3 * (0.5 - Math.random());
            array[i + 2] += 0.3 * (0.5 - Math.random());

          }

          attributes.displacement.needsUpdate = true;

          if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
          }
        }
      };


      scene.background = new THREE.Color('#000')

      requestAnimationFrame(render);
    }
  }, []);

  return (
    <div ref={ref => (mount = ref)} className="three-canvas" />
  );

}

const mapStateToProps = state => {
  const { uniforms } = state;
  return { uniforms: uniforms };
};

export default ThreeLayer;