
function augumentPoly(num, den) {

	let augNum = new Array(den.length).fill(0.0);
	for (var i = 0; i < num.length; i++) {
		augNum[augNum.length-i-1] = num[num.length-i-1];
	}

	return augNum;	
}


function dState(state, num, den, input, td) {

	let augNum = augumentPoly(num, den);

	var dNewState = new Array(state.length).fill(0.0);
	for (var i = 1; i < state.length; i++) {
		dNewState[i-1] = state[i];
	}

	dNewState[state.length-1] = 0.0;
	for (var i = 1; i < den.length; i++) {
		dNewState[state.length-1] -= den[den.length-i]*state[i-1];
	}
	dNewState[state.length-1] += input;


	return dNewState;
}


function diffK(state, k, alpha) {
	let res = [];
	for (var i = 0; i < state.length; i++) {
		res.push(state[i] + alpha*k[i]);
	}

	return res;
}





function simulateSystem(state, num, den, input, dt, discrete = 0) {

	let augNum = augumentPoly(num, den);

	var newState = new Array(state.length).fill(0.0);
	for (var i = 0; i < state.length; i++) {
		newState[i] = state[i];
	}


//	dNewState = dState(state, num, den, input, dt);
	
	for (var i = 0; i < state.length; i++) {
		if (!discrete) {

			let k1 = dState(state, num, den, input, dt);
			let k2 = dState(diffK(state, k1, dt/2), num, den, input, dt);
			let k3 = dState(diffK(state, k2, dt/2), num, den, input, dt);
			let k4 = dState(diffK(state, k3, dt), num, den, input, dt);

			newState[i] += (dt/6)*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);
		} else {

			dNewState = dState(state, num, den, input, dt);

			newState[i] = dNewState[i];
		}
	}


	var y = 0;
	for (var i = newState.length-1; i >= 0; i--) {
		y += (augNum[i+1]-augNum[0]*den[i+1])*newState[newState.length-1-i];
	}
	y += augNum[0]*input;


	return [newState, y];

}



function normilizeGain(a, b, discrete) {

	var x = 1e-6;

	if (discrete) {
		x += 1;
	}

	numG = Polynomial.eval(b, {real:x, imag:0});
	denG = Polynomial.eval(a, {real:x, imag:0});

	return denG.real/numG.real;

}






function renderPolymonial(a, polyVar) {


  var n = a.length;
  var denStr = '';


  for (var i = 0; i < n; i++) {

//    console.log(a[i]);

    var sign = '+';
    if (a[i]<0) {
      sign = '-';
    }

    a_ = Math.abs(a[i]);

    if (i==n-1) {
          denStr += sign + a_.toPrecision(4);
    } else {
      if (i==n-2) {

        if ((sign=='+') && (i==0))
          sign = '';

        if (Math.abs(a_ - 1)<0.0000000001) {
          denStr += sign + polyVar;
        } else {
          denStr += sign + a_.toPrecision(4) + polyVar;
        }
      }
      else {

        if ((sign=='+') && (i==0))
          sign = '';

        if (Math.abs(a_ - 1)<0.0000000001) {
          denStr += sign +  polyVar + '^{' + (n-i-1)  + '}';
        } else {
          denStr += sign + a_.toPrecision(4) + polyVar + '^{' + (n-i-1)  + '}';
        }

      }
    }
  }

//  console.log(denStr);

  return denStr;
}


function renderTransferFunction(a, b, discrete) {
  var polyVar = 's';
  var TF = 'G(s)';
  if (discrete) {
    polyVar = 'z';
    TF = 'H(z)';
  }

  var numStr = renderPolymonial(b, polyVar);
  var denStr = renderPolymonial(a, polyVar);

  return '$'+TF+'=\\frac{'+numStr+'}{'+denStr+'}$';

}













class Singularity {

	constructor(real, imag = null) {
		this.real = real;
		this.imag = imag;
	}

	isClose(x, y, distThr) {
		var dist = 0;
		var dist1 = 0;
		var dist2 = 0;

		if (this.imag == null) {
			dist  = Math.sqrt( (x-this.real)*(x-this.real) + y*y );
		} else {
			dist1 = Math.sqrt( (x-this.real)*(x-this.real) + (y-this.imag)*(y-this.imag) );
			dist2 = Math.sqrt( (x-this.real)*(x-this.real) + (y+this.imag)*(y+this.imag) );
			dist = Math.min(dist1, dist2);
		}

		if (dist<distThr) {
			return this;
		}

		return null;
	}


	move(x, y = 0) {

		if (this.imag == null) {
			this.real = x;
		} else {
			this.real = x;
			this.imag = y;
		}

	}



}



class PolesDiagram {


