import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, AfterViewInit } from '@angular/core';
import { interval, timer, Subscription } from 'rxjs';
import * as moment from 'moment'

@Component({
	selector: 'app-scrolls',
	templateUrl: './scrolls.component.html',
	styleUrls: ['./scrolls.component.scss']
})
export class ScrollsComponent implements OnInit {

	items = [];


	@ViewChild('secondItemsContainer', { read: ViewContainerRef })
	secondContainer: ViewContainerRef;

	@ViewChild('secondItem', { read: TemplateRef })
	secondTemplate: TemplateRef<any>;

	@ViewChild('thirdItemsContainer', { read: ViewContainerRef })
	thirdContainer: ViewContainerRef;

	@ViewChild('thirdItem', { read: TemplateRef })
	thirdTemplate: TemplateRef<any>;

	showFirst = false;
	showSecond = false;
	showThird = false;

	intervalSub: Subscription;

	timerString: string;
	milleseconds = 0;

	timerSub: Subscription;

	constructor() { }

	ngOnInit(): void {
		// this.startTimer();
	}

	buildDataForFirstExample() {
		this.items = Array.from({ length: 2000 }).map((_, i) => `Item ${i}`);

		this.timerSub.unsubscribe();
	}

	buildDataForSecondExample() {

		const start = 0;
		const end = 2000;

		for (let n = start; n <= end; n++) {
			this.secondContainer.createEmbeddedView(this.secondTemplate, {
				item: {
					id: n,
					label: Math.random()
				}
			});
		}

		timer(1000).subscribe(emit => {
			this.milleseconds = 1000 - this.milleseconds;
			this.timerString = moment(this.milleseconds).format('ss:SS')

			this.timerSub.unsubscribe();
		})

	}

	buildDataForThirdExample() {
		const ITEMS_RENDERED_AT_ONCE = 500;
		const INTERVAL_IN_MS = 10;

		let currentIndex = 0;

		this.intervalSub = interval(INTERVAL_IN_MS).subscribe(emit => {

			const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

			for (let n = currentIndex; n <= nextIndex; n++) {

				if (n >= 2000) {
					this.intervalSub.unsubscribe();
					this.timerSub.unsubscribe();
					break;
				}
				const context = {
					item: {
						id: n,
						label: Math.random()
					}
				};
				this.thirdContainer.createEmbeddedView(this.thirdTemplate, context);
			}

			currentIndex += ITEMS_RENDERED_AT_ONCE;
		})
	}


	// buildDataForThirdExample() {
	// 	const ITEMS_RENDERED_AT_ONCE = 500;
	// 	const INTERVAL_IN_MS = 10;

	// 	let currentIndex = 0;

	// 	const interval = setInterval(() => {
	// 		const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

	// 		for (let n = currentIndex; n <= nextIndex; n++) {
	// 			if (n >= 200000) {
	// 				clearInterval(interval);
	// 				break;
	// 			}
	// 			const context = {
	// 				item: {
	// 					id: n,
	// 					label: Math.random()
	// 				},
	// 				isEven: n % 2 === 0
	// 			};
	// 			this.thirdContainer.createEmbeddedView(this.thirdTemplate, context);
	// 		}

	// 		currentIndex += ITEMS_RENDERED_AT_ONCE;
	// 	}, INTERVAL_IN_MS);
	// }


	showFirstBlock() {
		this.showFirst = true;
		this.startTimer();
		this.buildDataForFirstExample();
	}

	showSecondBlock() {
		this.items = [];

		this.showSecond = true;


		this.timerString = '';
		this.milleseconds = 0;

		this.timerSub = interval(10).subscribe(emit => {
			this.milleseconds += 10;
		})


		this.buildDataForSecondExample();
	}

	showThirdBlock() {
		this.showThird = true;
		this.startTimer();
		this.buildDataForThirdExample();
	}

	startTimer() {
		this.timerString = '';
		this.milleseconds = 0;

		this.timerSub = interval(10).subscribe(emit => {
			this.milleseconds += 10;
			this.timerString = moment(this.milleseconds).format('ss:SS')

			console.log('opacchki')
		})
	}

}
