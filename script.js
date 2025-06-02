document.addEventListener("DOMContentLoaded", function () {
  const generateButton = document.getElementById("generate-maze");
  const solveButton = document.getElementById("solve-maze");

  generateButton.addEventListener("click", generateMaze);
  solveButton.addEventListener("click", solveMaze);

  document.addEventListener("keydown", handleKeyPress); // Add event listener for arrow key presses
});

let mazeCells; // Declare mazeCells globally to access it from different functions
let numRows, numCols;
let startCellIndex, endCellIndex;
let steps = 0; // Keep track of the steps taken by the player

let initialMaze; // Variable to store the initial maze configuration
let initialStartCellIndex; // Variable to store the initial index of the start cell
let initialEndCellIndex; // Variable to store the initial index of the end cell

function generateMaze() {
  const mazeContainer = document.getElementById("maze-container");
  mazeContainer.innerHTML = ""; // Clear previous maze

  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  numRows = maze.length;
  numCols = maze[0].length;

  const availablePathSpaces = []; // Array to store available path spaces

  // Loop through maze to find available path spaces
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (maze[i][j] === 0) {
        availablePathSpaces.push({ row: i, col: j });
      }
    }
  }

  // Randomly select start and end points from available path spaces
  let randomStartIndex, randomEndIndex;
  do {
    randomStartIndex = Math.floor(Math.random() * availablePathSpaces.length);
    randomEndIndex = Math.floor(Math.random() * availablePathSpaces.length);
  } while (
    randomStartIndex === randomEndIndex // Ensure start and end are different
  );

  // Calculate the index of start cell in the mazeCells array
  const startCellRow = availablePathSpaces[randomStartIndex].row;
  const startCellCol = availablePathSpaces[randomStartIndex].col;
  startCellIndex = startCellRow * numCols + startCellCol;

  // Calculate the index of end cell in the mazeCells array
  const endCellRow = availablePathSpaces[randomEndIndex].row;
  const endCellCol = availablePathSpaces[randomEndIndex].col;
  endCellIndex = endCellRow * numCols + endCellCol;

  // Store the initial maze configuration and start/end cell indices
  initialMaze = maze.map((row) => [...row]);
  initialStartCellIndex = startCellIndex;
  initialEndCellIndex = endCellIndex;

  // Loop through maze array and create HTML elements
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (maze[i][j] === 1) {
        cell.classList.add("wall");
      } else {
        cell.classList.add("path");
      }
      mazeContainer.appendChild(cell);
    }
  }

  // Set start and end points directly using style attribute
  const startCell = mazeContainer.children[startCellIndex];
  startCell.style.backgroundColor = "red";

  const endCell = mazeContainer.children[endCellIndex];
  endCell.style.backgroundColor = "green";

  mazeCells = mazeContainer.getElementsByClassName("cell"); // Assign mazeCells
}

function resetMaze() {
  const mazeContainer = document.getElementById("maze-container");
  mazeContainer.innerHTML = ""; // Clear previous maze
  steps = 0; // Reset steps counter
  // Restore the initial maze configuration and start/end cell indices
  const maze = initialMaze.map((row) => [...row]);
  startCellIndex = initialStartCellIndex;
  endCellIndex = initialEndCellIndex;

  // Loop through maze array and create HTML elements
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (maze[i][j] === 1) {
        cell.classList.add("wall");
      } else {
        cell.classList.add("path");
      }
      mazeContainer.appendChild(cell);
    }
  }

  // Set start and end points directly using style attribute
  const startCell = mazeContainer.children[startCellIndex];
  startCell.style.backgroundColor = "red";

  const endCell = mazeContainer.children[endCellIndex];
  endCell.style.backgroundColor = "green";

  mazeCells = mazeContainer.getElementsByClassName("cell"); // Assign mazeCells
}

