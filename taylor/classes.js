class Plot1D {

	constructor(divName, MIN_X, MAX_X, N, func, NTaylor, showAllAprox) {

		this.divName = divName;
		this.MIN_X = MIN_X;
		this.MAX_X = MAX_X;
		this.N = N;
		
		this.showAllAprox = showAllAprox;

		this.xCoord = 0;

		this.currentMouseX = 0;
		this.oldMouseX = 0;

		this.func = func;

		this.setNTaylor(NTaylor);

		this.layout = {
			width : 800, height: 600,
			margin: {
				l: 35,
				r: 35,
				b: 35,
				t: 35,
			},
			xaxis: {
				title: { text: 'x' },
				range: [MIN_X, MAX_X],
				autorange : true
			},
			yaxis: {
				title: { text: 'y' },
				range: [-10, 10],
			},
			showlegend: false,
		};

		this.traces = [{
		  x: [0, 0],
		  y: [0, 0],
		  mode: 'scatter',
		  marker: {color: '#000000'},
		},{
		  x: [0, 0],
		  y: [0, 0],
		  mode: 'lines',
		  line: {color: '#0000ff'},
		}];

		Plotly.newPlot(this.divName, this.traces, this.layout,  {displayModeBar: false, staticPlot:true});

		this.gdPoles = document.getElementById(this.divName);

		// have to beexecuted after plot in order to have _fullLayout populated
		this.xaxis = this.gdPoles._fullLayout.xaxis;
		this.yaxis = this.gdPoles._fullLayout.yaxis;

		this.attach(this);
	}


	getCordinatesAndButtonStatus(evt) {

		let evtX = evt.x;

		this.oldMouseX = this.currentMouseX;
		this.currentMouseX = evtX;

		var geom = this.gdPoles.getBoundingClientRect();

		var xCoordOld = this.xaxis.p2c(this.oldMouseX - geom.x - this.layout.margin.l);
		var xCoord = this.xaxis.p2c(this.currentMouseX - geom.x - this.layout.margin.l);

		var btStatus = evt.buttons;

		return [xCoord, xCoordOld, btStatus];

	}



	attach(obj) {
		obj.gdPoles.addEventListener('mousemove', function(evt) {

			var xCoord;
			var xCoordOld;
			var btStatus;
			[xCoord, xCoordOld, btStatus] = obj.getCordinatesAndButtonStatus(evt);

//			console.log(xCoord, yCoord, btStatus);

			obj.xCoord += (xCoord - xCoordOld);

			if (obj.xCoord > obj.MAX_X)
				obj.xCoord = obj.MAX_X;

			if (obj.xCoord < obj.MIN_X)
				obj.xCoord = obj.MIN_X;

			obj.plot();
		});



		obj.gdPoles.addEventListener('mousewheel', function(evt) {
			evt.preventDefault()


			let range = (obj.MAX_X - obj.MIN_X)*(1.0 + evt.deltaY/100);

			obj.MIN_X = obj.xCoord - range/2;
			obj.MAX_X = obj.xCoord + range/2;


			obj.plot();

		});



	}


	setNTaylor(n) {
		this.NTaylor = n;

		this.colors = [];
		for (var i = 0; i < n; i++) {
			this.colors = Math.floor(Math.random()*16777215).toString(16);
		}
	}


	setShowAllAprox(showAllAprox) {
		this.showAllAprox = showAllAprox;
	}



	plot() {

		// First trace is the original fixed function.
		// traces from 1 to length-1 are the derivatives (they move with the mark)
		// last trace is the marker itself

		// clean 
		this.traces.splice(0,this.traces.length);

		// generate fixed function
		var X;
		var Y;
		[X, Y] = evalFunc(this.func, this.MIN_X, this.MAX_X, this.N);
		this.traces.push({
			  x: X,
			  y: Y,
			  mode: 'lines',
			  line: {color: '#0000ff', width:4},
			});


		// generate taylor expansions
		var i0 = 0;
		if (!this.showAllAprox) {
			i0 = this.NTaylor-1;
		}
		for (var i = i0; i < this.NTaylor; i++) {
			var _X;
			var _Y;
			[_X, _Y] = evalTaylor1D(this.func, this.MIN_X, this.MAX_X, this.N, i+1, this.xCoord);
			this.traces.push({
				  x: _X,
				  y: _Y,
				  mode: 'lines',
				  line: {color: this.colors[i]},
				});
		}


		// generate marks
		this.traces.push({
			  x: [this.xCoord],
			  y: [this.func(this.xCoord)],
			  type: 'scatter',
			  mode: 'markers',
			  marker: {size: 12, color: '#000000'},
			});


		Plotly.redraw(this.divName);


		// have to be executed after plot in order to have _fullLayout populated
		// since we changed the geometry, we need to reassign xaxis so the mouse events 
		// have the right lenghts
		this.xaxis = this.gdPoles._fullLayout.xaxis;
		this.yaxis = this.gdPoles._fullLayout.yaxis;		
	}





}


















