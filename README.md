# Falling Shapes with PIXI.js

This project demonstrates the creation of falling shapes using the PIXI.js library. Users can interact with the application by creating shapes with clicks on the canvas and controlling the spawn rate and gravity.

## Project Structure

- `index.html`: The main HTML page containing the controls and the canvas for displaying shapes.
- `src/styles.css`: CSS styles for page layout.
- `src/app.js`: The entry point of the application, initializing the model, view, and controller.
- `src/model.js`: The model managing the application's state (gravity, spawn rate, list of shapes).
- `src/view.js`: The view responsible for rendering shapes and handling user events.
- `src/controller.js`: The controller linking the model and view, handling events and updating the state.
- `src/shapeSpawner.js`: A class for creating and managing shapes.

## Installation and Running

1. Clone the repository:

   ```sh
   git clone <repository URL>
   ```

2. Navigate to the project directory:

   ```sh
   cd Digocode
   ```

3. Open the `index.html` file in a browser.

## Usage

- Click inside the canvas area to create a shape.
- Use the control buttons to increase/decrease the spawn rate and gravity.

## Dependencies

- [PIXI.js](https://pixijs.com/): A library for creating graphics and animations.
