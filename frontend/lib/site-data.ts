export type Localized = { ar: string; en: string }
export type LocalizedArr = { ar: string[]; en: string[] }

export type NavItem = {
  slug: string
  title: Localized
  excerpt: Localized
  description: Localized
  features: LocalizedArr
  image?: string
}

export type NavGroup = {
  slug: string
  title: Localized
  items: NavItem[]
}

/* ---------------------------------- Solutions --------------------------------- */
export const solutionsGroups: NavGroup[] = [
  {
    slug: "omnichannel-contact-center",
    title: { ar: "مراكز الاتصال متعددة القنوات", en: "Omni-Channel Contact Centers" },
    items: [
      {
        slug: "digital-channels",
        title: {
          ar: "ربط قنوات الدردشة الرقمية ورسائل التواصل الاجتماعي",
          en: "Connect Digital Chat & Social Messaging Channels",
        },
        excerpt: {
          ar: "وحّد جميع قنوات التواصل في صندوق وارد واحد لفريقك.",
          en: "Unify all communication channels into one inbox for your team.",
        },
        description: {
          ar: "اجمع محادثات واتساب وفيسبوك وإنستغرام والدردشة المباشرة ورسائل التواصل الاجتماعي في منصة واحدة موحّدة، ليتمكن وكلاؤك من الرد على كل العملاء من شاشة واحدة دون تشتيت.",
          en: "Bring WhatsApp, Facebook, Instagram, live chat, and social messages into one unified platform so your agents can respond to every customer from a single screen.",
        },
        features: {
          ar: [
            "صندوق وارد موحّد لكل القنوات الرقمية",
            "توزيع ذكي للمحادثات على الوكلاء",
            "سجل كامل لتفاعلات العميل عبر القنوات",
            "ردود جاهزة وقوالب معتمدة",
          ],
          en: [
            "Unified inbox for all digital channels",
            "Smart routing of conversations to agents",
            "Full history of customer interactions across channels",
            "Canned responses and approved templates",
          ],
        },
      },
      {
        slug: "crm",
        title: { ar: "نظام إدارة علاقات العملاء CRM", en: "Customer Relationship Management (CRM)" },
        excerpt: {
          ar: "أدر بيانات عملائك وتفاعلاتهم من مكان واحد.",
          en: "Manage your customer data and interactions from one place.",
        },
        description: {
          ar: "نظام CRM متكامل يمنح فريقك رؤية شاملة لكل عميل، من بيانات الاتصال إلى سجل المحادثات والتذاكر، لتقديم تجربة شخصية ومتسقة في كل نقطة تواصل.",
          en: "An integrated CRM that gives your team a 360° view of every customer — from contact details to conversation and ticket history — for a consistent, personalized experience at every touchpoint.",
        },
        features: {
          ar: ["ملف موحّد لكل عميل", "إدارة التذاكر والمتابعات", "تقسيم العملاء وشرائح مخصصة", "تكامل مع قنوات التواصل والمبيعات"],
          en: [
            "Unified profile for each customer",
            "Ticket and follow-up management",
            "Customer segmentation and custom segments",
            "Integration with communication and sales channels",
          ],
        },
      },
      {
        slug: "quality-management",
        title: { ar: "حلول إدارة الجودة QM", en: "Quality Management (QM) Solutions" },
        excerpt: {
          ar: "راقب وقيّم جودة خدمة العملاء بشكل مستمر.",
          en: "Continuously monitor and assess customer service quality.",
        },
        description: {
          ar: "أدوات لمراقبة جودة المكالمات والمحادثات، وتقييم أداء الوكلاء وفق معايير قابلة للتخصيص، مع تقارير تساعدك على رفع مستوى رضا العملاء باستمرار.",
          en: "Tools to monitor call and chat quality and evaluate agent performance against customizable criteria, with reports that help you continuously raise customer satisfaction.",
        },
        features: {
          ar: ["بطاقات تقييم قابلة للتخصيص", "مراجعة المكالمات والمحادثات", "تنبيهات الجودة الآلية", "تقارير أداء تفصيلية للوكلاء"],
          en: [
            "Customizable scorecards",
            "Call and conversation review",
            "Automated quality alerts",
            "Detailed agent performance reports",
          ],
        },
      },
      {
        slug: "realtime-dashboard",
        title: { ar: "لوحة تحكم في الوقت الفعلي", en: "Real-Time Dashboard" },
        excerpt: { ar: "تابع مؤشرات الأداء لحظة بلحظة.", en: "Track performance indicators moment by moment." },
        description: {
          ar: "لوحات تحكم حية تعرض حالة مركز الاتصال ومؤشرات الأداء الرئيسية في الوقت الفعلي، لتتخذ قرارات سريعة ومبنية على بيانات دقيقة.",
          en: "Live dashboards that display contact-center status and key performance indicators in real time, so you can make fast, data-driven decisions.",
        },
        features: {
          ar: ["مؤشرات أداء حيّة", "متابعة طوابير الانتظار", "تنبيهات فورية عند تجاوز الحدود", "تخصيص اللوحات حسب الفريق"],
          en: [
            "Live performance indicators",
            "Queue monitoring",
            "Instant alerts on threshold breaches",
            "Dashboards customizable per team",
          ],
        },
      },
    ],
  },
  {
    slug: "business-messaging",
    title: { ar: "دردشة رسائل الأعمال", en: "Business Messaging" },
    items: [
      {
        slug: "whatsapp-business",
        title: { ar: "واتساب أعمال", en: "WhatsApp Business" },
        excerpt: {
          ar: "تواصل مع عملائك عبر أكثر القنوات استخدامًا.",
          en: "Reach your customers on the most widely used channel.",
        },
        description: {
          ar: "واجهة برمجية رسمية لواتساب أعمال تتيح لك إرسال الإشعارات والحملات والرد على العملاء آليًا أو عبر الوكلاء، مع علامة توثيق رسمية لنشاطك التجاري.",
          en: "An official WhatsApp Business API that lets you send notifications and campaigns and reply to customers automatically or via agents, with an official verification badge for your business.",
        },
        features: {
          ar: ["حساب واتساب أعمال موثّق", "إشعارات وتنبيهات آلية", "ردود تلقائية وبوت ذكي", "قوالب رسائل معتمدة"],
          en: [
            "Verified WhatsApp Business account",
            "Automated notifications and alerts",
            "Auto-replies and smart bot",
            "Approved message templates",
          ],
        },
      },
      {
        slug: "google-rcs",
        title: { ar: "قوقل RCS", en: "Google RCS" },
        excerpt: {
          ar: "رسائل غنية تفاعلية مباشرة في تطبيق الرسائل.",
          en: "Rich, interactive messages directly in the messaging app.",
        },
        description: {
          ar: "قدّم تجربة رسائل تفاعلية غنية عبر بروتوكول RCS من قوقل، مع صور وأزرار ومعارض منتجات داخل رسائل عملائك مباشرة.",
          en: "Deliver a rich, interactive messaging experience via Google's RCS protocol, with images, buttons, and product carousels right inside your customers' messages.",
        },
        features: {
          ar: ["بطاقات وأزرار تفاعلية", "معارض منتجات داخل الرسالة", "علامة توثيق المرسل", "تقارير تسليم وقراءة"],
          en: [
            "Interactive cards and buttons",
            "Product carousels inside the message",
            "Verified sender badge",
            "Delivery and read reports",
          ],
        },
      },
      {
        slug: "apple-messages",
        title: { ar: "رسائل آبل أعمال ABC", en: "Apple Messages for Business (ABC)" },
        excerpt: { ar: "تواصل مع مستخدمي آبل عبر تطبيق الرسائل.", en: "Connect with Apple users through the Messages app." },
        description: {
          ar: "تكامل مع Apple Messages for Business لتمكين عملائك من التواصل معك مباشرة من خرائط آبل وسفاري والبحث، مع تجربة آمنة وسلسة.",
          en: "Integrate with Apple Messages for Business to let customers reach you directly from Apple Maps, Safari, and Search, with a secure and seamless experience.",
        },
        features: {
          ar: ["محادثات مباشرة من تطبيقات آبل", "مدفوعات ومواعيد داخل المحادثة", "تجربة آمنة ومشفّرة", "ردود غنية وتفاعلية"],
          en: [
            "Direct chats from Apple apps",
            "Payments and appointments inside the chat",
            "Secure, encrypted experience",
            "Rich, interactive replies",
          ],
        },
      },
    ],
  },
  {
    slug: "ai-chatbot",
    title: { ar: "شات بوت الذكاء الاصطناعي", en: "AI Chatbot" },
    items: [
      {
        slug: "nlu-chatbot",
        title: { ar: "شات بوت الذكاء الاصطناعي NLU", en: "NLU AI Chatbot" },
        excerpt: { ar: "بوت يفهم لغة عملائك الطبيعية ويرد بدقة.", en: "A bot that understands natural language and replies accurately." },
        description: {
          ar: "روبوت محادثة مبني على فهم اللغة الطبيعية (NLU) يتعرّف على نوايا العملاء ويرد عليهم بدقة باللهجات العربية والإنجليزية، ويحوّل المحادثة لوكيل بشري عند الحاجة.",
          en: "A chatbot built on Natural Language Understanding (NLU) that recognizes customer intent and responds accurately in Arabic dialects and English, handing off to a human agent when needed.",
        },
        features: {
          ar: ["فهم اللهجات العربية المتعددة", "تعرّف دقيق على نوايا العميل", "تحويل سلس للوكيل البشري", "تعلّم مستمر من المحادثات"],
          en: [
            "Understands multiple Arabic dialects",
            "Accurate customer-intent recognition",
            "Smooth handoff to a human agent",
            "Continuous learning from conversations",
          ],
        },
      },
      {
        slug: "genai-chatbot",
        title: { ar: "شات بوت الذكاء الاصطناعي التوليدي GenAI", en: "Generative AI Chatbot (GenAI)" },
        excerpt: { ar: "ردود طبيعية ذكية مبنية على معرفة شركتك.", en: "Smart, natural replies grounded in your company's knowledge." },
        description: {
          ar: "بوت توليدي يعتمد على نماذج لغوية متقدمة ومرتبط بقاعدة معرفة شركتك، ليقدّم إجابات دقيقة وطبيعية حول منتجاتك وخدماتك على مدار الساعة.",
          en: "A generative bot powered by advanced language models and connected to your company's knowledge base to provide accurate, natural answers about your products and services around the clock.",
        },
        features: {
          ar: ["إجابات طبيعية مبنية على بياناتك", "ربط بقاعدة معرفة الشركة", "حماية من الإجابات غير الدقيقة", "دعم متعدد اللغات"],
          en: [
            "Natural answers grounded in your data",
            "Connected to the company knowledge base",
            "Protection against inaccurate answers",
            "Multilingual support",
          ],
        },
      },
    ],
  },
  {
    slug: "ai-voice-bot",
    title: { ar: "بوت صوتي بالذكاء الاصطناعي", en: "AI Voice Bot" },
    items: [
      {
        slug: "voice-bot",
        title: { ar: "بوت صوتي بالذكاء الاصطناعي", en: "AI Voice Bot" },
        excerpt: { ar: "رد آلي صوتي ذكي على مكالمات عملائك.", en: "Smart automated voice responses to your customers' calls." },
        description: {
          ar: "مساعد صوتي يرد على المكالمات الهاتفية، يفهم طلبات العملاء صوتيًا ويجيب أو ينفّذ الإجراءات تلقائيًا، مما يقلّل أوقات الانتظار وتكلفة التشغيل.",
          en: "A voice assistant that answers phone calls, understands customer requests by voice, and responds or performs actions automatically, reducing wait times and operating costs.",
        },
        features: {
          ar: ["تعرّف على الكلام باللغة العربية", "رد صوتي طبيعي", "أتمتة الطلبات المتكررة", "تحويل للوكيل عند الحاجة"],
          en: [
            "Arabic speech recognition",
            "Natural voice responses",
            "Automation of repetitive requests",
            "Handoff to an agent when needed",
          ],
        },
      },
    ],
  },
  {
    slug: "ai-marketing",
    title: { ar: "أتمتة التسويق الرقمي بالذكاء الاصطناعي", en: "AI Digital Marketing Automation" },
    items: [
      {
        slug: "customer-journey",
        title: { ar: "تتبع رحلة العميل وأتمتة التواصل", en: "Customer Journey Tracking & Communication Automation" },
        excerpt: { ar: "اصنع رحلات تواصل آلية مبنية على سلوك العميل.", en: "Build automated journeys based on customer behavior." },
        description: {
          ar: "صمّم رحلات تواصل آلية تُطلق الرسائل المناسبة في الوقت المناسب بناءً على سلوك العميل وتفاعلاته، لزيادة التفاعل ومعدلات التحويل.",
          en: "Design automated communication journeys that trigger the right messages at the right time based on customer behavior and interactions, boosting engagement and conversion rates.",
        },
        features: {
          ar: ["منشئ رحلات بالسحب والإفلات", "محفّزات مبنية على السلوك", "رسائل عبر قنوات متعددة", "اختبارات A/B وتحسين مستمر"],
          en: [
            "Drag-and-drop journey builder",
            "Behavior-based triggers",
            "Messages across multiple channels",
            "A/B testing and continuous optimization",
          ],
        },
      },
      {
        slug: "cdp",
        title: { ar: "بناء قاعدة بيانات العملاء CDP", en: "Customer Data Platform (CDP)" },
        excerpt: { ar: "وحّد بيانات عملائك في منصة واحدة موثوقة.", en: "Unify your customer data in one trusted platform." },
        description: {
          ar: "منصة بيانات العملاء (CDP) تجمع بيانات عملائك من كل المصادر في ملف موحّد، لتمكّنك من التقسيم الدقيق والاستهداف الشخصي عبر كل القنوات.",
          en: "A Customer Data Platform (CDP) that gathers your customer data from all sources into a unified profile, enabling precise segmentation and personalized targeting across every channel.",
        },
        features: {
          ar: ["ملف عميل موحّد 360 درجة", "تجميع البيانات من كل المصادر", "شرائح ديناميكية دقيقة", "تكامل مع أدوات التسويق"],
          en: [
            "Unified 360° customer profile",
            "Data aggregation from all sources",
            "Precise dynamic segments",
            "Integration with marketing tools",
          ],
        },
      },
    ],
  },
]

