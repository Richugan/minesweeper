import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { ScrollsComponent } from './tests/scrolls/scrolls.component';
import { MazeComponent } from './game/maze/maze.component';
import { BridgeBuilderComponent } from './game/bridge-builder/bridge-builder.component';
import { RobotCleanerComponent } from './game/robot-cleaner/robot-cleaner.component';

const routes: Routes = [{
	path: '',
	component: GameComponent,
	pathMatch: 'full'
}, {
	path: 'maze',
	component: MazeComponent
}, {
	path: 'game',
	component: GameComponent
}, {
	path: 'scrolls',
	component: ScrollsComponent
}, {
	path: 'bridge',
	component: BridgeBuilderComponent
}, {
	path: 'rc',
	component: RobotCleanerComponent
}];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
