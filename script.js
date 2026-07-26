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
  new QRCode(el,{text:val,width:200,height:200,colorDark:'#141310',colorLight:'#f2f1ec',correctLevel:QRCode.CorrectLevel.H});
  var bg=el.getAttribute('data-bg'), t=el.getAttribute('data-t');
  var b=document.createElement('div');b.className='qr-badge';b.style.background=bg;b.innerHTML=t;el.appendChild(b);
  rendered[qrId]=true;
}
document.addEventListener('DOMContentLoaded', function(){
  ['qr-1','qr-2','qr-3','qr-4'].forEach(renderQR);
});