/* --------------------------------- Products -------------------------------- */
export const products: NavItem[] = [
  {
    slug: "whatsapp-campaigns",
    title: { ar: "إطلاق حملات الواتساب", en: "WhatsApp Campaigns" },
    excerpt: { ar: "أطلق حملات واتساب جماعية تصل وتُقرأ فعلًا.", en: "Launch bulk WhatsApp campaigns that actually get delivered and read." },
    description: {
      ar: "منصة لإطلاق حملات واتساب موجّهة لآلاف العملاء بقوالب معتمدة، مع جدولة وتقسيم للجمهور وتقارير أداء تفصيلية لكل حملة.",
      en: "A platform to launch targeted WhatsApp campaigns to thousands of customers using approved templates, with scheduling, audience segmentation, and detailed performance reports per campaign.",
    },
    features: {
      ar: ["إرسال جماعي بقوالب معتمدة", "تقسيم الجمهور والجدولة", "تقارير تسليم وقراءة وتفاعل", "ربط مع قاعدة العملاء"],
      en: [
        "Bulk sending with approved templates",
        "Audience segmentation and scheduling",
        "Delivery, read, and engagement reports",
        "Integration with your customer base",
      ],
    },
  },
  {
    slug: "leap-survey",
    title: { ar: "منصة استبيان ليب", en: "Leap Survey Platform" },
    excerpt: { ar: "اجمع آراء عملائك وقِس رضاهم بسهولة.", en: "Collect customer feedback and measure satisfaction with ease." },
    description: {
      ar: "أنشئ استبيانات احترافية وأرسلها عبر واتساب والقنوات الرقمية، وقِس مؤشرات مثل NPS و CSAT بتقارير لحظية تساعدك على تحسين الخدمة.",
      en: "Create professional surveys and send them via WhatsApp and digital channels, measuring metrics like NPS and CSAT with real-time reports that help you improve your service.",
    },
    features: {
      ar: ["منشئ استبيانات مرن", "قياس NPS و CSAT", "إرسال عبر واتساب والقنوات", "تقارير ولوحات تحليلية"],
      en: ["Flexible survey builder", "NPS and CSAT measurement", "Sending via WhatsApp and channels", "Reports and analytics dashboards"],
    },
  },
  {
    slug: "digital-invoices",
    title: { ar: "الفواتير الرقمية", en: "Digital Invoices" },
    excerpt: { ar: "أرسل فواتير رقمية واستلم المدفوعات بسرعة.", en: "Send digital invoices and collect payments quickly." },
    description: {
      ar: "أصدر وأرسل فواتير رقمية لعملائك عبر واتساب مع روابط دفع آمنة، وتابع حالة كل فاتورة من الإصدار حتى السداد.",
      en: "Issue and send digital invoices to your customers via WhatsApp with secure payment links, and track each invoice from issuance to payment.",
    },
    features: {
      ar: ["إصدار فواتير رقمية", "روابط دفع آمنة", "تذكير آلي بالسداد", "متابعة حالة الفواتير"],
      en: ["Digital invoice issuance", "Secure payment links", "Automated payment reminders", "Invoice status tracking"],
    },
  },
  {
    slug: "whatsapp-invitations",
    title: { ar: "دعوات واتساب الرقمية", en: "Digital WhatsApp Invitations" },
    excerpt: { ar: "أرسل دعوات تفاعلية أنيقة عبر واتساب.", en: "Send elegant, interactive invitations via WhatsApp." },
    description: {
      ar: "صمّم وأرسل دعوات رقمية للفعاليات والمناسبات عبر واتساب مع تأكيد الحضور (RSVP) ومتابعة المدعوين لحظيًا.",
      en: "Design and send digital invitations for events and occasions via WhatsApp with RSVP confirmation and real-time guest tracking.",
    },
    features: {
      ar: ["قوالب دعوات احترافية", "تأكيد حضور RSVP", "تذكيرات آلية", "متابعة قوائم المدعوين"],
      en: ["Professional invitation templates", "RSVP confirmation", "Automated reminders", "Guest-list tracking"],
    },
  },
  {
    slug: "chatbot-tree",
    title: { ar: "شجرة الشات بوت AI", en: "AI Chatbot Tree" },
    excerpt: { ar: "ابنِ مسارات محادثة ذكية دون برمجة.", en: "Build smart conversation flows with no coding." },
    description: {
      ar: "أداة مرئية لبناء مسارات محادثة الشات بوت بالسحب والإفلات، تتيح لك تصميم تجارب تفاعلية معقّدة دون الحاجة لأي خبرة برمجية.",
      en: "A visual drag-and-drop tool for building chatbot conversation flows, letting you design complex interactive experiences without any coding experience.",
    },
    features: {
      ar: ["منشئ مرئي بالسحب والإفلات", "مسارات شرطية ذكية", "ربط مع الأنظمة الخارجية", "اختبار ومعاينة فورية"],
      en: ["Visual drag-and-drop builder", "Smart conditional flows", "Integration with external systems", "Instant testing and preview"],
    },
  },
  {
    slug: "whatsapp-officer",
    title: { ar: "مأمور واتساب", en: "WhatsApp Officer" },
    excerpt: { ar: "وكيل واتساب آلي يخدم عملاءك على مدار الساعة.", en: "An automated WhatsApp agent serving your customers 24/7." },
    description: {
      ar: "حلّ متكامل يدير محادثات واتساب الواردة آليًا، يجيب على الاستفسارات المتكررة، ويحوّل الحالات المعقّدة للوكلاء البشريين.",
      en: "An integrated solution that automatically manages inbound WhatsApp conversations, answers frequent inquiries, and routes complex cases to human agents.",
    },
    features: {
      ar: ["رد آلي على الاستفسارات", "توجيه ذكي للوكلاء", "خدمة على مدار الساعة", "تقارير أداء يومية"],
      en: ["Automated answers to inquiries", "Smart routing to agents", "24/7 service", "Daily performance reports"],
    },
  },
  {
    slug: "recommendation-engine",
    title: { ar: "محرك التوصية REC", en: "Recommendation Engine (REC)" },
    excerpt: { ar: "وصِّ عملاءك بالمنتج الأنسب لزيادة المبيعات.", en: "Recommend the right product to boost your sales." },
    description: {
      ar: "محرك توصيات ذكي يحلّل سلوك العملاء وتفضيلاتهم ليقترح المنتجات والخدمات الأنسب لكل عميل، مما يرفع متوسط قيمة الطلب.",
      en: "A smart recommendation engine that analyzes customer behavior and preferences to suggest the most relevant products and services for each customer, raising average order value.",
    },
    features: {
      ar: ["توصيات شخصية لكل عميل", "تحليل سلوك الشراء", "رفع متوسط قيمة الطلب", "تكامل مع المتجر والقنوات"],
      en: ["Personalized recommendations per customer", "Purchase-behavior analysis", "Higher average order value", "Integration with store and channels"],
    },
  },
  {
    slug: "ai-recruiter",
    title: { ar: "مساعد التوظيف بالذكاء الاصطناعي R24", en: "AI Recruiting Assistant (R24)" },
    excerpt: { ar: "افرز المرشحين وأجرِ المقابلات الأولية آليًا.", en: "Screen candidates and run initial interviews automatically." },
    description: {
      ar: "مساعد توظيف ذكي يفرز السير الذاتية، يتواصل مع المرشحين عبر واتساب، ويجري المقابلات الأولية تلقائيًا لتسريع عملية التوظيف.",
      en: "A smart recruiting assistant that screens CVs, communicates with candidates via WhatsApp, and conducts initial interviews automatically to speed up hiring.",
    },
    features: {
      ar: ["فرز السير الذاتية آليًا", "تواصل مع المرشحين", "مقابلات أولية ذكية", "جدولة المقابلات"],
      en: ["Automated CV screening", "Candidate communication", "Smart initial interviews", "Interview scheduling"],
    },
  },
  {
    slug: "ai-parking",
    title: { ar: "خدمة مواقف AI", en: "AI Parking Service" },
    excerpt: { ar: "إدارة ذكية لمواقف السيارات بالذكاء الاصطناعي.", en: "Smart AI-powered parking management." },
    description: {
      ar: "حلّ ذكي لإدارة المواقف يتعرّف على لوحات السيارات ويتيح الدفع والدخول الآلي، مع تجربة سلسة للزوّار وتقارير إشغال دقيقة.",
      en: "A smart parking-management solution that recognizes license plates and enables automated payment and entry, with a seamless visitor experience and accurate occupancy reports.",
    },
    features: {
      ar: ["تعرّف على لوحات السيارات", "دفع ودخول آلي", "متابعة إشغال المواقف", "تقارير وتحليلات"],
      en: ["License-plate recognition", "Automated payment and entry", "Parking occupancy monitoring", "Reports and analytics"],
    },
  },
  {
    slug: "leap-ticketing",
    title: { ar: "ليب تذاكر – أتمتة نظام البلاغات والشكاوى", en: "Leap Ticketing" },
    excerpt: {
      ar: "إدارة ومعالجة شكاوى العملاء بفعالية عبر القنوات الرقمية.",
      en: "Effectively manage and resolve customer complaints across digital channels.",
    },
    description: {
      ar: "توفر منصة ليب تقنيات متقدمة لإدارة ومعالجة شكاوى العملاء عبر قنوات الخدمة المختلفة، وتحويل عدم رضا العملاء إلى رضا كامل.",
      en: "The Leap platform provides advanced technologies to effectively manage and resolve customer complaints across various service channels, turning customer dissatisfaction into complete satisfaction.",
    },
    features: {
      ar: ["خدمة ذاتية عبر البوت المدمج", "سجلات تذاكر شاملة", "توجيه سريع للفريق المناسب", "متابعة حالة التذكرة"],
      en: ["Self-service via integrated bot", "Comprehensive ticket logs", "Swift routing to the right team", "Ticket status tracking"],
    },
  },
]

