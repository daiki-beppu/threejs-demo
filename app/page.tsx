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

      // lil-gui
      const gui = new GUI({
        width: 400,
        title: "デバッグUI",
        closeFolders: true,
      });

      // デバッグUIの表示切り替え
      window.addEventListener("keydown", (event) => {
        event.key === "," ? gui.show(gui._hidden) : "";
      });

      const debugObject = {
        scale: 1,
        spin: () => {
          gsap.to(boxGroup.rotation, {
            duration: 1,
            x: boxGroup.rotation.x + Math.PI * 2,
          });
        },
      };

      const boxFolder = gui.addFolder("BOX");

      const visibleFolder = boxFolder.addFolder("BOX表示");
      visibleFolder.add(leftBox, "visible").name("左のBOX");
      visibleFolder.add(centerBox, "visible").name("中央BOX");
      visibleFolder.add(rightBox, "visible").name("右のBOX");

      const wireframeFolder = boxFolder.addFolder("ワイヤーフレーム");
      wireframeFolder.add(leftBox.material, "wireframe").name("左のBOX");
      wireframeFolder.add(centerBox.material, "wireframe").name("中央BOX");
      wireframeFolder.add(rightBox.material, "wireframe").name("右のBOX");

      const animationFolder = boxFolder.addFolder("アニメーション");
      animationFolder.add(debugObject, "spin");

      boxFolder
        .add(debugObject, "scale")
        .min(1)
        .max(3)
        .step(0.001)
        .name("大きさの変更")
        .onChange(() => {
          boxGroup.scale.set(
            debugObject.scale,
            debugObject.scale,
            debugObject.scale
          );
        });

      const colorFolder = boxFolder.addFolder("BOXカラー");
      colorFolder.addColor(leftBox.material, "color").name("左のBOXカラー");
      colorFolder.addColor(centerBox.material, "color").name("中央BOXカラー");
      colorFolder.addColor(rightBox.material, "color").name("右のBOXカラー");

      // Sizes
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const handleResize = () => {
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
      };
      window.addEventListener("resize", handleResize);

      // Fullscreen
      // const handleDbulclick = () => {
      //   !document.fullscreenElement
      //     ? canvas.requestFullscreen()
      //     : document.exitFullscreen();
      // };
      // window.addEventListener("dblclick", handleDbulclick);

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
        // alpha: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setClearColor("#93C5FD");

      // ループアニメーション
      const animetion = () => {
        controls.update();
        camera.lookAt(boxGroup.position);
        renderer.render(scene, camera);
        requestAnimationFrame(animetion);
      };
      animetion();

      return () => {
        gui.destroy();
        window.removeEventListener("resize", handleResize);
        // window.removeEventListener("dblclick", handleDbulclick);
      };
    }
  }, []);

  return <canvas ref={canvasRef} className=""></canvas>;
}
