function togglePasswordVisibility(){
  const pw = document.getElementById('password');
  const chk = document.getElementById('showPasswordToggle');
  if(!pw || !chk) return;
  pw.type = chk.checked ? 'text' : 'password';
}

// Verify a token with the backend /me endpoint. Returns true when the server confirms.
async function verifyToken(token){
  try{
    const res = await fetch('http://localhost:5000/me', { headers: { 'authorization': `Bearer ${token}` } });
    const data = await res.json().catch(()=>null);
    if(res.ok && data && data.success) return { state:'ok', user:data.user };
    return { state:'invalid', status: res.status, body: data };
  }catch(e){
    console.warn('verifyToken error', e);
    return { state:'network', error: String(e) };
  }
}

function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById('msg'); msg.innerText = '';
    serverStatus.textContent='';
  if(!email || !password){ msg.innerText = 'Please enter email and password.'; return; }
    setLoading(true, 'login');

  fetch('http://localhost:5000/login', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email,password})
  })
  .then(async res => {
    const body = await res.json().catch(()=>null);
    setLoading(false);
      if(res.ok && body && body.success){
        localStorage.setItem('token', body.token);
        const verification = await verifyToken(body.token);
        if(verification.state === 'ok'){
          window.location.href = '../main page/main_page.html';
        } else if(verification.state === 'network'){
          msg.style.color = 'lightgreen'; msg.innerText = 'Login succeeded but server is unreachable — opening main page in offline mode';
          setTimeout(()=> window.location.href = '../main page/main_page.html', 700);
        } else {
          msg.innerText = 'Login succeeded but token validation failed on server — try logging in again.';
        }
    } else {
      msg.innerText = `Login failed (${res.status}) — ${body && body.message ? body.message : 'Check server or credentials'}`;
    }
  }).catch(err => { setLoading(false); msg.innerText = 'Server unreachable (is backend running?)'; console.error(err); });
}

// Register a new user
function registerUser(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById('msg'); msg.innerText = ''; 
  if(!email || !password){ msg.innerText = 'Please enter email and password to register.'; return; }
  if(password.length < 6){ msg.innerText = 'Pick a stronger password (min 6 characters).'; return; }
  setLoading(true, 'register');
  fetch('http://localhost:5000/register', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email,password})
  })
  .then(async res => {
    const body = await res.json().catch(()=>null);
    setLoading(false);
      if(res.ok && body && body.success){
        localStorage.setItem('token', body.token);
        const verification = await verifyToken(body.token);
        if(verification.state === 'ok'){
          msg.style.color = 'lightgreen'; msg.innerText = 'Registration successful — redirecting...';
          setTimeout(()=> window.location.href = '../main page/main_page.html', 700);
        } else if(verification.state === 'network'){
          msg.style.color = 'lightgreen'; msg.innerText = 'Registered and server is unreachable — opening main page in offline mode';
          setTimeout(()=> window.location.href = '../main page/main_page.html', 700);
        } else {
          msg.innerText = 'Registered but token validation failed on server — please try logging in.';
        }
    } else {
      msg.innerText = `Registration failed (${res.status}) — ${body && body.message ? body.message : 'Check server or try different email'}`;
    }
  }).catch(err => { setLoading(false); msg.innerText = 'Server unreachable (is backend running?).'; console.error(err); });
}

// Simple fetch for backend health
// removed testServer UI (button removed) — keep health-check logic in backend accessible via tools if needed

function setLoading(enable, action){
  const l = document.getElementById('loginBtn');
  const r = document.getElementById('registerBtn');
  const t = document.getElementById('testBtn');
  if(!l || !r) return;
  if(enable){
    if(action==='login') l.disabled = true; else if(action==='register') r.disabled = true; else { l.disabled = r.disabled = true; }
    if(t) t.disabled = true;
  } else {
    l.disabled = r.disabled = false; if(t) t.disabled = false;
  }
}

