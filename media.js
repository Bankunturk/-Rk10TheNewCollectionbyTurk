/* Media controls shared by the current gallery and the original collection. */
'use strict';
function mediaMessage(th,en){const el=document.getElementById('media-status');if(el)el.textContent=document.documentElement.lang==='en'?en:th;}
function photoActions(item,index){
  const en=document.documentElement.lang==='en', box=document.createElement('div');box.className='photo-actions';
  const filename='RK10-'+String(index+1).padStart(2,'0')+'-'+item.src.split('/').pop();
  const save=document.createElement('a');save.href=item.src;save.download=filename;save.textContent=en?'Save photo':'บันทึกรูป';
  const original=document.createElement('a');original.href=item.src;original.target='_blank';original.rel='noopener';original.textContent=en?'Open original':'เปิดต้นฉบับ';
  const share=document.createElement('button');share.type='button';share.textContent=en?'Share':'แชร์รูป';
  share.addEventListener('click',async()=>{
    const url=new URL(item.src,location.href).href;
    try{if(navigator.share){await navigator.share({title:en?item.en:item.th,url});}
      else{await navigator.clipboard.writeText(url);mediaMessage('คัดลอกลิงก์ภาพแล้ว พร้อมส่งต่อ','Image link copied. Ready to share.');}}
    catch(e){if(e.name!=='AbortError')mediaMessage('กรุณาเลือก “เปิดต้นฉบับ” แล้วแชร์จากเมนูของเบราว์เซอร์','Open the original and share from your browser menu.');}
  });box.append(save,original,share);return box;
}
function saveBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
// ZIP STORE keeps JPEG bytes unchanged, with CRC32 and UTF-8 filenames.
function makePhotoZip(files){
  const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  const enc=new TextEncoder(),parts=[],directory=[];let offset=0;
  const header=size=>{const bytes=new Uint8Array(size);return [bytes,new DataView(bytes.buffer)];};
  for(const file of files){const name=enc.encode(file.name),data=file.data;let crc=0xffffffff;for(const b of data)crc=table[(crc^b)&255]^(crc>>>8);crc=(crc^0xffffffff)>>>0;
    const [local,v]=header(30);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,0x21,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);parts.push(local,name,data);
    const [central,c]=header(46);c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);directory.push(central,name);offset+=30+name.length+data.length;
  }
  const dirSize=directory.reduce((n,p)=>n+p.length,0),[end,e]=header(22);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,dirSize,true);e.setUint32(16,offset,true);return new Blob([...parts,...directory,end],{type:'application/zip'});
}
async function downloadPhotos(items,button,name){
  if(button.disabled)return;button.disabled=true;const files=[];
  try{for(let i=0;i<items.length;i++){
    mediaMessage('กำลังเตรียมภาพ '+(i+1)+' / '+items.length,'Preparing photo '+(i+1)+' / '+items.length);
    const response=await fetch(items[i].src);if(!response.ok)throw Error('Image '+(i+1));const data=new Uint8Array(await response.arrayBuffer());
    if(data[0]!==0xff||data[1]!==0xd8)throw Error('Invalid JPEG');files.push({name:String(i+1).padStart(2,'0')+'-'+items[i].src.split('/').pop(),data});
  }saveBlob(makePhotoZip(files),name);mediaMessage('ส่งไฟล์ ZIP ให้เบราว์เซอร์แล้ว ตรวจในรายการดาวน์โหลดหรือแอปไฟล์','ZIP prepared. Check browser Downloads or the Files app.');}
  catch{mediaMessage('ดาวน์โหลดรวมไม่สำเร็จ ลองอีกครั้ง หรือบันทึกทีละภาพจาก “เปิดต้นฉบับ”','ZIP could not be downloaded. Retry or save individual originals.');}
  finally{button.disabled=false;}
}
