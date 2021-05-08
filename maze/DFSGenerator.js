
/*
http://www.mazeworks.com/mazegen/mazetut/index.htm

Depth First Search algorithm:

create a CellStack (LIFO) to hold a list of cell locations  
set TotalCells = number of cells in grid  
choose a cell at random and call it CurrentCell  
set VisitedCells = 1  
   
while VisitedCells < TotalCells 
	find all neighbors of CurrentCell with all walls intact   
		if one or more found 
			choose one at random  
			knock down the wall between it and CurrentCell  
			push CurrentCell location on the CellStack  
			make the new cell CurrentCell  
			add 1 to VisitedCells
		else 
			pop the most recent cell entry off the CellStack  
			make it CurrentCell
		endIf
endWhile  

*/




// contains stack of cell locations
var cellLocs = [];

// contains neighbors with all walls intact
var neighbors = [];

var totalCells;
var visitedCells = 1;
var currentCell;
var rowQty;
var columnQty;

var OUTSIDE_MAZE = -100;
var IS_INTACT = 0;

/*
below example of a cell bitfield with West, South, East and North walls knocked down
 walls
 WSEN
 1111

below example of a cell bitfield with West, South, East and North walls intact
 walls
 WSEN
 0000


below ex. of how a cell index maps to the cells[][] indexes with 8 rows * 8 columns

0 8  16 24 32 40 48 56
1 9  17 25 33 41 49 57
2 10 18 26 34 42 50 58
3 11 19 27 35 43 51 59
4 12 20 28 36 44 52 60
5 13 21 29 37 45 53 61
6 14 22 30 38 46 54 62
7 15 23 31 39 47 55 63
*/

//////////////globals


// array that contains all of the cells that make up the maze
var cells;

// cell wall bit masks
var WEST_WALL = 0x08;
var SOUTH_WALL = 0x04;
var EAST_WALL = 0x02;
var NORTH_WALL = 0x01;
var ALL_WALLS = 0x0F;

// cell values
var CLOSED_CELL = 0;
var NORTH_CELL = 1;
var EAST_CELL = 2;
var EAST_NORTH_CELL = 3;
var SOUTH_CELL = 4;
var SOUTH_NORTH_CELL = 5;
var SOUTH_EAST_CELL = 6;
var SOUTH_EAST_NORTH_CELL = 7;
var WEST_CELL = 8;
var WEST_NORTH_CELL = 9;
var WEST_EAST_CELL = 10;
var WEST_EAST_NORTH_CELL = 11;
var WEST_SOUTH_CELL = 12;
var WEST_SOUTH_NORTH_CELL = 13;
var WEST_SOUTH_EAST_CELL = 14;
var WEST_SOUTH_EAST_NORTH_CELL = 15;




// set size of the maze in rows and columns
function setMazeSize(rq, cq){

	// set based on window size
	if (rq == 0 || cq == 0)
	{
		columnQty = Math.floor(window.innerWidth / cellImgWidth) - 1;
		rowQty = Math.floor(window.innerHeight / cellImgHeight) - 1;
	}
	// use values passed in
	else
	{
		columnQty = cq;
		rowQty = rq;
	}
	
	//alert("window width is: " + window.innerWidth + " height is " + window.innerHeight + " cols is " + columnQty + " rows is " + rowQty);
	//1366 643
	
	cells = new Array(rowQty);
	
	for (var i = 0; i < rowQty; i++) 
	{
		cells[i] = new Array(columnQty);
	}


	totalCells = rowQty * columnQty;
}


function generate(){

	getRandomCell();
	
	while (visitedCells < totalCells)
	{
		//clear neighbors array for each iteration
		neighbors.splice(0,neighbors.length)
		
		//find all neighbors of CurrentCell with all walls intact
		findNeighbors();


		//if one or more found
		if(neighbors.length > 0){
			// choose one at random
			var rdmIndex = Math.floor(Math.random() * neighbors.length);  ///////random int 0...length - 1

			var neighborCell = neighbors[rdmIndex];
			
			// knock down the wall between neighbor and CurrentCell 
			knockDownCommonWall(neighborCell);

			// push CurrentCell location on the CellStack
			cellLocs.push(currentCell);
			
			// make the neighbor cell CurrentCell
			currentCell = neighborCell;
			
			// add 1 to VisitedCells
			visitedCells++;
		
		}		
		else
			//pop the most recent cell entry off the CellStack make it CurrentCell
			currentCell = cellLocs.pop();	
	}


	
	//////////force cell to WSEN
	////forceCell(26);

	
	
	//////////force cell to WSEN
	////forceCell(73);
}

//force cell to WSEN 'penrose cell'
function forceCell(cellToForce){


	currentCell = cellToForce;
	
	//get array indexes of currentCell
	var currentRowIndex = getCellRow(currentCell);
	var currentColumnIndex = getCellColumn(currentCell);
	
	//find neighbor to North
	var northNeighbor = getCellLoc(currentRowIndex - 1, currentColumnIndex);

	//find neighbor to South
	var southNeighbor = getCellLoc(currentRowIndex + 1, currentColumnIndex);	

	//find neighbor to East
	var eastNeighbor = getCellLoc(currentRowIndex, currentColumnIndex + 1);

	//find neighbor to West
	var westNeighbor = getCellLoc(currentRowIndex, currentColumnIndex - 1);	

	// check that neighbors are inside maze
	if (northNeighbor != OUTSIDE_MAZE && southNeighbor != OUTSIDE_MAZE && eastNeighbor != OUTSIDE_MAZE && westNeighbor != OUTSIDE_MAZE)
	{
		knockDownCommonWall(northNeighbor);
		knockDownCommonWall(southNeighbor);
		knockDownCommonWall(eastNeighbor);
		knockDownCommonWall(westNeighbor);	
	}
	
}




