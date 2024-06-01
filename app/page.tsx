"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Canvas
      const canvas = canvasRef.current;

      // Scene
      const scene = new THREE.Scene();

      // Object

      const boxGroup = new THREE.Group();
      scene.add(boxGroup);

      const redBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: "#F87171" })
      );
      redBox.position.set(0, 0, 0);
      boxGroup.add(redBox);

      const blueBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: "#60A5FA" })
      );
      blueBox.position.set(2, 0, 0);
      boxGroup.add(blueBox);

      const greenBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: "#4AE480" })
      );
      greenBox.position.set(-2, 0, 0);
      boxGroup.add(greenBox);

      // Sizes
      const sizes = {
        width: 1000,
        height: 800,
      };

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height
      );
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 10;
      scene.add(camera);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
      });
      renderer.setSize(sizes.width, sizes.height);

      // ループアニメーション
      const animetion = () => {
        requestAnimationFrame(animetion);

        //boxGroupを回転
        boxGroup.rotation.x += 0.02;
        boxGroup.rotation.y += 0.01;

        renderer.render(scene, camera);
      };
      animetion();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[800px] h-[600px] bg-orange-300/65"
    ></canvas>
  );
}
