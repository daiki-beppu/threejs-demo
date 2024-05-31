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
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: "#F87171" });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Sizes
      const sizes = {
        width: 800,
        height: 600,
      };

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height
      );
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 2;
      scene.add(camera);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
      });
      renderer.setSize(sizes.width, sizes.height);

      // animetion loop
      const animetion = () => {
        requestAnimationFrame(animetion);

        //Rotete the mesh
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.01;

        renderer.render(scene, camera);
      };
      animetion();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[800px] h-[600px] bg-blue-400"
    ></canvas>
  );
}
