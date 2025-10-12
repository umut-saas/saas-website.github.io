<script>

const aiIcon = document.getElementById('aiChatIcon');
const aiBox = document.getElementById('aiChatBox');
const aiClose = document.getElementById('aiChatClose');
const aiHeader = document.getElementById('aiChatHeader');
const aiInput = document.getElementById('chatInput');






// Dil algılama
let lang = document.documentElement.lang || 'tr'; // Sayfanın <html lang="xx"> etiketi üzerinden

let translations = {
  tr: { header: "AI Canlı Destek", placeholder: "Sorunuzu yazın...", send: "Gönder" },
  en: { header: "AI Live Support", placeholder: "Type your question...", send: "Send" },
  de: { header: "KI Live-Support", placeholder: "Ihre Frage hier eingeben...", send: "Senden" },
  ru: { header: "ИИ Поддержка", placeholder: "Введите ваш вопрос...", send: "Отправить" }
};



// Çevirileri uygula
if(translations[lang]){
  aiHeader.childNodes[0].nodeValue = translations[lang].header;
  aiInput.placeholder = translations[lang].placeholder;
  document.getElementById('sendChat').innerText = translations[lang].send;
}



// Chat aç/kapa
aiIcon.addEventListener('click', () => {
  aiBox.style.display = (aiBox.style.display === 'flex') ? 'none' : 'flex';
  aiIcon.style.transform = aiBox.style.display === 'flex' ? 'scale(0.9)' : 'scale(1)';
});
aiClose.addEventListener('click', () => {
  aiBox.style.display = 'none';
  aiIcon.style.transform = 'scale(1)';
});



// Chat gönderme (backend ile değiştirilecek örnek)
document.getElementById('sendChat').addEventListener('click', async () => {
  const input = document.getElementById('chatInput');
  if(!input.value) return;
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML += `<div style="margin:5px 0;"><b>Sen:</b> ${input.value}</div>`;
  
  // Örnek AI cevabı
  const response = await fetch('/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({message: input.value})
  }).then(res => res.json());

  chatMessages.innerHTML += `<div style="margin:5px 0; color:#1e90ff;"><b>AI:</b> ${response.reply}</div>`;
  chatMessages.scrollTop = chatMessages.scrollHeight;
  input.value = '';
});












const form = document.getElementById("productForm");
const btn = document.querySelector(".btn-create");

btn.addEventListener("click", function() {
    const input = document.getElementById("productInput");
    // Eğer boşsa, sessizce formu gönderme
    if (!input.value.trim()) {
        return; // Hiçbir mesaj veya uyarı gösterilmez
    } else {
        form.submit(); // Doluysa formu gönder
    }
});











const T = {{ t | tojson }};

function copyResult(){
  const box = document.getElementById('resultBox');
  if(!box){ alert(T['js_make_first']); return; }
  navigator.clipboard.writeText(box.innerText).then(()=> alert(T['js_copied']));
}




function downloadResult() {
  // T değişkeninin tanımlı olduğundan emin olun: const T = {{ t | tojson }};
  const box = document.getElementById('resultBox');

  // meta / title / description / tags: önce DOM'dan alıyoruz,
  // ama eğer DOM'da yoksa T içindeki çeviriler/fallback metinleri kullanılır.
  const meta = box?.querySelector('.meta')?.innerText || T['pro_hint'] || '';
  
  // p:nth-of-type kullanımı; her dilde label: değer formatı olduğu
  // için ":" sonrasını alıyoruz (etiket farklı dillerde değişse bile çalışır).
   const titleRaw = box?.querySelector('p:nth-of-type(1)')?.innerText || T['demo_title'] || '';
   const descriptionRaw = box?.querySelector('p:nth-of-type(2)')?.innerText || T['demo_description'] || '';
   const tagsRaw = box?.querySelector('p:nth-of-type(3)')?.innerText || T['demo_tags'] || '';




  const title = titleRaw.includes(':') ? titleRaw.split(':').slice(1).join(':').trim() : (titleRaw.trim() || '');
  const description = descriptionRaw.includes(':') ? descriptionRaw.split(':').slice(1).join(':').trim() : (descriptionRaw.trim() || '');
  const tags = tagsRaw.includes(':') ? tagsRaw.split(':').slice(1).join(':').trim() : (tagsRaw.trim() || '');

  // Not ve label'ları T içinden string olarak alıyoruz (T zaten seçili dilin sözlüğü)
  const note = T['free_plan_note'] || '';
  const labelTitle = T['result_title_label'] || 'Başlık';
  const labelDesc = T['result_desc_label'] || 'Açıklama';
  const labelTags = T['result_tags_label'] || 'SEO Tagler';

  const content = `${labelTitle}: ${title}\n\n${labelDesc}: ${description}\n\n${labelTags}: ${tags}\n\n${note}`;


  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  // Dosya adını da çeviri dosyasından alırsın (eklediyseniz) yoksa fallback:
  a.download = T['download_filename'] || 'urun-aciklama.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);

  // Alert mesajı: T içinden string olarak alınmalı
  if (typeof T['free_plan_used'] === 'string') {
    alert(T['free_plan_used']);
  } else {
    // eğer free_plan_used obje değilse güvenli fallback
    alert('1 çıktı kullanıldı');
  }
}










