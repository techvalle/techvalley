import icons from "./icons";

export { icons };

// Language-specific error messages

export const errorMessagesAPI = {
  ar: {
    userNotFound: "المستخدم غير موجود",
    phoneInUse: "يبدو أن الرقم مستخدم بالفعل",
    emailInUse: "يبدو أن البريد الإلكتروني مستخدم بالفعل",
    chatNotFound: "لم يتم العثور على محادثات للمستخدم",
    failedToCreateUser: "فشل في إنشاء المستخدم",
    failedToRetrieveUser: "فشل في استرجاع تفاصيل المستخدم",
    failedToSendOTP: "فشل في إرسال رمز التحقق",
    failedToResetPassword: "فشل في إعادة تعيين كلمة المرور",
    uniqueUsernameFailed: "فشل في توليد اسم مستخدم فريد",
    failedToCreateChat: "فشل في إنشاء المحادثة",
    failedToCheckEmail: "فشل في التحقق من البريد الإلكتروني",
    failedToUpdatePhone: "فشل في تحديث رقم الهاتف",
    failedToSignIn: "فشل في تسجيل الدخول",
    failedToGetCurrentUser: "فشل في استرجاع المستخدم الحالي",
    failedToSendOtpToPhone: "فشل في إرسال رمز التحقق إلى الهاتف",
    failedToUpdateUserDetails: "فشل في تحديث تفاصيل المستخدم",
  },
  en: {
    userNotFound: "User not found",
    phoneInUse: "The phone number is already in use",
    emailInUse: "The email is already in use",
    chatNotFound: "No chats found for this user",
    failedToCreateUser: "Failed to create user",
    failedToRetrieveUser: "Failed to retrieve user details",
    failedToSendOTP: "Failed to send OTP",
    failedToResetPassword: "Failed to reset password",
    uniqueUsernameFailed: "Failed to generate a unique username",
    failedToCreateChat: "Failed to create chat",
    failedToCheckEmail: "Failed to check email",
    failedToUpdatePhone: "Failed to update phone number",
    failedToSignIn: "Failed to sign in",
    failedToGetCurrentUser: "Failed to retrieve current user",
    failedToSendOtpToPhone: "Failed to send OTP to phone",
    failedToUpdateUserDetails: "Failed to update user details",
  },
  fr: {
    userNotFound: "Utilisateur non trouvé",
    phoneInUse: "Le numéro de téléphone est déjà utilisé",
    emailInUse: "L'email est déjà utilisé",
    chatNotFound: "Aucune discussion trouvée pour cet utilisateur",
    failedToCreateUser: "Échec de la création de l'utilisateur",
    failedToRetrieveUser:
      "Échec de la récupération des détails de l'utilisateur",
    failedToSendOTP: "Échec de l'envoi du code OTP",
    failedToResetPassword: "Échec de la réinitialisation du mot de passe",
    uniqueUsernameFailed:
      "Échec de la génération d'un nom d'utilisateur unique",
    failedToCreateChat: "Échec de la création du chat",
    failedToCheckEmail: "Échec de la vérification de l'email",
    failedToUpdatePhone: "Échec de la mise à jour du numéro de téléphone",
    failedToSignIn: "Échec de la connexion",
    failedToGetCurrentUser: "Échec de la récupération de l'utilisateur actuel",
    failedToSendOtpToPhone: "Échec de l'envoi du code OTP au téléphone",
    failedToUpdateUserDetails:
      "Échec de la mise à jour des détails de l'utilisateur",
  },
} as any;

