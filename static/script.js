
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
  a.download = T['download_filename'] || 'Ürün Açıklaması İndirildi.txt';
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




















/* free-download-guard-dom-single.js
   - Tek dosya: DOM downloadResult() fonksiyonunu sarmalar.
   - Owner'ı etkilemez. Müşteri için domain-tabanlı localStorage 1-defa kısıtı uygular.
   - Yapıştır: mevcut DOM JS dosyanızın sonuna veya page <script> sona.
*/

(function(){
  const GLOBAL_KEY = 'freeDownloadUsed_GLOBAL';
  const BUTTON_ID = 'freeDownloadBtn'; // eğer butonun id'si farklıysa burayı değiştir
  const lang = (window.LANG || 'tr').toLowerCase();

  // helper: owner kontrol
  function isOwner() {
    try { return localStorage.getItem('isOwner') === 'true'; } catch(e){ return false; }
  }

  // mesajlar: öncelik T çevirisi
  function msgAlreadyUsed() {
    if (typeof T === 'object' && T['free_plan_already_used']) return T['free_plan_already_used'];
    const map = {
      tr: 'Ücretsiz çıktı hakkınız zaten kullanıldı!',
      en: 'Your free download has already been used!',
      de: 'Ihr kostenloser Download wurde bereits verwendet!',
      ru: 'Ваш бесплатный скачивание уже использовано!'
    };
    return map[lang] || map.tr;
  }
  function msgNowUsed() {
    if (typeof T === 'object' && T['free_plan_used']) return T['free_plan_used'];
    const map = { tr:'1 çıktı kullanıldı', en:'1 download used', de:'1 Ausgabe verwendet', ru:'Использовано 1 скачивание' };
    return map[lang] || map.tr;
  }

  // localStorage set/get güvenli wrapper
  function setGlobalFlag() {
    try { localStorage.setItem(GLOBAL_KEY, 'true'); } catch(e){ console.warn('localStorage set error', e); }
  }
  function getGlobalFlag() {
    try { return localStorage.getItem(GLOBAL_KEY); } catch(e){ return null; }
  }

  // Installer (wrap or replace)
  function installGuard() {
    const original = (typeof window.downloadResult === 'function') ? window.downloadResult : null;

    const guarded = function(...args) {
      // Owner bypass
      if (isOwner()) {
        if (original) return original.apply(this, args);
        console.warn('downloadResult tanımlı değil; owner olduğunuz için işlem yapılmadı (orijinal yok).');
        return;
      }

      // Müşteri: global flag kontrolü
      if (getGlobalFlag()) {
        alert(msgAlreadyUsed());
        return;
      }

      // İlk defa indiriliyor -> çağır orijinal (varsa)
      if (original) {
        try {
          const res = original.apply(this, args);

          // Eğer Promise döndürürse: resolve sonrası flag setle (Response objesi ise ok kontrolü)
          if (res && typeof res.then === 'function') {
            res.then((r) => {
              try {
                if (r && typeof r.ok === 'boolean') {
                  if (r.ok) setGlobalFlag();
                } else {
                  // resolve ancak Response değil => başarılı kabul edip setle
                  setGlobalFlag();
                }
              } catch(e){ /* ignore */ }
            }).catch(() => {
              // hata olursa flag setlenmesin
            });
          } else {
            // sync fonksiyon ise hemen setle
            setGlobalFlag();
          }

          return res;
        } catch (err) {
          // orijinal hata verdi -> flag koyma
          throw err;
        }
      } else {
        // orijinal yoksa fallback: set flag ve bilgilendir
        setGlobalFlag();
        alert(msgNowUsed());
        return;
      }
    };

    // Tekrar yüklenmeyi önlemek
    if (!window._freeDownloadGuard_installed) {
      window._original_downloadResult = original;
      window.downloadResult = guarded;
      window._freeDownloadGuard_installed = true;
    } else {
      // zaten yüklüyse güncelle
      window.downloadResult = guarded;
    }
  }

  // Butona güvenli bağlama (buton varsa)
  function bindButton() {
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById(BUTTON_ID);
      if (!btn) return;
      // remove old listener that might call original directly to avoid double-call (safest not to remove inline onclick)
      // Ensure click triggers our window.downloadResult
      btn.addEventListener('click', function(e){
        // öncelikle prevent default formları engellemek için, ama eğer form submit gerekiyorsa bırak
        if (e && e.preventDefault) {
          // NOTE: Eğer buton form submit yapmak zorundaysa bu satırı kaldır.
          // e.preventDefault();
        }
        // çağır
        try { window.downloadResult(); } catch(ex) { console.error(ex); }
      });
    });
  }

  // debug helpers
  window.__freeDownloadGuard = window.__freeDownloadGuard || {};
  window.__freeDownloadGuard.reset = function(){ try { localStorage.removeItem(GLOBAL_KEY); } catch(e){} };
  window.__freeDownloadGuard.get = function(){ return getGlobalFlag(); };
  window.__freeDownloadGuard.setOwner = function(){ try { localStorage.setItem('isOwner','true'); } catch(e){} };
  window.__freeDownloadGuard.removeOwner = function(){ try { localStorage.removeItem('isOwner'); } catch(e){} };

  // install
  installGuard();
  bindButton();

})(); 




</script>