class Plot2D {

	constructor(divName, MIN_X, MAX_X, MIN_Y, MAX_Y, N, func, NTaylor) {

		this.divName = divName;
		this.MIN_X = MIN_X;
		this.MAX_X = MAX_X;
		this.MIN_Y = MIN_Y;
		this.MAX_Y = MAX_Y;
		this.N = N;
		
		this.xCoord = 0;
		this.yCoord = 0;

		this.func = func;

		this.setNTaylor(NTaylor);


		this.layout = {
			  margin: {
			    l: 25,
			    r: 25,
			    b: 25,
			    t: 25,
			  },
			  width : 900, height: 400,
			  xaxis: {range: [MIN_X, MAX_X], title : 'x' , autorange : false},
			  yaxis: {range: [MIN_Y, MAX_Y], title : 'y' , autorange : false},
			  zaxis: {range: [-0.1, 10.0], autorange : false},
			  title: '',
			  autosize: false,
			  showlegend: false,
			  scene : {
				aspectmode : "manual",
				aspectratio : { x:2, y:2, z:0.8},
				zaxis: {autorange : false, showspikes : false, },
				xaxis: {autorange : true, showspikes : false, },
				yaxis: {autorange : true, showspikes : false, },
				camera: {
					up : {x:0, y:0, z:1},
					center : {x:0, y:0, z:-0.3},
					eye : {x:-1.3, y:1.3, z:0.8}
				},
				
			  }
		}


		this.traces = [{ 
		  name:'',
		  x: [],
		  y: [],
		  z: [],
		  type: 'surface',
		  opacity: 1.0,
		  showscale: false,
		  hoverinfo: 'skip',
		  colorscale : [[0, 'rgb(0,120,20)'], [1, 'rgb(0,0,255)']],
		  autocontour: false,
		}];




		Plotly.newPlot(this.divName, this.traces, this.layout, {displayModeBar: false});

		this.gdPoles = document.getElementById(this.divName);

		// have to beexecuted after plot in order to have _fullLayout populated
		this.xaxis = this.gdPoles._fullLayout.xaxis;
		this.yaxis = this.gdPoles._fullLayout.yaxis;

		this.attach(this);



		this.gdPoles.on('plotly_click', function(data){
			console.log(data);
		});



	}




	attach(obj) {
		obj.gdPoles.addEventListener('mousemove', function(evt) {

			
			let pos3D = obj.gdPoles._fullLayout.scene._scene.glplot.selection.data.position;

			obj.xCoord = obj.MIN_X + (pos3D[0]+0.5)*(obj.MAX_X-obj.MIN_X);
			obj.yCoord = obj.MIN_Y + (pos3D[1]+0.5)*(obj.MAX_Y-obj.MIN_Y);


//			console.log(obj.xCoord, obj.yCoord);

			obj.plot();
		});



		// obj.gdPoles.addEventListener('mousewheel', function(evt) {

		// 	console.log(evt);

		// 	obj.plot();

		// });



	}


	setNTaylor(n) {
		this.NTaylor = n;

		this.colors = [];
		for (var i = 0; i < n; i++) {
			this.colors = Math.floor(Math.random()*16777215).toString(16);
		}
	}




