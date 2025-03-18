export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.shapeInterval = null;
  }

  init() {
    this.view.app.view.addEventListener("click", (event) => {
      const rect = this.view.app.view.getBoundingClientRect();
      const x = event.clientX - rect.left;
      this.createRandomShape(x, 0);
    });

    document.getElementById("increaseShapes").addEventListener("click", () => {
      this.model.updateSpawnRate(this.model.getSpawnRate() + 1);
      this.updateShapeInterval();
      this.view.updateSpawnRateValue(this.model.getSpawnRate());
    });

    document.getElementById("decreaseShapes").addEventListener("click", () => {
      if (this.model.getSpawnRate() > 1) {
        this.model.updateSpawnRate(this.model.getSpawnRate() - 1);
        this.updateShapeInterval();
        this.view.updateSpawnRateValue(this.model.getSpawnRate());
      }
    });

    document.getElementById("increaseGravity").addEventListener("click", () => {
      this.model.updateGravity(this.model.getGravity() + 1);
      this.view.updateGravityValue(this.model.getGravity());
    });

    document.getElementById("decreaseGravity").addEventListener("click", () => {
      if (this.model.getGravity() > 1) {
        this.model.updateGravity(this.model.getGravity() - 1);
        this.view.updateGravityValue(this.model.getGravity());
      }
    });

    this.view.app.ticker.add(() => {
      this.model.getShapes().forEach((shape) => {
        shape.y += this.model.getGravity();
        if (shape.y > this.view.app.renderer.height) {
          this.view.removeShapeFromContainer(shape);
          this.model.removeShape(shape);
          this.updateTextFields();
        }
      });
    });

    this.updateShapeInterval();
  }

  createRandomShape(x, y) {
    const shapeTypes = ["triangle", "rectangle", "pentagon", "circle"];
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const color = Math.random() * 0xffffff;
    const shape = this.view.createShape(type, color, x, y);

    shape.on("pointerdown", () => {
      this.view.removeShapeFromContainer(shape);
      this.model.removeShape(shape);
      this.updateTextFields();
    });

    this.view.addShapeToContainer(shape);
    this.model.addShape(shape);
    this.updateTextFields();
  }

  updateShapeInterval() {
    if (this.shapeInterval) {
      clearInterval(this.shapeInterval);
    }
    this.shapeInterval = setInterval(() => {
      this.createRandomShape(Math.random() * this.view.app.renderer.width, 0);
    }, 1000 / this.model.getSpawnRate());
  }

  updateTextFields() {
    this.view.updateShapesCount(this.model.getShapes().length);
    const totalArea = this.model
      .getShapes()
      .reduce((acc, shape) => acc + shape.width * shape.height, 0);
    this.view.updateShapesArea(totalArea);
  }
}