function openModal(id){
  document.getElementById(id).style.display='block';
  const sel = document.getElementById('languageSelect');
  if(sel){ sel.style.pointerEvents = 'none'; sel.style.opacity = '0.5'; }
}




function closeModal(id){
  document.getElementById(id).style.display='none';
  const sel = document.getElementById('languageSelect');
  if(sel){ sel.style.pointerEvents = 'auto'; sel.style.opacity = '1'; }
}






async function changeLanguage(lang){
  try{
    await fetch('/set-language', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({lang})
    });
    location.reload();
  }catch(e){
    alert((T['js_selected_lang'] || 'Language: ') + lang);
  }
}





// --- Modal Fonksiyonları ---
function openModal(id) {
    document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// --- Popup ---
function showPopup(text) {
    document.getElementById('popup-text').innerText = text;
    document.getElementById('popup').style.display = 'block';
}
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// --- Form AJAX Submit ---
const form = document.getElementById('productForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('productInput');
    const product_name = input.value.trim();
    if (!product_name) return alert('Lütfen ürün adı girin!');

    const res = await fetch('/generate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({product_name})
    });

    const data = await res.json();
    displayResult(data);
});

function displayResult(result) {
    const box = document.getElementById('resultBox');
    if (!box) return;

    box.innerHTML = `
    <div class="meta" style="margin-bottom:16px;">
        <span style="color:#0035ff; font-weight:600; text-shadow: 2px 2px 4px rgba(49,189,255,1);">
            ${window.T['pro_hint']}
        </span>
    </div>
    <p style="margin-bottom:12px; color:#2563eb; font-weight:600;">
        ${window.T['result_title_label']}: ${result.title}
    </p>
    <p class="result-desc" style="margin-bottom:12px; color:#1e469d; font-weight:600; line-height:1.8;">
        ${window.T['result_desc_label']}: ${result.description}
    </p>
    <p class="result-tags" style="margin-bottom:12px; color:#7c3aed; font-weight:600;">
        ${window.T['result_tags_label']}: ${result.tags}
    </p>
    <div style="margin-top:16px; display:flex; gap:8px;">
        <button class="btn-copy" onclick="copyResult()">${window.T['btn_copy_all']}</button>
    </div>
    `;
}

// --- Copy Result ---
function copyResult() {
    const box = document.getElementById('resultBox');
    if (!box) return;
    const text = box.innerText;
    navigator.clipboard.writeText(text)
        .then(() => alert('Kopyalandı!'))
        .catch(() => alert('Kopyalama başarısız!'));
}

// --- Ücretsiz Plan Çıktısı ---
function downloadResult() {
    const box = document.getElementById('resultBox');
    if (!box) return alert('Önce bir sonuç oluşturun.');
    const text = box.innerText;
    const blob = new Blob([text], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// --- AI Chat ---
const aiIcon = document.getElementById('aiChatIcon');
const aiBox = document.getElementById('aiChatBox');
const aiClose = document.getElementById('aiChatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');

aiIcon.addEventListener('click', () => { aiBox.style.display = 'flex'; });
aiClose.addEventListener('click', () => { aiBox.style.display = 'none'; });

sendChat.addEventListener('click', async () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    appendMessage('Siz', msg);
    chatInput.value = '';
    const res = await fetch('/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({message: msg})
    });
    const data = await res.json();
    appendMessage('AI', data.reply);
});

function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Dil Seçici zaten index.html'de changeLanguage ile hazır ---



</script>