	plot() {

		// First trace is the original fixed function.
		// traces from 1 to length-1 are the derivatives (they move with the mark)
		// last trace is the marker itself

		// clean 
		this.traces.splice(0,this.traces.length);



		// generate fixed function
		this.traces.push({ 
		  name:'',
		  x: [],
		  y: [],
		  z: [],
		  type: 'surface',
		  opacity: 0.9,
		  showscale: false,
		  hoverinfo: 'none',
		  colorscale : [[0, 'rgb(0,120,20)'], [1, 'rgb(0,0,255)']],
		  autocontour: false,
		  contours: {  x: { highlight: false, project : {x:false, y:false, z:false} },  y: { highlight: false, project : {x:false, y:false, z:false} },  z: { highlight: false, project : {x:false, y:false, z:false} } },
		});
		let dx = (this.MAX_X-this.MIN_X)/this.N;
		let dy = (this.MAX_X-this.MIN_X)/this.N;
//		[this.traces[0].x, this.traces[0].y, this.traces[0].z] = evalFunc2D((x,y)=>{ return diff2D(this.func, dx, dy, x, y, 2, 2);}, this.MIN_X, this.MAX_X, this.MIN_Y, this.MAX_Y, this.N);
		[this.traces[this.traces.length-1].x, this.traces[this.traces.length-1].y, this.traces[this.traces.length-1].z] = 
		    evalFunc2D(this.func, this.MIN_X, this.MAX_X, this.MIN_Y, this.MAX_Y, this.N);


		// generate taylor expansion
		this.traces.push({ 
		  name:'',
		  x: [],
		  y: [],
		  z: [],
		type: 'surface',
		  opacity: 0.3,
		  showscale: false,
		  hoverinfo: 'none',
		  colorscale : [[0, 'rgb(120,20,20)'], [1, 'rgb(255,250,55)']],
		  autocontour: false,
		  contours: {  x: { highlight: false, project : {x:false, y:false, z:false} },  y: { highlight: false, project : {x:false, y:false, z:false} },  z: { highlight: false, project : {x:false, y:false, z:false} } },
		});
		[this.traces[this.traces.length-1].x, this.traces[this.traces.length-1].y, this.traces[this.traces.length-1].z] = 
		     evalTaylor2D(this.func, this.MIN_X, this.MAX_X, this.MIN_Y, this.MAX_Y, this.N, this.NTaylor, this.xCoord, this.yCoord);




		// generate taylor expansion
		var X;
		var Y;
		var Z;
		this.traces.push({ 
		  name:'',
		  x: [],
		  y: [],
		  z: [],
		type: 'scatter3d',
		mode : 'lines',
		  hoverinfo: 'none',
		line : {size:2, color : '#0000f0'},
		});
		[X, Y, Z] = evalTaylor2D(this.func, this.MIN_X, this.MAX_X, this.MIN_Y, this.MAX_Y, this.N/4, this.NTaylor, this.xCoord, this.yCoord);

		let Xt = transposeArray(X).reduce( (x,y)=>x.concat(y));;
		let Yt = transposeArray(Y).reduce( (x,y)=>x.concat(y));;
		let Zt = transposeArray(Z).reduce( (x,y)=>x.concat(y));;
		
		X = X.reduce( (x,y)=>x.concat(y));
		Y = Y.reduce( (x,y)=>x.concat(y));
		Z = Z.reduce( (x,y)=>x.concat(y));

		this.traces[this.traces.length-1].x = X.concat(Xt);
		this.traces[this.traces.length-1].y = Y.concat(Yt);
		this.traces[this.traces.length-1].z = Z.concat(Zt);



		// generate taylor expansion
		this.traces.push({ 
		  name:'',
		  x: [this.xCoord],
		  y: [this.yCoord],
		  z: [this.func(this.xCoord, this.yCoord)],
		  type: 'scatter3d',
		  mode : 'markers',
		  marker : {size : 10, color : '#000000'},
		  opacity: 1,
		  hoverinfo: 'none',
		});



//		Plotly.react(this.divName, this.traces, this.layout, {displayModeBar: false});
		Plotly.redraw(this.divName);

		// have to be executed after plot in order to have _fullLayout populated
		// since we changed the geometry, we need to reassign xaxis so the mouse events 
		// have the right lenghts
		this.xaxis = this.gdPoles._fullLayout.xaxis;
		this.yaxis = this.gdPoles._fullLayout.yaxis;		

	}





}


