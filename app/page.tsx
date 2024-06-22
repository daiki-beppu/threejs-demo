"use client";

import GUI from "lil-gui";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
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

      // テクスチャのロード
      const textureLoader = new THREE.TextureLoader();
      const floorcolorTexture = textureLoader.load(
        "/wood_floor_1k/wood_floor_diff_1k.webp"
      );
      const floorARMTexture = textureLoader.load(
        "/wood_floor_1k/wood_floor_arm_1k.webp"
      );
      const floorNormalTexture = textureLoader.load(
        "/wood_floor_1k/wood_floor_nor_gl_1k.webp"
      );

      floorcolorTexture.colorSpace = THREE.SRGBColorSpace;
      floorARMTexture.repeat.set(2, 2);
      floorARMTexture.wrapS = THREE.RepeatWrapping;
      floorARMTexture.wrapT = THREE.RepeatWrapping;

      floorNormalTexture.repeat.set(2, 2);
      floorNormalTexture.wrapS = THREE.RepeatWrapping;
      floorNormalTexture.wrapT = THREE.RepeatWrapping;

      const wallcolorTexture = textureLoader.load(
        "/wood_cabinet_worn_long_1k/wood_cabinet_worn_long_diff_1k.webp"
      );
      const wallARMTexture = textureLoader.load(
        "/wood_cabinet_worn_long_1k/wood_cabinet_worn_long_arm_1k.webp"
      );
      const wallNormalTexture = textureLoader.load(
        "/wood_cabinet_worn_long_1k/wood_cabinet_worn_long_nor_gl_1k.webp"
      );

      wallcolorTexture.colorSpace = THREE.SRGBColorSpace;
      wallARMTexture.repeat.set(2, 2);
      wallARMTexture.wrapS = THREE.RepeatWrapping;
      wallARMTexture.wrapT = THREE.RepeatWrapping;

      wallNormalTexture.repeat.set(2, 2);
      wallNormalTexture.wrapS = THREE.RepeatWrapping;
      wallNormalTexture.wrapT = THREE.RepeatWrapping;

      // デバッグUI
      const gui = new GUI({
        width: 300,
        title: "デバッグUI",
        // closeFolders: true,
      });
      gui.hide();
      guiRef.current = gui;

      // デバッグUIの表示切り替え
      window.addEventListener("keydown", (event) => {
        event.key === "," ? gui.show(gui._hidden) : "";
      });

      const vector3Params = ["x", "y", "z"];

      // 背景

      const backgroundParams = {
        width: 40,
        height: 40,
      };

      const backgroundGeometry = new THREE.PlaneGeometry(
        backgroundParams.width,
        backgroundParams.height
      );

      // 床
      const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorcolorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
      });
      const floor = new THREE.Mesh(backgroundGeometry, floorMaterial);

      floor.rotation.x = -Math.PI / 2;

      scene.add(floor);

      // 壁
      const wallMaterial = new THREE.MeshStandardMaterial({
        map: wallcolorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
      });

      const wall = new THREE.Mesh(backgroundGeometry, wallMaterial);
      wall.position.y = 12;
      wall.position.z = -10;
      scene.add(wall);

      // ギターグループ
      const guiterGroup = new THREE.Group();
      guiterGroup.position.z = -2;
      guiterGroup.rotation.z = -Math.PI / 3;

      guiterGroup.rotation.x = -Math.PI / 9;

      guiterGroup.scale.set(0.8, 0.8, 0.8);
      scene.add(guiterGroup);

      // ギターのボディ
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
        new THREE.MeshStandardMaterial({
          color: "#D7A625",
          roughness: 0.3,
          metalness: 0,
        })
      );

      guiterGroup.add(body);
      guiterGroup.position.y = bodyParams.height / 2;

      // デバッグ UI
      const bodyFolder = gui.addFolder("ボディ");

      vector3Params.map((vector3) =>
        bodyFolder
          .add(body.scale, vector3)
          .min(0.1)
          .max(10)
          .step(0.01)
          .name(`${vector3}軸のスケール`)
      );

      vector3Params.map((vector3) =>
        bodyFolder
          .add(body.position, vector3)
          .min(-5)
          .max(10)
          .step(0.01)
          .name(`${vector3}軸の移動`)
      );

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
        new THREE.MeshStandardMaterial({
          color: "#734e30",
        })
      );

      neck.position.y = bodyParams.height - 0.5;
      neck.position.z = bodyParams.depth / 2;

      guiterGroup.add(neck);

      // デバッグ UI
      const neckFolder = gui.addFolder("ネック");
      vector3Params.map((vextor3) =>
        neckFolder
          .add(body.scale, vextor3)
          .min(0.1)
          .max(10)
          .step(0.01)
          .name(`${vextor3}軸のスケール`)
      );
      vector3Params.map((vextor3) =>
        neckFolder
          .add(body.position, vextor3)
          .min(-10)
          .max(10)
          .step(0.01)
          .name(`${vextor3}軸のポジション`)
      );

      neckFolder.close();

      // ヘッド

      const headParams = {
        width: bodyParams.width / 3,
        height: 1.5,
        depth: 0.28,
      };

      const head = new THREE.Mesh(
        new THREE.BoxGeometry(
          headParams.width,
          headParams.height,
          headParams.depth
        ),
        new THREE.MeshStandardMaterial({ color: "black", roughness: 0.3 })
      );

      head.position.y = bodyParams.width + neckParams.height / 2 + 0.1;
      head.position.z = bodyParams.depth / 2;

      guiterGroup.add(head);

      const headFolder = gui.addFolder("ヘッド");
      vector3Params.map((vextor3) =>
        headFolder
          .add(body.scale, vextor3)
          .min(0.1)
          .max(10)
          .step(0.01)
          .name(`${vextor3}軸のスケール`)
      );
      vector3Params.map((vextor3) =>
        headFolder
          .add(body.position, vextor3)
          .min(-10)
          .max(10)
          .step(0.01)
          .name(`${vextor3}軸のポジション`)
      );

      headFolder.close();

      // ペグ

      const pegParams = {
        radius: 0.1,
        segments: 16,
      };

      const pegsGeometry = new THREE.CircleGeometry(
        pegParams.radius,
        pegParams.segments
      );
      const pegsMaterial = new THREE.MeshStandardMaterial({
        color: "silver",
        metalness: 0.1,
        roughness: 0,
      });

      const numPegs = 6;
      const spacingX = 0.4;
      const spacingY = 0.4;

      const pegsFolder = gui.addFolder("ペグ");
      pegsFolder.close();

      for (let i = 0; i < numPegs; i++) {
        const pegs = new THREE.Mesh(pegsGeometry, pegsMaterial);

        pegs.position.x = i < 3 ? spacingX : -spacingX;
        pegs.position.y = head.position.y + (i % 3) * spacingY - 0.3;
        pegs.position.z = headParams.depth + 0.01;
        guiterGroup.add(pegs);

        const pegStringFolder = pegsFolder.addFolder(`${i + 1}弦ペグ`);
        pegStringFolder
          .add(pegParams, "radius")
          .min(0.01)
          .max(10)
          .step(0.01)
          .name("半径")
          .onChange((value: number) => {
            pegs.geometry.dispose();
            pegs.geometry = new THREE.CircleGeometry(value, pegParams.segments);
          });
        pegStringFolder
          .add(pegs.position, "x")
          .min(-5)
          .max(10)
          .step(0.01)
          .name("x軸 移動");
        pegStringFolder
          .add(pegs.position, "y")
          .min(-5)
          .max(10)
          .step(0.01)
          .name("y軸 移動");
        pegStringFolder
          .add(pegs.position, "z")
          .min(-5)
          .max(10)
          .step(0.01)
          .name("z軸 移動");
      }

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

      const pickupMaterial = new THREE.MeshStandardMaterial({
        color: "black",
        roughness: 0.3,
      });

      const pickups = [
        { name: "フロント", positionOffsetY: neck.position.y / 2 - 0.95 },
        { name: "リア", positionOffsetY: 0 },
      ];

      const pickupFolder = gui.addFolder("ピックアップ");
      pickupFolder.close();

      pickups.map((pickup) => {
        const newPickup = new THREE.Mesh(pickupGeometry, pickupMaterial);
        newPickup.position.y = pickup.positionOffsetY;
        newPickup.position.z = bodyParams.depth / 2;

        guiterGroup.add(newPickup);

        const newPickupFolder = pickupFolder.addFolder(pickup.name);
        ["x", "y", "z"].map((vector3) => {
          newPickupFolder
            .add(newPickup.scale, vector3)
            .min(0.1)
            .max(10)
            .step(0.01)
            .name(`${vector3}軸のスケール`);
          newPickupFolder
            .add(newPickup.position, vector3)
            .min(-5)
            .max(10)
            .step(0.01)
            .name(`${vector3}軸の移動`);
        });
      });

      // ピックアップセレクター

      // ピックアップセレクター ベース
      const pickupSelectorBaseParams = {
        radius: 0.3,
        segments: 16,
      };

      const pickupSelectorBaseGeometry = new THREE.CircleGeometry(
        pickupSelectorBaseParams.radius,
        pickupSelectorBaseParams.segments
      );
      const pickupSelectorBaseMaterial = new THREE.MeshStandardMaterial({
        color: "black",
      });

      const pickupSelectorBase = new THREE.Mesh(
        pickupSelectorBaseGeometry,
        pickupSelectorBaseMaterial
      );

      pickupSelectorBase.position.x = -bodyParams.width / 3;
      pickupSelectorBase.position.y = bodyParams.height / 2 - 1;
      pickupSelectorBase.position.z = bodyParams.depth / 2 + 0.001;

      guiterGroup.add(pickupSelectorBase);

      const pickupSelectorFolder = gui.addFolder("ピックアップセレクター");
      pickupSelectorFolder.close();
      const pickupSelectorBaseFolder =
        pickupSelectorFolder.addFolder("ピックアップセレクターベース");
      pickupSelectorBaseFolder
        .add(pickupSelectorBaseParams, "radius")
        .min(0.01)
        .max(10)
        .step(0.01)
        .name("半径")
        .onChange((value: number) => {
          pickupSelectorBase.geometry.dispose();
          pickupSelectorBase.geometry = new THREE.CircleGeometry(
            value,
            pickupSelectorBaseParams.segments
          );
        });

      pickupSelectorBaseFolder
        .add(pickupSelectorBase.position, "x")
        .min(-5)
        .max(10)
        .step(0.01)
        .name("x軸 移動");
      pickupSelectorBaseFolder
        .add(pickupSelectorBase.position, "y")
        .min(-5)
        .max(10)
        .step(0.01)
        .name("y軸 移動");
      pickupSelectorBaseFolder
        .add(pickupSelectorBase.position, "z")
        .min(-5)
        .max(10)
        .step(0.01)
        .name("z軸 移動");

      // ピックアップセレクター ノブ

      const pickupSelectorKnobParams = {
        radiusTop: 0.06,
        radiusBottom: 0.03,
        height: 0.3,
        radialSegments: 16,
      };

      const pickupSelectorKnobGeometry = new THREE.CylinderGeometry(
        pickupSelectorKnobParams.radiusTop,
        pickupSelectorKnobParams.radiusBottom,
        pickupSelectorKnobParams.height,
        pickupSelectorKnobParams.radialSegments
      );

      const pickupSelectorKnobMatelial = new THREE.MeshStandardMaterial({
        color: "silver",
      });

      const pickupSelectorKnob = new THREE.Mesh(
        pickupSelectorKnobGeometry,
        pickupSelectorKnobMatelial
      );

      pickupSelectorKnob.position.x = pickupSelectorBase.position.x;
      pickupSelectorKnob.position.y = pickupSelectorBase.position.y;
      pickupSelectorKnob.position.z = pickupSelectorBase.position.z + 0.01;

      pickupSelectorKnob.rotation.x = Math.PI / 2;
      pickupSelectorKnob.rotation.z = Math.PI / 6;

      guiterGroup.add(pickupSelectorKnob);

      // コントロールノブ
      const controlKnobParams = {
        radiusTop: 0.15,
        radiusBottom: 0.2,
        height: 0.3,
        radialSegments: 16,
      };

      const controlKnobGometry = new THREE.CylinderGeometry(
        controlKnobParams.radiusTop,
        controlKnobParams.radiusBottom,
        controlKnobParams.height,
        controlKnobParams.radialSegments
      );

      const controlKnobMaterial = new THREE.MeshStandardMaterial({
        color: "black",
      });

      const controlKnobParts = [
        {
          name: "フロント ボリューム",
          position: { x: 1, y: -1.2, z: bodyParams.depth / 2 + 0.001 },
        },
        {
          name: "フロント トーン",
          position: { x: 1, y: -2, z: bodyParams.depth / 2 + 0.001 },
        },
        {
          name: "リア ボリューム",
          position: { x: 1.6, y: -0.8, z: bodyParams.depth / 2 + 0.001 },
        },
        {
          name: "リア トーン",
          position: { x: 1.6, y: -1.6, z: bodyParams.depth / 2 + 0.001 },
        },
      ];

      const controlKnobFolder = gui.addFolder("コントロールノブ");
      controlKnobFolder.close();

      controlKnobParts.map((part) => {
        const controlKnob = new THREE.Mesh(
          controlKnobGometry,
          controlKnobMaterial
        );

        controlKnob.position.set(
          part.position.x,
          part.position.y,
          part.position.z
        );

        controlKnob.rotation.x = Math.PI / 2;
        guiterGroup.add(controlKnob);

        const knobFolder = controlKnobFolder.addFolder(part.name);
        ["x", "y", "z"].map((vector3) => {
          knobFolder
            .add(controlKnob.position, vector3)
            .min(-5)
            .max(10)
            .step(0.01)
            .name(`${vector3}軸 移動`);
        });
      });

      // ブリッジ
      const bridgeParams = {
        width: pickupParams.width - 0.1,
        height: 0.3,
        depth: pickupParams.depth,
      };

      const bridgeGeometry = new THREE.BoxGeometry(
        bridgeParams.width,
        bridgeParams.height,
        bridgeParams.depth
      );

      const bridgeMaterial = new THREE.MeshStandardMaterial({
        color: "silver",
        roughness: 0,
        metalness: 0.1,
      });

      const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);

      bridge.position.y = -0.75;
      bridge.position.z = bodyParams.depth / 2 + 0.01;

      guiterGroup.add(bridge);

      // テイルピース

      const tailpieceParams = {
        radius: 0.1,
        length: pickupParams.width - 0.35,
        capSegments: 4,
        radialSegments: 8,
      };
      const tailpieceGeometry = new THREE.CapsuleGeometry(
        tailpieceParams.radius,
        tailpieceParams.length,
        tailpieceParams.capSegments,
        tailpieceParams.radialSegments
      );
      const tailpieceMaterial = new THREE.MeshStandardMaterial({
        color: "silver",
        roughness: 0,
        metalness: 0.1,
      });
      const tailpiece = new THREE.Mesh(tailpieceGeometry, tailpieceMaterial);

      tailpiece.position.y = -1.2;
      tailpiece.position.z = bodyParams.depth / 2 + 0.01;

      tailpiece.rotation.z = Math.PI / 2;
      guiterGroup.add(tailpiece);

      // 弦
      const guiterStringParams = {
        radius: 0.01,
        length: neckParams.height + 1.6,
        capSegments: 1,
        radialSegments: 16,
      };

      const guiterStringGeometry = new THREE.CapsuleGeometry(
        guiterStringParams.radius,
        guiterStringParams.length,
        guiterStringParams.capSegments,
        guiterStringParams.radialSegments
      );
      const guiterStringMaterial = new THREE.MeshStandardMaterial({
        color: "silver",
        metalness: 0.1,
        roughness: 0,
      });

      const numStrings = 6;
      const spacing = (neckParams.width - 0.1) / (numStrings - 1);

      for (let i = 0; i < numStrings; i++) {
        const guiterString = new THREE.Mesh(
          guiterStringGeometry,
          guiterStringMaterial
        );
        guiterString.position.x = (i - (numStrings - 1) / 2) * spacing;
        guiterString.position.y = bodyParams.height / 2;
        guiterString.position.z = neckParams.depth + 0.1;
        guiterGroup.add(guiterString);
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
        color: 0xffffff,
        intensity: 2,
      };

      const directionalLight = new THREE.DirectionalLight(
        directionalLightParams.color,
        directionalLightParams.intensity
      );
      directionalLight.position.set(10, 15, 15);

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
      const directionalLightFolder = gui.addFolder("directionalLight");

      directionalLightFolder
        .add(directionalLight.position, "x")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("x");
      directionalLightFolder
        .add(directionalLight.position, "y")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("y");
      directionalLightFolder
        .add(directionalLight.position, "z")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("z");

      const helperFolder = directionalLightFolder.addFolder("ヘルパー");
      helperFolder.close();
      helperFolder
        .add(directionalLighCameratHelper, "visible")
        .name("カメラヘルパー");
      helperFolder
        .add(directionalLightHelper, "visible")
        .name("ライトヘルパー");

      directionalLightFolder.close();

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

      camera.position.y = 6;
      camera.position.z = 12;

      // camera.rotation.x = -Math.PI / 4
      scene.add(camera);

      const cameraFoloder = gui.addFolder("カメラの位置");
      cameraFoloder
        .add(camera.position, "x")
        .min(-15)
        .max(15)
        .step(0.01)
        .name("x");
      cameraFoloder
        .add(camera.position, "y")
        .min(-15)
        .max(15)
        .step(0.01)
        .name("y");
      cameraFoloder
        .add(camera.position, "z")
        .min(-15)
        .max(15)
        .step(0.01)
        .name("z");

      cameraFoloder.close();

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

      directionalLight.castShadow = true;
      body.castShadow = true;
      neck.castShadow = true;
      head.castShadow = true;

      directionalLight.shadow.mapSize.width = 512;
      directionalLight.shadow.mapSize.height = 512;

      // 影の生成範囲を制御
      directionalLight.shadow.camera.top = 6;
      directionalLight.shadow.camera.right = 6;
      directionalLight.shadow.camera.bottom = -6;
      directionalLight.shadow.camera.left = -6;
      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 30;

      floor.receiveShadow = true;
      wall.receiveShadow = true;
      body.receiveShadow = true;
      head.receiveShadow = true;

      // ループアニメーション
      const timer = new Timer();

      const animetion = () => {
        controls.update();
        renderer.render(scene, camera);

        // タイマー
        timer.update();
        const elapsedTime = timer.getElapsed() * 0.5;

        guiterGroup.rotation.y = elapsedTime;

        requestAnimationFrame(animetion);
      };
      animetion();
    }
  }, []);

  return <canvas ref={canvasRef} className=""></canvas>;
}
