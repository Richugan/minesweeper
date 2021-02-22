import { Subscription } from 'rxjs';
import { RobotCleaner } from './robot-cleaner';

export class RobotController {
	field = new Map();

	totalMoves = 0;

	timerSubs: Subscription

	constructor(
		private robotCleaner: RobotCleaner
	) { }

	startCleaning() {
		this.totalMoves = 0;
		this.cleanCell(0, 0);
	}

	cleanCell(row: number, col: number) {
		// if (typeof this.timerSubs === 'undefined') {

		const curDir = this.robotCleaner.getDirection();
		const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];


		this.setMapValue(row, col, 1)

		for (let turns = 0; turns < DIRS.length; turns++) {


			if (turns === 2) {
				this.robotCleaner.turnRight();
				continue;
			}

			const dir = (curDir + turns) % DIRS.length;

			const raznica = DIRS[dir]
			row += raznica[0]
			col += raznica[1]

			if (!this.isVisited(row, col) && this.robotCleaner.forward()) {
				this.setMapValue(row, col, 1)

				this.cleanCell(row, col);
				this.robotCleaner.forward()
				this.robotCleaner.turnLeft();
				row -= raznica[0]
				col -= raznica[1]
			}
			else {
				this.setMapValue(row, col, -1);
				row -= raznica[0]
				col -= raznica[1]

				this.robotCleaner.turnRight();
			}

		}

		this.robotCleaner.turnLeft();
		this.robotCleaner.turnLeft();
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
