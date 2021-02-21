class MazeNode {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class MazeGenerator {

	private stack = new Array();
	private _maze = [];
	private dimension: number;

	constructor(dim: number) {
		this._maze = new Array(dim);

		for (let i = 0; i < dim; i++) {
			this._maze[i] = new Array(dim).fill(1);
		}
		this.dimension = dim;

		this.generateMaze();
	}

	private generateMaze(): void {
		this.stack.push(new MazeNode(0, 0));
		while (this.stack.length > 0) {
			const next: MazeNode = this.stack.pop();
			if (this.validNextNode(next)) {
				this._maze[next.y][next.x] = 0;
				const neighbors: MazeNode[] = this.findNeighbors(next);
				this.randomlyAddNodesToStack(neighbors);
			}
		}
	}

	private validNextNode(node: MazeNode): boolean {
		let numNeighboringOnes = 0;
		for (let y = node.y - 1; y < node.y + 2; y++) {
			for (let x = node.x - 1; x < node.x + 2; x++) {
				if (this.pointOnGrid(x, y) && this.pointNotNode(node, x, y) && this._maze[y][x] === 0) {
					numNeighboringOnes++;
				}
			}
		}
		return (numNeighboringOnes < 3) && this._maze[node.y][node.x] !== 0;
	}

	private randomlyAddNodesToStack(nodes: MazeNode[]): void {
		let targetIndex: number;
		while (nodes.length > 0) {
			targetIndex = this.getRandomInt(nodes.length)
			const targetNode = nodes[targetIndex]
			nodes.splice(targetIndex, 1);

			this.stack.push(targetNode);
		}
	}

	private findNeighbors(node: MazeNode): MazeNode[] {
		const neighbors: MazeNode[] = [];
		for (let y = node.y - 1; y < node.y + 2; y++) {
			for (let x = node.x - 1; x < node.x + 2; x++) {
				if (this.pointOnGrid(x, y) && this.pointNotCorner(node, x, y)
					&& this.pointNotNode(node, x, y)) {
					neighbors.push(new MazeNode(x, y));
				}
			}
		}
		return neighbors;
	}

	private pointOnGrid(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this.dimension && y < this.dimension;
	}

	private pointNotCorner(node: MazeNode, x: number, y: number): boolean {
		return (x === node.x || y === node.y);
	}

	private pointNotNode(node: MazeNode, x: number, y: number): boolean {
		return !(x === node.x && y === node.y);
	}

	private getRandomInt(max: number): number {
		const random = Math.floor(Math.random() * Math.floor(max));
		return random
	}

	public get maze(): number[][] {
		return this._maze;
	}
}