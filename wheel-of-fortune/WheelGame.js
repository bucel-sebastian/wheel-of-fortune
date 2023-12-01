"use strict";

import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";

// function spinWheel(renderer, scene, camera, numSegments, segmentsGroup) {
//   console.log("spinner", segmentsGroup.rotation.z);
//   segmentsGroup.rotation.z += 0.1;
//   renderer.render(scene, camera);
//   requestAnimationFrame(
//     () => {}
//     // spinWheel(renderer, scene, camera, numSegments, segmentsGroup)
//   );
// }

// async function handleWheelClick(
//   e,
//   renderer,
//   scene,
//   camera,
//   numSegments,
//   segmentsGroup
// ) {
//   console.log(
//     "Spin wheel",
//     renderer,
//     scene,
//     camera,
//     numSegments,
//     segmentsGroup
//   );
//   e.preventDefault();
//   e.stopPropagation();
//   const requestData = {
//     name: "name",
//     email: "email",
//     phone: "phone",
//   };
//   const response = await fetch(":80/api.php", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestData),
//   });
//   if (response.ok) {
//     const result = await response.json();
//     console.log(result);
//     // randomPrizeIndex = result.prize;

//     spinWheel(renderer, scene, camera, numSegments, segmentsGroup);
//   }
// }

// function setUpGame(renderer, scene, camera, numSegments, segmentsGroup) {
//   const wheelContainer = document.getElementById("wheel-container");
//   wheelContainer.addEventListener("click", () =>
//     handleWheelClick(event, renderer, scene, camera, numSegments, segmentsGroup)
//   );
// }

// function renderScene(renderer, scene, camera, numSegments, segmentsGroup) {
//   if (loadedImgs < numSegments) {
//     requestAnimationFrame(() =>
//       renderScene(renderer, scene, camera, numSegments, segmentsGroup)
//     );
//   } else {
//     setUpGame(renderer, scene, camera, numSegments, segmentsGroup);
//   }
//   renderer.render(scene, camera);
//   // console.log("render");
// }

let isFinalMessageShow = false;

const showFinalMessage = (prizeIndex) => {
  isFinalMessageShow = true;
  const textWon = document.getElementById("wheel-after-text-won");
  const textLoose = document.getElementById("wheel-after-text-loose");
  const finalMessageBox = document.getElementById("wheel-after-text");
  const wheelContainer = document.getElementById("wheel-container");

  setTimeout(() => {
    wheelContainer.style.filter = "blur(10px)";
    finalMessageBox.style.display = "flex";
    setTimeout(() => {
      finalMessageBox.style.opacity = "1";
    }, 250);
    if (prizeIndex === 0) {
      textWon.style.display = "none";
      textLoose.style.display = "block";
    } else {
      textWon.style.display = "block";
      textLoose.style.display = "none";
    }
  }, 1000);
};

