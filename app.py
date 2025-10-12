from flask import Flask, request, render_template_string, jsonify
from datetime import datetime



app = Flask(__name__)

# -- Basit i18n sözlüğü --
TRANSLATIONS = {
    "tr": {
        "app_name": "AI ÜrünSEO",
        "tagline": "Ürün açıklama & SEO otomasyonu",
        "nav_login": "Giriş Yap",
        "page_title": "E-ticaret için AI destekli ürün açıklaması & SEO başlık/tag üretici 🚀",
        "lead": "Ürün adını girin, AI (veya demo) sizin için başlık, açıklama ve SEO etiketlerini sağlar.",
        "info_ecom": "E-ticaret uyumlu",
        "info_auto": "Otomatik başlık & açıklama",
        "info_seo": "SEO & Tag üretimi",
        "info_ai": "AI destekli otomasyon",
        "tooltip_ecom": "Shopify, WooCommerce, Amazon KDP, Etsy ile uyumlu",
        "tooltip_auto": "Ürün başlık ve açıklamaları otomatik oluşturulur",
        "tooltip_seo": "SEO ve Tag üretimi desteklenir",
        "tooltip_ai": "AI destekli otomasyon",
        "popup_close": "✖ Kapat",
        "label_product_name": "Ürün Adı",
        "placeholder_product": "Örnek: E-kitap, Podcast Serisi, Online Kurs",
        "btn_create": "Oluştur",
        "pro_hint": "Pro plan ile limitsiz kullanım",
        "result_title_label": "Başlık",
        "demo_title": "E-kitap, Podcast Serisi, Online Kurs",
        "result_desc_label": "Açıklama",
        "demo_description": "Bu E-kitap, Podcast Serisi ve Online Kurs becerilerinizi geliştirmek ve bilgilerinizi artırmak için özenle hazırlanmıştır. Pratik, bilgilendirici ve yaratıcı öğrenme deneyimi sunar.",
        "result_tags_label": "SEO Tagler",
        "demo_tags": "E-kitap, Online Kurs, Podcast, Eğitim, Öğrenme",
        "btn_copy_all": "Tümünü Kopyala",
        "free_plan_title": "Ücretsiz Plan",
        "free_plan_meta": "1 çıktı ücretsiz",
        "free_plan_desc": "Hızlı demo ve test için uygundur.",
        "free_plan_cta": "Ücretsiz Çıktı Al",
        "free_plan_note": "Not: Bu dosya demo amaçlıdır, sadece 1 kez indirilebilir.",
        "free_plan_used": "1 çıktı kullanıldı",
        "pro_plan_title": "Pro Plan — Startup",
        "pro_plan_meta": "Limitsiz kullanım, öncelikli destek",
        "pro_plan_cta": "Satın Al",
        "trust_title": "Güvence & Destek",
        "trust_meta": "SSL, veri gizliliği ve müşteri desteği ile hazır.",
        "license_title": "Lisans",
        "license_meta": "Ürünler yalnızca kişisel kullanım içindir. Ticari kullanım veya paylaşım izni verilmez.",
        "footer_about": "Hakkında",
        "footer_contact": "İletişim",
        "footer_privacy": "Gizlilik Politikası",
        "footer_termsofuse": "Kullanım Şartları",
        "footer_refund": "İade Koşulları",
        "footer_update": "Güncelleme Politikası",
        "about_title": "Hakkında",
        "about_p1": "Merhabalar, E-Ticaret için AI tabanlı ürün açıklamaları ve SEO çözümleri geliştiriyorum. Amacım, AI ÜrünSEO ile işletmelerin açıklama, başlık ve SEO etiketlerini hızlı ve etkili biçimde oluşturmalarına yardımcı olmak.",
        "about_adv": "Platformun sunduğu başlıca avantajlar",
        "about_adv_items": ["🛒 E-ticaret uyumlu çözümler", "✨ Otomatik başlık & açıklama üretimi", "🔑 SEO odaklı tag oluşturma", "🤖 AI destekli otomasyon"],
        "contact_title": "İletişim",
        "privacy_title": "Gizlilik Politikası",
        "privacy_p": "Bu platform gizliliğe önem verir. Kişisel veriler yalnızca hizmet amacıyla kullanılır ve üçüncü kişilerle paylaşılmaz. SSL ve güvenli saklama yöntemleri uygulanır.",
        "termsofuse_title": "Kullanım Şartları",
        "termsofuse_p": "1. Bu içerik yalnızca satın alan kişi tarafından kullanılabilir.\n2. İçerik, kişisel projelere, e-ticaret sayfalarına ve sosyal medya hesaplarına entegre edilebilir.\n3. Satın alınan içerik yeniden satılamaz, çoğaltılamaz veya üçüncü kişilerle paylaşılmaz.\n4. Ücretsiz demo çıktılar yalnızca fikir edinmek amacıyla sunulur. Ticari kullanıma veya gelir elde etmeye uygun değildir.\n5. Kullanıcı bu şartları kabul ederek ürünü indirir ve kullanır.",
        "refund_title": "İade Koşulları",
        "refund_p1": "Bu ürün dijital olarak teslim edilmektedir.",
        "refund_p2": "Satın alma sonrası anında erişim sağlandığından dolayı iade veya iptal mümkün değildir.",
        "refund_p3": "Ancak teknik bir problem yaşamanız halinde lütfen bizimle iletişime geçiniz, sorununuzu en kısa sürede çözeceğiz.",
        "update_title": "Güncelleme Politikası",
        "update_p1": "Ürün düzenli olarak bakım ve performans iyileştirmeleri alacaktır.",
        "update_p2": "Küçük güncellemeler ve hata düzeltmeleri ücretsiz olarak sunulacaktır.",
        "update_p3": "Yeni özellikler veya kapsamlı geliştirmeler ek bir sürüm kapsamında sunulabilir.",
        "login_title": "Giriş Yap",
        "login_email_ph": "E-posta",
        "login_pass_ph": "Şifre",
        "login_btn": "Giriş Yap",
        "pro_modal_title": "Pro Plan — Startup",
        "pro_modal_p1": "Limitsiz kullanım, öncelikli destek",
        "pro_modal_p2": "Ödeme ekranı demo amaçlıdır.",
        "pro_modal_btn": "Satın Al",
        "js_make_first": "Önce oluşturun.",
        "js_copied": "Sonuç kopyalandı!",
        "js_selected_lang": "Dil seçildi: ",
        "download_filename": "urun-aciklama.txt",
    },


    "en": {
        "app_name": "AI ProductSEO",
        "tagline": "Product descriptions & SEO automation",
        "nav_login": "Sign In",
        "page_title": "AI-powered product description & SEO title/tag generator for e-commerce 🚀",
        "lead": "Enter a product name; AI (or the demo) will generate a title, description, and SEO tags for you.",
        "info_ecom": "E-commerce ready",
        "info_auto": "Auto title & description",
        "info_seo": "SEO & tag generation",
        "info_ai": "AI automation",
        "tooltip_ecom": "Shopify, WooCommerce, Amazon KDP, Etsy with compatible",
        "tooltip_auto": "Automatically generates product titles and descriptions",
        "tooltip_seo": "Supports SEO and tag generation",
        "tooltip_ai": "AI-powered automation",
        "popup_close": "✖ Close",
        "label_product_name": "Product Name",
        "placeholder_product": "Example: E-book, Podcast Series, Online Course",
        "btn_create": "Generate",
        "pro_hint": "Unlimited usage with Pro",
        "result_title_label": "Title",
        "demo_title": "E-book, Podcast Series, Online Course",
        "result_desc_label": "Description",
        "demo_description": "This E-book, Podcast Series, and Online Course are carefully designed to help you enhance your skills and expand your knowledge. Provides a practical, informative, and creative learning experience.",
        "result_tags_label": "SEO Tags",
        "demo_tags": "E-book, Online Course, Podcast, Education, Learning",
        "btn_copy_all": "Copy All",
        "free_plan_title": "Free Plan",
        "free_plan_meta": "1 output free",
        "free_plan_desc": "Great for quick demos and testing.",
        "free_plan_cta": "Get Free Output",
        "free_plan_note": "Note: This file is for demo purposes, can only be downloaded once.",
        "free_plan_used": "1 output used",
        "pro_plan_title": "Pro Plan — Startup",
        "pro_plan_meta": "Unlimited usage, priority support",
        "pro_plan_cta": "Buy",
        "trust_title": "Trust & Support",
        "trust_meta": "SSL, data privacy, and customer support included.",
        "license_title": "License",
        "license_meta": "Products are for personal use only. No commercial use or sharing rights are granted.",
        "footer_about": "About",
        "footer_contact": "Contact",
        "footer_privacy": "Privacy Policy",
        "footer_termsofuse": "Terms of Use",
        "footer_refund": "Refund Policy",
        "footer_update": "Update Policy",
        "about_title": "About",
        "about_p1": "Hi, I build AI-powered product description and SEO tools for e-commerce. My goal with AI ProductSEO is to help teams create titles, descriptions, and tags quickly and effectively.",
        "about_adv": "Key Benefits",
        "about_adv_items": ["🛒 E-commerce ready", "✨ Automatic titles & descriptions", "🔑 SEO-focused tag creation", "🤖 AI-powered automation"],
        "contact_title": "Contact",
        "privacy_title": "Privacy Policy",
        "privacy_p": "We value your privacy. Personal data is used only to provide the service and is not shared with third parties. SSL and secure storage practices are applied.",
        "termsofuse_title": "Terms of Use",
        "termsofuse_p": "1. This content can only be used by the person who purchased it.\n2. The content can be integrated into personal projects, e-commerce pages, and social media accounts.\n3. Purchased content cannot be resold, duplicated, or shared with third parties.\n4. Free demo outputs are provided for informational purposes only. They are not suitable for commercial use or generating income.\n5. By using the product, the user agrees to these terms.",
        "refund_title": "Refund Policy",
        "refund_p1": "This product is delivered digitally.",
        "refund_p2": "Since access is granted immediately after purchase, refunds or cancellations are not possible.",
        "refund_p3": "However, if you encounter a technical problem, please contact us and we will resolve the issue as quickly as possible.",
        "update_title": "Update Policy",
        "update_p1": "The product will receive regular maintenance and performance improvements.",
        "update_p2": "Minor updates and bug fixes will be provided free of charge.",
        "update_p3": "New features or major enhancements may be offered in an additional release.",
        "login_title": "Sign In",
        "login_email_ph": "Email",
        "login_pass_ph": "Password",
        "login_btn": "Sign In",
        "pro_modal_title": "Pro Plan — Startup",
        "pro_modal_p1": "Unlimited usage, priority support",
        "pro_modal_p2": "Payment screen is for demo purposes.",
        "pro_modal_btn": "Buy",
        "js_make_first": "Generate first.",
        "js_copied": "Copied!",
        "js_selected_lang": "Language selected: ",
        "download_filename": "product-description.txt",
    },


    "de": {
        "app_name": "AI ProduktSEO",
        "tagline": "Produktbeschreibungen & SEO-Automatisierung",
        "nav_login": "Anmelden",
        "page_title": "KI-gestützter Generator für Produktbeschreibung & SEO-Titel/Tags 🚀",
        "lead": "Produktname eingeben; KI (oder Demo) erzeugt Titel, Beschreibung und SEO-Tags.",
        "info_ecom": "E-Commerce-tauglich",
        "info_auto": "Autom. Titel & Beschreibung",
        "info_seo": "SEO & Tag-Erstellung",
        "info_ai": "KI-Automatisierung",
        "tooltip_ecom": "Kompatibel mit Shopify, WooCommerce, Amazon KDP, Etsy",
        "tooltip_auto": "Erzeugt automatisch Titel und Beschreibungen",
        "tooltip_seo": "Unterstützt SEO und Tag-Erstellung",
        "tooltip_ai": "KI-gestützte Automatisierung",
        "popup_close": "✖ Schließen",
        "label_product_name": "Produktname",
        "placeholder_product": "Beispiel: E-Book, Podcast-Serie, Online-Kurs",
        "btn_create": "Erzeugen",
        "pro_hint": "Unbegrenzt mit Pro",
        "result_title_label": "Titel",
        "demo_title": "E-Book, Podcast-Serie, Online-Kurs",
        "result_desc_label": "Beschreibung",
        "demo_description": "Dieses E-Book, die Podcast-Serie und der Online-Kurs sind sorgfältig darauf ausgelegt, Ihre Fähigkeiten zu verbessern und Ihr Wissen zu erweitern. Bietet ein praktisches, informatives und kreatives Lernerlebnis.",
        "result_tags_label": "SEO-Tags",
        "demo_tags": "E-Book, Online-Kurs, Podcast, Bildung, Lernen",
        "btn_copy_all": "Alles kopieren",
        "free_plan_title": "Kostenloser Plan",
        "free_plan_meta": "1 Ausgabe gratis",
        "free_plan_desc": "Ideal für schnelle Demos und Tests.",
        "free_plan_cta": "Gratis-Ausgabe holen",
        "free_plan_note": "Hinweis: Diese Datei ist für Demo-Zwecke, kann nur einmal heruntergeladen werden.",
        "free_plan_used": "1 Ausgabe verwendet",
        "pro_plan_title": "Pro Plan — Startup",
        "pro_plan_meta": "Unbegrenzt, priorisierter Support",
        "pro_plan_cta": "Kaufen",
        "trust_title": "Sicherheit & Support",
        "trust_meta": "SSL, Datenschutz und Kundensupport inklusive.",
        "license_title": "Lizenz",
        "license_meta": "Produkte sind nur für den persönlichen Gebrauch bestimmt. Es werden keine kommerziellen Nutzungs- oder Weitergaberechte gewährt.",
        "footer_about": "Über",
        "footer_contact": "Kontakt",
        "footer_privacy": "Datenschutz",
        "footer_termsofuse": "Nutzungsbedingungen",
        "footer_refund": "Rückgabebedingungen",
        "footer_update": "Aktualisierungsrichtlinie",
        "about_title": "Über",
        "about_p1": "Hallo, Ich entwickle KI-basierte Tools für Produktbeschreibungen und SEO. Ziel von AI ProduktSEO ist es, Titel, Beschreibungen und Tags schnell und effektiv zu erstellen.",
        "about_adv": "Wichtigste Vorteile",
        "about_adv_items": ["🛒 E-Commerce-tauglich", "✨ Automatische Titel & Beschreibungen", "🔑 SEO-fokussierte Tags", "🤖 KI-Automatisierung"],
        "contact_title": "Kontakt",
        "privacy_title": "Datenschutz",
        "privacy_p": "Wir legen Wert auf Privatsphäre. Daten werden nur für den Service genutzt und nicht weitergegeben. SSL und sichere Speicherung werden angewandt.",
        "termsofuse_title": "Nutzungsbedingungen", 
        "termsofuse_p": "1. Dieser Inhalt darf nur von der Person verwendet werden, die ihn gekauft hat.\n2. Der Inhalt kann in persönliche Projekte, E-Commerce-Seiten und Social-Media-Konten integriert werden.\n3. Gekaufte Inhalte dürfen nicht weiterverkauft, vervielfältigt oder mit Dritten geteilt werden.\n4. Kostenlose Demodateien dienen nur zu Informationszwecken. Sie sind nicht für die kommerzielle Nutzung oder Einkommensgenerierung geeignet.\n5. Durch die Nutzung des Produkts stimmt der Benutzer diesen Bedingungen zu.",
        "refund_title": "Rückgabebedingungen",
        "refund_p1": "Dieses Produkt wird digital geliefert.",
        "refund_p2": "Da der Zugriff unmittelbar nach dem Kauf gewährt wird, sind Rückerstattungen oder Stornierungen nicht möglich.",
        "refund_p3": "Wenn Sie jedoch ein technisches Problem haben, kontaktieren Sie uns bitte, und wir werden das Problem so schnell wie möglich lösen.",
        "update_title": "Aktualisierungsrichtlinie",
        "update_p1": "Das Produkt erhält regelmäßig Wartungen und Leistungsverbesserungen.",
        "update_p2": "Kleinere Updates und Fehlerbehebungen werden kostenlos bereitgestellt.",
        "update_p3": "Neue Funktionen oder umfassende Verbesserungen können in einer zusätzlichen Version angeboten werden.",
        "login_title": "Anmelden",
        "login_email_ph": "E-Mail",
        "login_pass_ph": "Passwort",
        "login_btn": "Anmelden",
        "pro_modal_title": "Pro-Plan — Startup",
        "pro_modal_p1": "Unbegrenzt, priorisierter Support",
        "pro_modal_p2": "Zahlungsseite nur Demo.",
        "pro_modal_btn": "Kaufen",
        "js_make_first": "Bitte zuerst erzeugen.",
        "js_copied": "Kopiert!",
        "js_selected_lang": "Sprache gewählt: ",
        "download_filename": "produkt-beschreibung.txt",
    },


    "ru": {
        "app_name": "AI ProductSEO",
        "tagline": "Описания товаров и SEO-автоматизация",
        "nav_login": "Войти",
        "page_title": "Генератор описаний и SEO-тегов для e-commerce на базе ИИ 🚀",
        "lead": "Введите название товара — ИИ (или демо) создаст заголовок, описание и SEO-теги.",
        "info_ecom": "Готово к e-commerce",
        "info_auto": "Авто заголовок и описание",
        "info_seo": "SEO и теги",
        "info_ai": "Автоматизация ИИ",
        "tooltip_ecom": "Совместимо с Shopify, WooCommerce, Amazon KDP, Etsy",
        "tooltip_auto": "Автоматически создаёт заголовки и описания",
        "tooltip_seo": "Поддержка SEO и генерации тегов",
        "tooltip_ai": "Автоматизация на ИИ",
        "popup_close": "✖ Закрыть",
        "label_product_name": "Название товара",
        "placeholder_product": "Пример: Электронная книга, Серия подкастов, Онлайн-курс",
        "btn_create": "Сгенерировать",
        "pro_hint": "Безлимит с Pro",
        "result_title_label": "Заголовок",
        "demo_title": "Электронная книга, Серия подкастов, Онлайн-курс",
        "result_desc_label": "Описание",
        "demo_description": "Эта электронная книга, серия подкастов и онлайн-курс тщательно разработаны, чтобы помочь вам развить навыки и расширить знания. Обеспечивает практический, информативный и творческий опыт обучения.",
        "result_tags_label": "SEO-теги",
        "demo_tags": "Электронная книга, Онлайн-курс, Подкаст, Образование, Обучение",
        "btn_copy_all": "Копировать всё",
        "free_plan_title": "Бесплатный план",
        "free_plan_meta": "1 результат бесплатно",
        "free_plan_desc": "Подходит для быстрых демо и тестов.",
        "free_plan_cta": "Получить бесплатно",
        "free_plan_note": "Примечание: Этот файл предназначен для демонстрации, можно скачать только один раз.",
        "free_plan_used": "1 результат использован",
        "pro_plan_title": "План Pro — Startup",
        "pro_plan_meta": "Безлимит, приоритетная поддержка",
        "pro_plan_cta": "Купить",
        "trust_title": "Надёжность и поддержка",
        "trust_meta": "SSL, конфиденциальность и поддержка клиентов.",
        "license_title": "Лицензия",
        "license_meta": "Продукция предназначена только для личного использования. Коммерческое использование или распространение не допускается.",
        "footer_about": "О нас",
        "footer_contact": "Контакты",
        "footer_privacy": "Политика конфиденциальности",
        "footer_termsofuse": "Условия использования",
        "footer_refund": "Условия возврата",
        "footer_update": "Политика обновлений",
        "about_title": "О нас",
        "about_p1": "Привет, Разрабатываю решения на базе ИИ для описаний товаров и SEO. Цель AI ProductSEO — быстро и эффективно создавать заголовки, описания и теги.",
        "about_adv": "Ключевые преимущества",
        "about_adv_items": ["🛒 Готово для e-commerce", "✨ Авто заголовки и описания", "🔑 SEO-ориентированные теги", "🤖 Автоматизация на ИИ"],
        "contact_title": "Контакты",
        "privacy_title": "Политика конфиденциальности",
        "privacy_p": "Мы ценим вашу конфиденциальность. Данные используются только для сервиса и не передаются третьим лицам. Используются SSL и безопасное хранение.",
        "termsofuse_title": "Условия использования",
        "termsofuse_p": "1. Этот контент может использоваться только лицом, которое его приобрело.\n2. Контент может быть интегрирован в личные проекты, страницы электронной коммерции и социальные сети.\n3. Приобретённый контент не может быть перепродан, скопирован или передан третьим лицам.\n4. Бесплатные демонстрационные материалы предоставляются только для ознакомления. Они не предназначены для коммерческого использования или получения дохода.\n5. Пользователь, используя продукт, соглашается с этими условиями.",
        "refund_title": "Условия возврата",
        "refund_p1": "Этот продукт предоставляется в цифровом виде.",
        "refund_p2": "Так как доступ предоставляется сразу после покупки, возврат или отмена невозможны.",
        "refund_p3": "Однако, если возникнут технические проблемы, пожалуйста, свяжитесь с нами, и мы решим проблему как можно скорее.",
        "update_title": "Политика обновлений",
        "update_p1": "Продукт будет регулярно получать техническое обслуживание и улучшения производительности.",
        "update_p2": "Небольшие обновления и исправления ошибок предоставляются бесплатно.",
        "update_p3": "Новые функции или масштабные улучшения могут быть предложены в рамках дополнительного выпуска.",
        "login_title": "Войти",
        "login_email_ph": "Эл. почта",
        "login_pass_ph": "Пароль",
        "login_btn": "Войти",
        "pro_modal_title": "План Pro — Startup",
        "pro_modal_p1": "Безлимит и приоритетная поддержка",
        "pro_modal_p2": "Платёжная страница для демо.",
        "pro_modal_btn": "Купить",
        "js_make_first": "Сначала сгенерируйте.",
        "js_copied": "Скопировано!",
        "js_selected_lang": "Выбран язык: ",
        "download_filename": "opisanie-tovara.txt",
    },




}



