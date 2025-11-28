// Set year
document.getElementById('year').textContent = new Date().getFullYear();
// Scroll helper
function scrollToSection(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}
// Simple modal-like card info (placeholder content)
function openCard(key){
  const data = {
    'girls': 'Girls education: encourage school attendance, provide books, mentorship programs, and safe transport. Contact local education dept. for scholarship programs.',
    'schemes': 'Government schemes: check national and state portals for up-to-date schemes such as scholarships, midday meals, uniforms, and conditional cash transfers.',
    'skills': 'Skill courses: digital literacy, tailoring, beautician, hospitality, basic coding, and entrepreneurship programs. Look for local training centers and online platforms.',
    'health-awareness': 'Health awareness: vaccination, regular checkups, nutrition, maternal care and family planning information from certified health professionals.',
    'menstruation': 'Menstruation hygiene: use clean absorbents, change regularly, wash hands. Dispel myths: periods are natural; do not isolate or restrict normal activities.',
    'cyber': 'Cyber safety: use strong passwords, enable two-factor auth, avoid sharing personal details publicly, report harassment to platform and authorities.' ,
    'ngos': 'NGOs: many local NGOs offer legal aid, counselling, and shelters. Search "women support NGO" with your city name to find local help.',
    'women-schemes': 'Women schemes: livelihood programs, maternity benefits, insurance schemes, and entrepreneurship grants. Always verify on official government portals.',
    'mental': 'Mental health: reach out to trusted friends or professionals. Crisis lines and online counselling are available; seek immediate help if at risk.'
  };
  alert(data[key] || 'Information coming soon');
}
// QUIZ: sample questions
const quizQuestions = [
  {q:'Which of these is a safe step when you face online harassment?', a:['Ignore and block the user','Share private info to prove yourself','Respond aggressively','Delete your account immediately'], c:0},
  {q:'What is a reliable way to verify a government scheme?', a:['Social media post','Official government portal','Random blog','Friend’s WhatsApp forward'], c:1},
  {q:'Good menstrual hygiene includes:', a:['Changing absorbent regularly','Using unclean water','Hiding period from doctor','Avoiding all exercise'], c:0},
  {q:'If you feel unsafe, best immediate action is to:', a:['Plan an escape route & call helpline','Post on social media only','Manage alone without telling anyone','Ignore the feeling'], c:0}
];
const quizWrap = document.getElementById('quiz-wrap');
const userAnswers = Array(quizQuestions.length).fill(null);
function renderQuiz(){
  quizWrap.innerHTML = '';
  quizQuestions.forEach((item,idx)=>{
    const box = document.createElement('div');box.className='question';
    const h = document.createElement('div');h.innerHTML = `<strong>Q${idx+1}.</strong> ${item.q}`;
    box.appendChild(h);
    const opts = document.createElement('div');opts.className='options';
    item.a.forEach((opt,j)=>{
      const o = document.createElement('div');o.className='opt';o.tabIndex=0;o.textContent = opt;
      o.addEventListener('click',()=>{selectOpt(idx,j)});
      o.addEventListener('keydown',(e)=>{if(e.key==='Enter') selectOpt(idx,j)});
      opts.appendChild(o);
    });
    box.appendChild(opts);
    quizWrap.appendChild(box);
  });
}
function selectOpt(qIdx,optIdx){
  userAnswers[qIdx]=optIdx;
  // update classes
  const qBoxes = quizWrap.querySelectorAll('.question');
  const opts = qBoxes[qIdx].querySelectorAll('.opt');
  opts.forEach((o,i)=>{o.classList.toggle('selected', i===optIdx)});
}
document.getElementById('quiz-submit').addEventListener('click', ()=>{
  // Show correct/incorrect answers
  quizQuestions.forEach((q, i) => {
    const qBoxes = quizWrap.querySelectorAll('.question');
    const opts = qBoxes[i].querySelectorAll('.opt');
  
    opts.forEach((o, j) => {
      // correct answer
      if (j === q.c) {
        o.classList.add('correct');
      }
      // wrong selected answer
      if (userAnswers[i] === j && j !== q.c) {
        o.classList.add('wrong');
      }
    });
  });
  const unanswered = userAnswers.some(v=>v===null);
  if(unanswered){ if(!confirm('You have unanswered questions — submit anyway?')) return; }
  let score=0; quizQuestions.forEach((q,i)=>{ if(userAnswers[i]===q.c) score++; });
  const percent = Math.round((score/quizQuestions.length)*100);
  const res = document.getElementById('quiz-result');
  let msg='';
  if(percent===100) msg='Excellent — you are highly aware!';
  else if(percent>=75) msg='Good — you have strong awareness.';
  else if(percent>=50) msg='Fair — there is room to improve.';
  else msg='Low — consider reading our resources and getting informed.';
  res.textContent = `Score: ${score}/${quizQuestions.length} (${percent}%) — ${msg}`;
  // small confetti effect
  confettiBurst(percent);
});

