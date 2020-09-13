function createOutputPlot(divName) {

	let layout = {
		margin: { l: 45, r: 15, b: 35, t: 15, },
		xaxis: {range: [0, 0.2], title: {text: 'time'}, autorange : true},
		yaxis: {range: [-2, 2], title : {text: 'amplitude'}, autorange : true},
		title: '',
		autosize: true,
		showlegend: false
	};

	let traces = [
	{x : [], y:[],  mode: 'lines', line : {size : 2, color : '#ff9090'}},
	{x : [], y:[],  mode: 'lines', line : {size : 2, color : '#90ff90'}},
	{x : [], y:[], 	mode: "markers", type: "scatter", marker: { size: 5, color: '#0000ff', symbol:'o' }}
	];


	Plotly.plot(divName, traces, layout,  {displayModeBar: false, staticPlot:true});

	return {traces : traces, layout: layout};
}







function discretizeZOH(b1, b0, a1, a0, h) {

let delta = a1*a1/4-a0;


if (delta>0) {
	c1r = Math.sqrt(delta);
	c1i = 0.0;
} else {
	c1r = 0.0;
	c1i = Math.sqrt(Math.abs(delta));
}

absC =  c1r*c1r + c1i*c1i;

T1 = Math.exp(-h*(a1 + c1r));
T2 = Math.exp((a1*h)/2);
T3 = Math.exp(h*(a1 + c1r));
T4 = Math.exp((h*(a1 + 4*c1r))/2);
T5 = Math.exp(c1r*h);

C1 = Math.cos(c1i*h);
C2 = Math.cos(2*c1i*h);

S1 = Math.sin(c1i*h);
S2 = Math.sin(2*c1i*h);

db1 =  - (((c1r*T1*C1)/(a0*(absC)) - (c1i*T1*S1)/(a0*(absC)))*(2*a0*b1*T2 - a1*b0*T2 + 2*b0*c1r*T2 - 4*b0*c1r*T3*C1 + 4*b0*c1i*T3*S1 - 2*a0*b1*T4*C2 + a1*b0*T4*C2 + 2*b0*c1r*T4*C2 - 2*b0*c1i*T4*S2))/4 - (((c1i*T1*C1)/(a0*(absC)) + (c1r*T1*S1)/(a0*(absC)))*(2*b0*c1i*T2 - 4*b0*c1i*T3*C1 - 4*b0*c1r*T3*S1 + 2*b0*c1i*T4*C2 - 2*a0*b1*T4*S2 + a1*b0*T4*S2 + 2*b0*c1r*T4*S2))/4;

db0 =                              - (((c1i*T1*C1)/(a0*(absC)) + (c1r*T1*S1)/(a0*(absC)))*(2*b0*c1i*T2 - 4*b0*c1i*T5*C1 - 4*b0*c1r*T5*S1 + 2*b0*c1i*T4*C2 + 2*a0*b1*T4*S2 - a1*b0*T4*S2 + 2*b0*c1r*T4*S2))/4 - (((c1r*T1*C1)/(a0*(absC)) - (c1i*T1*S1)/(a0*(absC)))*(a1*b0*T2 - 2*a0*b1*T2 + 2*b0*c1r*T2 - 4*b0*c1r*T5*C1 + 4*b0*c1i*T5*S1 + 2*a0*b1*T4*C2 - a1*b0*T4*C2 + 2*b0*c1r*T4*C2 - 2*b0*c1i*T4*S2))/4;

da1 =  - T1*C1*(T2 + T4*C2) - T1*T4*S1*S2;

da0 =                                                                      T1*T5;

	return [0, db1, db0, 1, da1, da0];
}


function discretizeImpulse(b1, b0, a1, a0, h) {

	let gainS = b0/a0;

	let delta = a1*a1/4-a0;


	if (delta>0) {
		c1r = Math.sqrt(delta);
		c1i = 0.0;
	} else {
		c1r = 0.0;
		c1i = Math.sqrt(Math.abs(delta));
	}

	let T1 = Math.exp(-h*(a1 + c1r));
	let T2 = Math.exp((a1*h)/2);
	let T3 = Math.exp((h*(a1 + 4*c1r))/2);
	let T4 = Math.exp(c1r*h);

	let C1 = Math.cos(c1i*h);
	let C2 = Math.cos(2*c1i*h);
	 
	let S1 = Math.sin(c1i*h);
	let S2 = Math.sin(2*c1i*h);

	let cAmp = c1i*c1i + c1r*c1r;

	let db0 = - ((4*c1r*T1*C1)/(16*cAmp) - (4*c1i*T1*S1)/(16*cAmp))*(2*b0*T2 - a1*b1*T2 + 2*b1*c1r*T2 - 2*b0*T3*C2 + a1*b1*T3*C2 + 2*b1*c1r*T3*C2 - 2*b1*c1i*T3*S2) - ((4*c1i*T1*C1)/(16*cAmp) + (4*c1r*T1*S1)/(16*cAmp))*(2*b1*c1i*T2 - 2*b0*T3*S2 + 2*b1*c1i*T3*C2 + a1*b1*T3*S2 + 2*b1*c1r*T3*S2);
	 
	 
	let db1 = b1;
	 
	 
	let da0 = T1*T4;
	 
	 
	let da1 = - T1*C1*(T2 + T3*C2) - T1*T3*S1*S2;
 

	let gainD = (db1+db0)/(1+da1+da0);

	return [0, h*db1, h*db0, 1, da1, da0];
}


