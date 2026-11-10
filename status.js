// Compatibility for older pages. All prices/statuses are maintained in units.json.
(function(){
  function render(data){
    window.RK10_UPDATED=data.updated;window.RK10_PRICE=Number(data.price).toLocaleString('en-GB');window.RK10_UNITS=data.units;
    const el=document.getElementById('unitStatus');if(!el)return;el.replaceChildren();
    const list=document.createElement('div');list.style.cssText='display:flex;gap:12px;flex-wrap:wrap';
    data.units.forEach(u=>{const card=document.createElement('p');card.style.cssText='border:1px solid #cdd1c6;padding:12px;border-radius:10px';
      card.textContent=u.plot+' · '+u.no+' · '+Number(u.price||data.price).toLocaleString('th-TH')+' บาท · '+({free:'พร้อมขาย',hold:'รอจอง',pending:'รอจอง',reserved:'ติดจอง',sold:'ขายแล้ว'}[u.s]||'กรุณาตรวจสอบสถานะ');list.append(card);});
    const date=document.createElement('p');date.textContent='สถานะตามข้อมูลเดิม อัปเดต '+data.updatedTh;el.append(list,date);
  }
  function start(){fetch('units.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('units');return r.json();}).then(render).catch(()=>{const el=document.getElementById('unitStatus');if(el)el.textContent='โหลดสถานะไม่สำเร็จ กรุณารีเฟรชและตรวจสอบก่อนจอง';});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
