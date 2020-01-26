const curveHeight = 40;
const arrowProps = {
  w: 16, h: 20, offset: 4
};

const partCurve = ( ctx, x,y, w,ch, hdir,vdir ) => {
  const coeff = 0.552284749831;
  ctx.bezierCurveTo(
    x + hdir * w * coeff, y,
    x + hdir * w, y + vdir * ch * coeff,
    x + hdir * w, y + vdir * ch
  );
}

const partArrowhead = ( ctx, x,y, w,h, vdir, color ) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo( x - h/2, y );
  ctx.lineTo( x + h/2, y );
  ctx.lineTo( x, y + vdir * h );
  ctx.closePath();
  ctx.fill();
}

const drawLine = ( ctx, x,y, y2, w, hdir, hue,width=3 ) => {
  const vdir = Math.sign( y2 - y );
  const lineHeight = Math.abs( y2 - y ) - 2 * curveHeight;
  const lineColor = `hsl(${hue}, 50%, 66%)`;
  const arrowColor = `hsla(${hue}, 50%, 66%, 0.65)`;

  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(x,y);
  partCurve( ctx, x,y, w,curveHeight, hdir, vdir );
  ctx.lineTo( x + hdir * w, y + vdir * ( curveHeight + lineHeight ));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x,y2);
  partCurve( ctx, x,y2, w,curveHeight, hdir, -vdir );
  ctx.stroke();
  partArrowhead( ctx, x + hdir * w, y +vdir * ( curveHeight + arrowProps.offset), arrowProps.w, arrowProps.h, vdir, arrowColor );
  partArrowhead( ctx, x + hdir * w, y +vdir * ( curveHeight + lineHeight - arrowProps.offset - arrowProps.h), arrowProps.w, arrowProps.h, vdir, arrowColor );
}

const drawDirectLine = ( ctx, x,y, y2, hue, arrowY, width=3 ) => {
  const lineColor = `hsl(${hue}, 50%, 66%)`;
  const arrowColor = `hsla(${hue}, 50%, 66%, 0.65)`;

  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(x,y);
  ctx.lineTo(x, y2);
  ctx.stroke();
  partArrowhead( ctx, x, arrowY, arrowProps.w, arrowProps.h, 1, arrowColor );

}

export const addLine = ( lob, ctx, chartSpecs ) => {
  const cx = chartSpecs.w / 2;
  const y = chartSpecs.marginY + chartSpecs.nodeHeight * lob.startIndex;
  const y2 = chartSpecs.marginY + chartSpecs.nodeHeight * lob.nextIndex;
  const w = chartSpecs.nodeWidth / 2 + Math.floor( (lob.lane-1)/2) * chartSpecs.laneGap;
  const hdir = ( lob.lane % 2 ) ? 1 : -1;
  const hue = ( 0 + lob.lane * 36 ) % 360;
  if ( lob.startIndex == lob.nextIndex-1 && lob.lane == 0 ) {
    drawDirectLine( ctx, cx,y, y2, hue, y2-chartSpecs.iconHeight );
  } else {
    drawLine( ctx, cx, y, y2, w, hdir, hue );
  }
}
