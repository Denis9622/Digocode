import { Model } from "./model.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const view = new View();
  const controller = new Controller(model, view);
  controller.init();
});
