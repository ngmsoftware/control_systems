function switchInput(onOff) {
	$('#imageSwitchInput').attr("src","images/switch"+onOff+".png");
}


function switchOutput(onOff) {
	$('#imageSwitchOutput').attr("src","images/switch"+onOff+".png");
}



function createOutputPlot(divName) {

	let layout = {
		margin: { l: 25, r: 25, b: 25, t: 25, },
		xaxis: {range: [0, 1], text: 'x'},
		yaxis: {range: [-3, 3], text: 'y'},
		title: '',
		autosize: true,
		showlegend: false
	};

	let traces = [];


	Plotly.plot(divName, traces, layout,  {displayModeBar: false, staticPlot:true});

	return {layout: layout, traces: traces};
}



function generateInput(N, type = 0) {

	let input = [];

	for (var i = 0; i < N; i++) {

		switch (type) {

			case 0:
				input.push( -2+4*Math.random() );
				break;

			case 1:
				input.push( 2 );
				break;

			case 2:
				input.push( 2*Math.sin(2*2*Math.PI*i/N) );
				break;

			case 3:
				if ( (i > parseInt(0.3*N)) && (i < parseInt(0.6*N)) )
					input.push( 2 );
				else 
					input.push( 0 );
				break;

		}
	}

	return input;
}