/* ------------------------------ Use Cases ----------------------------- */
export const useCases: NavItem[] = [
  {
    slug: "complaints-automation",
    title: { ar: "أتمتة نظام البلاغات والشكاوى", en: "Complaints & Reports Automation" },
    excerpt: { ar: "استقبل وعالج بلاغات العملاء آليًا وبسرعة.", en: "Receive and resolve customer reports automatically and fast." },
    description: {
      ar: "نظام متكامل لأتمتة استقبال البلاغات والشكاوى عبر القنوات الرقمية، وتوجيهها للجهة المختصة ومتابعتها حتى الإغلاق مع إشعار العميل بكل خطوة.",
      en: "An integrated system to automate receiving complaints and reports via digital channels, routing them to the right department and tracking them to closure while notifying the customer at every step.",
    },
    features: {
      ar: ["استقبال البلاغات عبر كل القنوات", "توجيه آلي للجهة المختصة", "متابعة حتى الإغلاق", "إشعار العميل بالتحديثات"],
      en: ["Receive reports across all channels", "Automatic routing to the right department", "Tracking to closure", "Notifying customers of updates"],
    },
  },
  {
    slug: "retail",
    title: { ar: "البيع بالتجزئة", en: "Retail" },
    excerpt: { ar: "تجربة تسوّق متكاملة من المحادثة حتى الشراء.", en: "A complete shopping experience from chat to checkout." },
    description: {
      ar: "مكّن عملاء التجزئة من التصفّح والشراء والدفع عبر واتساب والقنوات الرقمية، مع توصيات شخصية ودعم فوري يرفع المبيعات والولاء.",
      en: "Enable retail customers to browse, buy, and pay via WhatsApp and digital channels, with personalized recommendations and instant support that boost sales and loyalty.",
    },
    features: {
      ar: ["متجر داخل المحادثة", "توصيات منتجات شخصية", "دعم وخدمة فورية", "حملات تسويقية موجّهة"],
      en: ["In-chat store", "Personalized product recommendations", "Instant support and service", "Targeted marketing campaigns"],
    },
  },
  {
    slug: "telecom",
    title: { ar: "الاتصالات", en: "Telecom" },
    excerpt: { ar: "خدمة ودعم مشتركي الاتصالات بكفاءة عالية.", en: "Serve and support telecom subscribers with high efficiency." },
    description: {
      ar: "حلول لشركات الاتصالات لإدارة استفسارات المشتركين، تفعيل الباقات، وحل المشكلات التقنية آليًا عبر قنوات رقمية موحّدة.",
      en: "Solutions for telecom companies to manage subscriber inquiries, activate plans, and resolve technical issues automatically across unified digital channels.",
    },
    features: {
      ar: ["إدارة الباقات والاشتراكات", "دعم فني آلي", "تحصيل وتجديد الفواتير", "خدمة على مدار الساعة"],
      en: ["Plan and subscription management", "Automated technical support", "Invoice collection and renewal", "24/7 service"],
    },
  },
  {
    slug: "banking",
    title: { ar: "الخدمات المصرفية", en: "Banking" },
    excerpt: { ar: "خدمات مصرفية رقمية آمنة عبر قنوات المحادثة.", en: "Secure digital banking services through chat channels." },
    description: {
      ar: "قدّم خدمات مصرفية آمنة عبر القنوات الرقمية، من الاستعلام عن الرصيد إلى فتح الحسابات والدعم، مع أعلى معايير الأمان والامتثال.",
      en: "Offer secure banking services across digital channels — from balance inquiries to account opening and support — with the highest security and compliance standards.",
    },
    features: {
      ar: ["استعلامات آمنة عن الحساب", "خدمات ومعاملات رقمية", "تحقق وهوية متعدد العوامل", "امتثال ومعايير أمان عالية"],
      en: ["Secure account inquiries", "Digital services and transactions", "Multi-factor verification and identity", "High compliance and security standards"],
    },
  },
  {
    slug: "healthcare",
    title: { ar: "الرعاية الصحية", en: "Healthcare" },
    excerpt: { ar: "حجوزات ومتابعة المرضى عبر القنوات الرقمية.", en: "Appointments and patient follow-up via digital channels." },
    description: {
      ar: "حلول للقطاع الصحي لإدارة حجوزات المواعيد، تذكير المرضى، ومتابعة ما بعد الزيارة عبر واتساب، مما يقلّل التغيّب ويحسّن تجربة المريض.",
      en: "Healthcare solutions to manage appointment booking, patient reminders, and post-visit follow-up via WhatsApp, reducing no-shows and improving the patient experience.",
    },
    features: {
      ar: ["حجز وتأكيد المواعيد", "تذكير آلي بالمواعيد", "متابعة ما بعد الزيارة", "استبيانات رضا المرضى"],
      en: ["Appointment booking and confirmation", "Automated appointment reminders", "Post-visit follow-up", "Patient satisfaction surveys"],
    },
  },
  {
    slug: "insurance",
    title: { ar: "التأمين", en: "Insurance" },
    excerpt: { ar: "إصدار الوثائق ومعالجة المطالبات رقميًا.", en: "Issue policies and process claims digitally." },
    description: {
      ar: "بسّط رحلة عميل التأمين من طلب عرض السعر وإصدار الوثيقة حتى تقديم المطالبات ومتابعتها، كل ذلك عبر قنوات رقمية سهلة.",
      en: "Simplify the insurance customer journey from requesting a quote and issuing a policy to filing and tracking claims — all through easy digital channels.",
    },
    features: {
      ar: ["عروض أسعار فورية", "إصدار الوثائق رقميًا", "تقديم ومتابعة المطالبات", "تذكير بتجديد الوثائق"],
      en: ["Instant quotes", "Digital policy issuance", "Claim filing and tracking", "Policy-renewal reminders"],
    },
  },
  {
    slug: "travel-hospitality",
    title: { ar: "السفر والضيافة", en: "Travel & Hospitality" },
    excerpt: { ar: "تجربة ضيافة سلسة من الحجز حتى المغادرة.", en: "A seamless hospitality experience from booking to checkout." },
    description: {
      ar: "قدّم لضيوفك تجربة متكاملة من الحجز والتأكيد إلى الخدمات أثناء الإقامة والدعم، عبر قنوات رقمية متعددة اللغات على مدار الساعة.",
      en: "Give your guests a complete experience from booking and confirmation to in-stay services and support, across multilingual digital channels around the clock.",
    },
    features: {
      ar: ["حجز وتأكيد رقمي", "خدمات أثناء الإقامة", "دعم متعدد اللغات", "استبيانات تجربة الضيف"],
      en: ["Digital booking and confirmation", "In-stay services", "Multilingual support", "Guest-experience surveys"],
    },
  },
]

