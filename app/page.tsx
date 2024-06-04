"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

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

      const centerBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: "#F87171" })
      );
      centerBox.position.set(0, 0, 0);
      boxGroup.add(centerBox);

      const rightBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: "#60A5FA" })
      );
      rightBox.position.set(2, 0, 0);
      boxGroup.add(rightBox);

      const leftBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: "#4AE480" })
      );
      leftBox.position.set(-2, 0, 0);
      boxGroup.add(leftBox);

      // Sizes
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      window.addEventListener("resize", () => {
        // サイズの更新
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        ``;
        // カメラの更新
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // レンダラーの更新
        renderer.setSize(sizes.width, sizes.height);

        // ピクセル比を指定
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      // Fullscreen
      window.addEventListener("dblclick", async () => {
        !document.fullscreenElement
          ? await canvas.requestFullscreen()
          : await document.exitFullscreen();
      });

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height
      );
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 5;
      scene.add(camera);

      // Contorols
      const controls = new OrbitControls(camera, canvas);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setClearColor("#93C5FD");

      // gsap
      const tl = gsap.timeline();
      tl.to(boxGroup.position, { x: 1 })
        .to(boxGroup.rotation, { x: Math.PI })
        .to(boxGroup.position, { y: -2 })
        .to(boxGroup.rotation, { y: Math.PI, x: Math.PI })
        .to(boxGroup.position, { x: -1.5 })
        .to(boxGroup.rotation, { x: -Math.PI })
        .to(boxGroup.position, { y: 2 })
        .to(boxGroup.rotation, { y: -Math.PI, x: -Math.PI })
        .to(boxGroup.position, { x: 1.5 })
        .to(boxGroup.rotation, { x: Math.PI })
        .to(boxGroup.position, { y: -0.5 })
        .to(boxGroup.rotation, { y: Math.PI, x: -Math.PI })
        .to(boxGroup.position, { x: -0.25 })
        .delay(1)
        .repeat(-1);

      // ループアニメーション
      const animetion = () => {
        controls.update();
        camera.lookAt(boxGroup.position);
        renderer.render(scene, camera);
        requestAnimationFrame(animetion);
      };
      animetion();
    }
  }, []);

  return <canvas ref={canvasRef} className=""></canvas>;
}
