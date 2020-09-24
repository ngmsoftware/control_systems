$ = jQuery;


let MIN_X = -10;
let MAX_X = 10;
let MIN_Y = -10;
let MAX_Y = 10;

let N1D = 128;
let N2D = 80;

var showAllAprox = false;


let fx1 = function(x) {
  return x;
}
let fx2 = function(x) {
  return (x-5)*(x+5)/6;
}
let fx3 = function(x) {
  return (x-7)*x*(x+7)/50;
}
let fx4 = function(x) {
  return Math.pow(Math.abs(x),1.0/3.0)*4*Math.sign(x);
}
let fx5 = function(x) {
  return Math.sin(1.5*x)*6;
}
let fx6 = function(x) {
  return 5*Math.exp(-x*x/10);
}
let fx7 = function(x) {
  return 5*x*Math.exp(-x*x/10);
}


let FXS = [fx1, fx2, fx3, fx4, fx5, fx6, fx7];
let FXSNames = ['Linear', 'Quadractic', 'Cubic', 'Cubic root', 'sin', 'Gaussian', 'Diff Gaussian'];








let fxy1 = function(x,y) {
  return (x+y)/6.0+2.5;
}
let fxy2 = function(x,y) {
  return 5+-(x*x+y*y)/40;
}
let fxy3 = function(x,y) {
  return 5*Math.exp(-(x*x+y*y)/20);
}
let fxy4 = function(x,y) {
  return 2*Math.exp(-(x*x+(y-5)*(y-5))/10) - Math.exp(-(x*x+(y+5)*(y+5))/10);
}
let fxy5 = function(x,y) {
  return 1+2*Math.sin(x/2)*Math.cos(y/2);
}
let FXYS = [fxy1, fxy2, fxy3, fxy4, fxy5];
let FXYSNames = ['Linear', 'Quadractic', 'Gaussian', 'Local mins', 'sin / cos'];



