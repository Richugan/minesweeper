import { Subject } from 'rxjs';
import { CleaningField } from './cleaning-field';

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