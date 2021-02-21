import { Component, OnInit, ApplicationRef } from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';

@Component({
	selector: 'app-robot-cleaner',
	templateUrl: './robot-cleaner.component.html',
	styleUrls: ['./robot-cleaner.component.scss']
})
export class RobotCleanerComponent implements OnInit {
	size = 10;

	timerrr = new Subscription();

	public cleaningField: CleaningField
	public robotCleaner: RobotCleaner
	public robotController: RobotController

	constructor(
		protected appRef: ApplicationRef
	) {
		window.oncontextmenu = (event) => {
			return false;     // cancel default menu
		}

		document.addEventListener('keydown', event => {
			const key = (event as KeyboardEvent).key; // const {key} = event; in ES6+ 
			if (key === 'ArrowRight') {
				this.robotCleaner.turnRight();
			}
			else if (key === 'ArrowLeft') {
				this.robotCleaner.turnLeft();
			}
			else if (key === 'ArrowUp') {
				this.robotCleaner.forward();
			}
		});

	}

	ngOnInit(): void {
		this.restart();
	}

	restart() {
		this.cleaningField = new CleaningField;
		this.cleaningField.fillMatrix(this.size);
		this.timerrr.unsubscribe();
		this.robotCleaner = new RobotCleaner(this.cleaningField);
		this.robotController = new RobotController(this.cleaningField, this.robotCleaner, this.appRef);
		this.robotController.clearField();
	}

	startClean() {
		this.robotController.startCleaning();
	}

	rcChangePosition(row: number, col: number) {
		this.robotCleaner.rcChangePosition(row, col)
	}

	buildWall(row: number, col: number) {
		this.cleaningField.buildWall(row, col);
	}
}

export class RobotController {
	field = new Map();

	totalMoves = 0;

	timerSubs: Subscription

	constructor(
		private cleaningField: CleaningField,
		private robotCleaner: RobotCleaner,
		public appRef: ApplicationRef
	) { }

	startCleaning() {
		this.totalMoves = 0;
		this.cleaningField.updateCell(this.robotCleaner.rcPosition[0], this.robotCleaner.rcPosition[1], 1)

		this.cleanCell(0, 0);
	}

	cleanCell(row, col) {
		// if (typeof this.timerSubs === 'undefined') {

		const curDir = this.robotCleaner.getDirection();
		const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];


		this.setMapValue(row, col, 1)

		for (let turns = 0; turns < DIRS.length; turns++) {


			if (turns === 2) {
				this.robotCleaner.turnRight();
				this.appRef.tick();
				continue;
			}

			const dir = (curDir + turns) % DIRS.length;

			const raznica = DIRS[dir]
			row += raznica[0]
			col += raznica[1]

			if (!this.isVisited(row, col) && this.robotCleaner.forward()) {

				console.log(row, col)
				this.setMapValue(row, col, 1)

				this.appRef.tick();

				this.cleanCell(row, col);
				this.robotCleaner.forward()
				this.robotCleaner.turnLeft();
				row -= raznica[0]
				col -= raznica[1]
				this.appRef.tick();
			}
			else {
				this.setMapValue(row, col, -1);
				row -= raznica[0]
				col -= raznica[1]

				this.robotCleaner.turnRight();
				this.appRef.tick();
			}

		}

		this.robotCleaner.turnLeft();
		this.robotCleaner.turnLeft();
		this.appRef.tick();
		// }
	}

	isVisited(row: number, col: number) {
		return this.field.has(row) && this.field.get(row).has(col)
	}

	setMapValue(row: number, col: number, value: number) {
		if (!this.field.has(row)) {
			this.field.set(row, new Map())
		}

		this.field.get(row).set(col, value)
	}

	clearField() {
		this.field.clear();
	}

	// getMoves(row, col) {
	// 	return this.cleaningField.getMovesFromMap(row, col);
	// }

}

export class RobotCleaner {
	DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

	rcDirectionNum = 0;

	canForward: boolean;

	rcPosition = [0, 0];

	movesSubj = new Subject<number[]>();
	moves = 0;

	constructor(
		private cleaningField: CleaningField
	) {
		this.movesSubj.subscribe(rcPos => {
			this.moves++;

			// this.cleaningField.updateMovesMap(rcPos[0], rcPos[1], this.moves)
		})
	}

	public rcChangePosition(row: number, col: number) {
		this.cleaningField.updateCell(this.rcPosition[0], this.rcPosition[1], 0)

		this.cleaningField.updateCell(row, col, -5)
		this.rcPosition = [row, col]
	}

	public forward(): boolean {
		if (this.checkCanForward()) {
			const rcRow = this.rcPosition[0];
			const rcCol = this.rcPosition[1];
			const dirRow = this.DIRS[this.rcDirectionNum][0]
			const dirCol = this.DIRS[this.rcDirectionNum][1]

			this.cleaningField.updateCell(rcRow, rcCol, 0);
			this.cleaningField.updateCell(rcRow + dirRow, rcCol + dirCol, -5);

			this.cleaningField.updateCell(this.rcPosition[0], this.rcPosition[1], this.moves)

			this.rcPosition = [rcRow + dirRow, rcCol + dirCol];
			this.movesSubj.next(this.rcPosition);
			return true
		}
		return false
	}

	public turnRight() {
		if (this.rcDirectionNum >= 3) {
			this.rcDirectionNum = 0;
		}
		else {
			this.rcDirectionNum++;
		}
	}

	public turnLeft() {
		if (this.rcDirectionNum === 0) {
			this.rcDirectionNum = 3;
		}
		else {
			this.rcDirectionNum--;
		}
	}

	private checkCanForward() {
		const rcRow = this.rcPosition[0];
		const rcCol = this.rcPosition[1];

		const dirRow = this.DIRS[this.rcDirectionNum][0]
		const dirCol = this.DIRS[this.rcDirectionNum][1]


		return this.cleaningField.isCellAvailable(rcRow + dirRow, rcCol + dirCol);
	}

	public getDirection() {
		return this.rcDirectionNum;
	}
}

export class CleaningField {
	private matrix: number[][];
	private matrixSize = 0;
	private movesMap = new Map();

	constructor() {

	}

	public fillMatrix(size: number) {
		this.matrix = [];

		for (let i = 0; i < size; i++) {
			this.matrix.push(new Array(size).fill(0));
			this.matrixSize += size;
		}

		this.matrix[0][0] = -5;
	}

	public isCellAvailable(row: number, cell: number) {
		if (typeof this.matrix[row] !== 'undefined' && typeof this.matrix[row][cell] !== 'undefined') {
			return this.matrix[row][cell] !== -1;
		}

		return false;
	}

	public updateCell(row: number, cell: number, num: number) {
		this.matrix[row][cell] = num;
	}

	public buildWall(row: number, col: number) {
		if (this.matrix[row][col] === 0) {
			this.matrix[row][col] = -1
			this.matrixSize--;
		}
		else {
			this.matrix[row][col] = 0
			this.matrixSize++;
		}
	}

	public getMatrix() {
		return this.matrix
	}

	// public updateMovesMap(row: number, col: number, num: number) {
	// 	this.movesMap.set([row, col], num)
	// }

	// public getMovesFromMap(row, col) {
	// 	if (this.movesMap.has([row, col])) {
	// 		return this.movesMap.get([row, col]);
	// 	}
	// 	// return this.movesMap
	// }
}
