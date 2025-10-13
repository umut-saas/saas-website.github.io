<script>


// static/script.js  (Cleaned / unified version)
// Kullanım: index.html içinde <script src="{{ url_for('static', filename='script.js') }}"></script>
// ÖNEMLİ: Bu dosyada Jinja ifadeleri ({{ ... }}) yok. index.html içinde window.T ve window.LANG tanımlı olmalı.

(function () {
  "use strict";

  // --- Güvenlik: window.T ve LANG olmalı ---
  const T = window.T || {};        // çeviri sözlüğü index.html tarafından ekleniyor
  const LANG = window.LANG || document.documentElement.lang || "tr";

  // DOM hazır olduğunda çalıştır
  document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTLER (guard ile güvenli alım) ---
    const aiIcon = document.getElementById("aiChatIcon");
    const aiBox = document.getElementById("aiChatBox");
    const aiClose = document.getElementById("aiChatClose");
    const aiHeader = document.getElementById("aiChatHeader");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendChatBtn = document.getElementById("sendChat");

    const form = document.getElementById("productForm");
    const productInput = document.getElementById("productInput");
    const btnCreate = document.querySelector(".btn-create");
    const resultBox = document.getElementById("resultBox"); // olabilir veya olmayabilir
    const languageSelect = document.getElementById("languageSelect");

    // --- DİLSEL ÇEVİRİ (AI chat header & placeholder) ---
    const translations = {
      tr: { header: "AI Canlı Destek", placeholder: "Sorunuzu yazın...", send: "Gönder" },
      en: { header: "AI Live Support", placeholder: "Type your question...", send: "Send" },
      de: { header: "KI Live-Support", placeholder: "Ihre Frage hier eingeben...", send: "Senden" },
      ru: { header: "ИИ Поддержка", placeholder: "Введите ваш вопрос...", send: "Отправить" }
    };

    const langKey = (typeof LANG === "string" && LANG.slice(0,2)) || "tr";
    if (aiHeader && chatInput && translations[langKey]) {
      // aiHeader'in ilk metin düğümü varsa güncelle (görsel span da olduğunda güvenli ayar)
      // aiHeader genelde HTML içi "AI Canlı Destek <span ...>" şeklinde olduğu için text node'u güncelliyoruz
      if (aiHeader.childNodes && aiHeader.childNodes.length > 0) {
        // İlk node mu metin düğümü değilse (ör. <span>) fallback: innerText başına ekle
        if (aiHeader.childNodes[0].nodeType === Node.TEXT_NODE) {
          aiHeader.childNodes[0].nodeValue = translations[langKey].header + " ";
        } else {
          aiHeader.innerText = translations[langKey].header;
        }
      } else {
        aiHeader.innerText = translations[langKey].header;
      }
      chatInput.placeholder = translations[langKey].placeholder;
    }
    if (sendChatBtn && translations[langKey]) sendChatBtn.innerText = translations[langKey].send;

    // --- AI CHAT Open/Close ---
    if (aiIcon && aiBox) {
      aiIcon.addEventListener("click", () => {
        const isOpen = getComputedStyle(aiBox).display === "flex";
        aiBox.style.display = isOpen ? "none" : "flex";
        aiIcon.style.transform = isOpen ? "scale(1)" : "scale(0.9)";
      });
    }
    if (aiClose && aiBox && aiIcon) {
      aiClose.addEventListener("click", () => {
        aiBox.style.display = "none";
        aiIcon.style.transform = "scale(1)";
      });
    }

    // --- Chat Gönderme (backend /chat endpoint'e POST eder) ---
    if (sendChatBtn && chatInput && chatMessages) {
      sendChatBtn.addEventListener("click", async () => {
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage("Siz", text);
        chatInput.value = "";
        try {
          const resp = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
          });
          if (!resp.ok) throw new Error("HTTP " + resp.status);
          const data = await resp.json();
          appendMessage("AI", data.reply || "(no reply)");
        } catch (err) {
          appendMessage("AI", "(Sunucu hatası veya ağ hatası)");
          console.error("chat error:", err);
        }
      });
    }

    function appendMessage(sender, text) {
      if (!chatMessages) return;
      const d = document.createElement("div");
      d.style.margin = "6px 0";
      if (sender === "AI") {
        d.innerHTML = `<b>${sender}:</b> <span style="color:#1e90ff">${escapeHtml(text)}</span>`;
      } else {
        d.innerHTML = `<b>${sender}:</b> ${escapeHtml(text)}`;
      }
      chatMessages.appendChild(d);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // basit HTML escape
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // --- FORM: submit davranışı ---
    // Not: backend şu an app.py'de form POST bekliyor (form-encoded). Basit haliyle normal submit kullanıyoruz.
    // Eğer AJAX ile çalışmak istersen app.py'yi JSON kabul edecek şekilde düzenlemelisin.
    if (form && btnCreate && productInput) {
      // Prevent double listeners: remove previous inline onclick logic not required
      form.addEventListener("submit", (e) => {
        // Eğer boş input ise engelle ve kullanıcıya mesaj ver (çeviriden alın)
        const val = productInput.value.trim();
        if (!val) {
          e.preventDefault();
          const msg = T["js_make_first"] || "Lütfen önce oluşturun.";
          alert(msg);
          return false;
        }
        // normal form submit (backend app.py /generate ile çalışır)
        // NOT: Eğer deployda AJAX isteniyorsa bana söyle; app.py değişikliği gerekir.
      });

      // Ayrıca "btnCreate" bir <button type="submit"> olduğu için ekstra click handler'e gerek yok.
      // Ancak kullanıcı daha önce separate click kullanmış olabilir; güvenlik için koruma yok.
    }

    // --- COPY RESULT (tek fonksiyon, window.T kullanır) ---
    window.copyResult = function () {
      const box = document.getElementById("resultBox");
      if (!box) {
        alert(T["js_make_first"] || "Önce oluşturun.");
        return;
      }
      const text = box.innerText;
      if (!navigator.clipboard) {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); alert(T["js_copied"] || "Kopyalandı!"); }
        catch (e) { alert("Kopyalama başarısız"); }
        ta.remove();
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        alert(T["js_copied"] || "Kopyalandı!");
      }).catch(() => {
        alert("Kopyalama başarısız!");
      });
    };

    // --- DOWNLOAD RESULT (Ücretsiz çıktı .txt) ---
    window.downloadResult = function () {
      const box = document.getElementById("resultBox");
      if (!box) {
        alert(T["js_make_first"] || "Önce oluşturun.");
        return;
      }

      // DOM'dan başlık/description/tags çıkar (sayfanızın yapısına göre uyumlu)
      const pEls = box.querySelectorAll("p");
      // varsayılanlar çeviriden
      const title = pEls[0] ? extractAfterColon(pEls[0].innerText) : (T["demo_title"] || "");
      const desc = pEls[1] ? extractAfterColon(pEls[1].innerText) : (T["demo_description"] || "");
      const tags = pEls[2] ? extractAfterColon(pEls[2].innerText) : (T["demo_tags"] || "");

      const labelTitle = T["result_title_label"] || "Başlık";
      const labelDesc = T["result_desc_label"] || "Açıklama";
      const labelTags = T["result_tags_label"] || "SEO Tagler";
      const note = T["free_plan_note"] || "";

      const content = `${labelTitle}: ${title}\n\n${labelDesc}: ${desc}\n\n${labelTags}: ${tags}\n\n${note}`;

      const filename = T["download_filename"] || "urun-aciklama.txt";
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);

      // notify
      if (typeof T["free_plan_used"] === "string") alert(T["free_plan_used"]);
      else alert("1 çıktı kullanıldı");
    };

    function extractAfterColon(str) {
      if (!str) return "";
      return str.includes(":") ? str.split(":").slice(1).join(":").trim() : str.trim();
    }

    // --- MODAL & POPUP (tekil fonksiyonlar) ---
    window.openModal = function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = "block";
      if (languageSelect) { languageSelect.style.pointerEvents = "none"; languageSelect.style.opacity = "0.5"; }
    };
    window.closeModal = function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = "none";
      if (languageSelect) { languageSelect.style.pointerEvents = "auto"; languageSelect.style.opacity = "1"; }
    };
    window.showPopup = function (text) {
      const popup = document.getElementById("popup");
      const poptxt = document.getElementById("popup-text");
      if (!popup || !poptxt) return;
      poptxt.innerText = String(text || "");
      popup.style.display = "block";
    };
    window.closePopup = function () {
      const popup = document.getElementById("popup");
      if (!popup) return;
      popup.style.display = "none";
    };

    // --- LANGUAGE CHANGE (index.html'de select onchange zaten changeLanguage çağırıyor) ---
    // provide a safe global version that uses the server endpoint
    window.changeLanguage = window.changeLanguage || async function (lang) {
      try {
        await fetch("/set-language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang })
        });
        location.reload();
      } catch (e) {
        alert((T["js_selected_lang"] || "Language: ") + lang);
      }
    };

    // small utility: detect enter on chat input -> send
    if (chatInput && sendChatBtn) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendChatBtn.click();
        }
      });
    }

    // --- Son: küçük korumalar / konsol mesajı ---
    console.info("script.js loaded — clean unified version. LANG:", langKey);
  }); // DOMContentLoaded end

})(); // IIFE end

</script>