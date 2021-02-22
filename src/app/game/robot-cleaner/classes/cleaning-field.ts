import { FireEvent } from './fire-event';

export class CleaningField {
	private matrix: number[][];

	constructor(
		protected fireEvent: FireEvent
	) {


	}

	public fillMatrix(size: number) {
		this.matrix = [];

		for (let i = 0; i < size; i++) {
			this.matrix.push(new Array(size).fill(0));
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
		this.fireEvent.fireEvent.next();
	}

	public buildWall(row: number, col: number) {
		if (this.matrix[row][col] === 0) {
			this.matrix[row][col] = -1
		}
		else {
			this.matrix[row][col] = 0
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
