





// render the maze
function renderMaze() {
		
	ctx = document.getElementById("canvas").getContext('2d');

		
		var totalCells = getTotalCells();
		var cellRow = 0;
		var cellColumn = 0;
		var cellValue = 0;
		var imgScale = 0.5;
		
		// scale images
		cellImgWidth = cellImgWidth * imgScale;
		cellImgHeight = cellImgHeight * imgScale;
				
		for(var x = 0; x < totalCells; x++){

			//get cell value containing number of knocked down walls in cell
			cellValue = getCellValue(x);
			

	
			//determine where to draw cell image
			cellRow = getCellRow(x);
			cellColumn = getCellColumn(x);
		
			if (imgArr[cellValue] != null){
				
				//drawImage(image, x, y, width, height)

				ctx.drawImage(imgArr[cellValue],cellImgWidth * cellColumn, cellImgHeight * cellRow, cellImgWidth, cellImgHeight);
			}
		}   	
}



