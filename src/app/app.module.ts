import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ScrollsComponent } from './tests/scrolls/scrolls.component';
import { GameComponent } from './game/game.component';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MazeComponent } from './game/maze/maze.component';
import { BridgeBuilderComponent } from './game/bridge-builder/bridge-builder.component';
import { RobotCleanerComponent } from './game/robot-cleaner/robot-cleaner.component';

@NgModule({
	declarations: [
		AppComponent,
		ScrollsComponent,
		GameComponent,
		MazeComponent,
		BridgeBuilderComponent,
		RobotCleanerComponent
	],
	imports: [
		AppRoutingModule,
		ScrollingModule,
		BrowserModule,
		FormsModule,
		MatInputModule,
		MatButtonModule,
		MatRippleModule,
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