function solveMaze() {
  // Call the A* algorithm to find the optimal solution
  // Define heuristic function (Manhattan distance)
  function heuristic(index) {
    const row1 = Math.floor(index / numCols);
    const col1 = index % numCols;
    const row2 = Math.floor(endCellIndex / numCols);
    const col2 = endCellIndex % numCols;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
  }

  // Define directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Initialize open and closed sets
  const openSet = new Set([startCellIndex]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  [...mazeCells].forEach((cell, index) => {
    gScore[index] = Infinity;
    fScore[index] = Infinity;
  });
  gScore[startCellIndex] = 0;
  fScore[startCellIndex] = heuristic(startCellIndex);

  // A* algorithm
  while (openSet.size > 0) {
    const current = [...openSet].reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );
    if (current === endCellIndex) {
      reconstructPath(cameFrom, current);
      return;
    }

    openSet.delete(current);

    for (const [dx, dy] of directions) {
      const newRow = Math.floor(current / numCols) + dx;
      const newCol = (current % numCols) + dy;
      const newIndex = newRow * numCols + newCol;

      if (
        newRow >= 0 &&
        newRow < numRows &&
        newCol >= 0 &&
        newCol < numCols &&
        !mazeCells[newIndex].classList.contains("wall")
      ) {
        const tentativeGScore = gScore[current] + 1; // Assuming uniform cost
        if (tentativeGScore < gScore[newIndex]) {
          cameFrom[newIndex] = current;
          gScore[newIndex] = tentativeGScore;
          fScore[newIndex] = gScore[newIndex] + heuristic(newIndex);
          openSet.add(newIndex);
        }
      }
    }
  }

  // If no path found
  alert("No path found.");

  // Function to reconstruct the path
  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current] !== undefined) {
      current = cameFrom[current];
      path.push(current);
    }
    // Highlight the path
    for (const index of path) {
      if (index !== startCellIndex && index !== endCellIndex) {
        mazeCells[index].classList.add("path");
        mazeCells[index].style.backgroundColor = "orange";
      }
    }

    // Display message for shortest path
    alert("The shortest path is " + (path.length - 1) + " steps.");
  }
}

function handleKeyPress(event) {
  const key = event.key;

  if (
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    key === "ArrowLeft" ||
    key === "ArrowRight"
  ) {
    const direction = key.slice(5).toLowerCase(); // Extract direction from key

    // Calculate new position based on direction
    let newRow, newCol;
    switch (direction) {
      case "up":
        newRow = Math.floor(startCellIndex / numCols) - 1;
        newCol = startCellIndex % numCols;
        break;
      case "down":
        newRow = Math.floor(startCellIndex / numCols) + 1;
        newCol = startCellIndex % numCols;
        break;
      case "left":
        newRow = Math.floor(startCellIndex / numCols);
        newCol = (startCellIndex % numCols) - 1;
        break;
      case "right":
        newRow = Math.floor(startCellIndex / numCols);
        newCol = (startCellIndex % numCols) + 1;
        break;
      default:
        break;
    }

    // Check if new position is valid and move if so
    if (isValidMove(newRow, newCol)) {
      movePlayer(newRow, newCol);
    }
  }
}

function isValidMove(row, col) {
  // Check if the new position is within the maze bounds and not a wall
  return (
    row >= 0 &&
    row < numRows &&
    col >= 0 &&
    col < numCols &&
    !mazeCells[row * numCols + col].classList.contains("wall")
  );
}

function movePlayer(row, col) {
  // Update cell color to yellow and reset previous cell color to white
  mazeCells[startCellIndex].style.backgroundColor = "white";
  startCellIndex = row * numCols + col;
  mazeCells[startCellIndex].style.backgroundColor = "yellow";

  steps++; // Increment steps counter

  // Check if player reached the end of the maze
  if (startCellIndex === endCellIndex) {
    alert("You solved the maze in " + steps + " steps.");
    resetMaze(); // Reset the maze
  }
}