	constructor(divName, discrete, readOnly = false, showHelp = false, maxPoles = 20, title='') {

		this.minX = -1.1;
		this.minY = -1.1;
		this.maxX = 1.1;
		this.maxY = 1.1;

		this.divName = divName;
		this.discrete = discrete;
		this.readOnly = readOnly;
		this.showHelp = showHelp;
		this.maxPoles = maxPoles;

		this.polesZerosRange = {discrete: {x:[-1.1, 1.1], y:[-1.1, 1.1]}, continuous: {x:[-2.5, 2.5], y:[-2.5, 2.5]}};

		this.poles = [];
		this.zeros = [];

		this.layout = {
			title : { text : title, font : { size : 14} },
			margin: { l: 20, r: 20, b: 20, t: 20},
	        xaxis: {range: [this.minX, this.maxX], text: 'x',},
	        yaxis: {range: [this.minY, this.maxY], text: 'y', scaleanchor:"x", scaleratio:1 },
	        showlegend: false,
		};


		this.traceStable = [
			{ // stability limits
				mode: "lines",
				line : { width : 2, color:"#000000"},
				x: [], 
				y: []
			},
		];

		this.tracePoles = [
			{  
				mode: "markers",
				type: "scatter",
				name: "positive_poles",
				marker: { size: 12, color: '#0000ff', symbol:'x' },
				x: [], 
				y: []
			},
			{
				mode: "markers",
				type: "scatter",
				name: "negative_poles",
				marker: { size: 12, color: '#0000ff', symbol:'x' },
				x: [], 
				y: []
			},
		];
		this.traceZeros = [
			{  
				mode: "markers",
				type: "scatter",
				name: "positive_poles",
				marker: { size: 12, color: '#00ff00', symbol:'o' },
				x: [], 
				y: []
			},
			{
				mode: "markers",
				type: "scatter",
				name: "negative_poles",
				marker: { size: 12, color: '#00ff00', symbol:'o' },
				x: [], 
				y: []
			},
		];

		this.traceSelection = [
			{
				mode: "markers",
				type: "scatter",
				marker: { size: 18, color: '#000000', symbol:'circle-open' },
				x: [], 
				y: []
			},
		];



		this.traceRlocus = [{
			x: [],
			y: [],
			mode: 'lines',
			line : { width : 2, color:"red", dash: 'dash'},
		},{
				mode: "markers",
				type: "scatter",
				marker: { size: 14, color: '#000000', symbol:'circle-closed' },
				x: [], 
				y: []
			},
		];

		this.selectedSingularity = null;
		this.distThr = 0.04;


		this.gdPoles = document.getElementById(this.divName);

		Plotly.plot(this.divName, this.tracePoles.concat(this.traceZeros.concat(this.traceStable.concat(this.traceSelection.concat(this.traceRlocus)))), this.layout,  {displayModeBar: false, staticPlot:true}).then(this.attach(this));

		// have to beexecuted after plot in order to have _fullLayout populated
		this.xaxis = this.gdPoles._fullLayout.xaxis;
		this.yaxis = this.gdPoles._fullLayout.yaxis;


		this.onSingularityMove = (p) => null;
		this.onSingularityAdd = (p) => null;
		this.onSingularityDel = (p) => null;
		this.onSingularitySelected = (p) => null;
		this.onSingularityDeselected = () => null;
		this.onKeyDown = (key) => null;
		this.onMouseMove = (evt) => null;

		document.addEventListener('contextmenu', event => event.preventDefault());
	}




	static createCircle(radius, NPoints) {
		const PI = Math.PI;
		var X = [];
		var Y = [];
		for (var i = 0; i < NPoints; i++) {
			var t = 2*PI*i/(NPoints-1);
			var x = radius*Math.cos(t);
			var y = radius*Math.sin(t);

			X.push(x);
			Y.push(y);
		}

		return [X, Y];
	}



	renderSingularities(traceList, singList) {
		traceList[0].x = [];
		traceList[0].y = [];

		for (var i = 0; i < singList.length; i++) {
			var p = singList[i];

			if (p.imag != null) {
				traceList[0].x.push(p.real);
				traceList[0].x.push(p.real);
				traceList[0].y.push(p.imag);
				traceList[0].y.push(-p.imag);
			} else {
				traceList[0].x.push(p.real);
				traceList[0].y.push(0);
			}
		}

	}


	renderPolesAndZeros() {
		this.renderSingularities(this.tracePoles, this.poles);
		this.renderSingularities(this.traceZeros, this.zeros);
	}




	getCordinatesAndButtonStatus(evt) {

		var geom = this.gdPoles.getBoundingClientRect();

		var xCoord = this.xaxis.p2c(evt.x - geom.x - this.layout.margin.l);
		var yCoord = this.yaxis.p2c(evt.y - geom.y - this.layout.margin.t);

		var btStatus = evt.buttons;

		return [xCoord, yCoord, btStatus];
	}


	getClosestSingularity(xCoord, yCoord) {

		for (var i = 0; i < this.poles.length; i++) {
			var p = this.poles[i].isClose(xCoord, yCoord, this.distThr);

			if (p!=null)
				return p;
		}


		for (var i = 0; i < this.zeros.length; i++) {
			var p = this.zeros[i].isClose(xCoord, yCoord, this.distThr);

			if (p!=null)
				return p;
		}

	}

