const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0xeeeeee,
});
document.getElementById("canvas-container").appendChild(app.view);

const shapesContainer = new PIXI.Container();
shapesContainer.mask = new PIXI.Graphics()
  .beginFill(0xffffff)
  .drawRect(0, 0, app.screen.width, app.screen.height)
  .endFill();
app.stage.addChild(shapesContainer);

let gravity = 1;
let spawnRate = 1;
let shapes = [];
let clickedOnShape = false;

function createRandomShape(x, y) {
  const shapeTypes = ["triangle", "rectangle", "pentagon", "circle"];
  const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  let shape = new PIXI.Graphics();
  const color = Math.random() * 0xffffff;

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

  shape.on("pointerdown", () => {
    shapesContainer.removeChild(shape);
    shapes = shapes.filter((s) => s !== shape);
    clickedOnShape = true;
    updateTextFields();
  });

  shapesContainer.addChild(shape);
  shapes.push(shape);
  updateTextFields();
}

app.ticker.add(() => {
  shapes.forEach((shape) => {
    shape.y += gravity;
    if (shape.y > app.renderer.height) {
      shapesContainer.removeChild(shape);
      shapes = shapes.filter((s) => s !== shape);
      updateTextFields();
    }
  });
});

app.view.addEventListener("click", (event) => {
  if (clickedOnShape) {
    clickedOnShape = false;
    return;
  }

  const rect = app.view.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const isOverlapping = shapes.some((shape) => {
    const bounds = shape.getBounds();
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  });

  if (!isOverlapping) {
    createRandomShape(x, y);
  }
});

let shapeInterval = setInterval(() => {
  createRandomShape(Math.random() * app.renderer.width, 0);
}, 1000 / spawnRate);

// Кнопки управления
const increaseButton = document.getElementById("increaseShapes");
const decreaseButton = document.getElementById("decreaseShapes");
const spawnRateValue = document.getElementById("spawnRateValue");

increaseButton.addEventListener("click", () => {
  spawnRate++;
  resetShapeInterval();
  spawnRateValue.textContent = spawnRate;
  updateDecreaseButtonState();
});

decreaseButton.addEventListener("click", () => {
  if (spawnRate > 1) {
    spawnRate--;
    resetShapeInterval();
    spawnRateValue.textContent = spawnRate;
    updateDecreaseButtonState();
  }
});

function resetShapeInterval() {
  clearInterval(shapeInterval);
  shapeInterval = setInterval(() => {
    createRandomShape(Math.random() * app.renderer.width, 0);
  }, 1000 / spawnRate);
}

function updateDecreaseButtonState() {
  decreaseButton.disabled = spawnRate <= 1;
}

updateDecreaseButtonState();

document.getElementById("increaseGravity").addEventListener("click", () => {
  gravity++;
  document.getElementById("gravityValue").textContent = gravity;
});

document.getElementById("decreaseGravity").addEventListener("click", () => {
  if (gravity > 1) gravity--;
  document.getElementById("gravityValue").textContent = gravity;
});

const textStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 24,
  fill: "black",
});

const shapesCountText = new PIXI.Text("Shapes: 0", textStyle);
shapesCountText.x = 10;
shapesCountText.y = 10;
app.stage.addChild(shapesCountText);

const shapesAreaText = new PIXI.Text("Area: 0 px²", textStyle);
shapesAreaText.x = 10;
shapesAreaText.y = 40;
app.stage.addChild(shapesAreaText);

function updateTextFields() {
  shapesCountText.text = `Shapes: ${shapes.length}`;
  const totalArea = shapes.reduce(
    (acc, shape) => acc + shape.width * shape.height,
    0
  );
  shapesAreaText.text = `Area: ${totalArea} px²`;
}
