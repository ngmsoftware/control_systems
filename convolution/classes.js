

class PlotDiscrete {

	constructor(divName, N, funcs, colors, width, height, update, discrete = true) {

		this.divName = divName;
		this.N = N;
		this.funcs = funcs;
		this.colors = colors;
		
		this.displace = 0;

		this.discrete = discrete;

		this.update = update;

		this.layout = {
			width : width, height: height,
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
				range: [0, 1.1],
				autorange : false
			},
			showlegend: false,
		};

		this.traces = [{
		  x: [],
		  y: [],
		mode: 'markers',
		type: 'scatter',
		  marker: {color: '#000000'},
		},{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#0000ff'},
		},{
		  x: [],
		  y: [],
		mode: 'markers',
		type: 'scatter',
		  marker: {color: '#000000'},
		},{
		  x: [],
		  y: [],
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

		var geom = this.gdPoles.getBoundingClientRect();

		var xCoord = this.xaxis.p2c(evt.x - geom.x - this.layout.margin.l);

		var btStatus = evt.buttons;

		return [xCoord, btStatus];

	}



	attach(obj) {
		obj.gdPoles.addEventListener('mousemove', function(evt) {

			var xCoord;
			var btStatus;
			[xCoord, btStatus] = obj.getCordinatesAndButtonStatus(evt);

//			console.log(xCoord, yCoord, btStatus);

			if (obj.discrete)
				obj.displace = parseInt(5*xCoord);
			else 
				obj.displace = 50*xCoord;


			if (obj.update!== undefined) 
				obj.update(obj.displace, obj.discrete);

			obj.plot();
		});



	}



	plot() {

		var maxY = 0;
		var minY = 0;


		this.traces.splice(0,this.traces.length);

		for (var i = 0; i < this.funcs.length; i++) {
			let func = this.funcs[i];

			let tmp = this.colors[i].split('-')
			let color = tmp[0];
			let fill = tmp[1]=='fill'?'tozeroy':'';

			this.traces.push({
				x: [],
				y: [],
				mode: 'markers',
				type: 'scatter',
				marker: {color: 'black'},
			});
			this.traces.push({
				x: [],
				y: [],
				mode: 'lines',
				fill: fill,
				line: {color: color},
			});

			for (var j = -this.N/2; j < this.N/2; j++) {

				if (func !== null) {

					if (this.discrete) {

						var y = func(j);
						if (i==0) {
							y = func(this.displace - j);
						}


						this.traces[2*i].x.push(j + 0.2*i);
						this.traces[2*i].y.push(y);

						this.traces[2*i+1].x.push(j + 0.2*i);
						this.traces[2*i+1].x.push(j + 0.2*i);
						this.traces[2*i+1].x.push(j+1);
						this.traces[2*i+1].y.push(y);
						this.traces[2*i+1].y.push(0);
						this.traces[2*i+1].y.push(0);

					} else {

						var y = func(0.1*j);
						if (i==0) {
							y = func(0.1*(this.displace - j));
						}

						this.traces[2*i+1].x.push(0.1*j + 0.2*i);
						this.traces[2*i+1].y.push(y);


					}

					if (y>maxY)
						maxY = y;
					if (y<minY)
						minY = y;

				}
			}



		}

		if (maxY > 1.1)
			this.layout.yaxis.range[1] = maxY;
		else 
			this.layout.yaxis.range[1] = 1.1;

		if (minY < 0)
			this.layout.yaxis.range[0] = minY;
		else
			this.layout.yaxis.range[0] = 0;


		Plotly.redraw(this.divName);
	}


}







