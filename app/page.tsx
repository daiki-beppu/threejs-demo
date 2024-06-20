"use client";

import GUI from "lil-gui";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiRef = useRef<GUI | null>(null);
  useEffect(() => {
    if (canvasRef.current && !guiRef.current) {
      // Canvas
      const canvas = canvasRef.current;

      // Scene
      const scene = new THREE.Scene();

      // デバッグUI
      const gui = new GUI({
        width: 300,
        title: "デバッグUI",
        // closeFolders: true,
      });
      // gui.hide();
      guiRef.current = gui;

      // ギターグループ
      const guiterGroup = new THREE.Group();
      guiterGroup.position.x = -3.5;

      guiterGroup.rotation.z = -Math.PI / 3;
      guiterGroup.rotation.x = -Math.PI / 9;
      scene.add(guiterGroup);

      // ギターのボディ
      // オブジェクト
      const bodyParams = {
        width: 4.2,
        height: 5.5,
        depth: 0.28,
      };

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(
          bodyParams.width,
          bodyParams.height,
          bodyParams.depth
        ),
        new THREE.MeshStandardMaterial({ color: "#D7A625" })
      );

      guiterGroup.add(body);

      const bodyFolder = gui.addFolder("ボディ");
      bodyFolder.add(body.scale, "x").min(0.1).max(10).step(0.01).name("幅");
      bodyFolder.add(body.scale, "y").min(0.1).max(10).step(0.01).name("高さ");
      bodyFolder
        .add(body.scale, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("奥行き");
      bodyFolder
        .add(body.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      bodyFolder
        .add(body.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      bodyFolder
        .add(body.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      bodyFolder.close();

      // ギターのネック
      const neckParams = {
        width: 0.8,
        height: 6.2,
        depth: 0.15,
      };

      const neck = new THREE.Mesh(
        new THREE.BoxGeometry(
          neckParams.width,
          neckParams.height,
          neckParams.depth
        ),
        new THREE.MeshStandardMaterial({ color: "#734e30" })
      );

      neck.position.y = bodyParams.height - 0.5;
      neck.position.z = bodyParams.depth / 2;

      guiterGroup.add(neck);

      const neckFolder = gui.addFolder("ネック");
      neckFolder.add(neck.scale, "x").min(0.1).max(10).step(0.01).name("幅");
      neckFolder.add(neck.scale, "y").min(0.1).max(10).step(0.01).name("高さ");
      neckFolder
        .add(neck.scale, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("奥行き");
      neckFolder
        .add(neck.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      neckFolder
        .add(neck.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      neckFolder
        .add(neck.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      neckFolder.close();

      // ヘッド

      const headParams = {
        width: 1.3,
        height: 1.5,
        depth: 0.28,
      };

      const head = new THREE.Mesh(
        new THREE.BoxGeometry(
          headParams.width,
          headParams.height,
          headParams.depth
        ),
        new THREE.MeshStandardMaterial({ color: "black" })
      );

      head.position.y = bodyParams.width + neckParams.height / 2 + 0.1;
      head.position.z = bodyParams.depth / 2;

      guiterGroup.add(head);

      const headFolder = gui.addFolder("ヘッド");
      headFolder.add(head.scale, "x").min(0.1).max(10).step(0.01).name("幅");
      headFolder.add(head.scale, "y").min(0.1).max(10).step(0.01).name("高さ");
      headFolder
        .add(head.scale, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("奥行き");
      headFolder
        .add(head.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      headFolder
        .add(head.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      headFolder
        .add(head.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      headFolder.close();

      // ペグ

      const pegGroup = new THREE.Group();

      const pegParams = {
        radius: 0.1,
        segments: 16,
      };

      const pegsGeometry = new THREE.CircleGeometry(
        pegParams.radius,
        pegParams.segments
      );
      const pegsMaterial = new THREE.MeshStandardMaterial({ color: "silver" });

      // 1弦のペグ
      const peg1stString = new THREE.Mesh(pegsGeometry, pegsMaterial);

      peg1stString.position.x = headParams.width / 5;
      peg1stString.position.y =
        (bodyParams.height + neckParams.height + headParams.height) / 2 + 0.4;
      peg1stString.position.z = headParams.depth + 0.01;
      pegGroup.add(peg1stString);

      const pegFolder = gui.addFolder("ペグ");

      pegFolder.close();

      const peg1stStringFolder = pegFolder.addFolder("1弦ペグ");
      peg1stStringFolder
        .add(pegParams, "radius")
        .min(0.01)
        .max(10)
        .step(0.01)
        .name("半径")
        .onChange((value: number) => {
          peg1stString.geometry.dispose();
          peg1stString.geometry = new THREE.CircleGeometry(
            value,
            pegParams.segments
          );
        });

      peg1stStringFolder
        .add(peg1stString.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      peg1stStringFolder
        .add(peg1stString.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      peg1stStringFolder
        .add(peg1stString.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      // 2弦のペグ

      const peg2ndString = new THREE.Mesh(pegsGeometry, pegsMaterial);

      peg2ndString.position.x = headParams.width / 5;
      peg2ndString.position.y =
        (bodyParams.height + neckParams.height + headParams.height) / 2 + 0.8;
      peg2ndString.position.z = headParams.depth + 0.01;

      pegGroup.add(peg2ndString);

      const peg2ndStringFolder = pegFolder.addFolder("2弦ペグ");
      peg2ndStringFolder
        .add(pegParams, "radius")
        .min(0.01)
        .max(10)
        .step(0.01)
        .name("半径")
        .onChange((value: number) => {
          peg2ndString.geometry.dispose();
          peg2ndString.geometry = new THREE.CircleGeometry(
            value,
            pegParams.segments
          );
        });

      peg2ndStringFolder
        .add(peg2ndString.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      peg2ndStringFolder
        .add(peg2ndString.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      peg2ndStringFolder
        .add(peg2ndString.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      // 3弦のペグ
      const peg3rdString = new THREE.Mesh(pegsGeometry, pegsMaterial);

      peg3rdString.position.x = headParams.width / 5;
      peg3rdString.position.y =
        (bodyParams.height + neckParams.height + headParams.height) / 2 + 1.2;
      peg3rdString.position.z = headParams.depth + 0.01;

      pegGroup.add(peg3rdString);

      const peg3rdStringFolder = pegFolder.addFolder("3弦ペグ");
      peg3rdStringFolder
        .add(pegParams, "radius")
        .min(0.01)
        .max(10)
        .step(0.01)
        .name("半径")
        .onChange((value: number) => {
          peg3rdString.geometry.dispose();
          peg3rdString.geometry = new THREE.CircleGeometry(
            value,
            pegParams.segments
          );
        });

      peg3rdStringFolder
        .add(peg3rdString.position, "x")
        .min(0.1)
        .max(6)
        .step(0.01)
        .name("x軸 移動");
      peg3rdStringFolder
        .add(peg3rdString.position, "y")
        .min(0.1)
        .max(6)
        .step(0.01)
        .name("y軸 移動");
      peg3rdStringFolder
        .add(peg3rdString.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      // 4弦のペグ
      const peg4thString = new THREE.Mesh(pegsGeometry, pegsMaterial);

      peg4thString.position.x = -headParams.width / 5;
      peg4thString.position.y =
        (bodyParams.height + neckParams.height + headParams.height) / 2 + 0.4;
      peg4thString.position.z = headParams.depth + 0.01;

      pegGroup.add(peg4thString);

      const peg4thStringFolder = pegFolder.addFolder("4弦ペグ");
      peg4thStringFolder
        .add(pegParams, "radius")
        .min(0.01)
        .max(10)
        .step(0.01)
        .name("半径")
        .onChange((value: number) => {
          peg4thString.geometry.dispose();
          peg4thString.geometry = new THREE.CircleGeometry(
            value,
            pegParams.segments
          );
        });

      peg4thStringFolder
        .add(peg4thString.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      peg4thStringFolder
        .add(peg4thString.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      peg4thStringFolder
        .add(peg4thString.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      // 5弦のペグ

      const peg5thString = new THREE.Mesh(pegsGeometry, pegsMaterial);

      peg5thString.position.x = -headParams.width / 5;
      peg5thString.position.y =
        (bodyParams.height + neckParams.height + headParams.height) / 2 + 0.8;
      peg5thString.position.z = headParams.depth + 0.01;

      pegGroup.add(peg5thString);

      const peg5thStringFolder = pegFolder.addFolder("5弦ペグ");
      peg5thStringFolder
        .add(pegParams, "radius")
        .min(0.01)
        .max(10)
        .step(0.01)
        .name("半径")
        .onChange((value: number) => {
          peg5thString.geometry.dispose();
          peg5thString.geometry = new THREE.CircleGeometry(
            value,
            pegParams.segments
          );
        });

      peg5thStringFolder
        .add(peg5thString.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      peg5thStringFolder
        .add(peg5thString.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      peg5thStringFolder
        .add(peg5thString.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      // 6弦のペグ
      const peg6thString = new THREE.Mesh(pegsGeometry, pegsMaterial);

      peg6thString.position.x = -headParams.width / 5;
      peg6thString.position.y =
        (bodyParams.height + neckParams.height + headParams.height) / 2 + 1.2;
      peg6thString.position.z = headParams.depth + 0.01;

      pegGroup.add(peg6thString);

      const peg6thStringFolder = pegFolder.addFolder("6弦ペグ");
      peg6thStringFolder
        .add(pegParams, "radius")
        .min(0.01)
        .max(10)
        .step(0.01)
        .name("半径")
        .onChange((value: number) => {
          peg6thString.geometry.dispose();
          peg6thString.geometry = new THREE.CircleGeometry(
            value,
            pegParams.segments
          );
        });

      peg6thStringFolder
        .add(peg6thString.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      peg6thStringFolder
        .add(peg6thString.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      peg6thStringFolder
        .add(peg6thString.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      guiterGroup.add(pegGroup);

      // ピックアップの作成
      const pickupParams = {
        width: 1.5,
        height: 0.7,
        depth: 0.15,
      };

      const pickupGeometry = new THREE.BoxGeometry(
        pickupParams.width,
        pickupParams.height,
        pickupParams.depth
      );

      const pickupMaterial = new THREE.MeshStandardMaterial({ color: "black" });

      // フロント
      const frontPickup = new THREE.Mesh(pickupGeometry, pickupMaterial);

      frontPickup.position.y = neck.position.y / 2 - 0.95;
      frontPickup.position.z = bodyParams.depth / 2;

      guiterGroup.add(frontPickup);

      const pickupFolder = gui.addFolder("ピックアップ");
      pickupFolder.close();
      const frontPickupFolder = pickupFolder.addFolder("フロント");
      frontPickupFolder
        .add(frontPickup.scale, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("幅");
      frontPickupFolder
        .add(frontPickup.scale, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("高さ");
      frontPickupFolder
        .add(frontPickup.scale, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("奥行き");
      frontPickupFolder
        .add(frontPickup.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      frontPickupFolder
        .add(frontPickup.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      frontPickupFolder
        .add(frontPickup.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      // リア
      const rearPickup = new THREE.Mesh(pickupGeometry, pickupMaterial);

      rearPickup.position.z = bodyParams.depth / 2;

      guiterGroup.add(rearPickup);

      const rearPickupFolder = pickupFolder.addFolder("リア");
      rearPickupFolder
        .add(rearPickup.scale, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("幅");
      rearPickupFolder
        .add(rearPickup.scale, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("高さ");
      rearPickupFolder
        .add(rearPickup.scale, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("奥行き");
      rearPickupFolder
        .add(rearPickup.position, "x")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      rearPickupFolder
        .add(rearPickup.position, "y")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      rearPickupFolder
        .add(rearPickup.position, "z")
        .min(0.1)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

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

      camera.position.z = 10;
      scene.add(camera);

      // Contorols
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 影を有効にする
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      // ループアニメーション
      const timer = new Timer();

      const animetion = () => {
        controls.update();
        renderer.render(scene, camera);

        // タイマー
        timer.update();
        const elapsedTime = timer.getElapsed();

        requestAnimationFrame(animetion);
      };
      animetion();
    }
  }, []);

  return <canvas ref={canvasRef} className=""></canvas>;
}