// Options for the category dropdowns
export const categoryOptions = {
  category1: [
    {
      label: { ar: "الأجهزة", en: "Devices", fr: "Appareils" },
      value: "devices",
    },
    {
      label: { ar: "العقارات", en: "Real Estate", fr: "Immobilier" },
      value: "real_estate",
    },
    {
      label: { ar: "السيارات", en: "Cars", fr: "Voitures" },
      value: "cars",
    },
    {
      label: {
        ar: "أدوات منزلية",
        en: "Home Appliances",
        fr: "Électroménager",
      },
      value: "home_appliance",
    },
    {
      label: { ar: "اعمال", en: "Jobs", fr: "Emplois" },
      value: "jobs",
    },
    {
      label: {
        ar: "مستلزمات شخصية",
        en: "Personal Items",
        fr: "Articles Personnels",
      },
      value: "personal_items",
    },
  ],
  category2: {
    devices: [
      { label: { ar: "آيفون", en: "iPhone", fr: "iPhone" }, value: "iphone" },
      {
        label: { ar: "أندرويد", en: "Android", fr: "Android" },
        value: "android",
      },
      {
        label: { ar: "لابتوب", en: "Laptop", fr: "Ordinateur Portable" },
        value: "laptop",
      },
      { label: { ar: "تابلت", en: "Tablet", fr: "Tablette" }, value: "tablet" },
      {
        label: { ar: "ساعة ذكية", en: "Smartwatch", fr: "Montre Intelligente" },
        value: "smartwatch",
      },
    ],
    real_estate: [
      {
        label: { ar: "شقة", en: "Apartment", fr: "Appartement" },
        value: "apartment",
      },
      { label: { ar: "فيلا", en: "Villa", fr: "Villa" }, value: "villa" },
      { label: { ar: "مكتب", en: "Office", fr: "Bureau" }, value: "office" },
      { label: { ar: "أرض", en: "Land", fr: "Terrain" }, value: "land" },
      { label: { ar: "محل", en: "Shop", fr: "Magasin" }, value: "shop" },
    ],
    cars: [
      {
        label: { ar: "سيارة صغيرة", en: "Small Car", fr: "Petite Voiture" },
        value: "small_car",
      },
      {
        label: { ar: "سيارة كبيرة", en: "Big Car", fr: "Grande Voiture" },
        value: "big_car",
      },
      { label: { ar: "شاحنة", en: "Truck", fr: "Camion" }, value: "truck" },
      {
        label: { ar: "دراجة نارية", en: "Motorcycle", fr: "Moto" },
        value: "motorcycle",
      },
      { label: { ar: "SUV", en: "SUV", fr: "SUV" }, value: "suv" },
    ],
    home_appliance: [
      {
        label: { ar: "ثلاجة", en: "Fridge", fr: "Réfrigérateur" },
        value: "fridge",
      },
      {
        label: { ar: "غسالة", en: "Washing Machine", fr: "Machine à Laver" },
        value: "washing_machine",
      },
      {
        label: { ar: "مكيف", en: "Air Conditioner", fr: "Climatiseur" },
        value: "air_conditioner",
      },
      { label: { ar: "فرن", en: "Oven", fr: "Four" }, value: "oven" },
      {
        label: { ar: "مايكروويف", en: "Microwave", fr: "Micro-ondes" },
        value: "microwave",
      },
    ],
    jobs: [
      {
        label: { ar: "مهندس", en: "Engineer", fr: "Ingénieur" },
        value: "engineer",
      },
      {
        label: { ar: "محاسب", en: "Accountant", fr: "Comptable" },
        value: "accountant",
      },
      {
        label: {
          ar: "مطور برامج",
          en: "Software Developer",
          fr: "Développeur Logiciel",
        },
        value: "software_developer",
      },
      { label: { ar: "مدير", en: "Manager", fr: "Manager" }, value: "manager" },
      {
        label: { ar: "معلم", en: "Teacher", fr: "Enseignant" },
        value: "teacher",
      },
    ],
    personal_items: [
      {
        label: { ar: "ملابس", en: "Clothes", fr: "Vêtements" },
        value: "clothes",
      },
      { label: { ar: "أحذية", en: "Shoes", fr: "Chaussures" }, value: "shoes" },
      {
        label: { ar: "إكسسوارات", en: "Accessories", fr: "Accessoires" },
        value: "accessories",
      },
      { label: { ar: "حقائب", en: "Bags", fr: "Sacs" }, value: "bags" },
      {
        label: { ar: "مستحضرات تجميل", en: "Cosmetics", fr: "Cosmétiques" },
        value: "cosmetics",
      },
    ],
  },
  category3: {
    iphone: [
      {
        label: { ar: "آيفون X", en: "iPhone X", fr: "iPhone X" },
        value: "iphone_x",
      },
      {
        label: { ar: "آيفون 11", en: "iPhone 11", fr: "iPhone 11" },
        value: "iphone_11",
      },
      {
        label: { ar: "آيفون 12", en: "iPhone 12", fr: "iPhone 12" },
        value: "iphone_12",
      },
      {
        label: { ar: "آيفون 13", en: "iPhone 13", fr: "iPhone 13" },
        value: "iphone_13",
      },
    ],
    android: [
      {
        label: {
          ar: "سامسونج جالاكسي",
          en: "Samsung Galaxy",
          fr: "Samsung Galaxy",
        },
        value: "galaxy",
      },
      {
        label: { ar: "جوجل بيكسل", en: "Google Pixel", fr: "Google Pixel" },
        value: "pixel",
      },
      {
        label: { ar: "ون بلس", en: "OnePlus", fr: "OnePlus" },
        value: "oneplus",
      },
      { label: { ar: "شاومي", en: "Xiaomi", fr: "Xiaomi" }, value: "xiaomi" },
    ],
    laptop: [
      {
        label: { ar: "ماك بوك", en: "MacBook", fr: "MacBook" },
        value: "macbook",
      },
      {
        label: { ar: "ديل XPS", en: "Dell XPS", fr: "Dell XPS" },
        value: "xps",
      },
      {
        label: { ar: "إتش بي سبيكتر", en: "HP Spectre", fr: "HP Spectre" },
        value: "spectre",
      },
      {
        label: {
          ar: "لينوفو ثينك باد",
          en: "Lenovo ThinkPad",
          fr: "Lenovo ThinkPad",
        },
        value: "thinkpad",
      },
    ],
    tablet: [
      { label: { ar: "آيباد", en: "iPad", fr: "iPad" }, value: "ipad" },
      {
        label: { ar: "سامسونج تاب", en: "Samsung Tab", fr: "Samsung Tab" },
        value: "samsung_tab",
      },
      {
        label: {
          ar: "مايكروسوفت سيرفس",
          en: "Microsoft Surface",
          fr: "Microsoft Surface",
        },
        value: "surface",
      },
      {
        label: { ar: "لينوفو تاب", en: "Lenovo Tab", fr: "Lenovo Tab" },
        value: "lenovo_tab",
      },
    ],
    smartwatch: [
      {
        label: { ar: "ساعة آبل", en: "Apple Watch", fr: "Apple Watch" },
        value: "apple_watch",
      },
      {
        label: { ar: "ساعة جالاكسي", en: "Galaxy Watch", fr: "Galaxy Watch" },
        value: "galaxy_watch",
      },
      { label: { ar: "فيتبيت", en: "Fitbit", fr: "Fitbit" }, value: "fitbit" },
      { label: { ar: "جارمين", en: "Garmin", fr: "Garmin" }, value: "garmin" },
    ],
    apartment: [
      {
        label: { ar: "2 غرف نوم", en: "2 Bedrooms", fr: "2 Chambres" },
        value: "2_bedroom",
      },
      {
        label: { ar: "3 غرف نوم", en: "3 Bedrooms", fr: "3 Chambres" },
        value: "3_bedroom",
      },
      {
        label: { ar: "1 غرفة نوم", en: "1 Bedroom", fr: "1 Chambre" },
        value: "1_bedroom",
      },
    ],
    villa: [
      {
        label: { ar: "فيلا صغيرة", en: "Small Villa", fr: "Petite Villa" },
        value: "small_villa",
      },
      {
        label: { ar: "فيلا كبيرة", en: "Big Villa", fr: "Grande Villa" },
        value: "big_villa",
      },
      {
        label: { ar: "فيلا فاخرة", en: "Luxury Villa", fr: "Villa de Luxe" },
        value: "luxury_villa",
      },
    ],
    office: [
      {
        label: { ar: "مكتب صغير", en: "Small Office", fr: "Petit Bureau" },
        value: "small_office",
      },
      {
        label: { ar: "مكتب كبير", en: "Big Office", fr: "Grand Bureau" },
        value: "big_office",
      },
      {
        label: { ar: "مكتب مشترك", en: "Shared Office", fr: "Bureau Partagé" },
        value: "shared_office",
      },
    ],
    small_car: [
      {
        label: { ar: "تويوتا يارس", en: "Toyota Yaris", fr: "Toyota Yaris" },
        value: "yaris",
      },
      {
        label: { ar: "هوندا فيت", en: "Honda Fit", fr: "Honda Fit" },
        value: "fit",
      },
      {
        label: { ar: "هيونداي i10", en: "Hyundai i10", fr: "Hyundai i10" },
        value: "i10",
      },
    ],
    big_car: [
      {
        label: {
          ar: "تويوتا لاند كروزر",
          en: "Toyota Land Cruiser",
          fr: "Toyota Land Cruiser",
        },
        value: "land_cruiser",
      },
      {
        label: {
          ar: "شيفروليه تاهو",
          en: "Chevrolet Tahoe",
          fr: "Chevrolet Tahoe",
        },
        value: "tahoe",
      },
      {
        label: { ar: "نيسان أرمادا", en: "Nissan Armada", fr: "Nissan Armada" },
        value: "armada",
      },
    ],
    truck: [
      {
        label: { ar: "فورد F-150", en: "Ford F-150", fr: "Ford F-150" },
        value: "f150",
      },
      {
        label: { ar: "رام 1500", en: "Ram 1500", fr: "Ram 1500" },
        value: "ram_1500",
      },
      {
        label: {
          ar: "شيفروليه سيلفرادو",
          en: "Chevrolet Silverado",
          fr: "Chevrolet Silverado",
        },
        value: "silverado",
      },
    ],
    engineer: [
      {
        label: {
          ar: "مهندس كهرباء",
          en: "Electrical Engineer",
          fr: "Ingénieur Électrique",
        },
        value: "electrical_engineer",
      },
      {
        label: {
          ar: "مهندس مدني",
          en: "Civil Engineer",
          fr: "Ingénieur Civil",
        },
        value: "civil_engineer",
      },
      {
        label: {
          ar: "مهندس ميكانيكي",
          en: "Mechanical Engineer",
          fr: "Ingénieur Mécanique",
        },
        value: "mechanical_engineer",
      },
      {
        label: { ar: "مهندس معماري", en: "Architect", fr: "Architecte" },
        value: "architect",
      },
    ],
    accountant: [
      {
        label: {
          ar: "محاسب تكاليف",
          en: "Cost Accountant",
          fr: "Comptable des Coûts",
        },
        value: "cost_accountant",
      },
      {
        label: {
          ar: "محاسب إداري",
          en: "Management Accountant",
          fr: "Comptable de Gestion",
        },
        value: "management_accountant",
      },
      {
        label: {
          ar: "محاسب مالي",
          en: "Financial Accountant",
          fr: "Comptable Financier",
        },
        value: "financial_accountant",
      },
    ],
    software_developer: [
      {
        label: {
          ar: "مطور تطبيقات",
          en: "App Developer",
          fr: "Développeur d'Applications",
        },
        value: "app_developer",
      },
      {
        label: { ar: "مطور ويب", en: "Web Developer", fr: "Développeur Web" },
        value: "web_developer",
      },
      {
        label: {
          ar: "مطور واجهات",
          en: "Frontend Developer",
          fr: "Développeur Frontend",
        },
        value: "frontend_developer",
      },
      {
        label: {
          ar: "مطور خلفيات",
          en: "Backend Developer",
          fr: "Développeur Backend",
        },
        value: "backend_developer",
      },
    ],
    manager: [
      {
        label: {
          ar: "مدير مشروع",
          en: "Project Manager",
          fr: "Chef de Projet",
        },
        value: "project_manager",
      },
      {
        label: {
          ar: "مدير مبيعات",
          en: "Sales Manager",
          fr: "Responsable des Ventes",
        },
        value: "sales_manager",
      },
      {
        label: {
          ar: "مدير تسويق",
          en: "Marketing Manager",
          fr: "Responsable Marketing",
        },
        value: "marketing_manager",
      },
      {
        label: {
          ar: "مدير موارد بشرية",
          en: "HR Manager",
          fr: "Responsable RH",
        },
        value: "hr_manager",
      },
    ],
    teacher: [
      {
        label: {
          ar: "مدرس رياضيات",
          en: "Math Teacher",
          fr: "Professeur de Mathématiques",
        },
        value: "math_teacher",
      },
      {
        label: {
          ar: "مدرس علوم",
          en: "Science Teacher",
          fr: "Professeur de Sciences",
        },
        value: "science_teacher",
      },
      {
        label: {
          ar: "مدرس لغة عربية",
          en: "Arabic Teacher",
          fr: "Professeur d'Arabe",
        },
        value: "arabic_teacher",
      },
      {
        label: {
          ar: "مدرس إنجليزي",
          en: "English Teacher",
          fr: "Professeur d'Anglais",
        },
        value: "english_teacher",
      },
    ],
    clothes: [
      {
        label: { ar: "تيشيرت", en: "T-shirt", fr: "T-shirt" },
        value: "tshirt",
      },
      {
        label: { ar: "بنطلون", en: "Trousers", fr: "Pantalon" },
        value: "trousers",
      },
      { label: { ar: "قميص", en: "Shirt", fr: "Chemise" }, value: "shirt" },
      { label: { ar: "فستان", en: "Dress", fr: "Robe" }, value: "dress" },
    ],
    shoes: [
      {
        label: {
          ar: "حذاء رياضي",
          en: "Sports Shoes",
          fr: "Chaussures de Sport",
        },
        value: "sports_shoes",
      },
      {
        label: {
          ar: "حذاء رسمي",
          en: "Formal Shoes",
          fr: "Chaussures Habillées",
        },
        value: "formal_shoes",
      },
      {
        label: { ar: "حذاء صيفي", en: "Sandals", fr: "Sandales" },
        value: "sandals",
      },
      {
        label: { ar: "حذاء شتوي", en: "Winter Shoes", fr: "Bottes d'Hiver" },
        value: "winter_shoes",
      },
    ],
    accessories: [
      { label: { ar: "ساعة يد", en: "Watch", fr: "Montre" }, value: "watch" },
      {
        label: {
          ar: "نظارة شمسية",
          en: "Sunglasses",
          fr: "Lunettes de Soleil",
        },
        value: "sunglasses",
      },
      {
        label: { ar: "سوار", en: "Bracelet", fr: "Bracelet" },
        value: "bracelet",
      },
      { label: { ar: "خاتم", en: "Ring", fr: "Bague" }, value: "ring" },
    ],
    bags: [
      {
        label: { ar: "حقيبة يد", en: "Handbag", fr: "Sac à Main" },
        value: "handbag",
      },
      {
        label: { ar: "حقيبة ظهر", en: "Backpack", fr: "Sac à Dos" },
        value: "backpack",
      },
      {
        label: { ar: "حقيبة سفر", en: "Travel Bag", fr: "Sac de Voyage" },
        value: "travel_bag",
      },
      {
        label: { ar: "حقيبة رياضية", en: "Gym Bag", fr: "Sac de Sport" },
        value: "gym_bag",
      },
    ],
    cosmetics: [
      {
        label: { ar: "كريم أساس", en: "Foundation", fr: "Fond de Teint" },
        value: "foundation",
      },
      {
        label: { ar: "أحمر شفاه", en: "Lipstick", fr: "Rouge à Lèvres" },
        value: "lipstick",
      },
      {
        label: { ar: "ماسكارا", en: "Mascara", fr: "Mascara" },
        value: "mascara",
      },
      {
        label: { ar: "بودرة وجه", en: "Face Powder", fr: "Poudre Visage" },
        value: "face_powder",
      },
    ],
    land: [
      {
        label: {
          ar: "أرض سكنية",
          en: "Residential Land",
          fr: "Terrain Résidentiel",
        },
        value: "residential_land",
      },
      {
        label: {
          ar: "أرض تجارية",
          en: "Commercial Land",
          fr: "Terrain Commercial",
        },
        value: "commercial_land",
      },
      {
        label: {
          ar: "أرض زراعية",
          en: "Agricultural Land",
          fr: "Terrain Agricole",
        },
        value: "agricultural_land",
      },
      {
        label: {
          ar: "أرض صناعية",
          en: "Industrial Land",
          fr: "Terrain Industriel",
        },
        value: "industrial_land",
      },
    ],
    shop: [
      {
        label: {
          ar: "محل تجاري",
          en: "Commercial Shop",
          fr: "Boutique Commerciale",
        },
        value: "commercial_shop",
      },
      {
        label: { ar: "محل صغير", en: "Small Shop", fr: "Petite Boutique" },
        value: "small_shop",
      },
      {
        label: { ar: "محل كبير", en: "Large Shop", fr: "Grande Boutique" },
        value: "large_shop",
      },
      {
        label: {
          ar: "محل متعدد الأقسام",
          en: "Department Store",
          fr: "Grand Magasin",
        },
        value: "department_store",
      },
    ],
    fridge: [
      {
        label: {
          ar: "ثلاجة سامسونج",
          en: "Samsung Fridge",
          fr: "Réfrigérateur Samsung",
        },
        value: "samsung_fridge",
      },
      {
        label: { ar: "ثلاجة LG", en: "LG Fridge", fr: "Réfrigérateur LG" },
        value: "lg_fridge",
      },
      {
        label: {
          ar: "ثلاجة هيتاشي",
          en: "Hitachi Fridge",
          fr: "Réfrigérateur Hitachi",
        },
        value: "hitachi_fridge",
      },
      {
        label: {
          ar: "ثلاجة باناسونيك",
          en: "Panasonic Fridge",
          fr: "Réfrigérateur Panasonic",
        },
        value: "panasonic_fridge",
      },
    ],
    washing_machine: [
      {
        label: {
          ar: "غسالة سامسونج",
          en: "Samsung Washing Machine",
          fr: "Lave-linge Samsung",
        },
        value: "samsung_washing_machine",
      },
      {
        label: {
          ar: "غسالة LG",
          en: "LG Washing Machine",
          fr: "Lave-linge LG",
        },
        value: "lg_washing_machine",
      },
      {
        label: {
          ar: "غسالة هيتاشي",
          en: "Hitachi Washing Machine",
          fr: "Lave-linge Hitachi",
        },
        value: "hitachi_washing_machine",
      },
      {
        label: {
          ar: "غسالة باناسونيك",
          en: "Panasonic Washing Machine",
          fr: "Lave-linge Panasonic",
        },
        value: "panasonic_washing_machine",
      },
    ],
    air_conditioner: [
      {
        label: {
          ar: "مكيف سامسونج",
          en: "Samsung AC",
          fr: "Climatiseur Samsung",
        },
        value: "samsung_ac",
      },
      {
        label: { ar: "مكيف LG", en: "LG AC", fr: "Climatiseur LG" },
        value: "lg_ac",
      },
      {
        label: {
          ar: "مكيف هيتاشي",
          en: "Hitachi AC",
          fr: "Climatiseur Hitachi",
        },
        value: "hitachi_ac",
      },
      {
        label: {
          ar: "مكيف باناسونيك",
          en: "Panasonic AC",
          fr: "Climatiseur Panasonic",
        },
        value: "panasonic_ac",
      },
    ],
    oven: [
      {
        label: { ar: "فرن سامسونج", en: "Samsung Oven", fr: "Four Samsung" },
        value: "samsung_oven",
      },
      {
        label: { ar: "فرن LG", en: "LG Oven", fr: "Four LG" },
        value: "lg_oven",
      },
      {
        label: { ar: "فرن هيتاشي", en: "Hitachi Oven", fr: "Four Hitachi" },
        value: "hitachi_oven",
      },
      {
        label: {
          ar: "فرن باناسونيك",
          en: "Panasonic Oven",
          fr: "Four Panasonic",
        },
        value: "panasonic_oven",
      },
    ],
    microwave: [
      {
        label: {
          ar: "مايكروويف سامسونج",
          en: "Samsung Microwave",
          fr: "Micro-ondes Samsung",
        },
        value: "samsung_microwave",
      },
      {
        label: { ar: "مايكروويف LG", en: "LG Microwave", fr: "Micro-ondes LG" },
        value: "lg_microwave",
      },
      {
        label: {
          ar: "مايكروويف هيتاشي",
          en: "Hitachi Microwave",
          fr: "Micro-ondes Hitachi",
        },
        value: "hitachi_microwave",
      },
      {
        label: {
          ar: "مايكروويف باناسونيك",
          en: "Panasonic Microwave",
          fr: "Micro-ondes Panasonic",
        },
        value: "panasonic_microwave",
      },
    ],
  },
} as any;