export const solutionsFlat: NavItem[] = solutionsGroups.flatMap((g) => g.items)

export function findSolution(slug: string) {
  return solutionsFlat.find((i) => i.slug === slug)
}
export function findProduct(slug: string) {
  return products.find((i) => i.slug === slug)
}
export function findUseCase(slug: string) {
  return useCases.find((i) => i.slug === slug)
}

/* ------------------------------- Pricing -------------------------------- */
export type PricingPlan = {
  slug: string
  price: string
  featured: boolean
  name: Localized
  tagline: Localized
  features: LocalizedArr
}

export const pricingPlans: PricingPlan[] = [
  {
    slug: "leap-space-1",
    price: "149",
    featured: false,
    name: { ar: "باقة Leap Space 1", en: "Leap Space Plan 1" },
    tagline: {
      ar: "كن مستعدًا لاستقبال مكالمات العملاء:",
      en: "Be ready to receive customer calls:",
    },
    features: {
      ar: [
        "المكالمات والتفاعلات المباشرة الواردة والصادرة",
        "المجيب الصوتي التفاعلي (IVR) سهل الاستخدام وقابل للتخصيص",
        "خيار معاودة الاتصال من الخدمات الذاتية",
        "تفاعلات العملاء الشخصية",
        "نقطة اتصال واحدة للإدارة وإعداد التقارير",
        "قنوات متعددة متكاملة",
        "أداة إنشاء تدفق المكالمات بالسحب والإفلات",
        "ضمان الامتثال التنظيمي بتسجيل كل تفاعل بدقة عالية",
      ],
      en: [
        "Inbound and outbound live calls and interactions",
        "Easy-to-use, customizable interactive voice response (IVR)",
        "Callback option from self-service",
        "Personalized customer interactions",
        "Single point for management and reporting",
        "Multiple integrated channels",
        "Drag-and-drop call-flow builder",
        "Regulatory compliance with high-accuracy recording of every interaction",
      ],
    },
  },
  {
    slug: "leap-space-2",
    price: "199",
    featured: true,
    name: { ar: "باقة Leap Space 2", en: "Leap Space Plan 2" },
    tagline: {
      ar: "إدارة القنوات الرقمية الخاصة بك:",
      en: "Manage your digital channels:",
    },
    features: {
      ar: [
        "إدارة التفاعلات الرقمية: البريد، مراسلة الويب والتطبيق",
        "التسجيل السريع لأرقام الواتساب",
        "التحقق من العلامة الخضراء لتوثيق الواتساب",
        "مساحة عمل محسّنة للموظفين الرقميين",
        "الوصول إلى مركز المعرفة",
        "إمكانات الوسائط الغنية والمتعددة",
        "حل إدارة الجودة قوي وبديهي",
        "واجهة برمجة تطبيقات مفتوحة للتكامل مع CRM ووسائل التواصل",
      ],
      en: [
        "Digital interaction management: email, web and app messaging",
        "Fast WhatsApp number onboarding",
        "Green badge verification for WhatsApp",
        "Optimized workspace for digital agents",
        "Access to the knowledge center",
        "Rich, multimedia capabilities",
        "Powerful, intuitive quality management",
        "Open API for CRM and social integration",
      ],
    },
  },
  {
    slug: "leap-space-3",
    price: "299",
    featured: false,
    name: { ar: "باقة Leap Space 3", en: "Leap Space Plan 3" },
    tagline: {
      ar: "مركز الاتصال متعدد القنوات:",
      en: "Omni-channel contact center:",
    },
    features: {
      ar: [
        "يشمل جميع ميزات الباقتين الصوتية والرقمية",
        "التفاعلات المباشرة الواردة والصادرة",
        "أداة السحب والإفلات سهلة الاستخدام وقابلة للتخصيص",
        "تفاعلات العملاء الشخصية",
        "نقطة اتصال واحدة للإدارة وإعداد التقارير",
        "قنوات متكاملة متعددة",
        "سياسة استخدام عادل تغطي IVR وتخزين البيانات وطلبات API",
        "أداة موحدة لإدارة ومراقبة التفاعلات الصوتية والرقمية",
      ],
      en: [
        "Includes all voice and digital plan features",
        "Inbound and outbound live interactions",
        "Easy-to-use, customizable drag-and-drop tool",
        "Personalized customer interactions",
        "Single point for management and reporting",
        "Multiple integrated channels",
        "Fair-use policy covering IVR, data storage, and API requests",
        "Unified tool to manage and monitor voice and digital interactions",
      ],
    },
  },
]