def get_lang():
    lang = (request.args.get("lang")
            or request.cookies.get("lang")
            or "tr").lower()
    return lang if lang in TRANSLATIONS else "tr"

def make_demo_result(product_name: str, lang: str):
    if lang == "en":
        title = f"E-book, Podcast Series, Online Course"
        description = (f"This E-book, Podcast Series, and Online Course are carefully designed to help you enhance your skills and expand your knowledge. Provides a practical, informative, and creative learning experience.")
        tags = "E-book, Online Course, Podcast, Education, Learning"
    elif lang == "de":
        title = f"E-Book, Podcast-Serie, Online-Kurs"
        description = (f"Dieses E-Book, die Podcast-Serie und der Online-Kurs sind sorgfältig darauf ausgelegt, Ihre Fähigkeiten zu verbessern und Ihr Wissen zu erweitern. Bietet ein praktisches, informatives und kreatives Lernerlebnis.")
        tags = "E-Book, Online-Kurs, Podcast, Bildung, Lernen"
    elif lang == "ru":
        title = f"Электронная книга, Серия подкастов, Онлайн-курс"
        description = (f"Эта электронная книга, серия подкастов и онлайн-курс тщательно разработаны, чтобы помочь вам развить навыки и расширить знания. Обеспечивает практический, информативный и творческий опыт обучения.")
        tags = "Электронная книга, Онлайн-курс, Подкаст, Образование, Обучение"
    else:  # tr
        title = f"E-kitap, Podcast Serisi, Online Kurs"
        description = (f"Bu E-kitap, Podcast Serisi ve Online Kurs becerilerinizi geliştirmek ve bilgilerinizi artırmak için özenle hazırlanmıştır. Pratik, bilgilendirici ve yaratıcı öğrenme deneyimi sunar.")
        tags = "E-kitap, Online Kurs, Podcast, Eğitim, Öğrenme"
    return {"product_name": product_name, "title": title, "description": description, "tags": tags}






"""

@app.post("/set-language")
def set_language():
    data = request.get_json(silent=True) or {}
    lang = (data.get("lang") or "tr").lower()
    if lang not in TRANSLATIONS:
        lang = "tr"
    resp = jsonify(ok=True, lang=lang)
    # 1 yıl sakla
    resp.set_cookie("lang", lang, max_age=60*60*24*365, samesite="Lax")
    return resp

@app.route("/", methods=["GET"])
def index():
    lang = get_lang()
    t = TRANSLATIONS[lang]
    return render_template_string(HTML, t=t, lang=lang, year=datetime.now().year)

@app.route("/generate", methods=["POST"])
def generate():
    lang = get_lang()
    t = TRANSLATIONS[lang]
    product_name = request.form.get("product_name", "E-kitap, Podcast Serisi, Online Kurs").strip()
    result = make_demo_result(product_name, lang)
    return render_template_string(HTML, result=result, t=t, lang=lang, year=datetime.now().year)

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8000)

