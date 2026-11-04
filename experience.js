'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const text = {
    th: {welcomeStep:'The New collection\n19 ตารางวา ที่ใส่ใจทุกตารางเมตร',next:'ถัดไป',made:'ทุกพื้นที่ เริ่มจากความใส่ใจ',back:'ย้อนกลับ',formTitle:'ให้บ้านหลังนี้\nเชื่อมต่อกับลูกค้าของคุณ',formIntro:'กรุณาระบุชื่อนายหน้า เบอร์โทร และ LINE เพื่อสร้างลิงก์เว็บไซต์สำหรับนำเสนอให้ลูกค้า โดยใช้ข้อมูลติดต่อของคุณ',formSub:'A personal link, made for you.',nameLabel:'ชื่อนายหน้า',phoneLabel:'เบอร์โทรศัพท์',lineLabel:'LINE ID',namePlaceholder:'ระบุชื่อของคุณ',linePlaceholder:'LINE ID ของคุณ',confirm:'ยืนยันและสร้างลิงก์',formNote:'ข้อมูลติดต่อบนลิงก์จะเป็นข้อมูลที่คุณกรอกไว้',successTitle:'ยินดีด้วย\nสร้างลิงก์เว็บไซต์สำเร็จแล้ว',successCopy:'คัดลอกลิงก์ของคุณเพื่อส่งให้ลูกค้าได้เลย\nข้อมูลติดต่อทุกอย่างจะเป็นของคุณตามที่กรอกไว้',linkLabel:'ลิงก์เว็บไซต์ของคุณ',copy:'คัดลอกลิงก์',copied:'คัดลอกแล้ว พร้อมส่งให้ลูกค้า',copyFallback:'เลือกลิงก์ไว้แล้ว กรุณากดคัดลอกบนอุปกรณ์ของคุณ',edit:'แก้ไขข้อมูลติดต่อ',seeHomes:'เลื่อนลงเพื่อดูบ้านทั้ง 7 หลัง',customerTagline:'19 ตารางวา ที่เราใส่ใจทุกตารางเมตร',homesTitle:'บ้านที่ใช่ ในแปลงที่คุณเลือก',reserved:'ติดจอง',available:'พร้อมขาย',pending:'รอจอง',sold:'ขายแล้ว',renderNote:'ภาพจำลองประกอบการนำเสนอ',photosTitle:'ทุกมุมของความใส่ใจ',yourAdvisor:'ติดต่อนายหน้า',call:'โทร',galleryError:'โหลดภาพไม่สำเร็จ กรุณารีเฟรชหน้าเว็บ',unit:'แปลง',statusDate:'สถานะตามข้อมูลเดิม อัปเดต',photos:'ภาพ',phoneError:'กรุณาระบุเบอร์โทรศัพท์ให้ถูกต้อง (8–15 หลัก)',nameError:'กรุณาระบุชื่อของคุณ',lineError:'กรุณาระบุ LINE ID โดยไม่มีช่องว่าง'},
    en: {welcomeStep:'The New collection\n19 square wah. Every square metre matters.',next:'Next',made:'Care in every square metre.',back:'Back',formTitle:'Connect your clients\nwith their next home.',formIntro:'Enter your agent name, phone number and LINE ID. We will create a personal property link with your contact details, ready to share with clients.',formSub:'A personal link, made for you.',nameLabel:'Agent name',phoneLabel:'Phone number',lineLabel:'LINE ID',namePlaceholder:'Your name',linePlaceholder:'Your LINE ID',confirm:'Confirm & create my link',formNote:'Your personal link will display the contact details you enter.',successTitle:'Congratulations.\nYour website link is ready.',successCopy:'Copy your link and share it with your clients.\nAll contact details will be the ones you provided.',linkLabel:'Your personal website link',copy:'Copy link',copied:'Link copied. Ready to share.',copyFallback:'Link selected. Please use Copy on your device.',edit:'Edit contact details',seeHomes:'Scroll to explore all seven homes',customerTagline:'19 square wah. Every square metre matters.',homesTitle:'Seven homes. Find your place.',reserved:'Reserved',available:'Available',pending:'Pending reservation',sold:'Sold',renderNote:'Illustrative architectural visualization',photosTitle:'A closer look at every detail',yourAdvisor:'Your property advisor',call:'Call',galleryError:'Photos could not load. Please refresh the page.',unit:'UNIT',statusDate:'Status from the existing records, updated',photos:'PHOTOS',phoneError:'Please enter a valid phone number (8–15 digits).',nameError:'Please enter your name.',lineError:'Please enter a LINE ID without spaces.'}
  };
  let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'th';
  let current = 'welcome', agent = null, gallery = [], lightboxIndex = 0, lastPhotoTrigger = null, slideTimer = null, slideIndex = 0, activeSlide = 0;
  const backgroundImages = ['left','close','carport','front'].map(n=>'renders/exterior-approved/'+n+'.jpg');
  const units = Array.from({length:7},(_,i)=>({n:i+1,no:'160/'+(32+i),s:'free'}));
  const statuses = {free:{class:'free',key:'available'},hold:{class:'pending',key:'pending'},pending:{class:'pending',key:'pending'},reserved:{class:'reserved',key:'reserved'},sold:{class:'sold',key:'sold'}};
  function t(key){return text[lang][key] || key;}
  function applyLanguage(next){
    lang=next;document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    document.querySelectorAll('[data-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.placeholder);});
    document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));
    $('personal-link').setAttribute('aria-label',t('linkLabel'));
    renderUnits();renderGallery();if(agent)updateLink();
  }
  document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.language)));
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
    $('advisor').hidden=which!=='collection'||!agent;
    if(which==='registration')startSlides();else stopSlides();
    if(which==='collection'){$('success').hidden=customer;$('customer-intro').hidden=!customer;}
    window.scrollTo({top:0,behavior:'instant'});
    if(focus){const target=which==='registration'?$('agent-name'):which==='collection'?(customer?$('customer-intro').querySelector('h1'):$('result-title')):$('welcome-title');if(target.tagName!=='INPUT')target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
  }
  $('next').addEventListener('click',()=>show('registration'));
  $('back').addEventListener('click',()=>show('welcome'));
  $('edit-agent').addEventListener('click',()=>show('registration'));
  function cleanAgent(a){return {name:a.name.trim().slice(0,80),phone:a.phone.trim().replace(/[^\d+]/g,''),line:a.line.trim().replace(/^@/,'').slice(0,60)};}
  function updateContact(){
    $('advisor-name').textContent=agent.name;$('advisor-number').textContent=agent.phone;$('advisor-line-id').textContent=agent.line;
    $('advisor-phone').href='tel:'+agent.phone;$('advisor-line').href='https://line.me/ti/p/~'+encodeURIComponent(agent.line);
  }
  function updateLink(){const u=new URL('./',location.href);u.searchParams.set('view','home');u.searchParams.set('a',agent.name);u.searchParams.set('t',agent.phone);u.searchParams.set('l',agent.line);u.searchParams.set('lang',lang);$('personal-link').value=u.href;}
  $('agent-form').addEventListener('submit',event=>{
    event.preventDefault();const candidate=cleanAgent({name:$('agent-name').value,phone:$('agent-phone').value,line:$('agent-line').value});
    let error='',field=null;if(!candidate.name){error=t('nameError');field=$('agent-name');}else if(!/^\+?\d{8,15}$/.test(candidate.phone)){error=t('phoneError');field=$('agent-phone');}else if(!candidate.line||/\s/.test(candidate.line)){error=t('lineError');field=$('agent-line');}
    $('form-error').textContent=error;if(error){field.focus();return;}
    agent=candidate;updateContact();updateLink();$('copy-feedback').textContent='';show('collection');
  });
  $('copy-link').addEventListener('click',async()=>{
    try{if(!navigator.clipboard?.writeText)throw Error('clipboard');await navigator.clipboard.writeText($('personal-link').value);$('copy-feedback').textContent=t('copied');}
    catch{const input=$('personal-link');input.focus();input.select();input.setSelectionRange(0,input.value.length);let ok=false;try{ok=document.execCommand('copy');}catch{}$('copy-feedback').textContent=t(ok?'copied':'copyFallback');}
  });
  function renderUnits(){
    $('units').replaceChildren();units.forEach((u,i)=>{const state=statuses[u.s]||statuses.free;const card=document.createElement('article');card.className='unit';const photo=document.createElement('div');photo.className='unit-photo';photo.style.backgroundPosition=(i/6*100)+'% center';photo.setAttribute('aria-hidden','true');const body=document.createElement('div');body.className='unit-body';const label=document.createElement('small');label.textContent=t('unit')+' '+u.n;const title=document.createElement('h3');title.textContent=u.no;const status=document.createElement('span');status.className='unit-state';const lamp=document.createElement('i');lamp.className='lamp '+state.class;lamp.setAttribute('aria-hidden','true');status.append(lamp,document.createTextNode(t(state.key)));body.append(label,title,status);card.append(photo,body);$('units').append(card);});
    $('status-date').textContent=t('statusDate')+' '+(lang==='th'?'27 ต.ค. 2569':'27 Oct 2026');
  }
  function renderGallery(){
    $('photo-grid').replaceChildren();gallery.forEach((item,i)=>{const button=document.createElement('button');button.type='button';button.className='photo-card';const img=document.createElement('img');img.src=item.src;img.alt=lang==='th'?item.th:item.en;img.loading='lazy';img.decoding='async';const caption=document.createElement('span');caption.className='photo-caption';const title=document.createElement('span');title.textContent=img.alt;const number=document.createElement('small');number.textContent=String(i+1).padStart(2,'0');caption.append(title,number);button.append(img,caption);button.addEventListener('click',()=>{lastPhotoTrigger=button;openPhoto(i);});$('photo-grid').append(button);});$('photo-count').textContent=gallery.length+' '+t('photos');
  }
  function openPhoto(i){if(!gallery.length)return;lightboxIndex=(i+gallery.length)%gallery.length;const item=gallery[lightboxIndex];$('lightbox-image').src=item.src;$('lightbox-image').alt=lang==='th'?item.th:item.en;$('lightbox-caption').textContent=(lightboxIndex+1)+' / '+gallery.length+' · '+$('lightbox-image').alt;if(!$('lightbox').open)$('lightbox').showModal();}
  $('close-lightbox').addEventListener('click',()=>$('lightbox').close());$('previous-photo').addEventListener('click',()=>openPhoto(lightboxIndex-1));$('next-photo').addEventListener('click',()=>openPhoto(lightboxIndex+1));
  $('lightbox').addEventListener('click',event=>{if(event.target===$('lightbox'))$('lightbox').close();});
  $('lightbox').addEventListener('keydown',event=>{if(event.key==='ArrowLeft')openPhoto(lightboxIndex-1);if(event.key==='ArrowRight')openPhoto(lightboxIndex+1);});
  $('lightbox').addEventListener('close',()=>lastPhotoTrigger?.focus({preventScroll:true}));
  fetch('gallery.json').then(r=>{if(!r.ok)throw Error('gallery');return r.json();}).then(data=>{gallery=data;renderGallery();}).catch(()=>{$('gallery-error').hidden=false;});
  // Keep sales status editable without altering the new visual experience.
  fetch('units.json').then(r=>{if(!r.ok)throw Error('units');return r.json();}).then(data=>{if(Array.isArray(data.units)&&data.units.length===7){units.splice(0,units.length,...data.units);renderUnits();if(data.updated)$('status-date').textContent=t('statusDate')+' '+data.updated;}}).catch(()=>{});
  applyLanguage(lang);
  const params=new URLSearchParams(location.search);
  if(params.get('a')&&params.get('t')&&params.get('l')){agent=cleanAgent({name:params.get('a'),phone:params.get('t'),line:params.get('l')});if(agent.name&&/^\+?\d{8,15}$/.test(agent.phone)&&agent.line&&!/\s/.test(agent.line)){updateContact();updateLink();$('agent-name').value=agent.name;$('agent-phone').value=agent.phone;$('agent-line').value=agent.line;show('collection',{customer:true,focus:false});}else agent=null;}
})();