	addPoles(x, y = null) {
		if (this.poles.length <= this.maxPoles) {

			var newPole = new Singularity(x,y);

			this.poles.push(newPole);

			this.onSingularityAdd(newPole);
		}
	}

	addZeros(x, y = null) {
		if (this.zeros.length <= this.maxPoles) {
			var newZero = new Singularity(x,y);

			this.zeros.push(newZero);
			
			this.onSingularityAdd(newZero);
		}
	}


	getAllPoles() {
		var res = [];

		for (var i = 0; i < this.poles.length; i++) {
			var p1 = { real: this.poles[i].real, imag:this.poles[i].imag };
			res.push(p1);
			if (this.poles[i].imag != null) {
				var p2 = { real: this.poles[i].real, imag:-this.poles[i].imag };
				res.push(p2);
			}
		}

		return res;
	}

	getAllZeros() {
		var res = [];

		for (var i = 0; i < this.zeros.length; i++) {
			var p1 = { real: this.zeros[i].real, imag:this.zeros[i].imag };
			res.push(p1);
			if (this.zeros[i].imag != null) {
				var p2 = { real: this.zeros[i].real, imag:-this.zeros[i].imag };
				res.push(p2);
			}
		}

		return res;
	}


	attach(obj) {


		obj.gdPoles.addEventListener('keydown', function(evt) {
			obj.onKeyDown(evt.key);
		});




		obj.gdPoles.addEventListener('mousemove', function(evt) {

			var xCoord;
			var yCoord;
			var btStatus;
			[xCoord, yCoord, btStatus] = obj.getCordinatesAndButtonStatus(evt);


			if (obj.selectedSingularity != null) {
				obj.selectedSingularity.move(xCoord, yCoord);

				obj.onSingularityMove(obj.selectedSingularity);
			} else {


				var p = obj.getClosestSingularity(xCoord, yCoord);

				if (p != null) {
					obj.traceSelection[0].x = [p.real];
					obj.traceSelection[0].y = [0];
					obj.onSingularitySelected(p);
					if (p.imag != null) {
						obj.traceSelection[0].x = [p.real, p.real];
						obj.traceSelection[0].y = [p.imag, -p.imag];
					}
				} else {
					obj.traceSelection[0].x = [];
					obj.traceSelection[0].y = [];

					obj.onSingularityDeselected();
				}
			}


			obj.renderPolesAndZeros();
	
			obj.onMouseMove(evt);

			Plotly.redraw(obj.divName);
		});



		obj.gdPoles.addEventListener('mousedown', function(evt) {

			var xCoord;
			var yCoord;
			var btStatus;
			[xCoord, yCoord, btStatus] = obj.getCordinatesAndButtonStatus(evt);

			var p = obj.getClosestSingularity(xCoord, yCoord);

			if (p == null) {

				if (!obj.readOnly) {
					if (!evt.altKey) {

						if (evt.shiftKey)
							obj.addPoles(xCoord);
						else 
							obj.addPoles(xCoord, yCoord);
					} else {

						if (evt.shiftKey)
							obj.addZeros(xCoord);
						else 
							obj.addZeros(xCoord, yCoord);

					}
				}

			} else {

				if (evt.button==2) {

					if (!obj.readOnly) {

						var idx = obj.zeros.findIndex(e => e == p);
						if (idx>=0)
							obj.zeros.splice(idx,1);
						var idx = obj.poles.findIndex(e => e == p);
						if (idx>=0)
							obj.poles.splice(idx,1);

						obj.onSingularityDel(p);
					}
				} else {
					obj.selectedSingularity = p;
				}

			}

			obj.renderPolesAndZeros();

			Plotly.redraw(obj.divName);
		});

		obj.gdPoles.addEventListener('mouseup', function(evt) {
			obj.selectedSingularity = null;

			Plotly.redraw(obj.divName);
		});
	}



	update() {

		if (this.discrete) {

			var circleResolution = 200;
			var CIRCLE_X;
			var CIRCLE_Y;
			[CIRCLE_X, CIRCLE_Y] = PolesDiagram.createCircle(1, circleResolution);

			this.traceStable[0].x = CIRCLE_X;
			this.traceStable[0].y = CIRCLE_Y;

			this.layout.yaxis.range = this.polesZerosRange.discrete.y;
			this.layout.xaxis.range = this.polesZerosRange.discrete.x;

			this.distThr = 0.04;

		} else {
			this.traceStable[0].x = [0, 0];
			this.traceStable[0].y = this.polesZerosRange.continuous.y;

			this.layout.yaxis.range = this.polesZerosRange.continuous.y;
			this.layout.xaxis.range = this.polesZerosRange.continuous.x;

			this.distThr = 0.12;
		}


		if (this.showHelp) {
	        this.layour.annotations = [
	        	{x: 1,	y: 1, showarrow: false,
				text: 'Click: Add poles (Shift for real pole)'},
	        	{x: 1,	y: 0.9, showarrow: false,
				text: 'Alt Click: Add zeros (Shift for real zero)'},
	        	{x: 1,	y: 0.8, showarrow: false,
				text: 'right click: erase pole/zero'},
				]
		}

		this.renderPolesAndZeros();

		Plotly.redraw(this.divName);


		// have to be executed after plot in order to have _fullLayout populated
		// since we changed the geometry, we need to reassign xaxis so the mouse events 
		// have the right lenghts
		this.xaxis = this.gdPoles._fullLayout.xaxis;
		this.yaxis = this.gdPoles._fullLayout.yaxis;

	}