function discretizeTustin(b1, b0, a1, a0, h) {


	let db0 = -(h*(2*b1 - b0*h))/(a0*h*h + 2*a1*h + 4);
	let db1 =  (h*(2*b1 + b0*h) - h*(2*b1 - b0*h))/(a0*h*h + 2*a1*h + 4);
	let db2 =  (h*(2*b1 + b0*h))/(a0*h*h + 2*a1*h + 4);
 
 
	let da0 = (a0*h*h - 2*a1*h + 4)/(a0*h*h + 2*a1*h + 4);
	let da1 = (2*a0*h*h - 8)/(a0*h*h + 2*a1*h + 4);


	return [db2, db1, db0, 1, da1, da0];
}


function discretizeForward(b1, b0, a1, a0, h) {


	let db0 = -h*(b1 - b0*h);
	let db1 = b1*h
 
 
	let da0 = a0*h*h - a1*h + 1;
	let da1 = a1*h - 2;

	return [0, db1, db0, 1, da1, da0];
}

function discretizeBackward(b1, b0, a1, a0, h) {

	let db0 = -(b1*h)/(a0*h*h + a1*h + 1);
	let db1 = (h*(b1 + b0*h))/(a0*h*h + a1*h + 1);
 
 
	let da0 =  1/(a0*h*h + a1*h + 1);
	let da1 = -(a1*h + 2)/(a0*h*h + a1*h + 1);

	return [0, db1, db0, 1, da1, da0];
}


function discretizeMatched(b1, b0, a1, a0, h) {

	let delta = a1*a1-4*a0;


	if (delta>0) {
		c1r = Math.sqrt(delta);
		c1i = 0.0;
	} else {
		c1r = 0.0;
		c1i = Math.sqrt(Math.abs(delta));
	}

	absC =  c1r*c1r + c1i*c1i;

 
	let db0 = (b0*(Math.exp(a1*h) - Math.exp((h*(a1 + c1r))/2)*Math.cos((c1i*h)/2) - Math.exp((h*(a1 - c1r))/2)*Math.cos((c1i*h)/2) + 1))/(a0*(Math.exp(a1*h) - Math.exp((h*(b0 + a1*b1))/b1)));
	let db1 = -(b0*(Math.exp((b0*h)/b1) + Math.exp((h*(b0 + a1*b1))/b1) - Math.exp((h*(2*b0 + a1*b1 + b1*c1r))/(2*b1))*Math.cos((c1i*h)/2) - Math.exp((h*(2*b0 + a1*b1 - b1*c1r))/(2*b1))*Math.cos((c1i*h)/2)))/(a0*(Math.exp(a1*h) - Math.exp((h*(b0 + a1*b1))/b1)));
 
 
	let da0 = Math.exp(-a1*h);
	let da1 = -Math.exp(-a1*h)*Math.cos((c1i*h)/2)*(Math.exp((h*(a1 + c1r))/2) + Math.exp((h*(a1 - c1r))/2));

	return [0, db1, db0, 1, da1, da0];
}









function ideal(s, T, w0=0.01) {

	let sR = s.real;
	let sI = s.imag;

	let zR = Math.exp(T*sR)*Math.cos(T*sI);
	let zI = Math.exp(T*sR)*Math.sin(T*sI);

	return new Singularity(zR, zI);
}


function tustin(s, T, w0=0.01) {

	let sR = s.real;
	let sI = s.imag;

	let a = w0/Math.tan(w0*T/2);

	let mod = (sI*sI + (a - sR)*(a - sR));

	let zR = ((a + sR)*(a - sR))/mod - sI*sI/mod;
	let zI = (sI*(a + sR))/mod + (sI*(a - sR))/mod;

	return new Singularity(zR, zI);
}


function backward(s, T, w0=0.01) {

	let sR = s.real;
	let sI = s.imag;

	let mod = (T*T*sI*sI + (T*sR - 1)*(T*sR - 1));

	let zR = -(T*sR - 1)/mod;
 	let zI = (T*sI)/mod;
 

	return new Singularity(zR, zI);
}


function forward(s, T, w0=0.01) {

	let sR = s.real;
	let sI = s.imag;

	let zR = T*sR+1;
	let zI = T*sI;

	return new Singularity(zR, zI);
}

/*
function ZOH(s, T, num) {

	let res = discretizeZOH(num[1], num[0], -2*s.real, s.real*s.real+s.imag*s.imag, T);


	let a = 1;
	let b = res[4];
	let c = res[5];

	let delta = b*b - 4*a*c;

	var zI;
	var zR;

	zI = Math.sqrt(Math.abs(delta))/(2*a);
	zR = -b/(2*a);


	return new Singularity(zR, zI);
}



function impulse(s, T, num) {

	let res = discretizeImpulse(num[1], num[0], -2*s.real, s.real*s.real+s.imag*s.imag, T);


	let a = 1;
	let b = res[4];
	let c = res[5];

	let delta = b*b - 4*a*c;

	var zI;
	var zR;

	zI = Math.sqrt(Math.abs(delta))/(2*a);
	zR = -b/(2*a);


	return new Singularity(zR, zI);
}


function matched(s, T, num) {
	return ZOH(s, T, num);
}
*/

function stepInputC(t, dt) {
	return t>0;
}

function stepInputD(n, T) {
	return n>0;
}



function impulseInputC(t, dt) {
	return (t<dt)/dt;
}

function impulseInputD(n, T) {
	return (n==0)/T;
}





function pnoiseInputC(t, dt) {
	return noise(t);
}

function pnoiseInputD(n, T) {
	return noise(n*T);
}




