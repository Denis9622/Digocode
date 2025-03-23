// Создание приложения Pixi.js
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
let clickedOnShape = false; // Флаг для определения клика по фигуре

// Функция создания случайной фигурки
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
    clickedOnShape = true; // Устанавливаем флаг клика по фигуре
    updateTextFields();
  });

  shapesContainer.addChild(shape);
  shapes.push(shape);
  updateTextFields();
}

// Тикер для управления гравитацией
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

// Обработчик кликов, добавляющий фигурки только на пустое место
app.view.addEventListener("click", (event) => {
  if (clickedOnShape) {
    // Сбрасываем флаг и выходим, если был клик по фигуре
    clickedOnShape = false;
    return;
  }

  const rect = app.view.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Проверка на пересечение клика с существующими фигурами
  const isOverlapping = shapes.some((shape) => {
    const bounds = shape.getBounds();
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  });

  // Если клик по пустому месту, создаём новую фигуру
  if (!isOverlapping) {
    createRandomShape(x, y);
  }
});

// Управление количеством фигур и гравитацией
let shapeInterval = setInterval(() => {
  createRandomShape(Math.random() * app.renderer.width, 0);
}, 1000 / spawnRate);

document.getElementById("increaseShapes").addEventListener("click", () => {
  spawnRate++;
  clearInterval(shapeInterval);
  shapeInterval = setInterval(() => {
    createRandomShape(Math.random() * app.renderer.width, 0);
  }, 1000 / spawnRate);
  document.getElementById("spawnRateValue").textContent = spawnRate;
});
document.getElementById("decreaseShapes").addEventListener("click", () => {
  if (spawnRate > 1) spawnRate--;
  clearInterval(shapeInterval);
  shapeInterval = setInterval(() => {
    createRandomShape(Math.random() * app.renderer.width, 0);
  }, 1000 / spawnRate);
  document.getElementById("spawnRateValue").textContent = spawnRate;
});
document.getElementById("increaseGravity").addEventListener("click", () => {
  gravity++;
  document.getElementById("gravityValue").textContent = gravity;
});
document.getElementById("decreaseGravity").addEventListener("click", () => {
  if (gravity > 1) gravity--;
  document.getElementById("gravityValue").textContent = gravity;
});

// Добавление текстов для отображения информации
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
