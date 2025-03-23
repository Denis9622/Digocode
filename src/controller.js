import { ShapeSpawner } from "./shapeSpawner.js";

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.shapeSpawner = new ShapeSpawner(model, view);
  }

  init() {
    // Register event handlers for view events
    this.view.on("canvasClick", (x, y) => {
      this.shapeSpawner.createRandomShape(x, y);
    });

    this.view.on("increaseShapes", () => {
      this.model.updateSpawnRate(this.model.getSpawnRate() + 1);
      this.shapeSpawner.updateShapeInterval();
      this.view.updateSpawnRateValue(this.model.getSpawnRate());
      this.view.updateDecreaseButtonState(this.model.getSpawnRate());
    });

    this.view.on("decreaseShapes", () => {
      if (this.model.getSpawnRate() > 1) {
        this.model.updateSpawnRate(this.model.getSpawnRate() - 1);
        this.shapeSpawner.updateShapeInterval();
        this.view.updateSpawnRateValue(this.model.getSpawnRate());
        this.view.updateDecreaseButtonState(this.model.getSpawnRate());
      }
    });

    this.view.on("increaseGravity", () => {
      this.model.updateGravity(this.model.getGravity() + 1);
      this.view.updateGravityValue(this.model.getGravity());
    });

    this.view.on("decreaseGravity", () => {
      if (this.model.getGravity() > 1) {
        this.model.updateGravity(this.model.getGravity() - 1);
        this.view.updateGravityValue(this.model.getGravity());
      }
    });

    // Start shape spawner and update button state
    this.shapeSpawner.start();
    this.view.updateDecreaseButtonState(this.model.getSpawnRate());
  }
}

class ShapeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  // Start ticker for falling shapes
  startFallTicker() {
    this.view.app.ticker.add(() => {
      this.model.getShapes().forEach((shape) => {
        shape.y += this.model.getGravity();
        if (shape.y - shape.height > this.view.app.renderer.height) {
          // Remove shape if it falls out of the screen
          this.view.removeShapeFromContainer(shape);
          this.model.removeShape(shape);
          this.updateTextFields();
        }
      });
    });
  }

  // Update text fields for shapes count and area
  updateTextFields() {
    this.view.updateShapesCount(this.model.getShapes().length);
    const totalArea = this.model
      .getShapes()
      .reduce((acc, shape) => acc + shape.width * shape.height, 0);
    this.view.updateShapesArea(totalArea);
  }
}