let loadedImgs = 0;
const wheelGame = () => {
  const wheelContainer = document.getElementById("wheel-container");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1 / 1, 1, 1000);
  camera.position.z = 500 + 100;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(wheelContainer.offsetWidth, wheelContainer.offsetHeight);
  document.getElementById("wheel-canvas").appendChild(renderer.domElement);

  //   wheel
  const wheelGeometry = new THREE.CircleGeometry(250, 32);
  const wheelMaterial = new THREE.MeshBasicMaterial({
    color: "#fafafa",
    // transparent: true,
  });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.position.set(0, 0, 0);
  scene.add(wheel);

  const numSegments = 6;
  const segmentHeight = 50;

  const segmentShape = new THREE.Shape();

  //   segmentShape.moveTo(-2.5, 2.5);
  //   segmentShape.lineTo(-2.5, 2.5);
  //   segmentShape.lineTo(5, 250);
  //   segmentShape.lineTo(-250, 155);
  //   segmentShape.lineTo(-2.5, 2.5);
  const lungimeaArcului = ((2 * Math.PI) / 6) * 250;

  const radius = 250;
  const theta = Math.PI / 3;

  // Punctul a
  const x_a = 0;
  const y_a = 0;

  // Punctul b (același cu a)
  const x_b = x_a;
  const y_b = y_a;

  // Punctul c
  const x_c = radius * Math.cos(theta);
  const y_c = radius * Math.sin(theta);

  // Punctul d
  const x_d = radius * Math.cos(2 * theta);
  const y_d = radius * Math.sin(2 * theta);
  segmentShape.moveTo(x_a + 2.5, y_a);
  segmentShape.lineTo(x_b, y_b + 2.5);
  segmentShape.lineTo(x_c, y_c + 2.5);
  segmentShape.lineTo(x_d + 2.5, y_d);
  segmentShape.lineTo(x_b, y_b + 2.5);

  const extrudeSettings = {
    steps: 1,
    depth: segmentHeight,
    bevelEnabled: false,
  };

  const segmentGeometry = new THREE.ExtrudeGeometry(
    segmentShape,
    extrudeSettings
  );

  const segmentsGroup = new THREE.Group();

  for (let i = 0; i < numSegments; i++) {
    let segmentMaterial;
    if (i % 2) {
      segmentMaterial = new THREE.MeshBasicMaterial({
        color: "#fad4e5",
        transparent: true,
      });
    } else {
      segmentMaterial = new THREE.MeshBasicMaterial({
        color: "#ec2227",
        transparent: true,
      });
    }
    const angle = (i * 2 * Math.PI) / numSegments;
    const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
    segment.position.set(0, 0, 25);

    const singleSegmentGroup = new THREE.Group();

    const geometry = new THREE.BoxGeometry(115, 115, 0);
    const loader = new THREE.TextureLoader();

    if (i % 6 === 0 || i % 6 === 3) {
      loader.load(
        "/wheel-of-fortune/img/prize-1.png",
        function (texture) {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            // color: "#1a1a1a",
          });

          const cube = new THREE.Mesh(geometry, material);
          singleSegmentGroup.add(cube);
          cube.position.z = 100;
          cube.position.y = 125;

          loadedImgs++;
        },
        undefined,
        function (error) {
          console.error("An error occurred while loading the texture", error);
        }
      );
    } else if (i % 6 === 1 || i % 6 === 4) {
      loader.load(
        "/wheel-of-fortune/img/prize-2.png",
        function (texture) {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            // color: "#1a1a1a",
          });

          const cube = new THREE.Mesh(geometry, material);
          singleSegmentGroup.add(cube);
          cube.position.z = 100;
          cube.position.y = 115;

          loadedImgs++;
        },
        undefined,
        function (error) {
          console.error("An error occurred while loading the texture", error);
        }
      );
    } else if (i % 6 === 2 || i % 6 === 5) {
      loader.load(
        "/wheel-of-fortune/img/prize-3.png",
        function (texture) {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            // color: "#1a1a1a",
          });

          const cube = new THREE.Mesh(geometry, material);
          singleSegmentGroup.add(cube);
          cube.position.z = 100;
          cube.position.y = 115;

          loadedImgs++;
        },
        undefined,
        function (error) {
          console.error("An error occurred while loading the texture", error);
        }
      );
    }

    singleSegmentGroup.add(segment);

    segmentsGroup.add(singleSegmentGroup);

    singleSegmentGroup.rotation.z = i * ((2 * Math.PI) / 6);
  }

  scene.add(segmentsGroup);

  const spinWheel = (prizeIndex) => {
    let rotationSpeed = 0.1;

    const rotationTarget =
      -10 * Math.PI - (prizeIndex / numSegments) * 2 * Math.PI;
    // console.log(rotationTarget);

    const animateRotation = () => {
      //   console.log("rotation - ", segmentsGroup.rotation.z, rotationTarget);

      if (segmentsGroup.rotation.z < rotationTarget + 0.25 * Math.PI) {
        if (rotationSpeed > 0.0025) {
          rotationSpeed -= 0.00005;
        } else {
          rotationSpeed = 0.0025;
        }
      } else if (segmentsGroup.rotation.z < rotationTarget + 0.4 * Math.PI) {
        if (rotationSpeed > 0.005) {
          rotationSpeed -= 0.00005;
        } else {
          rotationSpeed = 0.005;
        }
      } else if (segmentsGroup.rotation.z < rotationTarget + 0.6 * Math.PI) {
        if (rotationSpeed > 0.01) {
          rotationSpeed -= 0.0005;
        } else {
          rotationSpeed = 0.01;
        }
      } else if (segmentsGroup.rotation.z < rotationTarget + 1 * Math.PI) {
        if (rotationSpeed > 0.03) {
          rotationSpeed -= 0.0005;
        } else {
          rotationSpeed = 0.03;
        }
      } else if (segmentsGroup.rotation.z < rotationTarget + 2 * Math.PI) {
        if (rotationSpeed > 0.04) {
          rotationSpeed -= 0.0005;
        } else {
          rotationSpeed = 0.04;
        }
      } else if (segmentsGroup.rotation.z < rotationTarget + 2.5 * Math.PI) {
        if (rotationSpeed > 0.05) {
          rotationSpeed -= 0.0005;
        } else {
          rotationSpeed = 0.05;
        }
      } else if (segmentsGroup.rotation.z < rotationTarget + 4 * Math.PI) {
        if (rotationSpeed > 0.08) {
          rotationSpeed -= 0.0015;
        } else {
          rotationSpeed = 0.08;
        }
      }

      if (
        segmentsGroup.rotation.z > rotationTarget &&
        segmentsGroup.rotation.z - rotationSpeed > rotationTarget
      ) {
        segmentsGroup.rotation.z -= rotationSpeed;
        renderer.render(scene, camera);
        requestAnimationFrame(animateRotation);
      } else if (segmentsGroup.rotation.z === rotationTarget) {
        segmentsGroup.rotation.z = rotationTarget;
        renderer.render(scene, camera);
      } else {
        segmentsGroup.rotation.z = rotationTarget;
        renderer.render(scene, camera);
        if (!isFinalMessageShow) {
          showFinalMessage(prizeIndex);
        }
        requestAnimationFrame(animateRotation);
      }
    };

    animateRotation();
  };

  const handleWheelClick = async (e) => {
    // console.clear();

    const requestData = new Object();
    const formData = new FormData(document.getElementById("campaign-form"));
    for (const p of formData) {
      // console.log(p[0], p[1]);
      requestData[p[0]] = p[1];
    }
    // return;

    // console.log("handle click", requestData);
    segmentsGroup.rotation.z = 0;
    wheelContainer.removeEventListener("click", handleWheelClick);
    e.preventDefault();
    e.stopPropagation();

    const response = await fetch("/api/give-prize.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (response.ok) {
      const result = await response.json();
      // console.log(result);
      // return;
      spinWheel(result.prize);

      const secResponse = await fetch("/api/get-repart-data.php");
      if (secResponse.ok) {
        const result = await secResponse.json();
        // console.log(result.data);
        document.getElementById("repart-data-date").innerHTML =
          result.data.date;
        const probabilities = JSON.parse(result.data.prizes);
        // console.log(probabilities);
        document.getElementById("repart-prizes").innerHTML = "";
        probabilities.forEach((element) => {
          document.getElementById("repart-prizes").innerHTML += `<tr>
            <td>${element.name}</td>
            <td>${element.allocated_quantity} - ${element.quantity}</td>
            <td>${element.allocated_reserves} - ${element.reserves}</td>
            <td>${element.probability}</td>
          </tr>`;
        });
      }
    }
  };

  const renderScene = () => {
    if (loadedImgs < numSegments) {
      requestAnimationFrame(renderScene);
    } else {
      wheelContainer.addEventListener("click", handleWheelClick);
    }
    renderer.render(scene, camera);
  };

  renderScene(renderer, scene, camera, numSegments, segmentsGroup);
};

export default wheelGame;
