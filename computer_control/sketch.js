



var osciloscope = new Osciloscope(MAX_T, MAX_N);







function stepClicked() {
  clearBorders();

  _currentLine++;

  if (_currentLine > 8) _currentLine = 2;


  $('#line'+_currentLine).css("border","2px solid red");


  globalStep();

}


function updateSpan(variable, spanName) {
  var strR = '';
  for (var i = 1; i <= _n; i++) {
    strR += variable[i].toFixed(2) + ' ';
  }

  $(spanName).html(strR);
}


function playClicked() {
  if (!_play)
    $('#playButton').html('Stop!');
  else
    $('#playButton').html('Play!');

  _play = !_play;
}


function CPUClicked() {
  _CPUIndex = (_CPUIndex+1)%_CPUImages.length;
  _ctrlsIndex = (_ctrlsIndex+1)%CTRLS.length;

  $('#ctrl1Span').html(CTRLS[_ctrlsIndex][0]);
  $('#ctrl2Span').html(CTRLS[_ctrlsIndex][1]);


  $('#CPUImg').attr('src','images/'+_CPUImages[_CPUIndex]);
}

function DRIVERClicked() {
  _DRIVERIndex = (_DRIVERIndex+1)%_DRIVERImages.length;

  $('#DRIVERImg').attr('src','images/'+_DRIVERImages[_DRIVERIndex]);
}

function PLANTClicked() {
  _PLANTIndex = (_PLANTIndex+1)%_PLANTImages.length;
  _plantsIndex = (_plantsIndex+1)%PLANTS.length;


  $('#transferFuncSpan').html( renderTransferFunction([1, PLANTS[_plantsIndex][1],  PLANTS[_plantsIndex][0]], [PLANTS[_plantsIndex][2]], 0) ); 


  $('#PLANTImg').attr('src','images/'+_PLANTImages[_PLANTIndex]);

  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}





function globalStep() {

  if (_currentLine == 1) {
    $('#spanN').html(_n);
  }

  if ( (_t<MAX_T) && ( (_currentLine == 3) || _mainLoop )  ) {

    _mainLoop = true;

    event = _stepIterator.next();
    
    osciloscope.step(_r, _u, _y, _t, _n, STEPS);

//    console.log(event);

    switch (event.value) {
      case 'ref':
        updateSpan(_rn, '#spanRef');
        break;
      case 'out':
        updateSpan(_yn, '#spanOut');
        break;
      case 'err':
        updateSpan(_en, '#spanErr');
        break;
      case 'ctrl':
        updateSpan(_un, '#spanCtrl');
        break;
      case 'n+1':
        $('#spanN').html(_n+1);
    }


  }


}




_stepIterator = stepY(function () { 
//  osciloscope.update(_r, _u, _y, _t, _n, STEPS);
});




function setup() {
  frameRate(15);
}






function draw() {

  if (_play)
    stepClicked();
}





$('#transferFuncSpan').html( renderTransferFunction([1, PLANTS[_plantsIndex][1],  PLANTS[_plantsIndex][0]], [PLANTS[_plantsIndex][2]], 0) ); 
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);







