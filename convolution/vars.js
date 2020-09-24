$ = jQuery;


let MIN_X = -10;
let MAX_X = 10;

let N = 80;


let fx1 = function(x) {
  return x>0?1:0;
}
let fx2 = function(x) {
  return x>0&&x<10?1:0;
}
let fx3 = function(x) {
  return Math.sin(x/5);
}
let fx4 = function(x) {
  return Math.exp(-x*x/10);
}
let fx5 = function(x) {
  if (x<0)
    return 0;
  return Math.exp(-0.5*x)*0.9;
}
let fx6 = function(x) {
  return -x*Math.exp(-x*x/20)/2;
}


let FXS = [fx1, fx2, fx3, fx4, fx5, fx6];
let FXSNames = ['Step', 'Pulse', 'Sine', 'Gaussian', 'Exp', 'diff Gaussian'];





