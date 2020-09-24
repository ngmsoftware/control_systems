// utils


function factorial(n) {
  if (n==0)
    return 1;

  return n*factorial(n-1);
}


transposeArray = m => m[0].map((x,i) => m.map(x => x[i]))







function evalFunc(func, minX, maxX, N) {

  let X = [];
  let Y = [];

  for (var j = 0; j < N; j++) {
    let x = minX + j*(maxX-minX)/N;
    let y = func(x);

    X.push(x);
    Y.push(y);
  }

  return [X, Y];
}



function diff1D(func, dx, x0, order) {

  if (order == 0)
     return func(x0);

  let y2 = diff1D(func, dx, x0+dx/2, order-1);
  let y1 = diff1D(func, dx, x0-dx/2, order-1);

  let dY = (y2 - y1)/dx;

  return dY;
}



function taylor1D(func, x, x0, dx, order) {

  var y = func(x0);

  for (var j = 1; j <= order; j++) {
    let dy = diff1D(func, dx, x0, j);
    y += Math.pow(x-x0, j)*dy/factorial(j);
  }

  return y;
}




function evalTaylor1D(func, minX, maxX, N, order, x0) {

  let dx = (maxX-minX)/N;

  return evalFunc( x => taylor1D(func, x, x0, dx, order), minX, maxX, N );
}













function evalFunc2D(localFunc, minX, maxX, minY, maxY, N) {
  let X = [];
  let Y = [];
  let Z = [];


  for (var i = 0; i<N; i++) {
    var rowX = [];
    var rowY = [];
    var rowZ = [];
    for (var j = 0; j<N; j++) {
      var x = minX + (maxX-minX)*i/N;
      var y = minY + (maxY-minY)*j/N;
      var z = localFunc(x,y);

      rowX.push(x);
      rowY.push(y);
      rowZ.push(z);

    }
    X.push(rowX);
    Y.push(rowY);
    Z.push(rowZ);
  }


  return [X, Y, Z];
}




// function diff2D(func, dx, dy, x0, y0, orderx, ordery) {


//   if ( (orderx == 0)&&(ordery == 0) ) {
//      return func(x0, y0);
//   }

//   if (ordery == 0) {
//     let zx2 = diff2D(func, dx, dy, x0+dx/2, y0, orderx-1, 0);
//     let zx1 = diff2D(func, dx, dy, x0-dx/2, y0, orderx-1, 0);

//     let dZ = (zx2 - zx1)/dx;

//     return dZ;
//   }

//   if (orderx == 0) {
//     let zy2 = diff2D(func, dx, dy, x0, y0+dx/2, orderx, ordery-1);
//     let zy1 = diff2D(func, dx, dy, x0, y0-dx/2, orderx, ordery-1);

//     let dZ = (zy2 - zy1)/dy;

//     return dZ;
//    }


//   let zx2 = diff2D(func, dx, dy, x0+dx/2, y0, orderx-1, ordery);
//   let zx1 = diff2D(func, dx, dy, x0-dx/2, y0, orderx-1, ordery);


//   let zy2 = diff2D(func, dx, dy, x0, y0+dy/2, orderx, ordery-1);
//   let zy1 = diff2D(func, dx, dy, x0, y0-dy/2, orderx, ordery-1);


//   let dZ = ((zx2 - zx1)+(zy2 - zy1))/Math.sqrt(dx*dx + dy*dy);

//   return dZ;
// }


function diff2D(func, dx, dy, x0, y0, orderx, ordery) {


  if ( (orderx == 0)&&(ordery == 0) ) {
     return func(x0, y0);
  }

  if (ordery == 0) {

    let zx2 = diff2D(func, dx, dy, x0+dx/2, y0, orderx-1, 0);
    let zx1 = diff2D(func, dx, dy, x0-dx/2, y0, orderx-1, 0);

    let dZ = (zx2 - zx1)/dx;

    return dZ;

  } else {

    let zy2 = diff2D(func, dx, dy, x0, y0+dx/2, orderx, ordery-1);
    let zy1 = diff2D(func, dx, dy, x0, y0-dx/2, orderx, ordery-1);

    let dZ = (zy2 - zy1)/dy;

    return dZ;
  }

  // if (orderx == 0) {
  //   let zy2 = diff2D(func, dx, dy, x0, y0+dx/2, orderx, ordery-1);
  //   let zy1 = diff2D(func, dx, dy, x0, y0-dx/2, orderx, ordery-1);

  //   let dZ = (zy2 - zy1)/dy;

  //   return dZ;
  //  } else {

  //   let zx2 = diff2D(func, dx, dy, x0+dx/2, y0, orderx-1, 0);
  //   let zx1 = diff2D(func, dx, dy, x0-dx/2, y0, orderx-1, 0);

  //   let dZ = (zx2 - zx1)/dx;

  //   return dZ;

  //  }


  // let zx2y1 = diff2D(func, dx, dy, x0+dx/2, y0-dy/2, orderx-1, ordery);
  // let zx1y1 = diff2D(func, dx, dy, x0-dx/2, y0-dy/2, orderx-1, ordery);

  // let dzy1 = (zx2y1-zx1y1)/dx;

  // let zx2y2 = diff2D(func, dx, dy, x0+dx/2, y0+dy/2, orderx-1, ordery);
  // let zx1y2 = diff2D(func, dx, dy, x0-dx/2, y0+dy/2, orderx-1, ordery);

  // let dzy2 = (zx2y2-zx1y2)/dx;

  // let dZ = (dzy2 - dzy2)/dy;

  // return dZ;
}


function taylor2D(func, x, y, x0, y0, dx, dy, order) {

  if (   (Math.abs(x-x0)>4)||(Math.abs(y-y0)>4)   )
    return 0/0;

  var z = 0;

  for (var i = 0; i <= order; i++) {


    for (var j = 0; j <= i; j++) {

      let dz = diff2D(func, dx, dy, x0, y0, j, i-j);

      z += Math.pow(x-x0, j)*Math.pow(y-y0, i-j)*dz/(factorial(j)*factorial(i-j));
    }



  }

  return z;
}




function evalTaylor2D(func, minX, maxX, minY, maxY, N, order, x0, y0) {

  let dx = (maxX-minX)/N;
  let dy = (maxY-minY)/N;

  let Z = evalFunc2D( (x,y) => taylor2D(func, x, y, x0, y0, dx, dy, order), minX, maxX, minY, maxY, N );


  return Z;
}










function indexFromXCoord(x, minX, maxX, N) {
  let idx = parseInt( N*(x - MIN_X)/(MAX_X-MIN_X) );

  if (idx < 0)
    idx = 0;

  if (idx >= N)
    idx = N-1;

  return idx;
}