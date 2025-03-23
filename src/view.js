export class View {
  constructor() {
    // Constants for application dimensions and styles
    const APP_WIDTH = 800;
    const APP_HEIGHT = 600;
    const BACKGROUND_COLOR = 0xeeeeee;
    const TEXT_STYLE = {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "black",
    };

    // Initialize PIXI application
    this.app = new PIXI.Application({
      width: APP_WIDTH,
      height: APP_HEIGHT,
      backgroundColor: BACKGROUND_COLOR,
    });
    document.getElementById("canvas-container").appendChild(this.app.view);

    // Create container for shapes with a mask
    this.shapesContainer = new PIXI.Container();
    this.shapesContainer.mask = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
      .endFill();
    this.app.stage.addChild(this.shapesContainer);

    // Create text fields for shapes count and area
    this.shapesCountText = new PIXI.Text("Shapes: 0", TEXT_STYLE);
    this.shapesCountText.x = 10;
    this.shapesCountText.y = 10;
    this.app.stage.addChild(this.shapesCountText);

    this.shapesAreaText = new PIXI.Text("Area: 0 px²", TEXT_STYLE);
    this.shapesAreaText.x = 10;
    this.shapesAreaText.y = 40;
    this.app.stage.addChild(this.shapesAreaText);

    // Initialize event handlers and button state
    this.events = {};
    this.setupEventListeners();
    this.updateDecreaseButtonState(1); // Initialize button state
  }

  // Setup event listeners for user interactions
  setupEventListeners() {
    this.app.view.addEventListener("click", (event) => {
      const rect = this.app.view.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.emit("canvasClick", x, y);
    });

    document.getElementById("increaseShapes").addEventListener("click", () => {
      this.emit("increaseShapes");
    });

    document.getElementById("decreaseShapes").addEventListener("click", () => {
      this.emit("decreaseShapes");
    });

    document.getElementById("increaseGravity").addEventListener("click", () => {
      this.emit("increaseGravity");
    });

    document.getElementById("decreaseGravity").addEventListener("click", () => {
      this.emit("decreaseGravity");
    });
  }

  // Register event handlers
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Emit events to registered handlers
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args));
    }
  }

  // Create a shape based on type and color at specified coordinates
  createShape(type, color, x, y) {
    let shape = new PIXI.Graphics();
    switch (type) {
      case "triangle":
        shape.beginFill(color).drawPolygon([0, 0, 50, 100, -50, 100]).endFill();
        break;
      case "rectangle":
        shape.beginFill(color).drawRect(-25, -25, 50, 50).endFill();
        break;
      case "pentagon":
        shape
          .beginFill(color)
          .drawPolygon([0, -40, 38, -12, 24, 40, -24, 40, -38, -12])
          .endFill();
        break;
      case "circle":
        shape.beginFill(color).drawCircle(0, 0, 25).endFill();
        break;
      case "ellipse":
        shape.beginFill(color).drawEllipse(0, 0, 30, 20).endFill();
        break;
      case "star":
        shape.beginFill(color).drawStar(0, 0, 5, 30).endFill();
        break;
      case "random":
        shape = this.createRandomIrregularShape(color);
        break;
    }
    shape.x = x;
    shape.y = y;
    shape.interactive = true;
    shape.buttonMode = true;
    return shape;
  }

  // Create a random irregular shape
  createRandomIrregularShape(color) {
    const shape = new PIXI.Graphics();
    const points = [];
    const numPoints = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < numPoints; i++) {
      points.push(Math.random() * 50 - 25, Math.random() * 50 - 25);
    }
    shape.beginFill(color).drawPolygon(points).endFill();
    return shape;
  }

  // Add shape to the container
  addShapeToContainer(shape) {
    this.shapesContainer.addChild(shape);
  }

  // Remove shape from the container
  removeShapeFromContainer(shape) {
    this.shapesContainer.removeChild(shape);
  }

  // Update the text displaying the number of shapes
  updateShapesCount(count) {
    this.shapesCountText.text = `Shapes: ${count}`;
  }

  // Update the text displaying the total area of shapes
  updateShapesArea(area) {
    this.shapesAreaText.text = `Area: ${area} px²`;
  }

  // Update the text displaying the gravity value
  updateGravityValue(value) {
    document.getElementById("gravityValue").textContent = value;
  }

  // Update the text displaying the spawn rate value
  updateSpawnRateValue(value) {
    document.getElementById("spawnRateValue").textContent = value;
  }

  // Update the state of the decrease button based on spawn rate
  updateDecreaseButtonState(spawnRate) {
    const decreaseButton = document.getElementById("decreaseShapes");
    decreaseButton.disabled = spawnRate <= 1;
  }
}
