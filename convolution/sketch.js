function update(displacement, discrete) {

  var N0 = N;
  var scale = 1.0;
  if (!discrete) {
    N0 = 10*N;
    scale = 0.1;
  }

  plotDiscreteBoth.funcs = [ plotDiscreteFunc1.funcs[1], plotDiscreteFunc2.funcs[1]];

  plotDiscreteProd.funcs[1] = x=>plotDiscreteFunc2.funcs[1](x)*plotDiscreteFunc1.funcs[1](displacement*scale - x);

  plotDiscreteConv.funcs[1] = x => {

    if (x>displacement*scale)
      return 0;

    var s = 0.0;
    for (var i = -N0/2; i < N0/2; i++) {
      s += plotDiscreteFunc2.funcs[1](scale*i)*plotDiscreteFunc1.funcs[1](x - scale*i);
    }
    return s;

  };

  plotDiscreteFunc1.plot();
  plotDiscreteFunc2.plot();
  plotDiscreteBoth.plot();
  plotDiscreteProd.plot();
  plotDiscreteConv.plot();

}



function selectF1Changed() {
  let val = parseInt($('#selectF1').val());

  let func = FXS[val];

  plotDiscreteFunc1.funcs[1] = func;

  update();
}


function selectF2Changed() {
  let val = parseInt($('#selectF2').val());

  let func = FXS[val];

  plotDiscreteFunc2.funcs[1] = func;

  update();
}


function selectDomainChanged() {
  let val = parseInt($('#selectDomain').val());

  if (val == 2) {


    plotDiscreteFunc1.N = N;
    plotDiscreteFunc2.N = N;
    plotDiscreteBoth.N = N;
    plotDiscreteProd.N = N;
    plotDiscreteConv.N = N;

    plotDiscreteFunc1.discrete = true;
    plotDiscreteFunc2.discrete = true;
    plotDiscreteBoth.discrete = true;
    plotDiscreteProd.discrete = true;
    plotDiscreteConv.discrete = true;
  } else {


    plotDiscreteFunc1.N = 10*N;
    plotDiscreteFunc2.N = 10*N;
    plotDiscreteBoth.N = 10*N;
    plotDiscreteProd.N = 10*N;
    plotDiscreteConv.N = 10*N;

    plotDiscreteFunc1.discrete = false;
    plotDiscreteFunc2.discrete = false;
    plotDiscreteBoth.discrete = false;    
    plotDiscreteProd.discrete = false;    
    plotDiscreteConv.discrete = false;        
  }   
    
    update();
}








plotDiscreteFunc1 = new PlotDiscrete('divCanvasFunc1', N, [null, FXS[0]], ['', 'red'],400, 130);
plotDiscreteFunc2 = new PlotDiscrete('divCanvasFunc2', N, [null, FXS[5]], ['', 'blue'],400, 130);
plotDiscreteBoth = new PlotDiscrete('divCanvasBoth', N, [FXS[0], FXS[5]], ['red', 'blue'], 800, 200, update);
plotDiscreteProd = new PlotDiscrete('divCanvasProd', N, [null, (x)=>FXS[5](x)*FXS[0](x)], ['', 'green-fill'],800, 200);
plotDiscreteConv = new PlotDiscrete('divCanvasConv', N, [null, x=>0], ['', 'magenta'],800, 200);


update();



for (var i = 0; i<FXS.length; i++) {
  $('#selectF1').append(new Option(FXSNames[i] , i)); 
}
for (var i = 0; i<FXS.length; i++) {
  $('#selectF2').append(new Option(FXSNames[i], i)); 
}