	toMatlab() {
		var poles = this.getAllPoles();
		var zeros = this.getAllZeros();

		var str = 'G = tf(poly([';

		for (var i = 0; i < zeros.length; i++) {
			if (zeros[i].imag != null) {
				str += zeros[i].real + '+' + zeros[i].imag + 'j,';
			} else {
				str += zeros[i].real + ',';
			}
		}
		str += ']), poly([';
		for (var i = 0; i < poles.length; i++) {
			if (poles[i].imag != null) {
				str += poles[i].real + '+' + poles[i].imag + 'j,';
			} else {
				str += poles[i].real + ',';
			}
		}
		str += ']))';

		return str;
	}


} // class









//
// Vector field
//

class VectorField {


	constructor(divName, minX = -2, maxX = 2, minY = -2, maxY = 2, NPoints = 40, arrowSize = 0.3, arrowAngle = 20) {
		this.divName = divName

		this.minX = minX;
		this.maxX = maxX;
		this.minY = minY;
		this.maxY = maxY;
		this.NPoints = NPoints;

		this.onClick = (x, y, bt) => { return 0; };

		this.layout = {
				margin: { l: 30, r: 30, b: 30, t: 30},
				yaxis: { range: [this.minX, this.maxX], scaleanchor:"x", scaleratio:1, title: { text: '$x_2$' , font : {size : 24}} },
				xaxis: { range: [this.minY, this.maxY], title: { text: '$x_1$', font : {size : 24}}, },
		        showlegend: false,
			};
		this.trace = [
			{
				mode: "lines",
				line : { width : 1 },
				x: [], 
				y: []
			}
		];
		this.traceParticles = [
			{
				mode: "markers",
				type: "scatter",
				marker: { size: 10, color: '#ff0000', symbol:'circle-closed' },
				x: [], 
				y: []
			}
		];
		this.traceLines = [
			
		];

		this.traceDirections = [
		];



		this.X = [];
		this.Y = [];
		this.U = [];
		this.V = [];

		this.arrowSize = arrowSize;
		this.arrowAngle = arrowAngle;

		this.gdPoles = document.getElementById(this.divName);

		Plotly.plot(this.divName, this.trace.concat(this.traceParticles.concat(this.traceLines.concat(this.traceDirections))), this.layout,  {displayModeBar: false, staticPlot:true}).then(this.attach(this));

		// have to beexecuted after plot in order to have _fullLayout populated
		this.xaxis = this.gdPoles._fullLayout.xaxis;
		this.yaxis = this.gdPoles._fullLayout.yaxis;

	}


	sample() {
		this.X = [];
		this.Y = [];
		this.U = [];
		this.V = [];

		for (var i = 0; i < this.NPoints; i++) {
			for (var j = 0; j < this.NPoints; j++) {
				var x = this.minX + (this.maxX - this.minX)*i/(this.NPoints-1);
				var y = this.minY + (this.maxY - this.minY)*j/(this.NPoints-1);

				var u = 0.5*x*Math.exp(-x*x*0.1 -y*y*0.1)*0.8;
				var v = 0.5*y*Math.exp(-x*x*0.1 -y*y*0.1)*0.8;

				this.X.push(x);
				this.Y.push(y);
				this.U.push(u);
				this.V.push(v);
			}
		}
	}



	getCordinatesAndButtonStatus(evt) {

		var geom = this.gdPoles.getBoundingClientRect();


		var xCoord = this.xaxis.p2c(evt.x - geom.x - this.layout.margin.l);
		var yCoord = this.yaxis.p2c(evt.y - geom.y - this.layout.margin.t);

		var btStatus = evt.buttons;

		return [xCoord, yCoord, btStatus];
	}



	attach(obj) {

		obj.gdPoles.addEventListener('mousedown', function(evt) {

			var xCoord;
			var yCoord;
			var btStatus;
			[xCoord, yCoord, btStatus] = obj.getCordinatesAndButtonStatus(evt);


			obj.onClick(xCoord, yCoord, btStatus);
		});
	}




	update() {

		var Px;
		var Py;

		[Px, Py] = VectorField.makeQuiver(this.X, this.Y, this.U, this.V, this.arrowSize, this.arrowAngle);

		this.trace[0].x = Px;
		this.trace[0].y = Py;

		Plotly.redraw(this.divName);
	}


