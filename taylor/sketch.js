var FX = FXS[0];
var FXY = FXYS[0];
var _X
var _Y
var X = [];
var Y = [];


plot1D = new Plot1D('divCanvas1D', MIN_X, MAX_X, N1D, FXS[0], 1, showAllAprox);

plot2D = new Plot2D('divCanvas2D', MIN_X, MAX_X, MIN_Y, MAX_Y, N2D, FXYS[0], 1, showAllAprox);


plot1D.plot();
plot2D.plot();



function button1Clicked() {
  $('#selectFx').show();
  $('#selectFxy').hide();

  $('#divCanvas1D').show();
  $('#divCanvas2D').hide();

  $('#checkboxShowAll').prop('disabled',false);
}

function button2Clicked() {
  $('#selectFx').hide();
  $('#selectFxy').show();

  $('#divCanvas1D').hide();
  $('#divCanvas2D').show();

  $('#checkboxShowAll').prop('disabled',true);
}














// ONE function of ONE variable
for (var i = 0; i<FXS.length; i++) {
  $('#selectFx').append(new Option(FXSNames[i] , i)); 
}
for (var i = 0; i<FXYS.length; i++) {
  $('#selectFxy').append(new Option(FXYSNames[i], i)); 
}






function checkboxShowAllClicked() {
  showAllAprox = !showAllAprox;

  plot1D.setShowAllAprox(showAllAprox);
}


function selectFxChanged() {
  let val = parseInt($('#selectFx').val());

  let func = FXS[val];

  plot1D.func = func;

  plot1D.plot();
}


function selectFxyChanged() {
  let val = parseInt($('#selectFxy').val());

  let func = FXYS[val];

  plot2D.func = func;

  plot2D.plot();
}

function selectNTaylorChanged( ) {
  let val = parseInt($('#selectNTaylor').val());

  plot1D.NTaylor = val;
  plot2D.NTaylor = val;
}





