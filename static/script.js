
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

    if (!box) {
        console.error("resultBox bulunamadı!");
        return;
    }

    // Owner kontrolü
    const isOwner = localStorage.getItem('isOwner') === 'true';
    const lang = (window.LANG || 'tr').toLowerCase();

    // Müşteri 1 kez indirme kontrolü
    if (!isOwner && localStorage.getItem('freeDownloadUsed')) {
        const msg = {
            tr: T['free_plan_already_used'] || 'Ücretsiz çıktı hakkınız zaten kullanıldı!',
            en: T['free_plan_already_used'] || 'Your free download has already been used!',
            de: T['free_plan_already_used'] || 'Ihr kostenloser Download wurde bereits verwendet!',
            ru: T['free_plan_already_used'] || 'Ваш бесплатный скачивание уже использовано!'
        };
        alert(msg[lang] || msg['tr']);
        return;
    }

    // DOM string içeriğini al
    const raw = box.innerText || '';
    const lines = raw.split('\n').map(line => line.trim()).filter(line => line);

    const title = lines[0] || T['demo_title'] || '';
    const description = lines[1] || T['demo_description'] || '';
    const tags = lines[2] || T['demo_tags'] || '';

    // Not ve label'ları T içinden alıyoruz
    const note = T['free_plan_note'] || 'Not: Bu dosya demo amaçlıdır, sadece 1 kez indirilebilir.';
    const labelTitle = T['result_title_label'] || 'Başlık';
    const labelDesc = T['result_desc_label'] || 'Açıklama';
    const labelTags = T['result_tags_label'] || 'SEO Tagler';

    const content = `${labelTitle}: ${title}\n\n${labelDesc}: ${description}\n\n${labelTags}: ${tags}\n\n${note}`;

    // Dosya adları çok dilli
    const filenames = {
        tr: T['download_filename'] || 'Ürün Açıklaması İndirildi.txt',
        en: T['download_filename_en'] || 'Product Description Downloaded.txt',
        de: T['download_filename_de'] || 'Produktbeschreibung heruntergeladen.txt',
        ru: T['download_filename_ru'] || 'Opisanie Produkta Zagruzheno.txt'
    };
    const filename = filenames[lang] || filenames['tr'];

    // Dosya oluştur ve indir
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);

    // İndirme durumu ve alert
    if (!isOwner) {
        localStorage.setItem('freeDownloadUsed', 'true');
        const msgNow = {
            tr: '1 çıktı kullanıldı',
            en: '1 download used',
            de: '1 Ausgabe verwendet',
            ru: 'Использовано 1 скачивание'
        };
        alert(msgNow[lang] || msgNow['tr']);
    } else {
        const ownerMsg = {
            tr: 'Owner olarak çıktı alındı',
            en: 'Output downloaded as owner',
            de: 'Als Owner heruntergeladen',
            ru: 'Загружено как владелец'
        };
        alert(ownerMsg[lang] || ownerMsg['tr']);
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



</script>
