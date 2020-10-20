import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
	title = 'minesweeper';

	visualBoard = [];

	DIRS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];

	showStatus: string;

	rows = 5;
	columns = 5;
	mines = 5;

	maxMines: number;

	generatedBoard = [];

	opened = 0;

	minesMap = new Map();

	firstClick: boolean;

	eBallov = 0;

	constructor(
	) {
		window.oncontextmenu = (event) => {
			return false;     // cancel default menu
		}
	}

	ngOnInit(): void {
		this.initGame();
	}

	initGame() {
		this.showStatus = '';
		this.minesMap.clear();
		console.clear();
		this.generatedBoard = [];
		this.opened = 0;
		this.eBallov = 0;
		this.generateBoard();

		this.firstClick = true;

		this.visualBoard = this.generatedBoard.map(row => new Array(row.length).fill('E'));
	}

	updateBoard(click) {

		if (this.firstClick) {
			this.newSposobGenerationMines(click);
		}

		this.checkMove(click);

	}

	checkMove(click) {
		if (!this.showStatus && this.visualBoard[click[0]][click[1]] === 'E') {
			const tempBoard = this.generatedBoard.map(row => new Array(row.length).fill(0));

			tempBoard.forEach((row, rindex) => {
				row.forEach((cell, cindex) => {
					if (this.generatedBoard[rindex][cindex] === 'M') {
						tempBoard[rindex][cindex] = -2;

						this.DIRS.forEach(DIR => {
							this.updateCell(tempBoard, rindex + DIR[0], cindex + DIR[1]);
						});
					}
				});
			});

			if (this.generatedBoard[click[0]][click[1]] === 'M') {
				this.showStatus = 'GAME OVER!';
				this.visualBoard[click[0]][click[1]] = 'X';

				this.minesMap.forEach((val, key) => {
					const cIndex = Math.trunc(key / this.columns)
					const rIndex = key % this.columns;
					this.visualBoard[cIndex][rIndex] = 'X';
				})

				return this.generatedBoard;
			}

			this.firstClick = false;

			if (this.visualBoard[click[0]][click[1]] !== 'B') {
				this.tentacle(this.visualBoard, tempBoard, click[0], click[1]);
			}

			this.checkForWin();
		}

	}

	checkForWin() {
		let eCounter = 0;

		// tslint:disable-next-line: prefer-for-of
		for (let r = 0; r < this.visualBoard.length; r++) {

			// tslint:disable-next-line: prefer-for-of
			for (let c = 0; c < this.visualBoard[0].length; c++) {

				if (this.visualBoard[r][c] === 'E' || this.visualBoard[r][c] === 'F') {
					eCounter++
				}
			}
		}

		if (eCounter === this.minesMap.size) {
			this.showStatus = 'You Win!'
		}


	}

	updateCell(tempMap, rindex, cindex): void {
		if (rindex < 0 || cindex < 0) { return; }
		if (rindex >= tempMap.length || cindex >= tempMap[0].length) { return; }

		let cell = tempMap[rindex][cindex];


		if (cell >= 0) {
			cell++;
		}

		tempMap[rindex][cindex] = cell;
	}

	tentacle(board, tempMap, rindex, cindex): void {
		if (rindex < 0 || cindex < 0) { return; }
		if (rindex >= board.length || cindex >= board[0].length) { return; }



		if (tempMap[rindex][cindex] === 0) {

			tempMap[rindex][cindex] = -1;
			board[rindex][cindex] = 'B';
			this.opened++;

			this.DIRS.forEach(DIR => {
				this.tentacle(board, tempMap, rindex + DIR[0], cindex + DIR[1]);
			});
		}

		if (tempMap[rindex][cindex] > 0) {
			board[rindex][cindex] = tempMap[rindex][cindex] + '';
			tempMap[rindex][cindex] = -1;
			this.opened++;

		}
	}

	generateBoard() {
		this.showStatus = '';

		let rindex = 0;
		let cindex = 0;

		while (rindex < this.rows) {
			const tempArr = [];
			cindex = 0;

			while (cindex < this.columns) {
				tempArr.push('E')
				cindex++;
			}
			this.generatedBoard.push(tempArr)
			rindex++;
		}

		this.maxMines = this.rows * this.columns - 1

		if (this.mines > this.maxMines) {
			this.mines = this.maxMines;
		}
		else if (this.mines < 1) {
			this.mines = 1;
		}
	}

	newSposobGenerationMines(click) {
		const tempArr = []

		for (let i = 0; i < this.columns * this.rows; i++) {
			if (i !== click[0] * this.rows + click[1]) {
				tempArr.push(i);
			}
		}

		let max = tempArr.length - 1;

		for (let i = 0; i < this.mines; i++) {
			const randomCell = Math.trunc((Math.random() * max));
			const random = tempArr[randomCell]

			this.minesMap.set(random, 'M')

			const temp = tempArr[randomCell];

			tempArr[randomCell] = tempArr[max]
			tempArr[max] = temp;
			max--;
		}

		this.fillMines();
	}

	fillMines() {
		this.minesMap.forEach((val, key) => {
			const cIndex = Math.trunc(key / this.columns)
			const rIndex = key % this.columns;

			this.generatedBoard[cIndex][rIndex] = val;
		})
	}

	markCell(click) {
		if (!this.showStatus) {
			if (this.visualBoard[click[0]][click[1]] === 'F' || this.visualBoard[click[0]][click[1]] === 'E') {
				if (this.visualBoard[click[0]][click[1]] !== 'F') {
					this.visualBoard[click[0]][click[1]] = 'F'
				}
				else {
					this.visualBoard[click[0]][click[1]] = 'E'
				}
			}
		}
	}

	resetGame() {
		this.initGame();
	}
}