export const chadCities = [
  {
    label: { ar: "انجمينا", en: "N'Djamena", fr: "N'Djamena" },
    value: "n_djamena",
  },
  { label: { ar: "موندو", en: "Moundou", fr: "Moundou" }, value: "moundou" },
  { label: { ar: "أبشي", en: "Abéché", fr: "Abéché" }, value: "abéché" },
  { label: { ar: "سار", en: "Sarh", fr: "Sarh" }, value: "sarh" },
  {
    label: { ar: "أم التيمان", en: "Am Timane", fr: "Am Timane" },
    value: "am_timane",
  },
  { label: { ar: "بونغور", en: "Bongor", fr: "Bongor" }, value: "bongor" },
  { label: { ar: "كوكسري", en: "Koumra", fr: "Koumra" }, value: "koumra" },
  { label: { ar: "بيرا", en: "Pala", fr: "Pala" }, value: "pala" },
  { label: { ar: "دوما", en: "Doba", fr: "Doba" }, value: "doba" },
  {
    label: { ar: "فايا لارجو", en: "Faya Largeau", fr: "Faya Largeau" },
    value: "faya_largeau",
  },
  {
    label: { ar: "أم جرس", en: "Oum Hadjer", fr: "Oum Hadjer" },
    value: "oum_hadjer",
  },
  { label: { ar: "بيليتن", en: "Bilia", fr: "Bilia" }, value: "bilia" },
  { label: { ar: "أدو", en: "Adoo", fr: "Adoo" }, value: "adoo" },
  { label: { ar: "دغالا", en: "Dogla", fr: "Dogla" }, value: "dogla" },
  { label: { ar: "جويل", en: "Guel", fr: "Guel" }, value: "guel" },
  {
    label: { ar: "موسورو", en: "Moussoro", fr: "Moussoro" },
    value: "moussoro",
  },
  {
    label: { ar: "بطلحا", en: "Batangafo", fr: "Batangafo" },
    value: "batangafo",
  },
  { label: { ar: "موزوغوي", en: "Mozogo", fr: "Mozogo" }, value: "mozogo" },
  { label: { ar: "بيبي", en: "Bebe", fr: "Bebe" }, value: "bebe" },
  { label: { ar: "ماو", en: "Mao", fr: "Mao" }, value: "mao" },
  { label: { ar: "بباوا", en: "Baboua", fr: "Baboua" }, value: "baboua" },
];

