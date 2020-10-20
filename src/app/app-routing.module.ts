import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { ScrollsComponent } from './tests/scrolls/scrolls.component';

const routes: Routes = [{
	path: '',
	component: GameComponent,
	pathMatch: 'full'
}, {
	path: 'game',
	component: GameComponent
}, {
	path: 'scrolls',
	component: ScrollsComponent
}];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