	static arrow(p0, p1, arrowSize, sin45, cos45) {

		var len = Math.sqrt( (p0[0]-p1[0])*(p0[0]-p1[0]) + (p0[1]-p1[1])*(p0[1]-p1[1]) );
		var dx = p1[0]-p0[0];
		var dy = p1[1]-p0[1];
		var sinOi = dy/len;
		var cosOi = dx/len;


		// left
		var cosO =  cos45*cosOi + sin45*sinOi;
		var sinO = -sin45*cosOi + cos45*sinOi;

		var dxLeft0 = len*sinO*arrowSize;
		var dxLeft1 = -len*cosO*arrowSize;

		var paLeft0 = p1[0]+dxLeft0;
		var paLeft1 = p1[1]+dxLeft1;


		// right
		cosO =  cos45*cosOi - sin45*sinOi;
		sinO = sin45*cosOi + cos45*sinOi;

		var dxRight0 = -len*sinO*arrowSize;
		var dxRight1 = len*cosO*arrowSize;

		var paRight0 = p1[0]+dxRight0;
		var paRight1 = p1[1]+dxRight1;

		var x = [ p0[0], p1[0], null, p1[0], paLeft0, null, p1[0], paRight0, null ];
		var y = [ p0[1], p1[1], null, p1[1], paLeft1, null, p1[1], paRight1, null ];

		return [x,y]
	}




	static makeQuiver(X, Y, U, V, arrowSize, arrowAngle) {
		const PI = Math.PI;

		let cos45 = Math.cos(PI*(90-arrowAngle)/180);
		let sin45 = Math.sin(PI*(90-arrowAngle)/180);

		var XList = [];
		var YList = [];

		for (var i = 0; i < X.length; i++) {
			var x = X[i];
			var y = Y[i];
			var u = U[i];
			var v = V[i];

			var Px;
			var Py;
			[Px, Py] = VectorField.arrow([x, y],[x+u, y+v], arrowSize, sin45, cos45);

			var XList = XList.concat(Px);
			var YList = YList.concat(Py);
		}

		return [XList, YList];

	}


}















class FreqPlot {

	constructor(divName, NPoints = 200, minX = 0, maxX = 10, minY = -1.1, maxY = 1.1, discrete = 1, title = '') {
		this.divName = divName;

		this.NPoints = NPoints;

		this.minX = minX;
		this.maxX = maxX;
		this.minY = minY;
		this.maxY = maxY;

		this.X = [];
		this.Y = [];

		this.layout = {
			margin: { l: 65, r: 65, b: 65, t: 65, },
			xaxis: {range: [this.minX, this.maxX], title: 'frequency'},
			yaxis: {range: [this.minY, this.maxY], title: 'magnitude', titlefont : {color: '#4040c0'}},
			title: {text : title, font : { size : 14}},
			autosize: true,
			showlegend: false,
			yaxis2 : {
			    title: 'phase',
			    range : [-Math.PI, Math.PI],
			    overlaying: 'y',
			    side: 'right'
			}
		};

		this.traces = [{
			x: this.X,
			y: this.Y,
			mode: 'lines',
		},{
	        mode: "lines",
	        line : { width : 2, color:"#000000"},
	        x: [], 
	        y: [],
	        yaxis: 'y2',
		}];



		Plotly.plot(this.divName, this.traces, this.layout,  {displayModeBar: false, staticPlot:true});
	}


	update() {
		Plotly.redraw(this.divName);
	}


	sample() {
		var t = 0.0;
		var y = 0.0;

		for (var i = 0; i < this.NPoints; i++) {
			t = i*this.maxX/this.NPoints;
			y = 0;

			this.X.push(t);
			this.Y.push(y);
		}

	}



	compute(a, b) {
		var N = this.NPoints;
		var maxFreqRespAbs = 0;
		var maxFreqRespAngle = 0;

		this.traces[0].x = [];
		this.traces[0].y = [];

		this.traces[1].x = [];
		this.traces[1].y = [];


		for (var i = 0; i < N; i++) {
			var w = Math.PI*i/NPoints;

			this.traces[0].x.push( w );
			this.traces[1].x.push( w );

			var freqResp = {real: 0, imag:0};

			if (discrete) {
				var expjw = ComplexOps.exp({real:0, imag:w});
			} else {
				var expjw = {real:0, imag:w};
			}

			var num = Polynomial.eval(b, expjw);
			var den = Polynomial.eval(a, expjw);

			freqResp = ComplexOps.div(num, den);

			var freqRespAbs = ComplexOps.abs(freqResp);
			var freqRespAngle = ComplexOps.angle(freqResp);

			this.traces[0].y.push ( freqRespAbs );
			this.traces[1].y.push ( freqRespAngle );

			if (freqRespAbs > maxFreqRespAbs)
			  maxFreqRespAbs = freqRespAbs;
		}


		this.layout.yaxis.range = [0, maxFreqRespAbs];
	}


}




