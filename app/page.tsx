"use client";

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
      const loadingManager = new THREE.LoadingManager();

      const textureLoader = new THREE.TextureLoader(loadingManager);

      const sphereTexture = textureLoader.load("");
      sphereTexture.colorSpace = THREE.SRGBColorSpace;

      // オブジェクト
      // 3D テキスト
      const fontLoader = new FontLoader();
      fontLoader.load("/fonts/gentilis_regular.typeface.json", (font) => {
        const textGeometry = new TextGeometry("welcome !", {
          font: font,
          size: 0.5,
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
        scene.add(text);
      });

      //  マテリアル
      const textMaterial = new THREE.MeshStandardMaterial();
      const sphereMaterial = new THREE.MeshStandardMaterial();
      sphereMaterial.transparent = true;
      sphereMaterial.opacity = 0.6;

      // sphere オブジェクト
      const sphereParamas = {
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
      };

      const sphereGeometry = new THREE.SphereGeometry(
        sphereParamas.radius,
        sphereParamas.widthSegments,
        sphereParamas.heightSegments
      );

      for (let i = 0; i < 150; i += 1) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const randomPosition = {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
          z: (Math.random() - 0.5) * 10,
        };
        sphere.position.x = randomPosition.x;
        sphere.position.y = randomPosition.y;
        sphere.position.z = randomPosition.z;

        const randomRotaiton = {
          x: Math.random() * Math.PI,
          y: Math.random() * Math.PI,
          z: Math.random() * Math.PI,
        };

        sphere.rotation.x = randomRotaiton.x;
        sphere.rotation.y = randomRotaiton.y;

        sphere.scale.set(0.15, 0.15, 0.15);
        scene.add(sphere);
      }

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
        color: 0xebcd8f,
        intensity: 2,
      };

      const directionalLight = new THREE.DirectionalLight(
        directionalLightParams.color,
        directionalLightParams.intensity
      );
      directionalLight.position.set(0, -1, 2);

      const pointLightParams = {
        color: 0xebcd8f,
        intensity: 6,
        distance: 10,
        decay: 2,
      };

      for (let i = 0; i < 10; i += 1) {
        const pointLight = new THREE.PointLight(
          pointLightParams.color,
          pointLightParams.intensity,
          pointLightParams.distance,
          pointLightParams.decay
        );
        const randomPosition = {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
          z: (Math.random() - 0.5) * 10,
        };
        pointLight.position.x = randomPosition.x;
        pointLight.position.y = randomPosition.y;
        pointLight.position.z = randomPosition.z;

        scene.add(pointLight);
      }

      scene.add(ambientLight, directionalLight);

      // ヘルパー
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight,
        0.2
      );

      // scene.add(directionalLightHelper);

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

      camera.position.z = 5;
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
