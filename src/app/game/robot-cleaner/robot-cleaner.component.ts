import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CleaningField } from './classes/cleaning-field';
import { RobotCleaner } from './classes/robot-cleaner';
import { RobotController } from './classes/robot-controller';
import { FireEvent } from './classes/fire-event';

@Component({
	selector: 'app-robot-cleaner',
	templateUrl: './robot-cleaner.component.html',
	styleUrls: ['./robot-cleaner.component.scss']
})
export class RobotCleanerComponent implements OnInit {
	size = 10;

	timerrr = new Subscription();

	oldRcPos: number[];

	public cleaningField: CleaningField
	public robotCleaner: RobotCleaner
	public robotController: RobotController
	public fireEvent: FireEvent

	constructor(
		protected appRef: ApplicationRef
	) {
		window.oncontextmenu = () => {
			return false;     // cancel default menu
		}

		document.addEventListener('keydown', event => {
			const key = (event as KeyboardEvent).key;
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
		this.fireEvent = new FireEvent();
		this.cleaningField = new CleaningField(this.fireEvent);
		this.cleaningField.fillMatrix(this.size);
		this.timerrr.unsubscribe();
		this.robotCleaner = new RobotCleaner(this.cleaningField);
		this.robotController = new RobotController(this.robotCleaner);
		this.robotController.clearField();

		this.fireEvent.fireEvent.subscribe(fire => {
			this.appRef.tick();
		})

		this.oldRcPos = [0, 0];
	}

	startClean() {
		this.robotController.startCleaning();
	}

	rcChangePosition(row: number, col: number) {
		this.restart();

		this.cleaningField.updateCell(this.oldRcPos[0], this.oldRcPos[1], 0)

		this.cleaningField.updateCell(row, col, -5)

		this.oldRcPos = [row, col]
	}

	buildWall(row: number, col: number) {
		this.cleaningField.buildWall(row, col);
	}
}



