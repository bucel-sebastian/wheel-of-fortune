import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js";
import wheelGame from "./WheelGame.js";

let campaignStep = 1;
let campaignSteps = null;

let isLoaded = false;

const showCampaingStep = () => {
  if (campaignStep === 0) {
    campaignSteps.forEach((step) => {
      step.style.display = "block";

      if (step.id !== `campaign-step-${campaignStep}`) {
        step.style.display = "none";
        step.remove();
      }
    });
  }
  campaignSteps.forEach((step) => {
    step.style.display = "none";
    if (step.id === `campaign-step-${campaignStep}`) {
      step.style.display = "block";
    }
  });
};

const handleCampaignFormSubmit = (e) => {
  e.preventDefault();
  e.stopPropagation();

  campaignStep++;
  showCampaingStep();
};

// isLoaded = false;
fetch("/api/check-date.php")
  .then((response) => response.json())
  .then((response) => {
    // console.log("DATA FETCHED");

    const result = response;
    campaignSteps = document.querySelectorAll('[id*="campaign-step-"]');

    if (result.in_interval === true) {
      // fetch("/api/get-repart-data.php")
      //   .then((response) => response.json())
      //   .then((response) => {
      //     const result = response;
      //     console.log(result);
      //     document.getElementById("repart-data-date").innerHTML =
      //       result.data.date;
      //     const probabilities = JSON.parse(result.data.prizes);
      //     console.log(probabilities);
      //     document.getElementById("repart-prizes").innerHTML = "";
      //     probabilities.forEach((element) => {
      //       document.getElementById("repart-prizes").innerHTML += `<tr>
      //   <td>${element.name}</td>
      //   <td>${element.allocated_quantity} - ${element.quantity}</td>
      //   <td>${element.allocated_reserves} - ${element.reserves}</td>
      //   <td>${element.probability}</td>
      // </tr>`;
      //     });
      // });

      wheelGame();
      showCampaingStep();

      const campaignForm = document.getElementById("campaign-form");
      campaignForm.addEventListener("submit", handleCampaignFormSubmit);
    } else {
      campaignStep = 0;
      showCampaingStep();
    }
  });
document.addEventListener(
  "load",
  function () {
    if (isLoaded) {
      return;
    }
    // console.log("DOM LOADED");
  },
  false
);