/* -------------------------------- Addons -------------------------------- */
export type AddonItem = {
  icon: string
  title: Localized
  desc: Localized
}

export const addonItems: AddonItem[] = [
  {
    icon: "/icons/1.png",
    title: { ar: "الذكاء الاصطناعي التوليدي", en: "Generative AI" },
    desc: {
      ar: "ردود ذكية ومحتوى تلقائي يرفع كفاءة فريق خدمة العملاء ويقلل زمن الاستجابة.",
      en: "Smart replies and automated content that boost support-team efficiency and reduce response time.",
    },
  },
  {
    icon: "/icons/2.png",
    title: { ar: "نظام إدارة الحملات", en: "Campaign Management System" },
    desc: {
      ar: "تخطيط وإطلاق وقياس حملاتك التسويقية عبر القنوات من لوحة تحكم واحدة.",
      en: "Plan, launch, and measure your marketing campaigns across channels from one dashboard.",
    },
  },
  {
    icon: "/icons/3.png",
    title: { ar: "الفاتورة الرقمية", en: "Digital Invoice" },
    desc: {
      ar: "إصدار وإرسال الفواتير الرقمية لعملائك بشكل آمن وسريع ومتوافق.",
      en: "Issue and send digital invoices to your customers securely, quickly, and compliantly.",
    },
  },
  {
    icon: "/icons/4.png",
    title: { ar: "تكامل قنوات التواصل الاجتماعي", en: "Social Channel Integration" },
    desc: {
      ar: "إدارة محادثات منصات التواصل الاجتماعي من مكان واحد موحد.",
      en: "Manage social-platform conversations from one unified place.",
    },
  },
  {
    icon: "/icons/5.png",
    title: { ar: "صوت العملاء – الاستبيان وقياس الرضى", en: "Voice of Customer – Surveys & Satisfaction" },
    desc: {
      ar: "قياس رضى العملاء عبر استبيانات ذكية لتحسين تجربتهم باستمرار.",
      en: "Measure customer satisfaction through smart surveys to continuously improve their experience.",
    },
  },
  {
    icon: "/icons/6.png",
    title: { ar: "لوحة القيادة والتحكم", en: "Dashboard & Control Panel" },
    desc: {
      ar: "تحليلات قوية ومؤشرات أداء رئيسية لفهم شامل لتجربة العميل.",
      en: "Powerful analytics and KPIs for a complete view of the customer experience.",
    },
  },
  {
    icon: "/icons/7.png",
    title: { ar: "مستندات ليب LeapDocs", en: "LeapDocs" },
    desc: {
      ar: "إدارة المعرفة والمستندات لتمكين فريقك من الوصول السريع للمعلومات.",
      en: "Knowledge and document management so your team can access information quickly.",
    },
  },
  {
    icon: "/icons/8.png",
    title: { ar: "إدارة علاقات العملاء", en: "Customer Relationship Management" },
    desc: {
      ar: "نظام CRM متكامل يوحّد بيانات عملائك ويعزز علاقتك بهم.",
      en: "An integrated CRM that unifies customer data and strengthens your relationship with them.",
    },
  },
  {
    icon: "/icons/9.png",
    title: { ar: "أتمتة التسويق الرقمي بالذكاء الاصطناعي", en: "AI Digital Marketing Automation" },
    desc: {
      ar: "أتمتة المسارات التسويقية لتحويل المهتمين إلى عملاء فعليين.",
      en: "Automate marketing journeys to turn prospects into paying customers.",
    },
  },
  {
    icon: "/icons/10.png",
    title: { ar: "تقنيات الألعاب التحفيزية", en: "Gamification" },
    desc: {
      ar: "تحفيز الموظفين والعملاء عبر آليات الألعاب لرفع التفاعل والولاء.",
      en: "Motivate employees and customers through game mechanics to increase engagement and loyalty.",
    },
  },
]

export type StoreIntegration = {
  name: "salla" | "zid"
  logo?: string
  isImage: boolean
  title: Localized
}

export const storeIntegrations: StoreIntegration[] = [
  {
    name: "salla",
    logo: "/logos/salla.svg",
    isImage: true,
    title: { ar: "متجرك على سلة؟", en: "Your store on Salla?" },
  },
  {
    name: "zid",
    isImage: false,
    title: { ar: "متجرك على زد؟", en: "Your store on Zid?" },
  },
]
