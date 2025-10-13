// --- Global T (çeviriler) ---
const T = {{ t | tojson }};

// --- DOM Elements ---
const aiIcon = document.getElementById('aiChatIcon');
const aiBox = document.getElementById('aiChatBox');
const aiClose = document.getElementById('aiChatClose');
const aiHeader = document.getElementById('aiChatHeader');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');

const productForm = document.getElementById('productForm');
const productInput = document.getElementById('productInput');
const resultBox = document.getElementById('resultBox');

const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

const langSelect = document.getElementById('languageSelect');

// --- Functions ---

function openModal(id){
    const el = document.getElementById(id);
    if(el) el.style.display = 'block';
    if(langSelect) { langSelect.style.pointerEvents = 'none'; langSelect.style.opacity = '0.5'; }
}

function closeModal(id){
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
    if(langSelect) { langSelect.style.pointerEvents = 'auto'; langSelect.style.opacity = '1'; }
}

function showPopup(text){
    const popupText = document.getElementById('popup-text');
    const popup = document.getElementById('popup');
    if(popup && popupText){
        popupText.innerText = text;
        popup.style.display = 'block';
    }
}

function closePopup(){
    const popup = document.getElementById('popup');
    if(popup) popup.style.display = 'none';
}

window.changeLanguage = async function(lang){
    try{
        await fetch('/set-language',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({lang})
        });
        location.reload();
    }catch(e){
        alert((T['js_selected_lang'] || 'Language: ') + lang);
    }
}

// --- AI Chat ---
if(aiIcon && aiBox && aiClose && sendChat && chatMessages && chatInput){
    // Dil seçeneğine göre başlık ve placeholder
    let lang = document.documentElement.lang || 'tr';
    const translations = {
        tr: { header: "AI Canlı Destek", placeholder: "Sorunuzu yazın...", send: "Gönder" },
        en: { header: "AI Live Support", placeholder: "Type your question...", send: "Send" },
        de: { header: "KI Live-Support", placeholder: "Ihre Frage hier eingeben...", send: "Senden" },
        ru: { header: "ИИ Поддержка", placeholder: "Введите ваш вопрос...", send: "Отправить" }
    };
    if(translations[lang]){
        aiHeader.childNodes[0].nodeValue = translations[lang].header;
        chatInput.placeholder = translations[lang].placeholder;
        sendChat.innerText = translations[lang].send;
    }

    aiIcon.addEventListener('click', ()=>{
        aiBox.style.display = (aiBox.style.display==='flex') ? 'none' : 'flex';
        aiIcon.style.transform = aiBox.style.display === 'flex' ? 'scale(0.9)' : 'scale(1)';
    });
    aiClose.addEventListener('click', ()=>{
        aiBox.style.display = 'none';
        aiIcon.style.transform = 'scale(1)';
    });

    sendChat.addEventListener('click', async ()=>{
        const msg = chatInput.value.trim();
        if(!msg) return;
        appendMessage('Sen', msg);
        chatInput.value = '';
        const res = await fetch('/chat',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({message: msg})
        });
        const data = await res.json();
        appendMessage('AI', data.reply);
    });

    function appendMessage(sender, text){
        const div = document.createElement('div');
        div.innerHTML = `<b>${sender}:</b> ${text}`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// --- Product Form ---
if(productForm && productInput){
    productForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const name = productInput.value.trim();
        if(!name) return alert('Lütfen ürün adı girin!');
        const res = await fetch('/generate',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({product_name: name})
        });
        const data = await res.json();
        displayResult(data);
    });
}

function displayResult(result){
    if(!resultBox) return;
    resultBox.style.display = 'block';
    resultBox.innerText = `${T['result_title_label']}: ${result.title}\n${T['result_desc_label']}: ${result.description}\n${T['result_tags_label']}: ${result.tags}`;
}

// --- Copy / Download ---
if(copyBtn){
    copyBtn.addEventListener('click', ()=>{
        if(!resultBox) return alert(T['js_make_first'] || 'Önce bir sonuç oluşturun.');
        navigator.clipboard.writeText(resultBox.innerText)
        .then(()=> alert(T['js_copied'] || 'Kopyalandı!'))
        .catch(()=> alert('Kopyalama başarısız!'));
    });
}
if(downloadBtn){
    downloadBtn.addEventListener('click', ()=>{
        if(!resultBox) return alert(T['js_make_first'] || 'Önce bir sonuç oluşturun.');
        const blob = new Blob([resultBox.innerText], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = T['download_filename'] || 'urun-aciklama.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
    });
}