class TimePlot {


	constructor(divName, NPoints = 200, minX = 0, maxX = 10, minY = -1.1, maxY = 1.1, discrete = 1, dt = 0.01, maxStates = 20, maxTimeCont = 10, title = '') {
//		super(divName, NPoints = NPoints, minY = minY, maxY = maxY);

		this.divName = divName;


		this.X = [];
		this.Y = [];

		this.layout = {
			margin: { l: 65, r: 65, b: 65, t: 65, },
			xaxis: {range: [this.minX, this.maxX], text: 'x'},
			yaxis: {range: [this.minY, this.maxY], text: 'y', autorange: true},
			title: {text : title, font : { size : 14}},
			autosize: true,
			showlegend: false
		};

		this.traces = [{
			x: this.X,
			y: this.Y,
			mode: 'lines',
		}];




		this.NPoints = NPoints;
		this.minX = minX;
		this.maxX = maxX;
		this.minY = minY;
		this.maxY = maxY;
		this.discrete = discrete;
		this.dt = dt;
		this.maxStates = maxStates;
		this.discreteInputTimeScale = 8.0;
		this.maxTimeCont = maxTimeCont;

		this.layout.yaxis.range = [minY, maxY];

		this.Y = [];
		this.X = [];
		this.dX = [];


		console.log(minY, maxY);

		this.traces[0].x = [];
		this.traces[0].y = [];

		this.traces.push( {
		 	x: [],
		 	y: [],
		 	mode: 'markers',
		 	type: 'scatter'
		 });


		Plotly.plot(this.divName, this.traces, this.layout,  {displayModeBar: false, staticPlot:true});
	}


	init() {
		this.Y = new Array(this.NPoints).fill(0.0);
		this.X = new Array(this.maxStates).fill(0.0);
		this.dX = new Array(this.maxStates).fill(0.0);
	}


	// needs an external function u(t) that computes the input for time t
	compute(a_, b_) {


		var NPoints;

		if (this.discrete) {
			NPoints = parseInt(this.NPoints/6);

			this,maxX = NPoints;
			this.layout.xaxis.range = [0, NPoints];
		} else {
			NPoints = this.NPoints;

			this,maxX = this.dt*NPoints;
			this.layout.xaxis.range = [0, this.dt*NPoints];
		}

		this.Y = new Array(NPoints).fill(0);

		var states = new Array(a_.length-1).fill(0.0);
		var y_ = 0;
		var u_ = 0;

		for (var i = 0; i < NPoints; i++) {

			if (this.discrete) {
				u_ = u(i*this.dt*this.discreteInputTimeScale);
			} else {
				u_ = u(i*this.dt);
			}

			[states, y_] = simulateSystem(states, b_, a_, u_, this.dt, this.discrete);

			this.Y[i] = y_;

		}		


	}

/*
	// needs an external function u(t) that computes the input for time t
	compute2(a_, b_) {
		var NPoints;

		if (this.discrete) {
			NPoints = parseInt(this.NPoints/6);

			this,maxX = NPoints;
			this.layout.xaxis.range = [0, NPoints];
		} else {
			NPoints = this.NPoints;

			this,maxX = this.dt*NPoints;
			this.layout.xaxis.range = [0, this.dt*NPoints];
		}

		this.Y = new Array(NPoints).fill(0);


		var a = [].concat(a_);
		var b = [].concat(b_);

		if (this.discrete) {


			a = a.splice(1,a.length);

			var n = a.length;
			var m = b.length;


			var minY = 0;
			var maxY = 0;

			var D = 1 + a.reduce( (x,y) => x+y );
			var N = b.reduce( (x,y) => x+y );


//			b = b.map( x => (D/N)*x );


//			console.log( 'H = tf([' + b.join(',') + '],[1,' + a.join(',') +'],1);');



			for (var i = n-m+1; i < this.Y.length; i++) {


				for (var j = 0; j < n; j++) {
					var idx = i-j-1;
					if (idx>=0)
						this.Y[i] -= a[j]*this.Y[idx];
				}

				for (var j = 0; j < m; j++) {
					var idx = i-j-(n-m)-1;
					this.Y[i] += b[j]*u(idx);
				}


				if (minY > this.Y[i])
					minY = this.Y[i];
				if (maxY < this.Y[i])
					maxY = this.Y[i];

			}

		} else {

			var y = 0.0;

			var gain = b[b.length-1];


			var m = a.length;
			var n = b.length;

			b = new Array(m-n).fill(0.0).concat(b);


			// number of states
			n = m-1;


//			console.log( 'G = tf([' + b.join(',') + '],[' + a.join(',') +']);');


			for (var i = 0; i < this.X.length; i++) {
				this.dX[i] = 0.0;
				this.X[i] = 0.0;
			}	


			for (var k = 0; k < this.Y.length/(this.dt*this.maxTimeCont); k++) {

				// up diagonal of 1's
				for (var i = 0; i < n-1; i++) {
					this.dX[i] = this.X[i+1];
				}	

				// last line of A
				this.dX[n-1] = 0.0;
				for (var i = 0; i < n; i++) {
					this.dX[n-1] -= a[n-i]*this.X[i];
				}
				this.dX[n-1] += u(k*this.dt*this.discreteInputTimeScale);

				// output
				y = 0.0;
				for (var i = 0; i < n; i++) {
					y += (b[n-i] - a[n-i]*b[0])*this.X[i];
				}

				// euler integration
				for (var i = 0; i < n; i++) {
					this.X[i] += this.dX[i]*this.dt;
				}


				var idx = parseInt(k*this.dt*this.maxTimeCont);
				this.Y[idx] = y;

			}

		}

		//this.layout.yaxis.range = [minY, maxY*1.05];

	}
*/

