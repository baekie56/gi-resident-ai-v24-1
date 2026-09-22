
(function(){
  function addNote(){
    const main=document.getElementById('main');
    if(!main) return;
  }
  function syncVersion(){
    document.title='GI Resident AI V24.0 · 住培辅助教学';
    document.querySelectorAll('.logo small').forEach(x=>x.textContent='RESIDENCY TRAINING · V19');
    document.querySelectorAll('.login .pill').forEach(x=>x.textContent='GI Resident AI · v19');
  }
  const oldAtlas=window.openToolAtlas;
  if(oldAtlas){
    window.openToolAtlas=function(){
      oldAtlas();
      const main=document.getElementById('main');
      if(!main) return;
      const note=document.createElement('div');
      note.className='notice';
      note.style.margin='0 0 16px';
      note.innerHTML='<b>v19 高清器械图：</b>已换成厂商官方实物照片，并提供点击放大。FNA 使用蓝色手柄和斜面单刃针尖图，FNB 使用绿色手柄和 Franseen 三叉冠状针尖图。';
      main.insertBefore(note, main.firstChild.nextSibling);
      if(window.fixAllToolImages) window.fixAllToolImages(document);
    }
  }
  window.addEventListener('load',()=>{ syncVersion(); if(window.fixAllToolImages) { window.fixAllToolImages(document); setTimeout(()=>window.fixAllToolImages(document),300); } });
})();
