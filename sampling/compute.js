function createOutputPlot(divName, title, xlabel) {

	let layout = {
		title: {text: title, x:0.1, xanchor : 'left', y:0.95, yanchor : 'top', font : {size:12} },
		margin: { l: 25, r: 25, b: 25, t: 25, },
		xaxis: {range: [0, 1], title: xlabel},
		yaxis: {range: [-2, 2], title: '', autorange: true},
		autosize: true,
		showlegend: false
	};

	let traces = [];


	Plotly.plot(divName, traces, layout,  {displayModeBar: false, staticPlot:true});

	return {layout: layout, traces: traces};
}














function bitRev(N, nBit) {

	var current = N;

	var reversed = 0;
  
	// loop through remaining bits
	var bitPointerR;
	var bitPointerD;
	for (bitPointerR = nBit-1, bitPointerD = 0; bitPointerD < nBit; bitPointerD++, bitPointerR--) {
		let bitR = 1<<bitPointerR;
		let bitD = 1<<bitPointerD;

		reversed |= ((N&bitR)>0)*bitD;
	}
  
    return reversed;
}


function swap(arr, idx1, idx2) {
	let tmp = arr[idx1];
	arr[idx1] = arr[idx2];
	arr[idx2] = tmp;
}


function fft(xReal, xImag, XReal, XImag, dir) {

	let N = xReal.length;

	let nBit = Math.log2(N);

	let idx = new Array(N).fill(0);

	for (var i = 0; i < N; i++) {
		idx[i] = bitRev(i,nBit);
	}


	for (var i = 0; i < N; i++) {
		XReal[i] = xReal[idx[i]];
		XImag[i] = xImag[idx[i]];
	}

	recFtt(xReal, xImag, XReal, XImag, dir, N, 0);
}




function recFtt(xReal, xImag, XReal, XImag, dir, N, i) {

	if (N==1) return;


	recFtt(xReal, xImag, XReal, XImag, dir, N/2, i);
	recFtt(xReal, xImag, XReal, XImag, dir, N/2, i+N/2);

	for (var k = 0; k < N/2; k++) {

		let idxe = k + i;
		let idxo = k + N/2 + i;

		let eXReal = XReal[idxe];
		let eXImag = XImag[idxe];

		let oXReal = XReal[idxo];
		let oXImag = XImag[idxo];

		let WReal  = Math.cos(-dir*2*Math.PI*k/N);
		let WImag  = Math.sin(-dir*2*Math.PI*k/N);

		XReal[idxe] = eXReal + multReal( oXReal, oXImag, WReal, WImag );
		XImag[idxe] = eXImag + multImag( oXReal, oXImag, WReal, WImag );

		XReal[idxo] = eXReal - multReal( oXReal, oXImag, WReal, WImag );
		XImag[idxo] = eXImag - multImag( oXReal, oXImag, WReal, WImag );

	}

}


function multReal(xReal, xImag, yReal, yImag) {
	return xReal*yReal - xImag*yImag;
}

function multImag(xReal, xImag, yReal, yImag) {
	return xImag*yReal + xReal*yImag;
}




function fftFlip(XReal) {

	let N = XReal.length;

	for (var i = 0; i < N/2; i++) {
		swap(XReal, i, (i+N/2)%N);
	}




}



function mag(xReal, xImag, res, factor = 1) {

	let N = xReal.length;

	for (var i = 0; i < N; i++) {
		res[i] = factor*Math.sqrt(xReal[i]*xReal[i] + xImag[i]*xImag[i])/Math.sqrt(N);
	}

}




function func4(t) {
	let f = 15*Math.PI;

	let y = Math.cos(f*t);

	return y;
}


function func1(t) {
	let f = 15.0;
	let di = 0.5;

	var y = Math.pow( Math.sin(f*(t - maxTime/2) + 1e-6)/(f*(t - maxTime/2) + 1e-6) ,2);
	for (var j = 0; j < 10; j++) {
		y += Math.pow(-1,j)*Math.pow( Math.sin(f*(di*j+t - maxTime/2) + 1e-6)/(f*(di*j+t - maxTime/2) + 1e-6) ,1);
		y += Math.pow(-1,j)*Math.pow( Math.sin(f*(-di*j+t - maxTime/2) + 1e-6)/(f*(-di*j+t - maxTime/2) + 1e-6) ,1);
	}

	y *= Math.exp(-0.1*(t-5)*(t-5));


	return y;
}


function func0(t) {
	let f = 15.0;
	let di = 0.5;

	var y = Math.pow( Math.sin(f*(t - maxTime/2) + 1e-6)/(f*(t - maxTime/2) + 1e-6) ,1);


	return y;
}




function func2(t) {
	let f = 15.0;
	let di = 0.5;

	var y = Math.cos( f*t);

	return y*(y>0);
}



function func3(t) {
	let f = 15.0;
	let di = 0.5;

	var y = (Math.cos(f*t) > 0)+0;


	return y;
}




SIGNALS = [func0, func1, func2, func3, func4];















