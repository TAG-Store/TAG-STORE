function copyText(t){
  navigator.clipboard.writeText(t).then(showToast).catch(function(){
    var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();showToast();
  });
}
function showToast(){var t=document.getElementById('toast');t.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(function(){t.classList.remove('show');},1600);}

var rendered={};
function renderQR(qrId){
  if(rendered[qrId]) return;
  var el=document.getElementById(qrId);
  if(!el) return;
  var val=el.getAttribute('data-qr');
  var logo=el.getAttribute('data-logo');

  var size = el.offsetWidth || 235;

  var opts={
    type:'svg',
    width:size, height:size, data:val, margin:0,
    dotsOptions:{ type:'extra-rounded', color:'#ffffff' },
    cornersSquareOptions:{ type:'extra-rounded', color:'#ffffff' },
    cornersDotOptions:{ type:'dot', color:'#ffffff' },
    backgroundOptions:{ color:'#000000' },
    qrOptions:{ errorCorrectionLevel:'H' }
  };
  if(logo){
    opts.image=logo;
    opts.imageOptions={ crossOrigin:'anonymous', margin:4, imageSize:0.38, hideBackgroundDots:true };
  }

  var qrCode = new QRCodeStyling(opts);
  qrCode.append(el);

  var svg = el.querySelector('svg');
  if(svg){
    svg.style.width  = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
  }

  rendered[qrId]=true;
}

document.addEventListener('DOMContentLoaded', function(){
  var siteQR = document.getElementById('qr-site');
  if(siteQR){ siteQR.setAttribute('data-qr', window.location.href); }
  ['qr-1','qr-2','qr-3','qr-4','qr-site'].forEach(renderQR);
});
