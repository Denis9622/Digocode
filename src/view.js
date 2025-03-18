export class View {
  constructor() {
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0xeeeeee,
    });
    document.getElementById("canvas-container").appendChild(this.app.view);

    this.shapesContainer = new PIXI.Container();
    this.shapesContainer.mask = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
      .endFill();
    this.app.stage.addChild(this.shapesContainer);

    this.shapesCountText = new PIXI.Text("Shapes: 0", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "black",
    });
    this.shapesCountText.x = 10;
    this.shapesCountText.y = 10;
    this.app.stage.addChild(this.shapesCountText);

    this.shapesAreaText = new PIXI.Text("Area: 0 px²", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "black",
    });
    this.shapesAreaText.x = 10;
    this.shapesAreaText.y = 40;
    this.app.stage.addChild(this.shapesAreaText);
  }

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
    }
    shape.x = x;
    shape.y = y;
    shape.interactive = true;
    shape.buttonMode = true;
    return shape;
  }

  addShapeToContainer(shape) {
    this.shapesContainer.addChild(shape);
  }

  removeShapeFromContainer(shape) {
    this.shapesContainer.removeChild(shape);
  }

  updateShapesCount(count) {
    this.shapesCountText.text = `Shapes: ${count}`;
  }

  updateShapesArea(area) {
    this.shapesAreaText.text = `Area: ${area} px²`;
  }

  updateGravityValue(value) {
    document.getElementById("gravityValue").textContent = value;
  }

  updateSpawnRateValue(value) {
    document.getElementById("spawnRateValue").textContent = value;
  }
}
