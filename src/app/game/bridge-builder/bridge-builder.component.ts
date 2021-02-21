import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-bridge-builder',
	templateUrl: './bridge-builder.component.html',
	styleUrls: ['./bridge-builder.component.scss']
})
export class BridgeBuilderComponent implements OnInit {
	matrix: number[][];
	movesMatrix: number[][];

	DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];

	size = 20;

	gameStatus = '';
	counter = '';

	foundedIsland = [];

	timeoutHandler: any;

	hold = false;
	holdRif = false;

	constructor() {
		window.oncontextmenu = (event) => {
			return false;     // cancel default menu
		}
	}

	ngOnInit(): void {
		console.log('START')
		this.matrix = [];
		this.gameStatus = '';
		this.movesMatrix = [];
		this.fillMatrix();

	}

	fillMatrix() {
		this.matrix = [];

		for (let i = 0; i < this.size; i++) {
			this.matrix.push(new Array(this.size).fill(0));
		}

	}

	toggleEarth(row: number, col: number) {
		if (this.gameStatus !== 'Start') {
			if (this.matrix[row][col] <= 1) {
				this.matrix[row][col] = 1 - this.matrix[row][col]
			}
			else {
				this.matrix[row][col] = 1
			}
		}
	}

	toggleRif(row: number, col: number) {
		if (this.gameStatus !== 'Start') {
			if (this.matrix[row][col] < 1 || this.matrix[row][col] === 4) {
				this.matrix[row][col] = 3 - this.matrix[row][col]
			}
			else {
				this.matrix[row][col] = 3
			}
		}
	}

	startGame() {
		if (this.gameStatus !== 'Start') {

			for (let i = 0; i < this.size; i++) {
				this.movesMatrix.push(new Array(this.size).fill(-1));
			}

			const start = this.findPrimaryIsland(0, 0);

			this.markPrimaryIsland(this.matrix, start[0], start[1]);

			this.buildBridge(this.matrix)

			this.showBridge();

			const nextIsland = this.findPrimaryIsland(0, 0);

			this.buildAnotherBridge(nextIsland);

		}

		this.gameStatus = 'Start';
	}

	findPrimaryIsland(x, y) {
		let coords = [x, y]
		this.matrix.find((row, rIndex) => {
			return row.find((cell, cIndex) => {
				if (cell === 1) {
					coords = [rIndex, cIndex];
					return true;
				}
			})
		})

		return coords;
	}

	markPrimaryIsland(matrix, rowIndex, colIndex) {
		if (rowIndex < 0 || colIndex < 0) return;
		if (rowIndex >= matrix.length || colIndex >= matrix[0].length) return;
		if (matrix[rowIndex][colIndex] !== 1) return;

		matrix[rowIndex][colIndex] = 2;

		this.DIRS.forEach(dir => {
			this.markPrimaryIsland(this.matrix, rowIndex + dir[0], colIndex + dir[1])
		})

	}

	buildBridge(matrix) {
		const rows = matrix.length;
		const cols = matrix[0].length;

		const visited = [];

		for (let i = 0; i < rows; i++) visited.push(new Array(cols).fill(false));

		const queue = [];
		let maxPath = 0;

		matrix.forEach((row, rIndex) => {
			row.forEach((cell, cIndex) => {
				if (cell === 2) {
					queue.push([rIndex, cIndex])

					visited[rIndex][cIndex] = true;
				}
			})
		})

		while (queue.length) {
			const nums = queue.length;

			for (let di = 0; di < nums; di++) {
				const [curRow, curCol] = queue.shift();
				this.movesMatrix[curRow][curCol] = maxPath

				if (matrix[curRow][curCol] === 1) {
					this.foundedIsland = [curRow, curCol]
					this.counter = 'Counter: ' + (maxPath - 1)
					return maxPath - 1
				}

				// tslint:disable-next-line: prefer-for-of
				for (let i = 0; i < this.DIRS.length; i++) {
					let [r, c] = this.DIRS[i];
					r = curRow + r;
					c = curCol + c;

					if (r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c] === true || this.matrix[r][c] === 3) continue;

					visited[r][c] = true;

					queue.push([r, c]);
				}
			}
			maxPath++;
		}

		this.gameStatus = 'Error';
		return - 1;
	}

	buildAnotherBridge(newIsland) {

		this.markPrimaryIsland(this.matrix, newIsland[0], newIsland[1]);

		this.findPrimaryIsland(newIsland[0], newIsland[1]);

		this.buildBridge(this.matrix)


		if (this.matrix[this.foundedIsland[0]][this.foundedIsland[1]] === 1) {
			this.showBridge();

			const nextIsland = this.findPrimaryIsland(newIsland[0], newIsland[1]);
			this.markPrimaryIsland(this.matrix, nextIsland[0], nextIsland[1]);
			this.buildAnotherBridge(nextIsland)

		}



		console.log(this.matrix)
	}

	showBridge() {

		let curRow = this.foundedIsland[0]
		let curCol = this.foundedIsland[1]


		while (this.movesMatrix[curRow][curCol] !== 1) {

			// tslint:disable-next-line: prefer-for-of
			for (let i = 0; i < this.DIRS.length; i++) {

				let [r, c] = this.DIRS[i];
				r = curRow + r;
				c = curCol + c;

				if (r >= 0 && r < this.size && c >= 0 && c < this.size && (this.movesMatrix[curRow][curCol] - this.movesMatrix[r][c]) === 1) {
					curRow = r;
					curCol = c;
					this.matrix[curRow][curCol] = 4;
				};
			}
		}

	}


	mouseup() {
		this.hold = false;
		this.holdRif = false;
	}

	mousedown(event: MouseEvent, row: number, col: number) {
		// tslint:disable-next-line: deprecation
		if (event.which === 3) {
			this.holdRif = true;
			this.matrix[row][col] = 3
		}
		else {
			this.hold = true;
			this.matrix[row][col] = 1
		}
	}

	mouseenter(row: number, col: number) {
		if (this.hold) {
			// if (this.matrix[row][col] <= 1) {
			// 	this.matrix[row][col] = 1 - this.matrix[row][col]
			// }
			// else {
			this.matrix[row][col] = 1
			// }
		}
		if (this.holdRif) {
			this.matrix[row][col] = 3
		}
	}

}
