export class ShapeSpawner {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.shapeInterval = null;
  }

  start() {
    this.updateShapeInterval();
  }

  createRandomShape(x, y) {
    const SHAPE_TYPES = ["triangle", "rectangle", "pentagon", "circle"];
    const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
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

    const MIN_INTERVAL = 100;
    const intervalTime = Math.max(
      1000 / this.model.getSpawnRate(),
      MIN_INTERVAL
    );
    this.shapeInterval = setInterval(() => {
      this.createRandomShape(Math.random() * this.view.app.renderer.width, -50); // Появление за пределами экрана
    }, intervalTime);
  }

  updateTextFields() {
    this.view.updateShapesCount(this.model.getShapes().length);
    const totalArea = this.model
      .getShapes()
      .reduce((acc, shape) => acc + shape.width * shape.height, 0);
    this.view.updateShapesArea(totalArea);
  }
}
