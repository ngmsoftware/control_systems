	function createOutputPlot(divName) {

		let layout = {
			margin: { l: 35, r: 15, b: 35, t: 15, },
			xaxis: {range: [0, 0.2], title:{text: 'time', font:{size:14}}},
			yaxis: {range: [-2, 2], title:{text: 'amplitude', font:{size:14}}},
			title: '',
			autosize: true,
			showlegend: false
		};

		let traces = [];


		Plotly.plot(divName, traces, layout,  {displayModeBar: false, staticPlot:true});

		return traces;
	}










	function zeroPoleToStateSpace(zeros, poles, canonical) {

		let N = Polynomial.rootsToCoefs(zeros);
		let D = Polynomial.rootsToCoefs(poles);

		var res;
		if (canonical == "1") {
			res = [-D[1], 1, -D[2], 0, N[0], N[1], 1, 0];
		} else {
			res = [0, 1, -D[2], -D[1], 0, 1, N[1], N[0]];
		}


		return res;

	}





	function invA(a11, a12, a21, a22) {
		let ia11 = a22/(a11*a22 - a12*a21);
		let ia12 = -a12/(a11*a22 - a12*a21);
		let ia21 = -a21/(a11*a22 - a12*a21);
		let ia22 = a11/(a11*a22 - a12*a21);

		return [ia11, ia12, ia21, ia22];
	}



	function stateSpaceToPoles(a11, a12, a21, a22, b1, b2, c1, c2) {

//		let zero1 = (a22*b1 - a12*b2)/b1;
		let zero1 = (a11*b2*c2 - a12*b2*c1 - a21*b1*c2 + a22*b1*c1)/(b1*c1 + b2*c2);
 

		let delta = a11*a11 - 2*a11*a22 + a22*a22 + 4*a12*a21;

		var p1;
		var p2;

		singularities = [];

		if (delta>0) {

	 		pole1 = {real: a11/2 + a22/2 - Math.sqrt(delta)/2, imag: 0};
	 		pole2 = {real: a11/2 + a22/2 + Math.sqrt(delta)/2, imag: 0};

		 	poles = [new Singularity(pole1.real), new Singularity(pole2.real) ];

	 	} else {

	 		pole1 = {real: a11/2 + a22/2,  imag: Math.sqrt(-delta)/2};

		 	poles = [new Singularity(pole1.real, pole1.imag)];
	 	}

	 	zeros = [new Singularity(zero1)];



	 	return [zeros, poles];
		
	}









    function stateEq(x, u, a11, a12, a21, a22, b1, b2) {
    	var dx1 = a11*x[0] + a12*x[1] + b1*u;
    	var dx2 = a21*x[0] + a22*x[1] + b2*u;

    	return [dx1, dx2];
    }








	function evolve(x, y, u, a11, a12, a21, a22, b1, b2, domain) {

		if (!domain) {

			for (var j = 0; j < 100; j++) {
				let V = stateEq([x, y], u, a11, a12, a21, a22, b1, b2);
				x += V[0]*dt;
				y += V[1]*dt;
			}
		} else {
			let V = stateEq([x, y], u, a11, a12, a21, a22, b1, b2);

			x = V[0];
			y = V[1];
		}

		return [x,y];
	}




function computeEigenvectors(a11, a12, a21, a22) {

	let v1 = (a11/2 + a22/2 - Math.sqrt(a11*a11 - 2*a11*a22 + a22*a22 + 4*a12*a21)/2)/a21 - a22/a21;
	let v2 = 1;
	let u1 = (a11/2 + a22/2 + Math.sqrt(a11*a11 - 2*a11*a22 + a22*a22 + 4*a12*a21)/2)/a21 - a22/a21;
	let u2 = 1;
 
	return [[v1, v2], [u1, u2]];
}

