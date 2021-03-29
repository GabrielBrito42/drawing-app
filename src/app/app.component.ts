import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'drawning-app';
  isDrawing = false;
  toolFunction =  false;
  functionName = '';
  finalFunctionName = '';
  saveColor = '';
  x = 0;
  y = 0;
  initialX = 0;
  initialY = 0;
  context: any = null;
  outlineContext: any = null;
  mouseWidth = 5;
  color = 'black';

  @ViewChild("myDiv") 
  divView:ElementRef<HTMLCanvasElement>;

  @ViewChild("outlineDiv") 
  outlineView:ElementRef<HTMLCanvasElement>;

  @ViewChild("mouse") 
  mouseView:ElementRef<HTMLCanvasElement>;

  constructor(){}

  ngOnInit(): void { }

  ngAfterViewInit(){
    this.context = this.divView.nativeElement.getContext('2d');
    this.outlineContext = this.outlineView.nativeElement.getContext('2d');
    this.divView.nativeElement.style.backgroundColor = 'white';
   
  }

  follow = (e: any) => {
    this.mouseView.nativeElement.style.left = e.clientX + "px";
    this.mouseView.nativeElement.style.top = e.clientY + "px";
  }

  clicked = (e: any) => {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.initialX = e.offsetX;
    this.initialY = e.offsetY;
    this.isDrawing = true;
  }

  drawn = (e: any) => {
    if(!this.isDrawing) return;
    if(this.toolFunction){
      this[this.functionName](e.offsetX, e.offsetY);
      return
    }
    this.drawLine(e.offsetX, e.offsetY);
    this.x = e.offsetX;
    this.y = e.offsetY;
  }

  release = (e: any) => {
    if(!this.isDrawing) return;
    if(this.toolFunction) this[this.finalFunctionName](e.offsetX, e.offsetY);
    this.x = 0;
    this.y = 0;
    this.isDrawing = false;
  }

  drawLine = (x2: any, y2: any) => {
    if(!this.isDrawing) return;
    this.clearFrame();
    this.context.lineWidth = this.mouseWidth;
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  makeSquare = (x2: any, y2: any) => {
    this.clearFrame();
    this.outlineContext.fillStyle = this.color;
    this.outlineContext.beginPath();
    this.outlineContext.fillRect(this.initialX, this.initialY, x2 - this.initialX, y2 - this.initialY);
    this.finalFunctionName = 'releaseSquare';
  }

  makeLine = (x2: any, y2: any) => {
    this.clearFrame();
    this.outlineContext.strokeStyle = this.color;
    this.outlineContext.lineWidth = this.mouseWidth;
    this.outlineContext.beginPath();
    this.outlineContext.moveTo(this.initialX, this.initialY);
    this.outlineContext.lineTo(x2, y2);
    this.outlineContext.stroke();
    this.finalFunctionName = 'releaseLine'
  }

  makeCircle = (x2: any, y2: any) => {
    this.clearFrame();
    this.outlineContext.fillStyle = this.color;
    this.outlineContext.beginPath();
    this.outlineContext.arc(this.initialX, this.initialY  , Math.abs(x2 - this.initialX), 0, Math.PI * 2);
    this.outlineContext.fill();
    this.finalFunctionName = 'releaseCircle';
  }

  changeColor = (e: any) => {
    this.color = e.target.value;
    this.mouseView.nativeElement.style.backgroundColor = this.color;
  }

  releaseCircle = (x2: any, y2: any) => {
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.arc(this.initialX, this.initialY, Math.abs(x2 - this.initialX), 0, Math.PI * 2, false);
    this.context.fill();
  }

  releaseSquare = (x2: any, y2: any) => {
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.fillRect(this.initialX, this.initialY, x2 - this.initialX, y2 - this.initialY);
  }

  releaseLine = (x2: any, y2: any) => {
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.mouseWidth;
    this.context.moveTo(this.initialX, this.initialY);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  clearFrame = () => {
    this.outlineContext.clearRect(0, 0, 1100, 700);
  }

  eraser = () => {
    this.toolFunction = false;
    this.functionName = '';
    this.finalFunctionName = '';
    this.saveColor = this.color;
    this.color = 'white';
    this.mouseView.nativeElement.style.backgroundColor = this.color;
  }

  brush = () => {
    this.color = this.saveColor;
    this.mouseView.nativeElement.style.backgroundColor = this.saveColor;
    this.toolFunction = false;
    this.functionName = '';
    this.finalFunctionName = '';
  }

  changeMouseWidth = (e: any) => {
    this.mouseWidth = e.target.value;
    this.mouseView.nativeElement.style.width = this.mouseWidth + "px";
    this.mouseView.nativeElement.style.height = this.mouseWidth + "px";
  }

  drawSquare = () => {
    this.toolFunction = true;
    this.functionName = 'makeSquare';
  }

  drawCircle = () => {
    this.toolFunction = true;
    this.functionName = 'makeCircle';
  }

  drawStraightLine = () => {
    this.toolFunction = true;
    this.functionName = 'makeLine';
  }
}
