"use client";

import gsap from "gsap";
import GUI from "lil-gui";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Canvas
      const canvas = canvasRef.current;

      // Scene
      const scene = new THREE.Scene();

      // テクスチャ

      //  マテリアル
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xebcd8f });
      const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xfffffe });

      // オブジェクト
      // 3D テキスト
      const fontLoader = new FontLoader();
      fontLoader.load("/fonts/gentilis_regular.typeface.json", (font) => {
        const textGeometry = new TextGeometry("welcome !", {
          font: font,
          size: 1,
          depth: 0.2,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 4,
        });

        const text = new THREE.Mesh(textGeometry, textMaterial);
        textGeometry.center();
        text.castShadow = true;
        scene.add(text);
      });

      const planeParams = {
        width: 10,
        height: 10,
      };

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(planeParams.width, planeParams.height),
        planeMaterial
      );

      plane.position.set(0, 0, -1);
      plane.receiveShadow = true;
      scene.add(plane);

      // ライト
      const ambientLightParams = {
        color: 0xffffff,
        intensity: 1,
      };

      const ambientLight = new THREE.AmbientLight(
        ambientLightParams.color,
        ambientLightParams.intensity
      );

      const directionalLightParams = {
        color: 0xffffff,
        intensity: 2,
      };

      const directionalLight = new THREE.DirectionalLight(
        directionalLightParams.color,
        directionalLightParams.intensity
      );
      directionalLight.position.set(0, -1, 2);
      directionalLight.castShadow = true;

      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;

      // 影の生成範囲を制御
      directionalLight.shadow.camera.top = 2;
      directionalLight.shadow.camera.right = 3;
      directionalLight.shadow.camera.bottom = -2;
      directionalLight.shadow.camera.left = -3;
      directionalLight.shadow.camera.near = 0.7;
      directionalLight.shadow.camera.far = 4;

      scene.add(ambientLight, directionalLight);

      // ライトヘルパー
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight,
        0.2
      );
      directionalLightHelper.visible = false;
      scene.add(directionalLightHelper);

      // カメラヘルパー
      const directionalLighCameratHelper = new THREE.CameraHelper(
        directionalLight.shadow.camera
      );
      directionalLighCameratHelper.visible = false;
      scene.add(directionalLighCameratHelper);

      // デバッグUI
      const gui = new GUI({
        width: 400,
        title: "デバッグUI",
        closeFolders: true,
      });
      gui.hide();

      // directionalLight
      const directionalLightDebugUI = gui.addFolder("directionalLight");

      const helperFolder = directionalLightDebugUI.addFolder("ヘルパー");
      helperFolder
        .add(directionalLighCameratHelper, "visible")
        .name("カメラヘルパー");
      helperFolder
        .add(directionalLightHelper, "visible")
        .name("ライトヘルパー");

      // デバッグUIの表示切り替え
      window.addEventListener("keydown", (event) => {
        event.key === "," ? gui.show(gui._hidden) : "";
      });

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

      camera.position.z = 7;
      scene.add(camera);

      // Contorols
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        // alpha: true,
        antialias: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setClearColor("#7DD3FC");
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 影を有効にする
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

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
