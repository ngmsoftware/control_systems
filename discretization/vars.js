$ = jQuery;



var _T = 0.3;
var _t = 0.0;
var _n = 1;
var _discretizationMethod = 0;
var _play = false;
var _playing = false;
var _x = [];
var _idx = 0;
var _input = [];
var _output = [];
var _inputType = 0;
var _systemIdx = 0;
var _systemState = [];
var _maxOut = 0;
var _minOut = 0;

let MAX_T = 5.0;
let _dt = 0.005;

let SYSTEMS = [
{tf: '$\\frac{3}{s+1}$', num:[3], den:[1, 1]},
{tf: '$\\frac{3}{s^2+s+1}$', num:[3], den:[1, 1, 1]},
{tf: '$\\frac{30}{s+40}$', num:[30], den:[1, 40]},
{tf: '$\\frac{50}{s^2+s+50}$', num:[50], den:[1, 1, 50]},
{tf: '$\\frac{1000}{s^2+20\\,s+1000}$', num:[1000], den:[1, 20, 1000]},
{tf: '$\\frac{2000}{s^2+15\\,s+2000}$', num:[2000], den:[1, 15, 2000]},
];