	update() {

		this.traces[0].x = [];
		this.traces[0].y = [];

		this.traces[1].x = [];
		this.traces[1].y = [];

		for (var i = 0; i < this.Y.length; i++) {

			if (this.discrete) {

				this.traces[0].x.push(3*i);
				this.traces[0].y.push(0);

				this.traces[0].x.push(3*i+1);
				this.traces[0].y.push(0);

				this.traces[0].x.push(3*i+1);
				this.traces[0].y.push(this.Y[i]);

				this.traces[0].x.push(3*i+1);
				this.traces[0].y.push(0);

				this.traces[0].x.push(3*i+2);
				this.traces[0].y.push(0);

				this.traces[1].x.push(3*i+1);
				this.traces[1].y.push(this.Y[i]);
			} else {
				this.traces[0].x.push(i*this.dt);
				this.traces[0].y.push(this.Y[i]);
			}

		}

		Plotly.redraw(this.divName);
	}



	sample() {
		var t = 0.0;
		var y = 0.0;

		this.Y = [];
		for (var i = 0; i < this.NPoints; i++) {
			t = i*this.maxX/this.NPoints;
			y = 1.3*Math.sin(t/2)*Math.exp(-t/10);

			this.Y.push(y);
		}

	}




}





class ComplexOps {

  static dist(p1, p2) { return Math.sqrt(  (p1.real-p2.real)**2 + (p1.imag-p2.imag)**2  );};

  static conj(p1) { return {real:p1.real, imag:-p1.imag};};
  static prod(p1, p2) {return { real: p1.real*p2.real - p1.imag*p2.imag, imag : p1.imag*p2.real + p2.imag*p1.real }; };
  static div(p1, p2) { 
  	var den = p2.imag*p2.imag + p2.real*p2.real;

	var r = (p1.imag*p2.imag) + (p1.real*p2.real);
	var i = (p1.imag*p2.real) - (p2.imag*p1.real);

  	return { real: r/den, imag: i/den }; 
  };
  static neg(p1) {return { real: -p1.real, imag : -p1.imag }; };
  static add(p1, p2) {return { real: p1.real+p2.real, imag : p1.imag+p2.imag }; };
  static scalarProd(a, p1) { return { real: a*p1.real, imag: a*p1.imag }; };
  static pow(x, p) {
  	var res = {real: 1, imag: 0};
  	for (var i = 0; i < p; i++) {
  		res = ComplexOps.prod(res, x);
  	}
  	return res;
  }
  static exp(x) { return {real: Math.exp(x.real)*Math.cos(x.imag), imag: Math.exp(x.real)*Math.sin(x.imag)}; };
  static abs(x) { return Math.sqrt(x.real*x.real + x.imag*x.imag); };
  static angle(x) { 
  	var imag = x.imag;
  	if (imag == null)
  		imag = 0;
  	return Math.atan2(imag, x.real); 
  };

}






