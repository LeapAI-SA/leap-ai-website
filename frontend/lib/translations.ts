import { adminExtraTranslations } from "./admin-extra-translations"

export type Translation = { ar: string; en: string }

export const translations = {
  /* ------------------------------- Header ------------------------------- */
  "header.hours": { ar: "الأحد - الخميس 8.00 - 17.00", en: "Sun - Thu 8.00 - 17.00" },
  "header.email": { ar: "البريد:", en: "Email:" },
  "header.phone": { ar: "الهاتف:", en: "Phone:" },
  "header.menu": { ar: "القائمة", en: "Menu" },
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.about": { ar: "معلومات عنا", en: "About Us" },
  "nav.solutions": { ar: "حلولنا", en: "Solutions" },
  "nav.products": { ar: "منتجاتنا", en: "Products" },
  "nav.useCases": { ar: "حالات الاستخدام", en: "Use Cases" },
  "nav.cases": { ar: "قصص النجاح", en: "Success Stories" },
  "nav.partner": { ar: "كن شريكنا", en: "Become a Partner" },
  "nav.contact": { ar: "اتصل بنا", en: "Contact Us" },
  "nav.langToggle": { ar: "ENGLISH", en: "العربية" },

  /* -------------------------------- Hero -------------------------------- */
  "hero.line1": { ar: "تعتبر", en: "" },
  "hero.line2": {
    ar: "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة ومتوافقة مع نظام حماية البيانات الشخصية.",
    en: "is Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh.",
  },
  "hero.sub1": {
    ar: "LeapAI المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي تجمع مركز الاتصال الصوتي والرقمي، واتساب للأعمال، الشات بوت الذكي، حملات الرسائل، والتكامل مع سلة وزد وOdoo في مكان واحد. توفر المنصة 3 باقات تشغيل مرنة (149، 199، 299 ريال لكل مستخدم شهريًا) وتساعدك على تحسين زمن الاستجابة، أتمتة الرحلات، ومتابعة الأداء عبر لوحة موحدة، مع استضافة محلية متوافقة مع نظام حماية البيانات الشخصية ودعم رؤية 2030.",
    en: "LeapAI is Saudi Arabia's premier AI-native CX platform that unifies voice and digital contact center operations, WhatsApp Business, AI chatbots, campaign messaging, and integrations with Salla, Zid, and Odoo in one place. The platform offers 3 flexible plans (149, 199, and 299 SAR per user/month) and helps teams improve response time, automate journeys, and track measurable performance from one dashboard, with PDPL-ready local hosting aligned to Vision 2030.",
  },
  "hero.sub2": {
    ar: "منصة LeapAI هي الاختيار الأمثل لخدمة العملاء والاحتفاظ بهم على الأمد البعيد.",
    en: "LeapAI is the ideal choice for serving customers and retaining them for the long term.",
  },
  "hero.cta": { ar: "حجز تجربة", en: "Book a demo" },

  "demo.title": { ar: "حجز تجربة", en: "Book a demo" },
  "demo.sub": {
    ar: "أدخل اسمك وبريد العمل ورقم الهاتف وسيتواصل معك فريق المبيعات.",
    en: "Enter your name, business email, and phone number and our sales team will reach out.",
  },
  "demo.fullName": { ar: "الاسم الكامل", en: "Full name" },
  "demo.businessEmail": { ar: "البريد الإلكتروني للعمل", en: "Business email" },
  "demo.phone": { ar: "رقم الهاتف", en: "Phone" },
  "demo.phonePlaceholder": { ar: "+966 5X XXX XXXX", en: "+966 5X XXX XXXX" },
  "demo.emailPlaceholder": { ar: "you@company.com", en: "you@company.com" },
  "demo.submit": { ar: "إرسال الطلب", en: "Submit request" },
  "demo.submitting": { ar: "جاري الإرسال…", en: "Sending…" },
  "demo.success": { ar: "تم استلام طلبك", en: "Request received" },
  "demo.successText": {
    ar: "شكراً لك. سيتواصل معك فريق المبيعات قريباً على بريد العمل.",
    en: "Thank you. Sales will contact you shortly at your business email.",
  },
  "demo.close": { ar: "إغلاق", en: "Close" },
  "demo.nameRequired": { ar: "يرجى إدخال الاسم الكامل.", en: "Please enter your full name." },
  "demo.phoneRequired": { ar: "يرجى إدخال رقم هاتف صحيح.", en: "Please enter a valid phone number." },
  "demo.emailInvalid": { ar: "يرجى إدخال بريد إلكتروني صحيح.", en: "Please enter a valid email address." },
  "demo.emailBusinessOnly": {
    ar: "يرجى استخدام بريد عمل. Gmail وHotmail وOutlook وغيرها غير مقبولة.",
    en: "Please use a business email. Gmail, Hotmail, Outlook, and similar providers are not accepted.",
  },
  "demo.error": { ar: "تعذر إرسال الطلب. حاول مرة أخرى.", en: "Could not send the request. Please try again." },

  /* --------------------------- Services intro --------------------------- */
  "services.label": { ar: "LEAP AI", en: "LEAP AI" },
  "services.heading": {
    ar: "كيف تقدم LeapAI خدمات متكاملة لتجربة العملاء؟",
    en: "How does LeapAI deliver integrated customer experience services?",
  },
  "services.p1": {
    ar: "تعتمد المنصة على تشغيل القنوات الصوتية والرقمية في لوحة واحدة لتمكين فرقك من إدارة المكالمات، واتساب، والدردشة المباشرة بسرعة أعلى وجودة أكثر اتساقًا.",
    en: "The platform runs voice and digital channels in one dashboard so your teams can manage calls, WhatsApp, and live chat with faster response times and more consistent quality.",
  },
  "services.p2": {
    ar: "تدعم LeapAI أتمتة الرحلات وقياس الأداء الفعلي عبر مؤشرات مثل زمن الاستجابة ومعدلات التحويل، مع ربط النتائج مباشرة بباقات 149 و199 و299 ريال لكل مستخدم شهريًا لقياس العائد التشغيلي بشكل واضح.",
    en: "LeapAI supports journey automation and real performance measurement through metrics such as response time and conversion rate, while aligning outcomes with the 149, 199, and 299 SAR plans to track operational ROI clearly.",
  },

  /* ----------------------------- Omni-channel --------------------------- */
  "omni.badge": { ar: "مركز الاتصال متعدد القنوات", en: "Omni-Channel Contact Center" },
  "omni.heading": {
    ar: "يتضمن مركز الاتصال متعدد القنوات LEAP SPACE OMNI-CHANNEL جميع الحملات الواردة والصادرة عبر جميع قنوات الخدمة الصوتية والرقمية",
    en: "The LEAP SPACE OMNI-CHANNEL contact center covers all inbound and outbound campaigns across every voice and digital service channel",
  },
  "omni.p1": {
    ar: "تشمل القنوات المكالمات الصوتية، IVR، واتساب للأعمال، الدردشة المباشرة، وقنوات التواصل الاجتماعي، بحيث تصل كل محادثة إلى الفريق المناسب دون تكرار أو فقدان للسياق.",
    en: "Channels include voice calls, IVR, WhatsApp Business, live chat, and social media, so each conversation reaches the right team without duplication or context loss.",
  },
  "omni.p2": {
    ar: "عند توحيد هذه القنوات في نظام واحد، يمكنك متابعة كفاءة الوكلاء، تقليل وقت الانتظار، وتحسين جودة الخدمة بالاعتماد على بيانات تشغيل حقيقية يومًا بعد يوم.",
    en: "When these channels are unified in one system, you can track agent efficiency, reduce wait time, and improve service quality using real operational data day by day.",
  },

  /* ------------------------------- Pricing ------------------------------ */
  "pricing.heading": {
    ar: "ما هي باقات الاشتراك المناسبة لاحتياجك؟",
    en: "Which subscription plan fits your needs?",
  },
  "pricing.subtitle": {
    ar: "اختر الباقة الأنسب لاحتياجك وابدأ بتقديم تجربة عملاء استثنائية اليوم.",
    en: "Choose the plan that best fits your needs and start delivering an exceptional customer experience today.",
  },
  "pricing.popular": { ar: "الأكثر طلباً", en: "Most Popular" },
  "pricing.currency": { ar: "ريال", en: "SAR" },
  "pricing.perMonth": { ar: "/ شهرياً", en: "/ month" },
  "pricing.cta": { ar: "حجز تجربة", en: "Book a demo" },

  /* -------------------------------- Addons ------------------------------ */
  "addons.heading": { ar: "إضافات الذكاء الاصطناعي", en: "AI Add-ons" },
  "addons.subtitle": {
    ar: "وسّع منصتك بإضافات ذكية تلبي احتياجات عملك المتنامية.",
    en: "Extend your platform with smart add-ons that meet your growing business needs.",
  },

  /* -------------------------- Store integrations ------------------------ */
  "stores.zidEyebrow": { ar: "تكامل المتاجر", en: "Store Integration" },
  "stores.zidTitle": { ar: "متجرك على زِد؟", en: "Your store on Zid?" },
  "stores.zidLead": {
    ar: "اربط متجرك بنقرة واحدة وفعّل خدمة بوت ثري ذكية لمستخدميك من:",
    en: "Connect your store in one click and enable a smart bot service for your users from:",
  },
  "stores.sallaEyebrow": { ar: "تكامل المتاجر", en: "Store Integration" },
  "stores.sallaTitle": { ar: "متجرك على سلة؟", en: "Your store on Salla?" },
  "stores.sallaLead": {
    ar: "اربط متجرك بنقرة واحدة وفعّل خدمة بوت ثري ذكية لمستخدميك من:",
    en: "Connect your store in one click and enable a smart bot service for your users from:",
  },
  "stores.feat1": {
    ar: "ربط الطلبات ومتابعتها للعميل عبر الواتساب.",
    en: "Link and track orders for the customer via WhatsApp.",
  },
  "stores.feat2": {
    ar: "إرسال فاتورة رقمية للعميل عبر الواتساب.",
    en: "Send a digital invoice to the customer via WhatsApp.",
  },
  "stores.feat3": {
    ar: "تأكيد الطلب بنقرة واحدة من العميل.",
    en: "One-click order confirmation from the customer.",
  },
  "stores.feat4": {
    ar: "إرسال إشعارات حالة الطلب تلقائياً عبر الواتساب.",
    en: "Automatically send order-status notifications via WhatsApp.",
  },
  "stores.more": { ar: "وميزات أخرى بالكامل!", en: "And many more features!" },
  "stores.cta": { ar: "اعرف أكثر", en: "Learn More" },

  /* ----------------------------- Acquire CTA ---------------------------- */
  "acquire.heading": { ar: "استحوذ على عملاء جدد!", en: "Acquire new customers!" },
  "acquire.subtitle": {
    ar: "حوّل عملاءك المهتمين من الإعلان إلى محادثة الواتساب لتحفيزهم على إجراء عملية الشراء عبر رسائل آلية",
    en: "Turn your interested customers from ads into a WhatsApp conversation to drive them to purchase through automated messages",
  },
  "acquire.cta": { ar: "القيمة المضافة من ليب", en: "Added Value by Leap" },

  /* ------------------------------ Partners ------------------------------ */
  "partners.heading": { ar: "من هم شركاء التقنية في منظومة LeapAI؟", en: "Who are LeapAI technology partners?" },

  /* ------------------------------- Stats -------------------------------- */
  "stats.heading": { ar: "أرقام تتحدث عنا", en: "Numbers That Speak for Us" },
  "stats.clients": { ar: "عميل يثق بنا", en: "Trusted Clients" },
  "stats.messages": { ar: "رسالة شهرياً", en: "Messages per Month" },
  "stats.uptime": { ar: "نسبة جاهزية النظام", en: "System Uptime" },
  "stats.support": { ar: "دعم فني متواصل", en: "Continuous Support" },

  /* ------------------------------- Footer ------------------------------- */
  "footer.about": {
    ar: "LeapAI المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي، نمكّن الشركات من تقديم خدمة استثنائية عبر كل القنوات مع استضافة محلية.",
    en: "LeapAI, Saudi Arabia's premier AI-native CX platform, empowers businesses to deliver exceptional service across every channel with PDPL-ready local hosting.",
  },
  "footer.quickLinks": { ar: "روابط سريعة", en: "Quick Links" },
  "footer.contactTitle": { ar: "تواصل معنا", en: "Contact Us" },
  "footer.hoursTitle": { ar: "ساعات العمل", en: "Working Hours" },
  "footer.rights": { ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },
  "footer.address": { ar: "الرياض، المملكة العربية السعودية", en: "Riyadh, Saudi Arabia" },

  /* ---------------------------- Listing pages --------------------------- */
  "list.solutionsTitle": { ar: "حلولنا", en: "Our Solutions" },
  "list.solutionsSub": {
    ar: "حلول متكاملة لتجربة عملاء استثنائية عبر كل القنوات.",
    en: "Integrated solutions for an exceptional customer experience across every channel.",
  },
  "list.productsTitle": { ar: "منتجاتنا", en: "Our Products" },
  "list.productsSub": {
    ar: "منتجات ذكية تساعدك على النمو وخدمة عملائك بكفاءة.",
    en: "Smart products that help you grow and serve your customers efficiently.",
  },
  "list.useCasesTitle": { ar: "حالات الاستخدام", en: "Use Cases" },
  "list.useCasesSub": {
    ar: "كيف تستفيد مختلف القطاعات من منصة LeapAI.",
    en: "How different industries benefit from the LeapAI platform.",
  },
  "list.casesTitle": { ar: "قصص النجاح", en: "Success Stories" },
  "list.casesSub": {
    ar: "مشاريع في تجربة العملاء وتحليل البيانات وحلول التطبيقات والمواقع.",
    en: "Projects in customer experience, data analytics, and mobile & web solutions.",
  },
  "list.casesSubLong": {
    ar: "استعرض قصص النجاح عبر تجربة العملاء (CX) وتحليل البيانات وحلول التطبيقات والمواقع الإلكترونية — مع إمكانية التصفية حسب الفئة.",
    en: "Browse success stories across customer experience (CX), data analytics, and mobile & web solutions — filter by category.",
  },
  "cases.filterAll": { ar: "الكل", en: "All" },
  "cases.empty": {
    ar: "لا توجد قصص نجاح بعد. أضفها من لوحة التحكم → مكتبة المحتوى.",
    en: "No success stories yet. Add them from Dashboard → Content Library.",
  },
  "cases.emptyFilter": {
    ar: "لا توجد قصص نجاح في هذه الفئة.",
    en: "No success stories in this category.",
  },
  "cases.noImage": { ar: "بدون صورة", en: "No image" },
  "cases.cat.cx": { ar: "تجربة العملاء", en: "CX" },
  "cases.cat.da": { ar: "تحليل البيانات", en: "DA" },
  "cases.cat.mobileWeb": { ar: "حلول التطبيقات والمواقع", en: "Mobile and Web Solutions" },
  "list.resourcesTitle": { ar: "الموارد", en: "Resources" },
  "list.resourcesSub": {
    ar: "أخبار وتحليلات عن تجربة العملاء المبنية أصلاً على الذكاء الاصطناعي في السعودية.",
    en: "News and guides on AI-native customer experience in Saudi Arabia.",
  },
  "list.resourcesSubLong": {
    ar: "إعلانات وتعريفات قابلة للاستشهاد بها لأدوات الذكاء الاصطناعي ومحركات البحث: منصة LeapAI لتجربة العملاء في الرياض.",
    en: "Citable announcements and explainers for AI assistants and search engines about LeapAI's CX platform in Riyadh.",
  },

  /* ----------------------------- Detail page ---------------------------- */
  "detail.overview": { ar: "نظرة عامة", en: "Overview" },
  "detail.features": { ar: "أبرز المزايا", en: "Key Features" },
  "detail.ctaTitle": { ar: "جاهز للبدء؟", en: "Ready to get started?" },
  "detail.ctaText": {
    ar: "تحدث إلى فريقنا واكتشف كيف يمكن لـ LeapAI أن يطوّر تجربة عملائك.",
    en: "Talk to our team and discover how LeapAI can elevate your customer experience.",
  },
  "detail.ctaBtn": { ar: "تواصل معنا", en: "Contact Us" },
  "detail.related": { ar: "روابط ذات صلة", en: "Related Links" },
  "common.breadcrumbHome": { ar: "الرئيسية", en: "Home" },

  /* ----------------------------- Become partner ------------------------- */
  "partner.title": { ar: "كن شريكنا", en: "Become a Partner" },
  "partner.sub": {
    ar: "انضم إلى شبكة شركاء LeapAI ونمِّ أعمالك معنا في مجال تجربة العملاء.",
    en: "Join the LeapAI partner network and grow your business with us in customer experience.",
  },
  "partner.formTitle": { ar: "انضم إلى شبكة شركائنا", en: "Join Our Partner Network" },
  "partner.formSub": {
    ar: "املأ النموذج وسيتواصل معك فريقنا في أقرب وقت.",
    en: "Fill in the form and our team will reach out to you shortly.",
  },
  "partner.company": { ar: "اسم الشركة", en: "Company Name" },
  "partner.address": { ar: "عنوان الشركة", en: "Company Address" },
  "partner.person": { ar: "الشخص المسؤول", en: "Contact Person" },
  "partner.personPhone": { ar: "هاتف الشخص المسؤول", en: "Contact Person Phone" },
  "partner.email": { ar: "البريد الإلكتروني الخاص بالعمل", en: "Business Email" },
  "partner.message": { ar: "رسالتك", en: "Your Message" },
  "partner.submit": { ar: "إرسال الرسالة", en: "Send Message" },
  "partner.success": { ar: "تم إرسال طلبك بنجاح!", en: "Your request was sent successfully!" },
  "partner.successText": {
    ar: "شكراً لتواصلك معنا، سيقوم فريقنا بالرد عليك قريباً.",
    en: "Thank you for reaching out, our team will get back to you soon.",
  },

  /* ------------------------------ Contact ------------------------------- */
  "contact.title": { ar: "اتصل بنا", en: "Contact Us" },
  "contact.sub": {
    ar: "نحن هنا لمساعدتك. تواصل معنا في أي وقت وسنرد عليك بأسرع ما يمكن.",
    en: "We're here to help. Reach out anytime and we'll respond as quickly as possible.",
  },
  "contact.callTitle": { ar: "اتصل في أي وقت", en: "Call Anytime" },
  "contact.emailTitle": { ar: "أرسل بريداً إلكترونياً", en: "Send an Email" },
  "contact.locationTitle": { ar: "موقعنا", en: "Our Location" },
  "contact.formTitle": { ar: "تواصل معنا", en: "Get in Touch" },
  "contact.formSub": {
    ar: "املأ النموذج أدناه وسنعاود الاتصال بك في أقرب وقت.",
    en: "Fill in the form below and we'll get back to you shortly.",
  },
  "contact.name": { ar: "اسمك", en: "Your Name" },
  "contact.email": { ar: "البريد الإلكتروني", en: "Email" },
  "contact.company": { ar: "اسم الشركة", en: "Company Name" },
  "contact.phone": { ar: "رقم الهاتف", en: "Phone Number" },
  "contact.message": { ar: "محتوى الرسالة", en: "Message" },
  "contact.submit": { ar: "إرسال", en: "Send" },
  "contact.success": { ar: "تم إرسال رسالتك بنجاح!", en: "Your message was sent successfully!" },
  "contact.successText": {
    ar: "شكراً لتواصلك معنا، سنرد عليك في أقرب وقت ممكن.",
    en: "Thank you for contacting us, we'll reply as soon as possible.",
  },
  "contact.sendAnother": { ar: "إرسال رسالة أخرى", en: "Send another message" },
  "contact.formExpert": { ar: "لا تتردد في التواصل مع الخبراء", en: "Feel free to reach out to our experts" },
  "contact.emailLabel": { ar: "عنوان البريد الإلكتروني", en: "Email address" },
  "contact.phoneExample": { ar: "على سبيل المثال 0555555555", en: "e.g. 0555555555" },
  "contact.messagePlaceholder": { ar: "يرجى كتابة محتوى الرسالة...", en: "Please write your message..." },
  "contact.pageSub": {
    ar: "هدفنا تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — وتعزيز نجاح الأعمال مع إثراء الحياة. لا تتردد في التواصل مع الخبراء.",
    en: "Our goal is to empower the symbiotic relationship between humans and AI — driving business success while enriching lives. Feel free to reach out to our experts.",
  },
  "contact.locationCity": { ar: "الرياض", en: "Riyadh" },
  "contact.locationLine": { ar: "طريق الملك عبد العزيز الفرعي", en: "King Abdulaziz Branch Road" },
  "contact.mapLink": { ar: "موقعنا على الخريطة", en: "View on map" },
  "contact.emailAction": { ar: "راسلنا الآن", en: "Email us now" },
  "contact.callAction": { ar: "اتصل الآن", en: "Call now" },
  "contact.mapTitle": { ar: "موقع LeapAI على الخريطة", en: "LeapAI location on map" },

  /* ------------------------------ Partner extras ------------------------ */
  "partner.pageSub": {
    ar: "هدفنا تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — وتعزيز نجاح الأعمال مع إثراء الحياة. لا تتردد في الاتصال بنا.",
    en: "Our goal is to empower the symbiotic relationship between humans and AI — driving business success while enriching lives. Don't hesitate to contact us.",
  },
  "partner.callUs": { ar: "اتصل بنا", en: "Call us" },
  "partner.ourEmail": { ar: "البريد الإلكتروني", en: "Email" },
  "partner.ourLocation": { ar: "موقعنا", en: "Our location" },
  "partner.workingHours": { ar: "ساعات العمل", en: "Working hours" },
  "partner.hoursLine1": { ar: "الأحد - الخميس", en: "Sun - Thu" },
  "partner.hoursLine2": { ar: "8:00 ص – 5:00 م", en: "8:00 AM – 5:00 PM" },
  "partner.sideTitle": { ar: "لا تتردد في الاتصال بنا", en: "Don't hesitate to contact us" },
  "partner.sideText": {
    ar: "نسعد بانضمامك إلى شبكة شركائنا. املأ النموذج وسيتواصل معك فريقنا في أقرب وقت.",
    en: "We'd love to have you join our partner network. Fill in the form and our team will reach out shortly.",
  },
  "partner.messageSubject": { ar: "عنوان رسالة", en: "Message subject" },
  "partner.messagePlaceholder": { ar: "أدخل محتوى رسالتك...", en: "Enter your message..." },
  "partner.successTextLong": {
    ar: "شكراً لتواصلك مع منصة LeapAI، سيقوم فريقنا بمراجعة طلبك والرد عليك في أقرب وقت ممكن.",
    en: "Thank you for contacting LeapAI. Our team will review your request and get back to you as soon as possible.",
  },
  "partner.formSubShort": {
    ar: "املأ النموذج وسيتواصل معك فريقنا قريباً",
    en: "Fill in the form and our team will contact you soon",
  },

  /* --------------------------- Listing page subs ------------------------ */
  "list.solutionsSubLong": {
    ar: "منظومة متكاملة من الحلول السحابية لإدارة تجربة العملاء عبر كل القنوات وبأحدث تقنيات الذكاء الاصطناعي.",
    en: "An integrated suite of cloud solutions to manage customer experience across every channel with the latest AI technologies.",
  },
  "list.productsSubLong": {
    ar: "مجموعة من المنتجات الجاهزة المبنية على الذكاء الاصطناعي لتسريع أعمالك وتحسين تجربة عملائك.",
    en: "A set of ready-made AI-powered products to accelerate your business and improve your customer experience.",
  },
  "list.useCasesSubLong": {
    ar: "اكتشف كيف تساعد حلول LeapAI القطاعات المختلفة على تقديم تجارب عملاء استثنائية وأتمتة عملياتها.",
    en: "Discover how LeapAI helps different industries deliver exceptional customer experiences and automate their operations.",
  },

  /* ------------------------------- Common ------------------------------- */
  "common.learnMore": { ar: "اكتشف المزيد", en: "Learn more" },
  "common.whatsapp": { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
  "common.chatPreview": { ar: "نموذج محادثة", en: "Chat preview" },

  /* ----------------------------- Footer extras -------------------------- */
  "footer.mission": {
    ar: "هدفنا تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — وتعزيز نجاح الأعمال مع إثراء الحياة.",
    en: "Our goal is to empower the symbiotic relationship between humans and AI — driving business success while enriching lives.",
  },
  "nav.blog": { ar: "الموارد", en: "Resources" },
  "footer.locationDetail": {
    ar: "المملكة العربية السعودية، الرياض، طريق الملك عبد العزيز الفرعي",
    en: "King Abdulaziz Branch Road, Riyadh, Saudi Arabia",
  },
  "footer.hoursDetail": { ar: "8:00 ص – 5:00 م", en: "8:00 AM – 5:00 PM" },
  "footer.copyright": { ar: "جميع الحقوق محفوظة لمنصة ليب 2024", en: "All rights reserved © Leap 2024" },
  "footer.socialAria": { ar: "رابط تواصل اجتماعي", en: "Social media link" },

  /* ----------------------------- Pricing extras ------------------------- */
  "pricing.perUserMonth": { ar: "مستخدم / شهر", en: "per user / month" },

  /* ----------------------------- Addons extras -------------------------- */
  "addons.badge": { ar: "الإضافات", en: "Add-ons" },
  "addons.title": {
    ar: "مكونات ذكاء اصطناعي جاهزة للاستخدام!",
    en: "Ready-to-use AI components!",
  },
  "addons.lead": {
    ar: "عزّز تجربة العملاء وحسّن نتائج عملك.",
    en: "Enhance customer experience and improve your business results.",
  },

  /* ----------------------------- Stores extras ---------------------------- */
  "stores.eyebrow": { ar: "تكامل مباشر", en: "Direct integration" },
  "stores.lead": {
    ar: "اربط متجرك بنقرة واحدة وتفعّل خدمة بوت شات بوت للتفاعل مع مستخدميك من:",
    en: "Connect your store in one click and enable a smart chatbot to engage your users from:",
  },
  "stores.abandonedCart": {
    ar: "إرسال إشعارات سلة المتروكة لتذكير العميل عبر الواتساب.",
    en: "Send abandoned-cart reminders to customers via WhatsApp.",
  },

  /* ----------------------------- Acquire extras ------------------------- */
  "acquire.subtitleLong": {
    ar: "حوّل عملاءك المهتمين من الإعلان إلى محادثة واتساب لتحفّزهم على إجراء عملية الشراء عبر رسائل آلية ذكية تزيد من معدلات التحويل وتعزز ولاء العملاء.",
    en: "Turn interested customers from ads into WhatsApp conversations and drive purchases through smart automated messages that boost conversion and loyalty.",
  },

  /* ----------------------------- Stats labels --------------------------- */
  "stats.projects": { ar: "مشاريع", en: "Projects" },
  "stats.experts": { ar: "خبراء", en: "Experts" },
  "stats.customers": { ar: "عملاء", en: "Clients" },

  /* ----------------------------- About page ----------------------------- */
  "about.title": { ar: "معلومات عنا", en: "About us" },
  "about.subtitle": { ar: "قصتنا ورؤيتنا ومهمتنا", en: "Our story, vision, and mission" },
  "about.storyHeading": { ar: "قصتنا", en: "Our Story" },
  "about.story1": {
    ar: "مع أكثر من 23 عامًا من الخبرة في مجال التكنولوجيا داخل السوق السعودي، أصبحت LeapAI ثمرة إرث وابتكار BAB International. وبصفتها رائدة في تكنولوجيا المعلومات والاتصالات منذ 1999، أطلقت BAB International منصة LeapAI في 2022 لتكون مخصصة لحلول الذكاء الاصطناعي للمؤسسات ورائدة في السوق كمزود رائد لحلول الذكاء الاصطناعي.",
    en: "With more than 23 years of experience in the technology space within the Saudi market, LeapAI became the fruit of BAB International's legacy and innovation. As an ICT leader since 1999, BAB International initiated LeapAI in 2022 to be dedicated to enterprise AI solutions and a leader in the marketplace as a pioneer AI solution provider.",
  },
  "about.story2": {
    ar: "نهدف إلى تشكيل حقبة جديدة من التحول المدعوم بالذكاء الاصطناعي بقيادة خبرة تقنية وقيادية واسعة تمتد لأكثر من عقدين.",
    en: "We aim to shape a new era of AI-powered transformation led by vast technical and leadership experience spanning more than two decades.",
  },
  "about.story3": {
    ar: "شغوفون بالعمل معًا والمساعدة في ربط الشركات بالمستقبل الناشئ.",
    en: "Passionate to work together and help bridge businesses to the emerging future.",
  },
  "about.story4": {
    ar: "نسعى إلى المساهمة في تحقيق أعلى معايير الرفاهية للمجتمع السعودي من خلال توفير قيمة مضافة في مجال خدمة العملاء وفق أعلى المعايير لتحقيق التميز.",
    en: "We seek to contribute to achieving the highest standards of excellence for Saudi society by providing added value in customer service in accordance with the highest standards.",
  },
  "about.visionTagline": { ar: "كن في صدارة اللعبة", en: "Stay ahead of the game" },
  "about.visionTitle": { ar: "رؤيتنا", en: "Our Vision" },
  "about.visionText": {
    ar: "تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — وتعزيز نجاح الأعمال مع إثراء الحياة.",
    en: "To enable a symbiotic relationship between humans and artificial intelligence — enhancing business success while enriching lives.",
  },
  "about.missionTitle": { ar: "مهمتنا", en: "Our Mission" },
  "about.missionText": {
    ar: "نهدف إلى دفع التقدم المستدام من خلال جعل إمكانات الذكاء الاصطناعي مؤثرة ومفيدة عبر الأفق التجارية والمجتمعية.",
    en: "We aim to drive sustainable progress by making AI's potential impactful and beneficial across commercial and societal landscapes.",
  },
  "about.valuesTitle": { ar: "قيمنا", en: "Our Values" },
  "about.valuesText": {
    ar: "نؤمن بالتعاون متعدد الوظائف الذي يزيد من مشاركة أصحاب المصلحة والاحتفاظ بهم ومشاركة الموظفين لإطلاق العنان للإمكانات والابتكار. نُثري علاقتنا مع عملائنا كرائدين في تقنيات الذكاء الاصطناعي.",
    en: "We believe in cross-functional collaboration that increases stakeholder buy-in, retention, and employee engagement to unlock potential and innovation. We enrich the relationship with our clients as a pioneer in AI technologies.",
  },
  "about.quote": {
    ar: "هدفنا هو تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — ودفع نجاح الأعمال مع إثراء الحياة.",
    en: "Our goal is to enable a symbiotic relationship between humans and AI — and to drive business success while enriching lives.",
  },
  "about.imageAlt": { ar: "فريق LeapAI", en: "LeapAI team" },

  /* ----------------------------- Detail extras -------------------------- */
  "detail.demoBtn": { ar: "اطلب عرضًا توضيحيًا", en: "Request a demo" },
  "detail.tryLiveBtn": { ar: "جرّب البوت الصوتي", en: "Try the Voice Bot" },
  "detail.ctaTextAlt": {
    ar: "تحدث إلى فريقنا واكتشف كيف يساعدك هذا الحل على تقديم تجربة عملاء استثنائية.",
    en: "Talk to our team and discover how this solution helps you deliver an exceptional customer experience.",
  },

  /* ----------------------------- Hero alt ------------------------------- */
  "hero.imageAlt": {
    ar: "لوحة تحكم منصة LeapAI لتجربة العملاء",
    en: "LeapAI customer experience dashboard",
  },
  "services.imageAlt": {
    ar: "نظرة عامة على التذاكر في منصة LeapAI",
    en: "Ticket overview in the LeapAI platform",
  },
  "omni.imageAlt": {
    ar: "مركز الاتصال متعدد القنوات Leap Space Omni-Channel",
    en: "Leap Space Omni-Channel contact center",
  },
  /* ------------------------------ Admin UI ------------------------------ */
  "admin.common.dashboard": { ar: "لوحة التحكم", en: "Dashboard" },
  "admin.common.menu": { ar: "القائمة", en: "Menu" },
  "admin.common.preview": { ar: "معاينة", en: "Preview" },
  "admin.common.backToWebsite": { ar: "العودة للموقع", en: "Back to website" },
  "admin.common.save": { ar: "حفظ", en: "Save" },
  "admin.common.saving": { ar: "جارٍ الحفظ...", en: "Saving..." },
  "admin.common.cancel": { ar: "إلغاء", en: "Cancel" },
  "admin.common.delete": { ar: "حذف", en: "Delete" },
  "admin.common.edit": { ar: "تعديل", en: "Edit" },
  "admin.common.refresh": { ar: "تحديث", en: "Refresh" },
  "admin.common.loading": { ar: "جارٍ التحميل...", en: "Loading..." },
  "admin.common.loadingContent": { ar: "جارٍ تحميل المحتوى...", en: "Loading content..." },
  "admin.common.search": { ar: "بحث", en: "Search" },
  "admin.common.live": { ar: "مباشر", en: "Live" },
  "admin.common.notLive": { ar: "غير مباشر", en: "Not live" },
  "admin.common.waiting": { ar: "انتظار", en: "Waiting" },
  "admin.common.checking": { ar: "جارٍ الفحص", en: "Checking" },
  "admin.common.failed": { ar: "فشل", en: "Failed" },
  "admin.common.ok": { ar: "موافق", en: "OK" },
  "admin.common.noImage": { ar: "لا توجد صورة", en: "No image" },
  "admin.common.uploadImage": { ar: "رفع صورة", en: "Upload image" },
  "admin.common.uploading": { ar: "جارٍ الرفع...", en: "Uploading..." },
  "admin.common.arabic": { ar: "العربية", en: "Arabic" },
  "admin.common.english": { ar: "English", en: "English" },

  "admin.nav.overview": { ar: "نظرة عامة", en: "Overview" },
  "admin.nav.siteSettings": { ar: "إعدادات الموقع", en: "Site Settings" },
  "admin.nav.geo": { ar: "الظهور في الذكاء الاصطناعي", en: "GEO" },
  "admin.nav.contact": { ar: "تواصل معنا", en: "Contact Us" },
  "admin.nav.content": { ar: "المحتوى", en: "Content" },
  "admin.nav.contentLibrary": { ar: "مكتبة المحتوى", en: "Content Library" },
  "admin.nav.newContent": { ar: "محتوى جديد", en: "New Content" },
  "admin.nav.editContent": { ar: "تعديل المحتوى", en: "Edit Content" },
  "admin.nav.signOut": { ar: "تسجيل الخروج", en: "Sign out" },
  "admin.nav.viewLiveSite": { ar: "عرض الموقع المباشر", en: "View live site" },
  "admin.nav.addContent": { ar: "إضافة محتوى", en: "Add content" },

  "admin.login.badge": { ar: "إدارة المحتوى", en: "Content Management" },
  "admin.login.heading1": { ar: "إدارة موقعك", en: "Manage your website" },
  "admin.login.heading2": { ar: "من مكان واحد", en: "in one place" },
  "admin.login.sub": {
    ar: "حدّث محتوى الصفحة الرئيسية، والهيرو، والإحصائيات، وجميع الحلول — بالعربية والإنجليزية — بدون تعديل الكود.",
    en: "Update homepage content, hero sections, stats, and all solutions — in Arabic and English — without touching code.",
  },
  "admin.login.f1": { ar: "تحرير محتوى عربي / إنجليزي", en: "Bilingual AR / EN content editing" },
  "admin.login.f2": { ar: "مدعوم بواسطة MongoDB وRedis", en: "Powered by MongoDB & Redis" },
  "admin.login.f3": { ar: "التغييرات تظهر فوراً على الموقع المباشر", en: "Changes reflect on the live site instantly" },
  "admin.login.welcome": { ar: "مرحباً بعودتك", en: "Welcome back" },
  "admin.login.subtitle": { ar: "سجل الدخول إلى لوحة إدارة المحتوى", en: "Sign in to your CMS dashboard" },
  "admin.login.email": { ar: "البريد الإلكتروني", en: "Email address" },
  "admin.login.password": { ar: "كلمة المرور", en: "Password" },
  "admin.login.signingIn": { ar: "جارٍ تسجيل الدخول...", en: "Signing in..." },
  "admin.login.signIn": { ar: "دخول إلى اللوحة", en: "Sign in to dashboard" },
  "admin.login.failed": { ar: "فشل تسجيل الدخول", en: "Login failed" },
  "admin.login.portal": { ar: "بوابة إدارة LeapAI", en: "LeapAI — Admin Portal" },
  "admin.auth.checkingAccess": { ar: "جارٍ التحقق من الصلاحية...", en: "Checking access..." },

  "admin.home.title": { ar: "أهلاً بعودتك", en: "Good to see you" },
  "admin.home.desc": {
    ar: "أدر محتوى موقع LeapAI وإعدادات الصفحة الرئيسية والصفحات المنشورة من مكان واحد.",
    en: "Manage your LeapAI website content, homepage settings, and published pages from one place.",
  },
  "admin.home.previewSite": { ar: "معاينة الموقع", en: "Preview site" },
  "admin.home.totalContent": { ar: "إجمالي المحتوى", en: "Total content" },
  "admin.home.solutionsHint": { ar: "حلول، منتجات، حالات استخدام، وقصص نجاح", en: "Solutions, products, use cases & success stories" },
  "admin.home.solutions": { ar: "الحلول", en: "Solutions" },
  "admin.home.products": { ar: "المنتجات", en: "Products" },
  "admin.home.siteStatus": { ar: "حالة الموقع", en: "Site status" },
  "admin.home.maintenance": { ar: "صيانة", en: "Maintenance" },
  "admin.home.quickActions": { ar: "إجراءات سريعة", en: "Quick actions" },
  "admin.home.quickActionsDesc": { ar: "المهام الشائعة لإدارة موقعك", en: "Common tasks to manage your site" },
  "admin.home.systemStack": { ar: "بنية النظام", en: "System stack" },
  "admin.home.cmsInfra": { ar: "بنية نظام إدارة المحتوى", en: "Your CMS infrastructure" },

  "admin.content.title": { ar: "مكتبة المحتوى", en: "Content Library" },
  "admin.content.desc": { ar: "أدر الحلول والمنتجات وحالات الاستخدام وقصص النجاح ومقالات الموارد في موقعك.", en: "Manage solutions, products, use cases, success stories, and Resources articles displayed on your public website." },
  "admin.content.searchPlaceholder": { ar: "ابحث بالعنوان أو الرابط...", en: "Search by title or slug..." },
  "admin.content.noContent": { ar: "لا يوجد محتوى", en: "No content found" },
  "admin.content.createFirst": { ar: "أنشئ أول عنصر", en: "Create first item" },
  "admin.content.published": { ar: "منشور", en: "Published" },
  "admin.content.draft": { ar: "مسودة", en: "Draft" },

  "admin.contact.title": { ar: "رسائل التواصل", en: "Contact Us" },
  "admin.contact.inbox": { ar: "الوارد", en: "Inbox" },
  "admin.contact.unread": { ar: "غير مقروء", en: "unread" },
  "admin.contact.new": { ar: "جديد", en: "New" },
  "admin.contact.read": { ar: "مقروء", en: "Read" },
  "admin.contact.view": { ar: "عرض", en: "View" },
  "admin.contact.unreadBtn": { ar: "غير مقروء", en: "Unread" },
  "admin.contact.deleteConfirm": { ar: "حذف رسالة التواصل هذه؟", en: "Delete this contact message?" },

  "admin.geo.title": { ar: "GEO — الظهور في الذكاء الاصطناعي", en: "GEO — AI visibility" },
  "admin.geo.checkAll": { ar: "فحص جميع الروابط", en: "Check all links" },
  "admin.geo.indexNowPanel": { ar: "محركات البحث — IndexNow", en: "Search engines — IndexNow" },
  "admin.geo.refreshStatus": { ar: "تحديث الحالة", en: "Refresh status" },
  "admin.geo.submitIndexNow": { ar: "إرسال خريطة الموقع (IndexNow)", en: "Submit sitemap (IndexNow)" },

  "admin.contentForm.basicInfo": { ar: "معلومات أساسية", en: "Basic info" },
  "admin.contentForm.back": { ar: "رجوع", en: "Back" },
  "admin.contentForm.saveContent": { ar: "حفظ المحتوى", en: "Save content" },
  "admin.contentForm.createTitle": { ar: "إنشاء محتوى", en: "Create content" },
  "admin.contentForm.editTitle": { ar: "تعديل المحتوى", en: "Edit content" },
  "admin.contentForm.createFailed": { ar: "فشل الإنشاء", en: "Failed to create" },
  "admin.contentForm.saveFailed": { ar: "فشل الحفظ", en: "Save failed" },
  "admin.contentForm.deleteFailed": { ar: "فشل الحذف", en: "Delete failed" },
  "admin.contentForm.loadFailed": { ar: "فشل تحميل المحتوى", en: "Failed to load content" },
  "admin.contentForm.deleteConfirm": { ar: "حذف هذا العنصر نهائياً؟", en: "Delete this content item permanently?" },

  ...adminExtraTranslations,
} as const

export type TranslationKey = keyof typeof translations
