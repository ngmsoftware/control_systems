

class Osciloscope {

	constructor(MAX_T, MAX_N) {


		this.MAX_T = MAX_T;
		this.MAX_N = MAX_N;
		
		this.lastT = 0;

		this.layout = {
			margin: {
				l: 15,
				r: 5,
				b: 15,
				t: 5,
			},
			xaxis: {
				title: { text: 'time' },
				range: [0, 1],
			},
			yaxis: {
				title: { text: 'time' },
				range: [-0.05, 6.1],
				autorange: true,
			},
			showlegend: false,
		};

		this.traces = [{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#0000ff'},
		},{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#ff0000'},
		},{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#000000'},
		},{
		  x: [],
		  y: [],
		  mode: 'markers',
		  marker: {color: '#000000', size:10},
		}];

		this.tracesBars = [{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#00ff00', dash: 'solid'},
		},{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#cccccc', dash: 'dash'},
		},{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#aaaaaa', dash: 'dot'},
		},{
		  x: [],
		  y: [],
		  mode: 'lines',
		  line: {color: '#ccccff', dash: 'dash'},
		}
		];


		Plotly.newPlot('osciloscopeDiv', this.traces.concat(this.tracesBars), this.layout,  {displayModeBar: false, staticPlot:true});

	}


	step(r, u, y, t, n, steps) {
/*
		this.traces[0].x = [];
		this.traces[0].y = [];
		this.traces[1].x = [];
		this.traces[1].y = [];
		this.traces[2].x = [];
		this.traces[2].y = [];

		this.tracesBars[0].x = [];
		this.tracesBars[0].y = [];
		this.tracesBars[1].x = [];
		this.tracesBars[1].y = [];
*/


		for (var i = this.lastT; i < t; i++) {
			var x = i*_dt;

			this.traces[0].x.push(x);
			this.traces[0].y.push(y[i]);

			this.traces[2].x.push(x);
			this.traces[2].y.push(r[i]);

			this.traces[1].x.push(x);
			this.traces[1].y.push(u[i]/U_SCALE);


			if ( 
				(i%steps == 0)
				) {
				this.tracesBars[0].x.push(x);
				this.tracesBars[0].y.push(6);
				this.tracesBars[0].x.push(x);
				this.tracesBars[0].y.push(-1);
			} else {
				this.tracesBars[0].x.push(undefined);
				this.tracesBars[0].y.push(undefined);
			}

			if ( 
				((i-parseInt(steps*_substepRef))%parseInt(steps) == 0)
				) {
				this.tracesBars[1].x.push(x);
				this.tracesBars[1].y.push(5);
				this.tracesBars[1].x.push(x);
				this.tracesBars[1].y.push(-0.5);
			} else {
				this.tracesBars[1].x.push(undefined);
				this.tracesBars[1].y.push(undefined);
			}

			if ( 
				((i-parseInt(steps*_substepOut))%parseInt(steps) == 0)
				) {
				this.tracesBars[2].x.push(x);
				this.tracesBars[2].y.push(5);
				this.tracesBars[2].x.push(x);
				this.tracesBars[2].y.push(-0.5);


				this.traces[3].x.push(x);
				this.traces[3].y.push(y[i]);
				this.traces[3].x.push(x);
				this.traces[3].y.push(r[i]);

			} else {
				this.traces[3].x.push(undefined);
				this.traces[3].y.push(undefined);

				this.tracesBars[2].x.push(undefined);
				this.tracesBars[2].y.push(undefined);
			}

			if ( 
				((i-parseInt(steps*_substepContr))%parseInt(steps) == 0)
				) {
				this.tracesBars[3].x.push(x);
				this.tracesBars[3].y.push(5);
				this.tracesBars[3].x.push(x);
				this.tracesBars[3].y.push(-0.5);
			} else {
				this.tracesBars[3].x.push(undefined);
				this.tracesBars[3].y.push(undefined);
			}
		}


		this.layout.xaxis.range = [0, Math.max(this.MAX_T*_dt/3, t*_dt)];

		this.lastT = t;


//		Plotly.plot('osciloscopeDiv', this.traces.concat(this.tracesBars), this.layout,  {displayModeBar: false, staticPlot:true});
		Plotly.redraw('osciloscopeDiv');

	}




}