class Polynomial {

// Poly representation:
//
//  n = length(a)-1
//
//  a[0]*x^n + a[1]*x^(n-1) +  a[2]*x^(n-2) +  ...  +  a[n-1]*x +  a[n]
//  
//  eg: 
//        a[0]*x^4 + a[1]*x^3 +  a[2]*x^2 + a[1]*x +  a[0]
//
//        a[0]*x^2 + a[1]*x +  a[2]






static monomer(degree) {
	var res = new Array(degree+1).fill(0.0);

	res[0] = 1;

	return res;
}





static longDiv(poly1, poly2) {

	var n1 = poly1.length;
	var n2 = poly2.length;
	var n = 0;

	var rem = [].concat(poly1);
	var div = [];

	while (n<=(n1-n2)) {

		var mon = Polynomial.monomer(n1-n2-n);
		var q = rem[n]/poly2[0];
		var p = Polynomial.scalarProd( -q ,poly2  )
		rem = Polynomial.add(rem, Polynomial.prod( p, mon ) );

//		console.log(mon, p, q, rem);

		div.push(q);

		n++;
	}

	return [div, rem];
}




static neg(poly) {
	return poly.map(x=>-x);
}


static polySemiEval(roots, rootIndex) {
    var n = roots.length;

    var y = {real: 1, imag: 0};
    
    for (var i = 0; i < n; i++) {
        if (i != rootIndex) {
            y = ComplexOps.prod(y, ComplexOps.add(roots[rootIndex], ComplexOps.neg(roots[i])));
        }
	}

	return y;
}



static roots(poly, r0 = [], MAXITER = 20) {


	function step(poly, roots) {

	    for (var i = 0; i < roots.length; i++) {
	        roots[i] = ComplexOps.add( roots[i], ComplexOps.neg( ComplexOps.div( Polynomial.eval(poly, roots[i]), Polynomial.polySemiEval(roots, i) )  ) );
		}
	}


	if (r0.length == 0) {

		var maxAmp = 0;
		for (var i = 0; i < poly.length; i++) {
			var thisAmp = Math.abs(poly[i]);
			if (thisAmp>maxAmp) {
				maxAmp = thisAmp;
			}
		}
		maxAmp += 1;

		var r0 = [];
		for (var i = 0; i < poly.length-1; i++) {
			r0.push({real: (-0.5 + Math.random())*maxAmp, imag: (-0.5 + Math.random())*maxAmp});	
		}
	}

	for (var i = 0; i < MAXITER; i++) {
		step(poly, r0);
	}

	return r0;
}


static prod(poly1, poly2) {

	var n1 = poly1.length;
	var n2 = poly2.length;

	var res = [0.0];

	for (var i = 0; i < n2; i++) {

		var highPoly = poly1.concat(Array(n2-i-1).fill(0.0));

		highPoly = Polynomial.scalarProd(poly2[i], highPoly);

		res = Polynomial.add(res, highPoly);

	}

	return res;
}







static scalarProd(k, poly) {
	var res = [];

	for (var i = 0; i < poly.length; i++) {

		var c = poly[i]*k;

		res.push(c);
	}

	return res;
}






static add(polySmall, polyBig) {
	var nSmall = polySmall.length;
	var nBig = polyBig.length;

	var newPolySmall;
	var newPolyBig;

	if (nSmall>nBig) {
		newPolySmall = [].concat(polyBig);
		newPolyBig = [].concat(polySmall);
	} else {
		newPolySmall = [].concat(polySmall);
		newPolyBig = [].concat(polyBig);
	}

	var nSmall = newPolySmall.length;
	var nBig = newPolyBig.length;
	var nDiff = nBig - nSmall;

	var res = [].concat(newPolyBig);

	for (var i = 0; i < nSmall; i++) {

		res[i+nDiff] += newPolySmall[i];
	}


	return res;
}






static diff(poly) {
	var n = poly.length;
	var res = [];

	for (var i = 0; i < n-1; i++) {
		var c = poly[i]*(n-i-1);
		res.push(c);
	}

	return res;
}



static eval(poly, x) {
	var n = poly.length;
	var res = {real: 0, imag:0};

	for (var i = 0; i < n; i++) {
		var a = poly[i];

		var zn = ComplexOps.pow(x, n-i-1);

		var term = ComplexOps.scalarProd(a, zn);

		res = ComplexOps.add(res, term);
	}

	return res;
}



static elementarySymmetricList(list, k) {
  /*
    Returns the list for computing the Elementary Symmetric Sum formula for combinations of elements in products among k of them.
    Ex.:

    elementarySymmetricList([1,2,3,4,5], 3) = [[1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5], [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]]
  */

  if (k==1) {
    return list.map( (x) => [x]);
  }

  var resultList = [];

  for (var i = 0; i < list.length-k+1; i++) {
    var item = list[i];

    var listCopy = [].concat(list);

    var newList = Polynomial.elementarySymmetricList(listCopy.splice(i+1,list.length), k-1);

    var expandedNewList = newList.map( x => [item].concat(x));

    var resultList = resultList.concat(expandedNewList);
  }

  return resultList;
}





static vietasFormula(roots) {
  /*
    Implements Vieta's formula for coefficients of polynomials
  */

  var powM1 = (n) => { return -1*(n%2) + ((n+1)%2); };

  var n = roots.length;

  var a = Array(n).fill(0);
  for (var i = 0; i < roots.length; i++) {

    var list = Polynomial.elementarySymmetricList(roots, n-i);

	a[i] = {real: 0, imag:0};

	for (var j = 0; j < list.length; j++) {
		var elements = list[j];

		var prod = elements.reduce( (x,y) => ComplexOps.prod(x,y) );

		a[i] = ComplexOps.add(a[i], prod);
	}

	a[i].real *= powM1(n-i);
	a[i].imag *= powM1(n-i);

  }

  a.reverse();

  return [1].concat(a.map( x => x.real ));



}





static rootsToCoefs(roots) {
	return Polynomial.vietasFormula(roots);
}




}










