export class Model {
  constructor() {
    this.gravity = 1;
    this.spawnRate = 1;
    this.shapes = [];
  }

  addShape(shape) {
    this.shapes.push(shape);
  }

  removeShape(shape) {
    this.shapes = this.shapes.filter((s) => s !== shape);
  }

  updateGravity(value) {
    this.gravity = value;
  }

  updateSpawnRate(value) {
    this.spawnRate = value;
  }

  getShapes() {
    return this.shapes;
  }

  getGravity() {
    return this.gravity;
  }

  getSpawnRate() {
    return this.spawnRate;
  }
}
