
inputPlotDiscrete = createOutputPlot('inputSignalDiscrete');
outputPlotDiscrete = createOutputPlot('outputSignalDiscrete');

inputPlotContinuous = createOutputPlot('inputSignalContinuous');
outputPlotContinuous = createOutputPlot('outputSignalContinuous');




function sliderTChanged() {

  _T = parseFloat($('#rangeT').val());

  $('#spanT').html( $('#rangeT').val() );

  reset();
}



function selectSystemChanged() {
  let option = parseInt($('#selectSystem').val());

  $('#spanSystem').html( SYSTEMS[option].tf );

  _systemIdx = option;
  _systemState = new Array(SYSTEMS[option].den.length-1).fill(0.0);

  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  reset();
}


function selectMethodChanged() {

  let option = parseInt($('#selectMethod').val());

  _discretizationMethod = option;

  reset();

}

function selectInputChanged() {

  let option = parseInt($('#selectInput').val());

  _inputType = option;

  _input = generateInput(MAX_T/_T, _inputType);

  reset();
}


function newInputClicked() {

  _input = generateInput(MAX_T/_T, _inputType);

  reset();
}

function stepClicked() {
  _play = true;

}


function playClicked() {
  if (_playing) {
    _playing = false;
    $('#buttonPlay').html('Play');
  } else {
    _playing = true;
    $('#buttonPlay').html('Stop');
  }
}

function lockPlotsClicked() {
  inputPlotContinuous.layout.yaxis.autorange = !$('#checkboxLockPlots').is(':checked');
  outputPlotContinuous.layout.yaxis.autorange = !$('#checkboxLockPlots').is(':checked');
  inputPlotDiscrete.layout.yaxis.autorange = !$('#checkboxLockPlots').is(':checked');
  outputPlotDiscrete.layout.yaxis.autorange = !$('#checkboxLockPlots').is(':checked');

}



function updateInputPlot() {

  inputPlotDiscrete.layout.xaxis.range[1] = MAX_T/_T;
  inputPlotContinuous.layout.xaxis.range[1] = MAX_T;

  inputPlotDiscrete.traces[0].x = [];
  inputPlotDiscrete.traces[0].y = [];
  inputPlotDiscrete.traces[1].x = [];
  inputPlotDiscrete.traces[1].y = [];

  inputPlotContinuous.traces[2].x = [];
  inputPlotContinuous.traces[2].y = [];

  for (var i = 0; i < _input.length; i++) {
    let val = _input[i];

    inputPlotDiscrete.traces[1].x.push(i);
    inputPlotDiscrete.traces[1].x.push(i);
    inputPlotDiscrete.traces[1].x.push(i);
    inputPlotDiscrete.traces[1].y.push(0);
    inputPlotDiscrete.traces[1].y.push(val);
    inputPlotDiscrete.traces[1].y.push(0);

    inputPlotDiscrete.traces[0].x.push(i);
    inputPlotDiscrete.traces[0].y.push(val);

  }


  inputPlotContinuous.traces[1].x = [];
  inputPlotContinuous.traces[1].y = [];
  for (var i = 0; i < _input.length; i++) {
    let val = _input[i];
    inputPlotContinuous.traces[1].x.push(i*_T);
    inputPlotContinuous.traces[1].x.push(i*_T);
    inputPlotContinuous.traces[1].x.push(null);
    inputPlotContinuous.traces[1].y.push(-3);
    inputPlotContinuous.traces[1].y.push(3);
    inputPlotContinuous.traces[1].y.push(null);

  }



  for (var i = 1; i < _input.length; i++) {
    let val = _input[i-1];
    if (i<=_n) {
      inputPlotContinuous.traces[2].x.push((i-1)*_T);
      inputPlotContinuous.traces[2].y.push(val);
    }
  }



  Plotly.redraw('inputSignalDiscrete');
  Plotly.redraw('inputSignalContinuous');
}







function updateOutputPlot() {

  outputPlotDiscrete.traces[1].x = [];
  outputPlotDiscrete.traces[1].y = [];
  outputPlotDiscrete.traces[0].x = [0];
  outputPlotDiscrete.traces[0].y = [0];
  outputPlotContinuous.traces[2].x = [];
  outputPlotContinuous.traces[2].y = [];

  for (var i = 0; i <= _n; i++) {
    let val = _output[i];

      outputPlotDiscrete.traces[1].x.push(i);
      outputPlotDiscrete.traces[1].x.push(i);
      outputPlotDiscrete.traces[1].x.push(i);
      outputPlotDiscrete.traces[1].y.push(0);
      outputPlotDiscrete.traces[1].y.push(val);
      outputPlotDiscrete.traces[1].y.push(0);

      outputPlotDiscrete.traces[0].x.push(i);
      outputPlotDiscrete.traces[0].y.push(val);

      outputPlotContinuous.traces[2].x.push(i*_T);
      outputPlotContinuous.traces[2].y.push(val);
  }

  outputPlotContinuous.traces[1].x = [];
  outputPlotContinuous.traces[1].y = [];
  for (var i = 0; i < _input.length; i++) {
    outputPlotContinuous.traces[1].x.push(i*_T);
    outputPlotContinuous.traces[1].x.push(i*_T);
    outputPlotContinuous.traces[1].x.push(null);
    outputPlotContinuous.traces[1].y.push(_maxOut);
    outputPlotContinuous.traces[1].y.push(_minOut);
    outputPlotContinuous.traces[1].y.push(null);

  }



  Plotly.redraw('outputSignalContinuous');
  Plotly.redraw('outputSignalDiscrete');
}



