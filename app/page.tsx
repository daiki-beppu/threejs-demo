"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Canvas
      const canvas = canvasRef.current;

      // Scene
      const scene = new THREE.Scene();

      // テクスチャ
      const loadingManager = new THREE.LoadingManager();

      loadingManager.onLoad = () => {
        console.log("ロード中");
      };

      loadingManager.onProgress = () => {
        console.log("ロード完了");
      };

      loadingManager.onError = () => {
        console.log("エラー");
      };

      const textureLoader = new THREE.TextureLoader(loadingManager);

      const sphereTexture = textureLoader.load("/color.jpg");
      sphereTexture.colorSpace = THREE.SRGBColorSpace;

      // オブジェクト

      //  マテリアル
      const material = new THREE.MeshStandardMaterial();
      // material.map = sphereTexture;

      // sphere オブジェクト
      const sphereRadius = 1;
      const sphereWidthSegments = 32;
      const sphereHeightSegments = 32;

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(
          sphereRadius,
          sphereWidthSegments,
          sphereHeightSegments
        ),
        material
      );
      scene.add(sphere);

      // 環境マップ
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load("/envmap.hdr", (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = environmentMap;
        scene.environment = environmentMap;
      });

      // デバッグUI
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
          gsap.to(sphere.rotation, {
            duration: 1,
            y: sphere.rotation.y + Math.PI * 2,
          });
        },
      };

      const boxFolder = gui.addFolder("BOX");

      const visibleFolder = boxFolder.addFolder("BOX表示");

      const wireframeFolder = boxFolder.addFolder("ワイヤーフレーム");

      const animationFolder = boxFolder.addFolder("アニメーション");
      animationFolder.add(debugObject, "spin");

      boxFolder
        .add(debugObject, "scale")
        .min(1)
        .max(3)
        .step(0.001)
        .name("大きさの変更")
        .onChange(() => {
          sphere.scale.set(
            debugObject.scale,
            debugObject.scale,
            debugObject.scale
          );
        });

      const colorFolder = boxFolder.addFolder("BOXカラー");

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

      // カメラ
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
      );
      camera.position.x = 1;
      camera.position.y = 1;
      camera.position.z = 5;
      scene.add(camera);

      // Contorols
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // ループアニメーション
      const animetion = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animetion);
      };
      animetion();
    }
  }, []);

  return <canvas ref={canvasRef} className=""></canvas>;
}