document.getElementById('quiz-reset').addEventListener('click', ()=>{
  for(let i=0;i<userAnswers.length;i++) userAnswers[i]=null;
  renderQuiz(); document.getElementById('quiz-result').textContent='';
});
renderQuiz();
// Simple confetti using canvas
function confettiBurst(percent){
  if(percent<50) return; // only celebrate good scores
  const c = document.createElement('canvas');
  c.style.position='fixed';c.style.left=0;c.style.top=0;c.style.width='100%';c.style.height='100%';c.style.zIndex=9999;document.body.appendChild(c);
  c.width = innerWidth; c.height = innerHeight; const ctx = c.getContext('2d');
  const pieces = [];
  for(let i=0;i<150;i++) pieces.push({x:Math.random()*c.width,y:Math.random()*c.height*0.2, vx:(Math.random()-0.5)*6, vy:Math.random()*4+2, r:Math.random()*6+3, c:['#ff6b6b','#6b6bff','#6bffb3'][Math.floor(Math.random()*3)]});
  let t=0; const id = setInterval(()=>{ ctx.clearRect(0,0,c.width,c.height); t++; pieces.forEach(p=>{p.x+=p.vx; p.y+=p.vy; p.vy += 0.12; ctx.fillStyle=p.c; ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r,p.r*0.6, Math.PI*0.2,0,Math.PI*2); ctx.fill();}); if(t>120){ clearInterval(id); c.remove(); } }, 16);
}
// Feedback save to localStorage
const fbSavedBox = document.getElementById('fb-saved');
document.getElementById('fb-send').addEventListener('click', ()=>{
  const name = document.getElementById('fb-name').value.trim();
  const email = document.getElementById('fb-email').value.trim();
  const topic = document.getElementById('fb-topic').value;
  const message = document.getElementById('fb-message').value.trim();
  if(!message){alert('Please write some feedback before sending.'); return;}
  const feedback = {name,email,topic,message,time:new Date().toISOString()};
  const arr = JSON.parse(localStorage.getItem('ws_feedback')||'[]'); arr.push(feedback); localStorage.setItem('ws_feedback', JSON.stringify(arr));
  fbSavedBox.textContent = 'Thanks — your feedback .';
  fbSavedBox.textContent = 'your feedback was saved Successfully  ❤️';
  setTimeout(()=> fbSavedBox.textContent = '', 5000);
  document.getElementById('fb-message').value='';
});
document.getElementById('fb-clear').addEventListener('click', ()=>{document.getElementById('fb-name').value='';document.getElementById('fb-email').value='';document.getElementById('fb-message').value='';});
// Small accessibility: keyboard focus styles
document.addEventListener('keydown', (e)=>{ if(e.key==='/' && document.activeElement.tagName!=='INPUT' && document.activeElement.tagName!=='TEXTAREA') { scrollToSection('quiz'); e.preventDefault(); }});