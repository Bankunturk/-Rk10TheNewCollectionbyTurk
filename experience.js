'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const text = {
    th: {welcomeStep:'The New Collection by บ้านคุณเตริก\n19 ตารางวา ที่ใส่ใจทุกตารางเมตร',next:'ถัดไป',made:'ทุกพื้นที่ เริ่มจากความใส่ใจ',back:'ย้อนกลับ',formTitle:'เพราะทีมงานคุณเตริก\nเข้าใจการทำงานของพี่ ๆ เอเจนซี่',formIntro:'เราจึงพัฒนาเว็บนี้เพื่อช่วยอำนวยความสะดวกสบายให้กับทุกท่าน\n\nง่าย ๆ ไม่กี่ขั้นตอน เพียงทุกท่านระบุข้อมูลในช่องชื่อและเบอร์โทรของคุณ (ไลน์ไม่บังคับ) เราจะไม่บันทึกข้อมูลของคุณลงฐานข้อมูล\n\nเราเพียงสร้างลิงก์เว็บไซต์ให้คุณส่งรูป ข้อมูล และดูบ้านที่ว่างของโครงการให้กับลูกค้าได้ภายในคลิกเดียว ในเว็บไซต์ลูกค้าจะเห็นเฉพาะข้อมูลติดต่อของคุณ\n\nมั่นใจได้เลยว่าเราตั้งใจจริง ๆ และขอบคุณทุกท่านที่ช่วยทำการตลาดเสมอมา',formSub:'by k.เตริก บ้านคุณเตริก',nameLabel:'ชื่อนายหน้า',phoneLabel:'เบอร์โทรศัพท์',lineLabel:'LINE ID (ไม่บังคับ)',namePlaceholder:'ระบุชื่อของคุณ',linePlaceholder:'LINE ID ของคุณ',confirm:'ยืนยันและสร้างลิงก์',formNote:'ข้อมูลติดต่อจะอยู่ในลิงก์ที่คุณสร้างและส่งให้ลูกค้า',successTitle:'ยินดีด้วย\nสร้างลิงก์เว็บไซต์สำเร็จแล้ว',successCopy:'คัดลอกลิงก์ของคุณเพื่อส่งให้ลูกค้าได้เลย\nข้อมูลติดต่อทุกอย่างจะเป็นของคุณตามที่กรอกไว้',linkLabel:'ลิงก์เว็บไซต์ของคุณ',copy:'คัดลอกลิงก์',copied:'คัดลอกแล้ว พร้อมส่งให้ลูกค้า',copyFallback:'เลือกลิงก์ไว้แล้ว กรุณากดคัดลอกบนอุปกรณ์ของคุณ',edit:'แก้ไขข้อมูลติดต่อ',seeHomes:'เลื่อนลงเพื่อดูบ้านทั้ง 7 หลัง',customerTagline:'19 ตารางวา ที่เราใส่ใจทุกตารางเมตร',homesTitle:'บ้านที่ใช่ ในแปลงที่คุณเลือก',reserved:'ติดจอง',available:'พร้อมขาย',pending:'รอจอง',sold:'ขายแล้ว',renderNote:'ภาพจำลองประกอบการนำเสนอ',photosTitle:'ทุกมุมของความใส่ใจ',yourAdvisor:'ติดต่อนายหน้า',call:'โทร',galleryError:'โหลดภาพไม่สำเร็จ กรุณารีเฟรชหน้าเว็บ',unit:'แปลง',statusDate:'สถานะตามข้อมูลเดิม อัปเดต',photos:'ภาพ',phoneError:'กรุณาระบุเบอร์โทรศัพท์ให้ถูกต้อง (8–15 หลัก)',nameError:'กรุณาระบุชื่อของคุณ',lineError:'กรุณาระบุ LINE ID โดยไม่มีช่องว่าง'},
    en: {welcomeStep:'The New Collection by บ้านคุณเตริก\n19 square wah. Every square metre matters.',next:'Next',made:'Care in every square metre.',back:'Back',formTitle:'Because our team understands\nhow our agency partners work.',formIntro:'We built this website to make your work easier.\n\nIn just a few steps, enter your name and phone number. LINE ID is optional. We do not save your details to a database.\n\nWe simply create a personal website link that lets you share photos, project information and available homes with clients in a single click. Your clients will see only your contact details.\n\nWe put our hearts into this, and thank you for your continued support in marketing our homes.',formSub:'by k.เตริก บ้านคุณเตริก',nameLabel:'Agent name',phoneLabel:'Phone number',lineLabel:'LINE ID (optional)',namePlaceholder:'Your name',linePlaceholder:'Your LINE ID',confirm:'Confirm & create my link',formNote:'Your contact details are included in the link you create and share with clients.',successTitle:'Congratulations.\nYour website link is ready.',successCopy:'Copy your link and share it with your clients.\nAll contact details will be the ones you provided.',linkLabel:'Your personal website link',copy:'Copy link',copied:'Link copied. Ready to share.',copyFallback:'Link selected. Please use Copy on your device.',edit:'Edit contact details',seeHomes:'Scroll to explore all seven homes',customerTagline:'19 square wah. Every square metre matters.',homesTitle:'Seven homes. Find your place.',reserved:'Reserved',available:'Available',pending:'Pending reservation',sold:'Sold',renderNote:'Illustrative architectural visualization',photosTitle:'A closer look at every detail',yourAdvisor:'Your property advisor',call:'Call',galleryError:'Photos could not load. Please refresh the page.',unit:'UNIT',statusDate:'Status from the existing records, updated',photos:'PHOTOS',phoneError:'Please enter a valid phone number (8–15 digits).',nameError:'Please enter your name.',lineError:'Please enter a LINE ID without spaces.'}
  };
  let customerMode = false;
  let welcomeTimer = null, welcomeIndex = 0, welcomeLayer = 0;
  let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'th';
  let current = 'welcome', agent = null, gallery = [], lightboxIndex = 0, lastPhotoTrigger = null, slideTimer = null, slideIndex = 0, activeSlide = 0;
  const backgroundImages = ['left','close','carport','front'].map(n=>'renders/exterior-approved/'+n+'.jpg');
  let unitData=null;
  const units=[];
  const statuses = {free:{class:'free',key:'available'},hold:{class:'pending',key:'pending'},pending:{class:'pending',key:'pending'},reserved:{class:'reserved',key:'reserved'},sold:{class:'sold',key:'sold'}};
  function t(key){return text[lang][key] || key;}
  function applyLanguage(next){
    lang=next;document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    document.querySelectorAll('[data-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.placeholder);});
    document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));
    $('personal-link').setAttribute('aria-label',t('linkLabel'));
    renderUnits();renderGallery();if(agent)updateLink();
    $('next').querySelector('[data-i18n="next"]').textContent=lang==='th'?'เข้าชมบ้าน':'Explore the homes';
  }
  document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.language)));
  const welcomeImages = ['left','front','close','carport'];
  function stopWelcomeSlides(){clearInterval(welcomeTimer);welcomeTimer=null;}
  function startWelcomeSlides(){
    stopWelcomeSlides();
    const backgrounds=[$('welcome-bg-a'),$('welcome-bg-b')],images=[$('welcome-image-a'),$('welcome-image-b')];
    backgrounds[welcomeLayer].style.backgroundImage='url("renders/exterior-approved/'+welcomeImages[welcomeIndex]+'.jpg")';
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    welcomeTimer=setInterval(()=>{
      if(document.hidden)return;
      welcomeIndex=(welcomeIndex+1)%welcomeImages.length;
      welcomeLayer=1-welcomeLayer;
      const src='renders/exterior-approved/'+welcomeImages[welcomeIndex]+'.jpg';
      const preload=new Image();
      preload.onload=()=>{if(current!=='welcome')return;images[welcomeLayer].src=src;backgrounds[welcomeLayer].style.backgroundImage='url("'+src+'")';images[welcomeLayer].classList.add('active');backgrounds[welcomeLayer].classList.add('active');images[1-welcomeLayer].classList.remove('active');backgrounds[1-welcomeLayer].classList.remove('active');$('welcome-count').textContent=String(welcomeIndex+1).padStart(2,'0');};
      preload.src=src;
    },9500);
  }
  function startSlides(){
    stopSlides();slideIndex=0;activeSlide=0;
    $('backdrop-a').style.backgroundImage='url("'+backgroundImages[0]+'")';$('backdrop-a').classList.add('active');$('backdrop-b').classList.remove('active');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    slideTimer=setInterval(()=>{if(document.hidden)return;slideIndex=(slideIndex+1)%backgroundImages.length;activeSlide=1-activeSlide;const layers=[$('backdrop-a'),$('backdrop-b')];layers[activeSlide].style.backgroundImage='url("'+backgroundImages[slideIndex]+'")';layers[activeSlide].classList.add('active');layers[1-activeSlide].classList.remove('active');$('scene-count').textContent=String(slideIndex+1).padStart(2,'0')+' / 04';},11000);
  }
  function stopSlides(){clearInterval(slideTimer);slideTimer=null;}
  function show(which,{customer=false,focus=true}={}){
    current=which;['welcome','registration','collection'].forEach(id=>{$(id).hidden=id!==which;});
    document.body.classList.toggle('on-registration',which==='registration');
    document.body.classList.toggle('is-agent',!customer&&which!=='welcome');
    document.body.classList.toggle('is-customer',customer||which==='welcome'&&customerMode);
    document.body.classList.toggle('on-welcome',which==='welcome');
    if(which==='welcome')startWelcomeSlides();else stopWelcomeSlides();
    $('advisor').hidden=which!=='collection'||!agent;
    if(which==='registration')startSlides();else stopSlides();
    if(which==='collection'){$('success').hidden=customer||!agent;$('customer-intro').hidden=!customer;}
    window.scrollTo({top:0,behavior:'instant'});
    if(focus){const target=which==='registration'?$('agent-name'):which==='collection'?(customer?$('customer-intro').querySelector('h1'):$('result-title')):$('welcome-title');if(target.tagName!=='INPUT')target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
  }
  $('next').addEventListener('click',()=>show('collection',{customer:true}));
  $('agent-entry').addEventListener('click',()=>show('collection',{customer:false}));
  $('agent-create').addEventListener('click',()=>show('registration'));
  $('customer-entry').addEventListener('click',()=>show('collection',{customer:true}));
  $('back').addEventListener('click',()=>show('collection',{customer:true}));
  $('edit-agent').addEventListener('click',()=>show('registration'));
  function cleanAgent(a){return {name:a.name.trim().slice(0,80),phone:a.phone.trim().replace(/[^\d+]/g,''),line:(a.line||'').trim().replace(/^@/,'').slice(0,60)};}
  function updateContact(){
    $('advisor-name').textContent=agent.name;$('advisor-number').textContent=agent.phone;$('advisor-line-id').textContent=agent.line;
    $('advisor-line').hidden=!agent.line;$('advisor-phone').href='tel:'+agent.phone;$('advisor-line').href='https://line.me/ti/p/~'+encodeURIComponent(agent.line);
  }
  function updateLink(){const u=new URL('./',location.href);u.searchParams.set('view','home');u.searchParams.set('a',agent.name);u.searchParams.set('t',agent.phone);if(agent.line)u.searchParams.set('l',agent.line);u.searchParams.set('lang',lang);$('personal-link').value=u.href;}
  $('agent-form').addEventListener('submit',event=>{
    event.preventDefault();const candidate=cleanAgent({name:$('agent-name').value,phone:$('agent-phone').value,line:$('agent-line').value});
    let error='',field=null;if(!candidate.name){error=t('nameError');field=$('agent-name');}else if(!/^\+?\d{8,15}$/.test(candidate.phone)){error=t('phoneError');field=$('agent-phone');}else if(/\s/.test(candidate.line)){error=t('lineError');field=$('agent-line');}
    $('form-error').textContent=error;if(error){field.focus();return;}
    agent=candidate;updateContact();updateLink();$('copy-feedback').textContent='';show('collection');
  });
  $('copy-link').addEventListener('click',async()=>{
    try{if(!navigator.clipboard?.writeText)throw Error('clipboard');await navigator.clipboard.writeText($('personal-link').value);$('copy-feedback').textContent=t('copied');}
    catch{const input=$('personal-link');input.focus();input.select();input.setSelectionRange(0,input.value.length);let ok=false;try{ok=document.execCommand('copy');}catch{}$('copy-feedback').textContent=t(ok?'copied':'copyFallback');}
  });
  $('download-gallery').addEventListener('click',()=>{if(gallery.length)downloadPhotos(gallery,$('download-gallery'),'RK10-current-photos.zip');});
  function imageDisclaimer(){const el=document.createElement('span');el.className='image-disclaimer';el.textContent='ภาพจำลองเพื่อการโฆษณาเท่านั้น\nIllustrative image for advertising purposes only.';return el;}
  function renderUnits(){
    $('units').replaceChildren();units.forEach((u,i)=>{const state=statuses[u.s]||statuses.free;const card=document.createElement('article');card.className='unit';const photo=document.createElement('div');photo.className='unit-photo';photo.style.backgroundPosition=(i/6*100)+'% center';photo.setAttribute('aria-hidden','true');const body=document.createElement('div');body.className='unit-body';const label=document.createElement('small');label.textContent=t('unit')+' '+(u.plot||u.n);const title=document.createElement('h3');title.textContent=u.no;const status=document.createElement('span');status.className='unit-state';const lamp=document.createElement('i');lamp.className='lamp '+state.class;lamp.setAttribute('aria-hidden','true');status.append(lamp,document.createTextNode(t(state.key)));const price=document.createElement('p');price.className='unit-price';price.textContent=Number(u.price||unitData?.price).toLocaleString(lang==='th'?'th-TH':'en-GB')+' '+(lang==='th'?'บาท':'THB');body.append(label,title,price,status);card.append(photo,imageDisclaimer(),body);$('units').append(card);});
    $('status-date').textContent=unitData?t('statusDate')+' '+(lang==='th'?unitData.updatedTh:unitData.updatedEn):(lang==='th'?'กำลังโหลดสถานะบ้าน…':'Loading home availability…');
  }
  function renderGallery(){
    $('photo-grid').replaceChildren();gallery.forEach((item,i)=>{const card=document.createElement('article');card.className='photo-card';const button=document.createElement('button');button.type='button';button.className='photo-preview';const img=document.createElement('img');img.src=item.src;img.alt=lang==='th'?item.th:item.en;img.loading='lazy';img.decoding='async';const caption=document.createElement('span');caption.className='photo-caption';const title=document.createElement('span');title.textContent=img.alt;const number=document.createElement('small');number.textContent=String(i+1).padStart(2,'0');caption.append(title,number);button.append(img,imageDisclaimer(),caption);button.addEventListener('click',()=>{lastPhotoTrigger=button;openPhoto(i);});card.append(button,photoActions(item,i));$('photo-grid').append(card);});$('photo-count').textContent=gallery.length+' '+t('photos');
  }
  function openPhoto(i){if(!gallery.length)return;lightboxIndex=(i+gallery.length)%gallery.length;const item=gallery[lightboxIndex];$('lightbox-image').src=item.src;$('lightbox-image').alt=lang==='th'?item.th:item.en;$('lightbox-actions').replaceChildren(photoActions(item,lightboxIndex));$('lightbox-caption').textContent=(lightboxIndex+1)+' / '+gallery.length+' · '+$('lightbox-image').alt;if(!$('lightbox').open)$('lightbox').showModal();}
  $('close-lightbox').addEventListener('click',()=>$('lightbox').close());$('previous-photo').addEventListener('click',()=>openPhoto(lightboxIndex-1));$('next-photo').addEventListener('click',()=>openPhoto(lightboxIndex+1));
  $('lightbox').addEventListener('click',event=>{if(event.target===$('lightbox'))$('lightbox').close();});
  $('lightbox').addEventListener('keydown',event=>{if(event.key==='ArrowLeft')openPhoto(lightboxIndex-1);if(event.key==='ArrowRight')openPhoto(lightboxIndex+1);});
  $('lightbox').addEventListener('close',()=>lastPhotoTrigger?.focus({preventScroll:true}));
  fetch('gallery.json').then(r=>{if(!r.ok)throw Error('gallery');return r.json();}).then(data=>{gallery=data;renderGallery();}).catch(()=>{$('gallery-error').hidden=false;});
  // Keep sales status editable without altering the new visual experience.
  fetch('units.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('units');return r.json();}).then(data=>{if(Array.isArray(data.units)&&data.units.length===7){unitData=data;units.splice(0,units.length,...data.units);renderUnits();}}).catch(()=>{$('status-date').textContent=lang==='th'?'โหลดสถานะไม่สำเร็จ กรุณารีเฟรชและตรวจสอบก่อนจอง':'Availability could not load. Refresh and confirm before booking.';});
  applyLanguage(lang);
  startWelcomeSlides();
  const params=new URLSearchParams(location.search);
  if(params.get('a')&&params.get('t')){agent=cleanAgent({name:params.get('a'),phone:params.get('t'),line:params.get('l')});if(agent.name&&/^\+?\d{8,15}$/.test(agent.phone)&&!/\s/.test(agent.line)){updateContact();updateLink();$('agent-name').value=agent.name;$('agent-phone').value=agent.phone;$('agent-line').value=agent.line;customerMode=true;document.body.classList.add('is-customer');$('next').querySelector('[data-i18n="next"]').textContent=lang==='th'?'เข้าชมบ้าน':'Explore the homes';document.querySelector('.topbar .brand').href=location.pathname+location.search;$('agent-entry').hidden=true;}else agent=null;}
  show('collection',{customer:location.hash!=='#agents'||customerMode,focus:false});
})();