function reset() {
  _t = 0;
  _idx = 0;
  _n = 1;

  _maxOut = 0.0;
  _minOut = 0.0;

  inputPlotContinuous.layout.yaxis.range = [-3, 3];
  outputPlotContinuous.layout.yaxis.range = [-3, 3];
  inputPlotDiscrete.layout.yaxis.range = [-3, 3];
  outputPlotDiscrete.layout.yaxis.range = [-3, 3];


  inputPlotContinuous.layout.xaxis.range[1] = MAX_T;
  outputPlotContinuous.layout.xaxis.range[1] = MAX_T;
  inputPlotDiscrete.layout.xaxis.range[1] = MAX_T/_T;
  outputPlotDiscrete.layout.xaxis.range[1] = MAX_T/_T;

  _input = generateInput(MAX_T/_T, _inputType); 

  _output = new Array(_input.length).fill(null);

  _systemState = new Array(SYSTEMS[_systemIdx].den.length-1).fill(0.0);

  for (var i = 0; i < inputContinuousY.length; i++) {
    inputContinuousY[i] = null;
    outputContinuousY[i] = null;
  }

  updateInputPlot();
  updateOutputPlot();
}






function init() {

  _x = new Array(MAX_T/_dt).fill(0.0);
  for (var i = 1; i < MAX_T/_dt; i++) {
    _x[i] = _x[i-1]+_dt;
  }
  outputContinuousY = new Array(parseInt(MAX_T/_dt)).fill(null);
  outputDiscreteY = new Array(parseInt(MAX_T/_dt)).fill(0.0);
  inputContinuousY = new Array(parseInt(MAX_T/_dt)).fill(null);
  inputDiscreteY = new Array(parseInt(MAX_T/_T)).fill(0.0);


  outputPlotDiscrete.traces.push({
    x : [],
    y : [],
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: 'rgb(255, 157, 17)',
      size: 8,
    }
  },{
    mode: "lines",
    line : { width : 1, color : 'gray'},
    x: [], 
    y: []
  });
  outputPlotContinuous.traces.push({
    mode: "lines",
    line : { width : 1, color : 'black'},
    x: _x, 
    y: outputContinuousY
  },{
    mode: "lines",
    line : { width : 1, color : 'RGBA(0,255,0,0.2)'},
    x: [], 
    y: []
  },{
    x : [],
    y : [],
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: 'rgba(255, 157, 17, 0.3)',
      size: 8,
    }
  });

  inputPlotDiscrete.traces.push({
    x : [],
    y : [],
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: 'rgb(17, 157, 255)',
      size: 8,
    }
  },{
    mode: "lines",
    line : { width : 1, color : 'gray'},
    x: [], 
    y: []
  });

  inputPlotContinuous.traces.push({
    mode: "lines",
    line : { width : 1, color : 'black'},
    x: _x, 
    y: inputContinuousY
  },{
    mode: "lines",
    line : { width : 1, color : 'RGBA(0,255,0,0.2)'},
    x: [], 
    y: []
  },{
    x : [],
    y : [],
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: 'rgba(17, 157, 255, 0.4)',
      size: 8,
    }
  });



  reset();
}














function setup() {
  frameRate(60);
}






function draw() {


  if (_playing)
    _play = true;



  if (_play) {
    switchInput('ON');
    switchOutput('OFF');

    _t += _dt;
    _idx++;

    if (Math.abs((_t+_dt)%_T)<_dt) {
      _play = false;
      switchInput('OFF');
      switchOutput('ON');

      _output[_n] = outputContinuousY[_idx-1];

      updateOutputPlot();
      updateInputPlot();

    }


    _n = 1+parseInt(_t/_T);
    

    var curInput;
    switch (_discretizationMethod) {
      case 1:
        curInput = _input[_n-1] + (_t - (_n-1)*_T)*(_input[_n]-_input[_n-1])/_T;
        break;
      case 0:
        curInput = _input[_n-1];
        break;
    }

    inputContinuousY[_idx] = curInput;

    res = simulateSystem(_systemState, SYSTEMS[_systemIdx].num, SYSTEMS[_systemIdx].den, curInput, _dt);
    _systemState = res[0];
    outputContinuousY[_idx] = res[1];


    if (outputContinuousY[_idx] > _maxOut) _maxOut = outputContinuousY[_idx];
    if (outputContinuousY[_idx] < _minOut) _minOut = outputContinuousY[_idx];


//    console.log(_t);


    Plotly.redraw('inputSignalContinuous');
    Plotly.redraw('inputSignalDiscrete');
    Plotly.redraw('outputSignalContinuous');
    Plotly.redraw('outputSignalDiscrete');
  }


    
}








init();