function getTotalCells(){

	return totalCells;
}

function getRandomCell(){

	currentCell = Math.floor(Math.random() * totalCells);  ///////random int 0...totalCells - 1
	
}

// find cell value containing number of walls in cell based on cell location
function getCellValue(cellLoc){

		//find cell in array cells [][]
		var row = getCellRow(cellLoc);
		var column = getCellColumn(cellLoc);

	return cells[row][column];
}

// find column index of cell in cells[][column] 
function getCellColumn(cell){

	if(cell >= rowQty*columnQty)
		return OUTSIDE_MAZE;
	else if(cell < rowQty)
		return 0;
	else{
		return ( Math.floor(cell / rowQty) );		
		}
}

// find row index of cell in cells[row][] 
function getCellRow(cell){

	if(cell >= rowQty*columnQty)
		return OUTSIDE_MAZE;
	else if(cell < rowQty)
		return cell;
	else{
		return (cell % rowQty);		
		}
}

//find cell location based on cells[row][column]
function getCellLoc(R, C){

	if(R < 0 || R >= rowQty || C < 0 || C >= columnQty )
		return OUTSIDE_MAZE;
	
	return rowQty*C + R;
}

// find all neighbors of CurrentCell with all walls intact
function findNeighbors(){
	
	//get array indexes of currentCell
	var currentRowIndex = getCellRow(currentCell);
	var currentColumnIndex = getCellColumn(currentCell);
	
	//assume neighbor cells have all 4 walls intact
	var northNeighbor = IS_INTACT;
	var southNeighbor = IS_INTACT;
	var eastNeighbor = IS_INTACT;
	var westNeighbor = IS_INTACT;
	
	//non-zero value means 1 or more walls have been knocked down for a cell
	var result = IS_INTACT;
	
	//find neighbor to North
	northNeighbor = getCellLoc(currentRowIndex - 1, currentColumnIndex);
		
	// find if all walls are intact for North neighbor
	if(northNeighbor != OUTSIDE_MAZE){
	result = cells[currentRowIndex - 1][currentColumnIndex] & ALL_WALLS;
		if(result == IS_INTACT)
			neighbors.push(northNeighbor);
	}
	
	//find neighbor to South
	southNeighbor = getCellLoc(currentRowIndex + 1, currentColumnIndex);	

	// find if all walls are intact for South neighbor
	if(southNeighbor != OUTSIDE_MAZE){
	result = cells[currentRowIndex + 1][currentColumnIndex] & ALL_WALLS;
		if(result == IS_INTACT)
			neighbors.push(southNeighbor);
	}
		
	//find neighbor to East
	eastNeighbor = getCellLoc(currentRowIndex, currentColumnIndex + 1);

	// find if all walls are intact for East neighbor
	if(eastNeighbor != OUTSIDE_MAZE){
	result = cells[currentRowIndex][currentColumnIndex + 1] & ALL_WALLS;
		if(result == IS_INTACT)
			neighbors.push(eastNeighbor);			
	}
		
	//find neighbor to West
	westNeighbor = getCellLoc(currentRowIndex, currentColumnIndex - 1);

	// find if all walls are intact for West neighbor
	if(westNeighbor != OUTSIDE_MAZE){
	result = cells[currentRowIndex][currentColumnIndex - 1] & ALL_WALLS;
		if(result == IS_INTACT)
			neighbors.push(westNeighbor);			
	}	
}

// knock down wall between current cell and neighbor cell
function knockDownCommonWall(neighbor){
	
	var neighborRow = getCellRow(neighbor);
	var neighborColumn = getCellColumn(neighbor);
	var currentCellRow = getCellRow(currentCell);
	var currentCellColumn = getCellColumn(currentCell);
	
	//neighbor to East or West
	if(neighborRow == currentCellRow){
		//neighbor to East
		if(neighborColumn > currentCellColumn){
			//knock down neighbor's West wall
			cells[neighborRow][neighborColumn] = cells[neighborRow][neighborColumn] | WEST_WALL;
			//knock down currentCell's East wall
			cells[currentCellRow][currentCellColumn] = cells[currentCellRow][currentCellColumn] | EAST_WALL;				
		}		
		//neighbor is to West
		else{
			//knock down neighbor's East wall
			cells[neighborRow][neighborColumn] = cells[neighborRow][neighborColumn] | EAST_WALL;			
			//knock down currentCell's West wall
			cells[currentCellRow][currentCellColumn] = cells[currentCellRow][currentCellColumn] | WEST_WALL;		
		}	
	}
	//neighbor to North or South
	else{
		//neighbor to South
		if(neighborRow > currentCellRow){
			//knock down neighbor's North wall
			cells[neighborRow][neighborColumn] = cells[neighborRow][neighborColumn] | NORTH_WALL;			
			//knock down currentCell's South wall		
			cells[currentCellRow][currentCellColumn] = cells[currentCellRow][currentCellColumn] | SOUTH_WALL;		
		
		}
		
		//neighbor is to North
		else{
			//knock down neighbor's South wall
			cells[neighborRow][neighborColumn] = cells[neighborRow][neighborColumn] | SOUTH_WALL;			
			//knock down currentCell's North wall			
			cells[currentCellRow][currentCellColumn] = cells[currentCellRow][currentCellColumn] | NORTH_WALL;		
		}	
	}
}

function getRowQty(){

	return rowQty;
}

function getColumnQty(){

	return columnQty;
}
