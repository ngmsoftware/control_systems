function clearBorders() {

	for (var i = 1; i <= 9; i++) {
		$('#line'+i).css("border","0px solid red");
	}
}



function updateReference() {
	_r[_t] = _r[_t-1];
}

function reference() {
//	_r[_t] = 3 + 0*(parseInt(_t/(STEPS*4))%2);
	_r[_t] = _globalRef;

	_rn[_n] = _r[_t];
}


function updateController() {
	_u[_t] = _u[_t-1];
}

function controller() {

	// e1 = _r[_t]-_y[_t];
	// e2 = _r[_t-1]-_y[_t-1];

	e1 = _en[_n];
	e2 = _en[_n-1];

	c1 = CTRLS[_ctrlsIndex][0];
	c2 = CTRLS[_ctrlsIndex][1];

	_u[_t] = _u[_t-1] + c1*(e1-e2) + c2*e1;

	_un[_n] = _u[_t];
}



function updateError() {
	_e[_t] = _e[_t-1];
}

function error() {
	_e[_t] = _r[_t]-_y[_t];

	_en[_n] = _e[_t];
}




function updateOutput() {
}

function output() {
	_yn[_n] = _y[_t];
}




function* stepY( stepFunc ) {

	if (_t < MAX_T) {


		for (var i = 0; i < STEPS; i++) {


			if (i == 1) {
				yield 'while';
			}

			if (i == parseInt(STEPS*_substepRef)) {
				reference();
				yield 'ref';
			}

			if (i == parseInt(STEPS*_substepOut)) {
				output();
				yield 'out';
			}

			if (i == parseInt(STEPS*_substepErr)) {
				error();
				yield 'err';
			}

			if (i == parseInt(STEPS*_substepContr)) {
				controller();
				yield 'ctrl';
			}

			if (i == parseInt(STEPS*_substepIncr)) {
				yield 'incr';
			}


			b = PLANTS[_plantsIndex][0];
			a1 = PLANTS[_plantsIndex][1];
			a2 = PLANTS[_plantsIndex][2];

			_x1[_t+1] = _x1[_t] + _x2[_t]*_dt;
			_x2[_t+1] = _x2[_t] + (b*_u[_t] - a1*_x2[_t] - a2*_x1[_t])*_dt;

			_y[_t+1] = _x1[_t+1];

			_t++;

			updateController();
			updateReference();
			updateError();
			updateOutput();


			stepFunc();

		}

		yield 'n+1';

		_n++;

		yield* stepY(stepFunc);
	}

}