// Define the supported languages
type Language = "en" | "ar" | "fr";

// Translation structure
interface Translations {
  seconds: string;
  minute: string;
  minutes: string;
  hour: string;
  hours: string;
  day: string;
  days: string;
  week: string;
  weeks: string;
  month: string;
  months: string;
  year: string;
  years: string;
}

// Function to format time difference as localized text
export const formatTimeAgoLocalized = (
  timestamp: string | number | Date,
  lang: Language = "en"
): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const translations: Record<Language, Translations> = {
    en: {
      seconds: "seconds ago",
      minute: "minute ago",
      minutes: "minutes ago",
      hour: "hour ago",
      hours: "hours ago",
      day: "day ago",
      days: "days ago",
      week: "week ago",
      weeks: "weeks ago",
      month: "month ago",
      months: "months ago",
      year: "year ago",
      years: "years ago",
    },
    ar: {
      seconds: "ثانية مضت",
      minute: "دقيقة مضت",
      minutes: "دقائق مضت",
      hour: "ساعة مضت",
      hours: "ساعات مضت",
      day: "يوم مضى",
      days: "أيام مضت",
      week: "أسبوع مضى",
      weeks: "أسابيع مضت",
      month: "شهر مضى",
      months: "أشهر مضت",
      year: "سنة مضت",
      years: "سنوات مضت",
    },
    fr: {
      seconds: "il y a secondes",
      minute: "il y a une minute",
      minutes: "il y a minutes",
      hour: "il y a une heure",
      hours: "il y a heures",
      day: "il y a un jour",
      days: "il y a jours",
      week: "il y a une semaine",
      weeks: "il y a semaines",
      month: "il y a un mois",
      months: "il y a mois",
      year: "il y a un an",
      years: "il y a ans",
    },
  };

  const t = translations[lang] || translations.en; // Fallback to English

  if (diffInSeconds < 60) {
    return `${diffInSeconds} ${t.seconds}`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes > 1 ? t.minutes : t.minute}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours > 1 ? t.hours : t.hour}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days > 1 ? t.days : t.day}`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks > 1 ? t.weeks : t.week}`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months > 1 ? t.months : t.month}`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} ${years > 1 ? t.years : t.year}`;
  }
};

// Function to format view counts with suffixes
export const formatViews = (views: number, lang: Language = "en"): string => {
  if (views < 0) return "0";

  const thresholds = [
    { value: 1_000_000, suffix: { en: "M", ar: "م", fr: "M" } }, // Million
    { value: 1_000, suffix: { en: "k", ar: "ألف", fr: "k" } }, // Thousand
  ];

  for (const threshold of thresholds) {
    if (views >= threshold.value) {
      const formatted = (views / threshold.value)
        .toFixed(1)
        .replace(/\.0$/, ""); // Remove trailing ".0"
      const suffix = threshold.suffix[lang] || threshold.suffix["en"]; // Default to English
      return `${formatted}${suffix}`;
    }
  }

  return views?.toString(); // Return raw number if below 1k
};

export const languages = [
  {
    label: { ar: "العربية", en: "Arabic", fr: "Arabe" },
    value: "ar",
  },
  {
    label: { ar: "الإنجليزية", en: "English", fr: "Anglais" },
    value: "en",
  },
  {
    label: { ar: "الفرنسية", en: "French", fr: "Français" },
    value: "fr",
  },
];
