
//globals
const BLOCK_WIDTH = 20;
const BLOCK_HEIGHT = 20;
const GAMEBOARD_COLS = 10;
const GAMEBOARD_ROWS = 20;
const SPAWN = 0;
const SPAWN_1 = 1;
const SPAWN_2 = 2;
const SPAWN_3 = 3;
const BLOCK_USED = true;
const BLOCK_EMPTY = false;

var GAME_SPEED = 500;
var FULL_ROW_QTY = 0;
var SCORE = 0;
var LINES = 0;
var LEVEL = 0;

var myInterval;

var current_piece;
var gameBoardArr = [];

// help w collision detection
var move_down = false;



	class Piece 
	{
		constructor(type) 
		{
			this.type = type;
			this.curr_state = SPAWN;
			
			// 2-D array of row, column pairs
			switch(type)
			{
				case 'J':
					this.coordinates = [[0, 3], [1, 3], [1, 4], [1, 5]];
					break;
				case 'I':
					this.coordinates = [[1, 3], [1, 4], [1, 5], [1, 6]];
					break;
				case 'S':
					this.coordinates = [[1, 3], [1, 4], [0, 4], [0, 5]];
					break;
				case 'T':
					this.coordinates = [[1, 3], [1, 4], [1, 5], [0, 4]];
					break;
				case 'O':
					this.coordinates = [[0, 4], [0, 5], [1, 4], [1, 5]];
					break;
				case 'L':
					this.coordinates = [[1, 3], [1, 4], [1, 5], [0, 5]];
					break;
				case 'Z':
					this.coordinates = [[0, 3], [0, 4], [1, 4], [1, 5]];
					break;
			}
		}
	}
	
	// update state after player rotates
	function update_curr_state(piece)
	{
		piece.curr_state++;
		if (piece.curr_state > SPAWN_3)
			piece.curr_state = SPAWN;	
	}

	function init()
	{
		// set viewPort
		var svgRootElement = document.getElementById("rt");
		svgRootElement.setAttribute("width", window.innerWidth - 20);
		svgRootElement.setAttribute("height", window.innerHeight - 20);

		// Add interval
		myInterval = setInterval(attemptMoveDown, GAME_SPEED);

		// Add keyboard listener
        window.addEventListener('keydown', attemptMove, true);
		
		gameBoardArr = initGameBoardArr();
		drawGameBoard();
	}
	
	// init game board rows and columns
	function initGameBoardArr()
	{
		var myGameBoardArr = new Array(GAMEBOARD_ROWS);
		for (var row = 0; row < myGameBoardArr.length; row++) 
		{
			myGameBoardArr[row] = new Array(GAMEBOARD_COLS);
			for (var column = 0; column < GAMEBOARD_COLS; column++)
			{
				myGameBoardArr[row][column] = BLOCK_EMPTY;
			}
		}
		return myGameBoardArr;
	}
	
	// player didn't make a valid move in time
	function attemptMoveDown()
	{
		attemptMove(new KeyboardEvent('keydown',{'keyCode':83}));
	}
	
	function attemptMoveLeft()
	{
		attemptMove(new KeyboardEvent('keydown',{'keyCode':65}));
	}
	
	function attemptMoveRight()
	{
		attemptMove(new KeyboardEvent('keydown',{'keyCode':68}));
	}
	
	function attemptRotate()
	{
		attemptMove(new KeyboardEvent('keydown',{'keyCode':87}));
	}
	
	function drawGameBoard()
	{
		for (row = 0; row < GAMEBOARD_ROWS; row++)
		{
			for (col = 0; col < GAMEBOARD_COLS; col++)
			{
				var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				rect.setAttribute('id', row + '_' + col);
				rect.setAttribute('x', col * BLOCK_HEIGHT);
				rect.setAttribute('y', row * BLOCK_WIDTH);
				rect.setAttribute('width', BLOCK_WIDTH);
				rect.setAttribute('height', BLOCK_HEIGHT);
				grp.appendChild(rect);
			}
		}
		
		// score box
		var scoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
		scoreText.setAttribute('id', 'score');
		scoreText.innerHTML = "SCORE: " + SCORE;
		scoreText.setAttribute('x', 12 * BLOCK_WIDTH);
		scoreText.setAttribute('y', 4 * BLOCK_WIDTH);
		scoreText.setAttribute('class', 'stats_labels');
		grp.appendChild(scoreText);
		
		// line box
		var lineText = document.createElementNS("http://www.w3.org/2000/svg", "text");
		lineText.setAttribute('id', 'lines');
		lineText.innerHTML = "LINES: " + 0;
		lineText.setAttribute('x', 12 * BLOCK_WIDTH);
		lineText.setAttribute('y', 6 * BLOCK_WIDTH);
		lineText.setAttribute('class', 'stats_labels');
		grp.appendChild(lineText);
		
		// left button
		leftButton.setAttribute('x', -3 * BLOCK_WIDTH);
		leftButton.setAttribute('y', (GAMEBOARD_ROWS + 2) * BLOCK_WIDTH);

		// right button
		rightButton.setAttribute('x', 3 * BLOCK_WIDTH);
		rightButton.setAttribute('y', (GAMEBOARD_ROWS + 2) * BLOCK_WIDTH);
		
		refreshGameBoard(true);
	}
	
	function refreshGameBoard(needNewPiece)
	{
		for (row = 0; row < GAMEBOARD_ROWS; row++)
		{
			for (col = 0; col < GAMEBOARD_COLS; col++)
			{
				var rect = document.getElementById(row + '_' + col);
		
				if (gameBoardArr[row][col] == BLOCK_EMPTY)
					rect.setAttribute('class', 'space_empty');
				else
					rect.setAttribute('class', 'space_filled');	
			}
		}
		
		if (needNewPiece)
			getNewPiece();
		else
			drawPiece('space_filled');
		
		updateStats();
		isGameOver();
		
	}
	
	function isGameOver()
	{
		for (col = 0; col < GAMEBOARD_COLS; col++)
		{
			if (gameBoardArr[0][col] == BLOCK_USED) 
			{
				clearInterval(myInterval);
			}
		}
	}
	
	function updateStats()
	{
		// update lines
		LINES = LINES + FULL_ROW_QTY;
		
		var lineText = document.getElementById('lines');
		lineText.innerHTML = "LINES: " + LINES;
		
		// update score
		switch (FULL_ROW_QTY) 
		{
			case 1:
				SCORE = SCORE + 40;
				break;
			case 2:
				SCORE = SCORE + 100;
				break;
			case 3:
				SCORE = SCORE + 300;
				break;
			case 4:
				SCORE = SCORE + 1200;
				break;	
		}
		
		var scoreText = document.getElementById('score');
		scoreText.innerHTML = "SCORE: " + SCORE;
		// reset
		FULL_ROW_QTY = 0;
		

	}
	
	function getNewPiece()
	{
		//R is reroll
		var random_pieces = ['J','I','S','T','O','L','Z','R'];
		
		var rand = Math.floor(Math.random() * Math.floor(8));
		// first piece in game or this piece same as last or reroll
		if (current_piece == undefined || random_pieces[rand] == current_piece.type || random_pieces[rand] == 'R')
		{
			rand = Math.floor(Math.random() * Math.floor(7));
		}
		
		current_piece = new Piece(random_pieces[rand]);
		drawPiece('space_filled');
	}
	function clearPiece()
	{
		drawPiece('space_empty');
	}
	
	function drawPiece(classAttr)
	{
		for (x = 0; x < 4; x++)
		{
			id = current_piece.coordinates[x][0] + '_' + current_piece.coordinates[x][1];
			elem = document.getElementById(id);		
			elem.setAttribute('class', classAttr);
		}	
	}

	function attemptMove(evt) 
	{
		// deep copy current piece object which will be used for collision detection
		let piece = JSON.parse(JSON.stringify(current_piece));
		
        switch (evt.keyCode) 
		{
			// 'A' move left
			case 65:
				// move piece left
				piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
				piece.coordinates[1][1] = piece.coordinates[1][1] - 1;
				piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
				piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
				
				move_down = false;
				break;
				
			// 'D' move right
			case 68:
				// move piece right
				piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
				piece.coordinates[1][1] = piece.coordinates[1][1] + 1;
				piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
				piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
				
				move_down = false;
				break;
				
			// 'W' rotate clockwise
			case 87:
				update_curr_state(piece);
					
				switch (piece.type)
				{
					case 'S':
						switch (piece.curr_state)
						{
							case SPAWN:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] - 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 2;
								break;
							case SPAWN_1:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 2;
								break;
							case SPAWN_2:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 2;
								break;
							case SPAWN_3:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] - 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 2;
								break;
						}
						break;

					case 'J':
						switch (piece.curr_state)
						{
							case SPAWN:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] - 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
								break;
							case SPAWN_1:
								piece.coordinates[0][1] = piece.coordinates[0][1] + 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] - 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
								break;
							case SPAWN_2:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] + 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
								break;
							case SPAWN_3:
								piece.coordinates[0][1] = piece.coordinates[0][1] - 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] + 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
								break;
						}
						break;

					case 'I':
						switch (piece.curr_state)
						{
							case SPAWN:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 2;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
								piece.coordinates[1][0] = piece.coordinates[1][0] - 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 2;
								break;
							case SPAWN_1:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 2;
								piece.coordinates[1][1] = piece.coordinates[1][1] + 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 2;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
								break;
							case SPAWN_2:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 2;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
								piece.coordinates[1][0] = piece.coordinates[1][0] + 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 2;
								break;
							case SPAWN_3:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 2;
								piece.coordinates[1][1] = piece.coordinates[1][1] - 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 2;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
								break;
						}
						break;

					case 'T':
						switch (piece.curr_state)
						{
							case SPAWN:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
								break;
							case SPAWN_1:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
								break;
							case SPAWN_2:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] - 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
								break;
							case SPAWN_3:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] - 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
								break;
						}
						break;

					case 'L':
						switch (piece.curr_state)
						{
							case SPAWN:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 2;
								break;
							case SPAWN_1:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 2;
								break;
							case SPAWN_2:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] + 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] - 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 2;
								break;
							case SPAWN_3:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
								piece.coordinates[0][1] = piece.coordinates[0][1] - 1;
								piece.coordinates[2][0] = piece.coordinates[2][0] - 1;
								piece.coordinates[2][1] = piece.coordinates[2][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 2;
								break;
						}
						break;

					case 'Z':
						switch (piece.curr_state)
						{
							case SPAWN:
								piece.coordinates[0][0] = piece.coordinates[0][0] - 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] - 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
								break;
							case SPAWN_1:
								piece.coordinates[0][1] = piece.coordinates[0][1] + 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] + 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] + 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
								break;
							case SPAWN_2:
								piece.coordinates[0][0] = piece.coordinates[0][0] + 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] + 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] - 1;
								break;
							case SPAWN_3:
								piece.coordinates[0][1] = piece.coordinates[0][1] - 2;
								piece.coordinates[1][0] = piece.coordinates[1][0] - 1;
								piece.coordinates[1][1] = piece.coordinates[1][1] - 1;
								piece.coordinates[3][0] = piece.coordinates[3][0] - 1;
								piece.coordinates[3][1] = piece.coordinates[3][1] + 1;
								break;
						}
						break;
				}
				break;

			// 'S' move down
			case 83:
				// move piece down
				piece.coordinates[0][0] = piece.coordinates[0][0] + 1;
				piece.coordinates[1][0] = piece.coordinates[1][0] + 1;
				piece.coordinates[2][0] = piece.coordinates[2][0] + 1;
				piece.coordinates[3][0] = piece.coordinates[3][0] + 1;
				
				move_down = true;
				break;
		}
		
		// check for collisions
		for (x = 0; x < 4; x++)
		{
			rowCoor = piece.coordinates[x][0];
			colCoor = piece.coordinates[x][1];
			
			// collision w wall
			if (colCoor < 0 || colCoor >= GAMEBOARD_COLS)
			{
				return;
			}
			else if (rowCoor >= GAMEBOARD_ROWS || gameBoardArr[rowCoor][colCoor] == BLOCK_USED)
			{
				// collision w lower piece or floor
				if (move_down == true)
				{
					move_down = false;
					for (i = 0; i < 4; i++)
					{
						gameBoardArr[current_piece.coordinates[i][0]][current_piece.coordinates[i][1]] = BLOCK_USED;				
					}
					///////////////refreshGameBoard(true);
					processFullRows();
					return;
				}
				// collision w side or above piece
				else
					return;
			}
		}
		
		// no collision, draw piece in new position
		clearPiece();
		current_piece = piece;
		refreshGameBoard(false);
	}
	
	function processFullRows()
	{	

		var tempRowNbr = gameBoardArr.length - 1;

		// init temp game board rows and columns
		var tempGameBoardArr = initGameBoardArr();

		//start at bottom of game board and iterate up
		for (var row = gameBoardArr.length - 1; row >=0; row--) 
		{
			var full_columns = 0;
			for (var column = 0; column < GAMEBOARD_COLS; column++)
			{
				if (gameBoardArr[row][column] == BLOCK_USED)
					full_columns++;	
			}
			
			// found a full row
			if (full_columns == GAMEBOARD_COLS)
			{
				FULL_ROW_QTY++;
			}
			else
			{
				tempGameBoardArr[tempRowNbr--] = gameBoardArr[row];
			}
		}

		gameBoardArr = tempGameBoardArr;
		refreshGameBoard(true);
	}

