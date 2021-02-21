import { Component, OnInit } from '@angular/core';
import { MazeGenerator } from './maze-generator';
import { timer, Subscription } from 'rxjs';

@Component({
	selector: 'app-maze',
	templateUrl: './maze.component.html',
	styleUrls: ['./maze.component.scss']
})
export class MazeComponent implements OnInit {

	maze: number[][];

	movesMaze: number[][] = [];

	DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];

	size = 5;

	gameStatus: string;

	hrackleArr = [];
	answerArr = [];

	subs: Subscription;

	shortPath = false;

	constructor() { }

	ngOnInit(): void {
		this.gameStatus = '';
		this.hrackleArr = [];
		this.answerArr = [];
		this.shortPath = false;
		this.movesMaze = [];

		const mazeGenerator = new MazeGenerator(this.size)
		this.maze = mazeGenerator.maze;

		if (this.subs) {
			this.subs.unsubscribe();
		}
		// tslint:disable-next-line: prefer-for-of
		for (let i = 0; i < this.size; i++) {
			this.movesMaze.push(new Array(this.size).fill(-1));
		}

	}

	showHerackle() {
		const rows = this.maze.length;
		const cols = this.maze.length;

		const visited = [];

		for (let i = 0; i < rows; i++) visited.push(new Array(cols).fill(false));

		if (this.maze[0][0] === 1 || this.maze[rows - 1][cols - 1] === 1) {
			this.gameStatus = 'Zdes\' ribi net ';
			return -1
		};

		const queue = [[0, 0]];
		visited[0][0] = true;
		let maxPath = 0;

		while (queue.length) {
			const nums = queue.length;

			for (let i = 0; i < nums; i++) {

				const [curRow, curCol] = queue.shift();
				this.movesMaze[curRow][curCol] = maxPath

				if (curRow === rows - 1 && curCol === cols - 1) {
					this.hrackleArr.unshift([0, 0])
					return maxPath + 1
				};

				// tslint:disable-next-line: prefer-for-of
				for (let dI = 0; dI < this.DIRS.length; dI++) {

					let [r, c] = this.DIRS[dI];
					r = curRow + r;
					c = curCol + c;

					if (r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c] === true || this.maze[r][c] === 1) continue;

					visited[r][c] = true;

					queue.push([r, c]);

				}
			}
			this.hrackleArr.push(...queue);
			maxPath++;
		}

		this.gameStatus = 'Ne nashel';
		return -1;
	}

	tyanemNitku() {
		this.showHerackle();

		let curRow = this.maze.length - 1;
		let curCol = this.maze.length - 1;

		this.answerArr.push([this.size - 1, this.size - 1])
		while (curRow !== 0 || curCol !== 0) {

			// tslint:disable-next-line: prefer-for-of
			for (let i = 0; i < this.DIRS.length; i++) {

				let [r, c] = this.DIRS[i];
				r = curRow + r;
				c = curCol + c;

				if (r >= 0 && r < this.size && c >= 0 && c < this.size && (this.movesMaze[curRow][curCol] - this.movesMaze[r][c]) === 1) {
					curRow = r;
					curCol = c;
					this.answerArr.push([curRow, curCol])
				};
			}
		}
		this.answerArr.push([0, 0])
		this.answerArr.reverse();
		this.podsvetkaKras();
	}

	podsvetkaKras() {
		if (this.subs) {
			this.subs.unsubscribe();
		}

		let i = 0;

		this.subs = timer(0, 20).subscribe(emit => {
			const arr = this.answerArr[i];
			this.maze[arr[0]][arr[1]] = 3;
			i++;

			if (i >= this.answerArr.length) {
				this.subs.unsubscribe();
			}
		})
	}

}
