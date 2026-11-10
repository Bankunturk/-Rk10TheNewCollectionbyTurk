'use strict';
fetch('archive-gallery.json').then(r=>{if(!r.ok)throw Error('gallery');return r.json();}).then(items=>{
  const grid=document.getElementById('archive-grid'),button=document.getElementById('download-archive');
  items.forEach((item,i)=>{const card=document.createElement('article');card.className='photo-card';const link=document.createElement('a');link.href=item.src;link.target='_blank';link.rel='noopener';const img=document.createElement('img');img.src=item.src;img.alt=item.th;img.loading='lazy';link.append(img);const caption=document.createElement('p');caption.textContent=String(i+1).padStart(2,'0')+' · '+item.th;card.append(link,caption,photoActions(item,i));grid.append(card);});
  button.disabled=false;button.addEventListener('click',()=>downloadPhotos(items,button,'RK10-original-32-20261102.zip'));mediaMessage('ครบ 32 ภาพ · บันทึกทีละภาพหรือดาวน์โหลดรวมได้','32 photos. Save individually or download the ZIP.');
}).catch(()=>mediaMessage('โหลดรายการภาพไม่สำเร็จ กรุณารีเฟรช','Could not load the collection. Please refresh.'));
