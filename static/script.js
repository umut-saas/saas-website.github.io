// --- DOM Elements ---
const aiIcon = document.getElementById('aiChatIcon');
const aiBox = document.getElementById('aiChatBox');
const aiClose = document.getElementById('aiChatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');

const productForm = document.getElementById('productForm');
const productInput = document.getElementById('productInput');

const resultBox = document.getElementById('resultBox');
const resultTitle = document.getElementById('resultTitle');
const resultDesc = document.getElementById('resultDesc');
const resultTags = document.getElementById('resultTags');

const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

const langSelect = document.getElementById('languageSelect');

// --- Functions ---
function openModal(id){ document.getElementById(id).style.display='block'; }
function closeModal(id){ document.getElementById(id).style.display='none'; }
function showPopup(text){ document.getElementById('popup-text').innerText=text; document.getElementById('popup').style.display='block'; }
function closePopup(){ document.getElementById('popup').style.display='none'; }

window.changeLanguage = async function(lang){
  try {
    await fetch('/set-language', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({lang}) });
    location.reload();
  } catch(e){
    alert((window.T['js_selected_lang']||'Language: ')+lang);
  }
}

// --- AI Chat Toggle ---
aiIcon.addEventListener('click', () => {
    if(aiBox.style.display === 'flex'){
        aiBox.style.display = 'none';
        aiIcon.style.transform = 'scale(1)';
    } else {
        aiBox.style.display = 'flex';
        aiIcon.style.transform = 'scale(0.9)';
    }
});

aiClose.addEventListener('click', () => {
    aiBox.style.display = 'none';
    aiIcon.style.transform = 'scale(1)';
});

// --- AI Chat Messaging ---
sendChat.addEventListener('click', async ()=>{
  const msg = chatInput.value.trim();
  if(!msg) return;
  appendMessage('Sen', msg);
  chatInput.value='';
  const res = await fetch('/chat',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message: msg}) });
  const data = await res.json();
  appendMessage('AI', data.reply);
});

function appendMessage(sender, text){
  const div = document.createElement('div');
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Product Form ---
productForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = productInput.value.trim();
  if(!name) return alert('Lütfen ürün adı girin!');
  const res = await fetch('/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({product_name:name}) });
  const data = await res.json();
  displayResult(data);
});

function displayResult(result){
  resultBox.style.display='block';
  resultTitle.innerText = `${window.T['result_title_label']}: ${result.title}`;
  resultDesc.innerText = `${window.T['result_desc_label']}: ${result.description}`;
  resultTags.innerText = `${window.T['result_tags_label']}: ${result.tags}`;
}

// --- Copy / Download ---
copyBtn.addEventListener('click', ()=>{
  navigator.clipboard.writeText(resultBox.innerText)
    .then(()=>alert('Kopyalandı!'))
    .catch(()=>alert('Kopyalama başarısız!'));
});

downloadBtn.addEventListener('click', ()=>{
  const blob = new Blob([resultBox.innerText], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'urun-aciklama.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
});
