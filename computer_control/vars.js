$ = jQuery;


var MAX_T = 4000;
var STEPS = 200;
var MAX_N = parseInt(MAX_T/STEPS)+1;

var U_SCALE = 2.5;

var _currentLine = 0;
var _n = 1;
var _t = 1;

var _u = new Array(MAX_T).fill(0.0);
var _x1 = new Array(MAX_T).fill(0.0);
var _x2 = new Array(MAX_T).fill(0.0);
var _y = new Array(MAX_T).fill(0.0);
var _r = new Array(MAX_T).fill(0.0);
var _e = new Array(MAX_T).fill(0.0);

var _rn = new Array(MAX_N).fill(0.0);
var _en = new Array(MAX_N).fill(0.0);
var _un = new Array(MAX_N).fill(0.0);
var _yn = new Array(MAX_N).fill(0.0);

var _substepRef = 2/20;
var _substepOut = 13/20;
var _substepErr = 15/20;
var _substepContr = 18/20;
var _substepIncr = 19/20;

var _dt = 0.01;
var _substep = 0;

var _globalRef = 3.0;

var _mainLoop = false;

var _CPUIndex = 0;
var _DRIVERIndex = 0;
var _PLANTIndex = 0;

var _CPUImages = ['computer.png', 'arduino.png', 'plc.png'];
var _DRIVERImages = ['inverter_small.png', 'inverter_big.png'];
var _PLANTImages = ['motor.png', 'robot.png'];


var _stepIterator;
var _play = false;

var _plantsIndex = 0;
var _ctrlsIndex = 0;

var PLANTS = [ [5, 8, 25], [35, 8, 45]];
var CTRLS = [ [0.5, 1.1],  [2.4, 0.6], [0.8, 0.0]]
