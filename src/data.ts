export type Language = 'sq' | 'en';

export interface MenuItem {
  id: string;
  nameSq: string;
  nameEn: string;
  descriptionSq: string;
  descriptionEn: string;
  price: number;
  price40?: number; // Price for 40cm version
  category: 'pizza_klasike' | 'pizza_speciale' | 'calzone' | 'piadina' | 'sandwich' | 'drinks';
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
  emoji: string;
}

export interface CartItem {
  id: string; // unique item instance id
  menuItemId: string;
  nameSq: string;
  nameEn: string;
  price: number;
  quantity: number;
  emoji: string;
  crustType?: 'classic' | 'thick' | 'gluten_free';
  selectedToppings?: { id: string; nameSq: string; nameEn: string; price: number }[];
  size?: '30' | '40';
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  timeSq: string;
  timeEn: string;
  textSq: string;
  textEn: string;
  isLocalGuide?: boolean;
  reviewsCount?: number;
  photosCount?: number;
  foodRating?: number;
}

export const PIZZERIA_INFO = {
  phone: '+355 69 578 8655',
  phoneRaw: '+355695788655',
  address: 'Rruga 3 Deshmoret, Kashar, Albania',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pizzeria+rea+Rruga+3+Deshmoret+Kashar+Albania',
  rating: 4.9,
  reviewsCount: 16,
  hours: {
    open: '11:00',
    close: '23:00',
    timezoneOffset: 2, // Albania is UTC+2 in summer (June)
  }
};

export const TRANSLATIONS = {
  sq: {
    appName: 'Pizzeria rea',
    tagline: 'Shija autentike e furrës me dru në krahët tuaj',
    heroButtonOrder: 'Shiko Menunë 🍕',
    heroButtonCall: 'Na Telefononi 📞',
    heroButtonMaps: 'Hartë & Vendndodhje',
    openStatusOpen: 'Hapur • Mbyllet në orën 21:00', // dynamic update in component
    openStatusClosed: 'Mbyllur • Hapet në 11:00 të mëngjesit',
    taglineSub: 'Të gatuara me dashuri dhe përbërësit më të freskët gjithmonë',
    overview: 'Përmbledhje',
    menu: 'Menuja jonë',
    reviews: 'Vlerësimet',
    about: 'Rreth Nesh',
    popularTimes: 'Koha Popullore',
    reserveTable: 'Rezervo një Tavolinë',
    dineIn: 'Ushqehu në restorant',
    driveThrough: 'Drive-through',
    noContactDelivery: 'Dërgesë direkte me telefon 📞',
    addressLabel: 'Adresa',
    hoursLabel: 'Orari',
    phoneLabel: 'Numri i telefonit',
    popularDishes: 'Pica më të kërkuara',
    allDishes: 'Të Gjitha',
    categoryPizzaKlasike: 'Pica Klasike',
    categoryPizzaSpeciale: 'Pica Speciale',
    categoryCalzone: 'Calzone',
    categoryPiadina: 'Piadina',
    categorySandwich: 'Sandwich',
    categoryDrinks: 'Pije',
    orderTitle: 'Krijuesi i Porosisë',
    orderIntro: 'Zgjidhni picën tuaj të preferuar për të llogaritur çmimin, konfigurojeni me shtesa dhe shtojeni në shportë para se të telefononi për të porositur!',
    toppingsLabel: 'Shtesa të preferuara (Opsionale)',
    extraCheese: 'Djathë shtesë',
    olives: 'Ulli',
    mushrooms: 'Kërpudha',
    prosciutto: 'Proshutë',
    spicySalami: 'Salami Pikant',
    crustType: 'Lloji i brumit',
    crustClassic: 'Klasik (Furë druri)',
    crustThick: 'I trashë (Stil Napoletan)',
    crustGlutenFree: 'Pa gluten (+200 ALL)',
    totalPrice: 'Çmimi Total',
    callToOrderBtn: 'Telefono për të Porositur 📞',
    orderOnWoltBtn: 'Shto në Shportë 🛒',
    addedToppings: 'Shtesat e zgjedhura',
    reviewsSubtitle: 'Çfarë thonë klientët tanë të mrekullueshëm',
    writeReview: 'Shkruaj një vlerësim',
    aboutTitle: 'Historia e Pizzerisë tonë',
    aboutText1: 'E vendosur në zemër të Kasharit në Rrugën 3 Dëshmorët, Pizzeria rea sjell traditën e vërtetë të picave italiane të gatuara në furrë druri directe për komunitetin tonë të dashur.',
    aboutText2: 'Me një vlerësim prej 4.9 yjesh dhe të njohur për brumin tonë të përsosur të fermentuar për 48 orë, ne krenohemi që përdorim vetëm mozzarela të freskët, salcë domatesh cilësore San Marzano dhe përbërës lokalë të Shqipërisë.',
    aboutText3: 'Dine-in, Drive-through ose Dërgesë direkte me telefonata - ne ju mirëpresim gjithmonë me buzëqeshje dhe shërbim miqësor.',
    quickLinks: 'Lidhje të Shpejta',
    contactUs: 'Na Kontaktoni',
    allRightsReserved: 'Të gjitha të drejtat e rezervuara',
    locationKashar: 'Kashar, Shqipëri',
    orderType: 'Lloji i porosisë',
    dineInLabel: 'Dine In',
    takeawayLabel: 'Takeaway',
    deliveryLabel: 'Delivery',
    successReview: 'Faleminderit për vlerësimin tuaj! Ndihmon shumë komunitetin tonë.',
    addReviewTitle: 'Shto Vlerësimin Tënd',
    yourName: 'Emri Juaj',
    comment: 'Komenti Juaj',
    stars: 'Yjet',
    btnSubmit: 'Dërgo Vlerësimin',
    foodLabel: 'Ushqimi',
    serviceLabel: 'Shërbimi',
    atmosphereLabel: 'Atmosfera',
  },
  en: {
    appName: 'Pizzeria rea',
    tagline: 'Authentic wood-fired taste delivered directly to you',
    heroButtonOrder: 'Explore Menu 🍕',
    heroButtonCall: 'Call Us Now 📞',
    heroButtonMaps: 'Map & Location',
    openStatusOpen: 'Open • Closes at 11:00 PM',
    openStatusClosed: 'Closed • Opens at 11:00 AM',
    taglineSub: 'Crafted with passion using the freshest ingredients, always',
    overview: 'Overview',
    menu: 'Our Menu',
    reviews: 'Reviews',
    about: 'About Us',
    popularTimes: 'Popular Times',
    reserveTable: 'Reserve a Table',
    dineIn: 'Dine-in',
    driveThrough: 'Drive-through',
    noContactDelivery: 'Direct call delivery 📞',
    addressLabel: 'Address',
    hoursLabel: 'Hours',
    phoneLabel: 'Phone number',
    popularDishes: 'Popular Pizzas',
    allDishes: 'All Items',
    categoryPizzaKlasike: 'Classic Pizzas',
    categoryPizzaSpeciale: 'Special Pizzas',
    categoryCalzone: 'Calzone',
    categoryPiadina: 'Piadina',
    categorySandwich: 'Sandwiches',
    categoryDrinks: 'Drinks',
    orderTitle: 'Order Builder',
    orderIntro: 'Select your favorite pizza to calculate the price, customize it with toppings, and add it to your cart before calling us to place your order!',
    toppingsLabel: 'Extra Toppings (Optional)',
    extraCheese: 'Extra Cheese',
    olives: 'Black Olives',
    mushrooms: 'Fresh Mushrooms',
    prosciutto: 'Cured Prosciutto',
    spicySalami: 'Spicy Salami',
    crustType: 'Crust Category',
    crustClassic: 'Classic (Wood-fired)',
    crustThick: 'Thick (Neapolitan Style)',
    crustGlutenFree: 'Gluten-Free (+200 ALL)',
    totalPrice: 'Total Price',
    callToOrderBtn: 'Call to Place Order 📞',
    orderOnWoltBtn: 'Add to Cart 🛒',
    addedToppings: 'Selected toppings',
    reviewsSubtitle: 'What our wonderful diners have to say',
    writeReview: 'Write a review',
    aboutTitle: 'The Story of Our Pizzeria',
    aboutText1: 'Located in the heart of Kashar on Rruga 3 Deshmoret, Pizzeria rea brings the real Italian wood-fired pizza tradition straight to our beloved community.',
    aboutText2: 'With a solid 4.9 rating and renowned for our perfect 48-hour slow-fermented dough, we pride ourselves on using only fresh mozzarella, premium San Marzano tomato sauce, and quality local Albanian ingredients.',
    aboutText3: 'Dine-in, Drive-through, or contactless delivery - we always greet you with a genuine smile and friendly, hospitable service.',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    allRightsReserved: 'All rights reserved',
    locationKashar: 'Kashar, Albania',
    orderType: 'Order type',
    dineInLabel: 'Dine In',
    takeawayLabel: 'Takeaway',
    deliveryLabel: 'Delivery',
    successReview: 'Thank you for your rating! It helps our community grow.',
    addReviewTitle: 'Add Your Review',
    yourName: 'Your Name',
    comment: 'Your Review',
    stars: 'Stars',
    btnSubmit: 'Submit Review',
    foodLabel: 'Food',
    serviceLabel: 'Service',
    atmosphereLabel: 'Atmosphere',
  }
};

export const MENU_ITEMS: MenuItem[] = [
  // === PIZZA KLASIKE ===
  {
    id: 'pizza-margarita',
    nameSq: 'Pizza Margarita',
    nameEn: 'Pizza Margherita',
    descriptionSq: 'Salce, mozzarela, borzilok i freskët, vaj ulliri.',
    descriptionEn: 'Tomato sauce, mozzarella, fresh basil, olive oil.',
    price: 350,
    price40: 550,
    category: 'pizza_klasike',
    popular: true,
    emoji: '🍕'
  },
  {
    id: 'pizza-proshut',
    nameSq: 'Pizza Proshut',
    nameEn: 'Pizza Ham',
    descriptionSq: 'Salce, mozzarela, proshut',
    descriptionEn: 'Tomato sauce, mozzarella, ham',
    price: 400,
    price40: 650,
    category: 'pizza_klasike',
    emoji: '🍕'
  },
  {
    id: 'pizza-sallam',
    nameSq: 'Pizza Sallam',
    nameEn: 'Pizza Salami',
    descriptionSq: 'Salce, mozzarela, sallam',
    descriptionEn: 'Tomato sauce, mozzarella, salami',
    price: 400,
    price40: 650,
    category: 'pizza_klasike',
    emoji: '🍕'
  },
  {
    id: 'pizza-kerpudhe',
    nameSq: 'Pizza Kerpudhe',
    nameEn: 'Pizza Mushroom',
    descriptionSq: 'Salce, mozzarela, kerpudhe',
    descriptionEn: 'Tomato sauce, mozzarella, fresh mushrooms',
    price: 400,
    price40: 650,
    category: 'pizza_klasike',
    emoji: '🍄'
  },
  {
    id: 'pizza-pikante',
    nameSq: 'Pizza Pikante',
    nameEn: 'Pizza Spicy',
    descriptionSq: 'Salce, mozzarela, sallam Pikant',
    descriptionEn: 'Tomato sauce, mozzarella, spicy Italian salami',
    price: 450,
    price40: 700,
    category: 'pizza_klasike',
    spicy: true,
    emoji: '🔥'
  },
  {
    id: 'pizza-proshut-sallam',
    nameSq: 'Pizza Proshut & Sallam',
    nameEn: 'Pizza Ham & Salami',
    descriptionSq: 'Salce, mozzarela, proshut, sallam',
    descriptionEn: 'Tomato sauce, mozzarella, ham, salami',
    price: 450,
    price40: 700,
    category: 'pizza_klasike',
    emoji: '🍕'
  },
  {
    id: 'pizza-proshut-kerpudhe',
    nameSq: 'Pizza Proshut & Kerpudhe',
    nameEn: 'Pizza Prosciutto & Mushroom',
    descriptionSq: 'Salce, mozzarela, proshut, kerpudhe',
    descriptionEn: 'Tomato sauce, mozzarella, ham, fresh mushrooms',
    price: 450,
    price40: 700,
    category: 'pizza_klasike',
    emoji: '🍄'
  },
  {
    id: 'pizza-pikante-kerpudhe',
    nameSq: 'Pizza Pikante & Kerpudhe',
    nameEn: 'Pizza Spicy & Mushroom',
    descriptionSq: 'Salce, mozzarela, sallam pikant, kerpudha',
    descriptionEn: 'Tomato sauce, mozzarella, spicy salami, mushrooms',
    price: 500,
    price40: 750,
    category: 'pizza_klasike',
    spicy: true,
    emoji: '🔥'
  },
  {
    id: 'pizza-kapricoza',
    nameSq: 'Pizza Kapricoza',
    nameEn: 'Pizza Capricciosa',
    descriptionSq: 'Salce, mozzarela, proshut, kerpudhe, speca, ullinj',
    descriptionEn: 'Tomato sauce, mozzarella, ham, mushrooms, peppers, olives',
    price: 500,
    price40: 750,
    category: 'pizza_klasike',
    popular: true,
    emoji: '🍕'
  },
  {
    id: 'pizza-fshati',
    nameSq: 'Pizza Fshati',
    nameEn: 'Pizza Village',
    descriptionSq: 'Salce, mozzarela, kerpudha, speca, domate, ullinj, Qepe, djath I Bardhe',
    descriptionEn: 'Tomato sauce, mozzarella, mushrooms, peppers, tomatoes, olives, onions, white cheese',
    price: 500,
    price40: 750,
    category: 'pizza_klasike',
    emoji: '🏡'
  },
  {
    id: 'pizza-vegetariane',
    nameSq: 'Pizza Vegetariane',
    nameEn: 'Vegetarian Pizza',
    descriptionSq: 'Salce, mozzarela, kerpudh, kungull, patellxhan, Speca, ullinj, pomodorini',
    descriptionEn: 'Tomato sauce, mozzarella, mushrooms, zucchini, eggplant, peppers, olives, cherry tomatoes',
    price: 500,
    price40: 750,
    category: 'pizza_klasike',
    vegetarian: true,
    emoji: '🥬'
  },
  {
    id: 'pizza-4-stinet',
    nameSq: 'Pizza 4 Stinet',
    nameEn: 'Pizza 4 Seasons',
    descriptionSq: 'Salc, mozzarela, proshut, sallam Pikant, kerpudh, ton',
    descriptionEn: 'Tomato sauce, mozzarella, ham, spicy salami, mushrooms, tuna',
    price: 500,
    price40: 750,
    category: 'pizza_klasike',
    emoji: '🍀'
  },
  {
    id: 'pizza-4-djathrat-klasike',
    nameSq: 'Pizza 4 Djathrat',
    nameEn: 'Pizza 4 Cheeses',
    descriptionSq: 'Mozzarela, gorgonzola, emental, parmigiano',
    descriptionEn: 'Mozzarella, gorgonzola, emmental, parmigiano',
    price: 500,
    price40: 750,
    category: 'pizza_klasike',
    emoji: '🧀'
  },
  {
    id: 'pizza-ton',
    nameSq: 'Pizza Ton',
    nameEn: 'Tuna Pizza',
    descriptionSq: 'Salce, mozzarela, ton, qepe, ullinj',
    descriptionEn: 'Tomato sauce, mozzarella, tuna, onions, olives',
    price: 500,
    price40: 750,
    category: 'pizza_klasike',
    emoji: '🐟'
  },
  {
    id: 'pizza-ton-kerpudhe',
    nameSq: 'Pizza Ton & Kerpudhe',
    nameEn: 'Tuna & Mushroom Pizza',
    descriptionSq: 'Salce, mozzarela, ton, kerpudhe',
    descriptionEn: 'Tomato sauce, mozzarella, tuna, fresh mushrooms',
    price: 550,
    price40: 800,
    category: 'pizza_klasike',
    emoji: '🐟'
  },

  // === PIZZA SPECIALE ===
  {
    id: 'pizza-napoli',
    nameSq: 'Pizza Napoli',
    nameEn: 'Pizza Napoli',
    descriptionSq: 'Salce, mozzarela, acuge, kaperi, ullinj',
    descriptionEn: 'Tomato sauce, mozzarella, anchovies, capers, olives',
    price: 450,
    price40: 700,
    category: 'pizza_speciale',
    emoji: '🛶'
  },
  {
    id: 'pizza-primavera',
    nameSq: 'Pizza Primavera',
    nameEn: 'Pizza Primavera',
    descriptionSq: 'Salce, mozzarela, rukola, pomodorini, parmigiano',
    descriptionEn: 'Tomato sauce, mozzarella, baby arugula, cherry tomatoes, parmigiano',
    price: 550,
    price40: 800,
    category: 'pizza_speciale',
    popular: true,
    emoji: '🌿'
  },
  {
    id: 'pizza-americana',
    nameSq: 'Pizza Americana',
    nameEn: 'Pizza Americana',
    descriptionSq: 'Salce, mozzarela, salcice, patate',
    descriptionEn: 'Tomato sauce, mozzarella, sausage, loaded fries',
    price: 500,
    price40: 750,
    category: 'pizza_speciale',
    emoji: '🍟'
  },
  {
    id: 'pizza-la-krema',
    nameSq: 'Pizza La Krema',
    nameEn: 'Pizza La Krema',
    descriptionSq: 'Pana, mozzarela, suxhuk, kerpudha',
    descriptionEn: 'Cream, mozzarella, sausage, mushrooms',
    price: 500,
    price40: 800,
    category: 'pizza_speciale',
    emoji: '🥛'
  },
  {
    id: 'pizza-mexicana',
    nameSq: 'Pizza Mexicana',
    nameEn: 'Pizza Mexicana',
    descriptionSq: 'Salce, mozzarela, sallam pikant, fileto pule, miser, qepe',
    descriptionEn: 'Tomato sauce, mozzarella, spicy salami, chicken breast, sweet corn, onions',
    price: 550,
    price40: 800,
    category: 'pizza_speciale',
    spicy: true,
    emoji: '🇲🇽'
  },
  {
    id: 'pizza-proshut-philadelphia',
    nameSq: 'Pizza Proshut & Philadelphia',
    nameEn: 'Pizza Ham & Philadelphia',
    descriptionSq: 'Salce, mozzarela, proshut, philadelphia',
    descriptionEn: 'Tomato sauce, mozzarella, prosciutto, philadelphia cream cheese',
    price: 550,
    price40: 800,
    category: 'pizza_speciale',
    emoji: '🥯'
  },
  {
    id: 'pizza-crudo',
    nameSq: 'Pizza Crudo',
    nameEn: 'Pizza Crudo',
    descriptionSq: 'Salce, mozzarela, proshut crudo',
    descriptionEn: 'Tomato sauce, mozzarella, premium prosciutto crudo',
    price: 550,
    price40: 800,
    category: 'pizza_speciale',
    emoji: '🥩'
  },
  {
    id: 'pizza-speciale-hark',
    nameSq: 'Pizza Speciale',
    nameEn: 'Special Pizza',
    descriptionSq: 'Mozzarela, suxhuk, speca, qepe, pomodorini, philadelphia',
    descriptionEn: 'Mozzarella, sausage, peppers, onions, cherry tomatoes, philadelphia',
    price: 600,
    price40: 850,
    category: 'pizza_speciale',
    popular: true,
    emoji: '👑'
  },
  {
    id: 'pizza-chicken-truffle',
    nameSq: 'Chicken Pizza',
    nameEn: 'Chicken Pizza',
    descriptionSq: 'Pana, tartuf, mozzarela, fileto pule, kerpudha',
    descriptionEn: 'Cream, truffle paste, mozzarella, chicken breast, mushrooms',
    price: 600,
    price40: 850,
    category: 'pizza_speciale',
    emoji: '🍗'
  },
  {
    id: 'pizza-pikante-straciatella',
    nameSq: 'Pizza Pikante & Straciatella',
    nameEn: 'Pizza Spicy & Straciatella',
    descriptionSq: 'Salce, mozzarela, sallam pikant, straciatella',
    descriptionEn: 'Tomato sauce, mozzarella, spicy salami, creamy straciatella cheese',
    price: 650,
    price40: 900,
    category: 'pizza_speciale',
    spicy: true,
    emoji: '🌶️'
  },
  {
    id: 'pizza-crudo-straciatella',
    nameSq: 'Pizza Crudo & Straciatella',
    nameEn: 'Pizza Crudo & Straciatella',
    descriptionSq: 'Salce, mozzarela, proshut crudo, straciatella',
    descriptionEn: 'Tomato sauce, mozzarella, prosciutto crudo, creamy straciatella cheese',
    price: 650,
    price40: 900,
    category: 'pizza_speciale',
    emoji: '🧀'
  },

  // === CALZONE ===
  {
    id: 'calzone-normale',
    nameSq: 'Calzone Normale',
    nameEn: 'Calzone Normal',
    descriptionSq: 'Salce, mozzarela, proshute, sallam',
    descriptionEn: 'Tomato sauce, mozzarella, ham, salami',
    price: 300,
    category: 'calzone',
    emoji: '🥟'
  },
  {
    id: 'calzone-4-djathrat',
    nameSq: 'Calzone 4 Djathrat',
    nameEn: 'Calzone 4 Cheeses',
    descriptionSq: 'Salce, mozzarela, gorgonzola, parmigiano',
    descriptionEn: 'Tomato sauce, mozzarella, gorgonzola, parmigiano',
    price: 300,
    category: 'calzone',
    emoji: '🧀'
  },
  {
    id: 'calzone-kapricioza',
    nameSq: 'Calzone Kapricioza',
    nameEn: 'Calzone Capricciosa',
    descriptionSq: 'Salce, mozzarela, proshut, kerpudhe, speca, ullinj',
    descriptionEn: 'Tomato sauce, mozzarella, ham, mushrooms, peppers, olives',
    price: 350,
    category: 'calzone',
    popular: true,
    emoji: '🥟'
  },

  // === PIADINA ===
  {
    id: 'piadina-romagnola',
    nameSq: 'Piadina Romagnola',
    nameEn: 'Piadina Romagnola',
    descriptionSq: 'Rukola, crudo, pomodorini, straciatella, aceto balsamike',
    descriptionEn: 'Arugula, prosciutto crudo, cherry tomatoes, straciatella, balsamic vinegar',
    price: 300,
    category: 'piadina',
    emoji: '🌮'
  },
  {
    id: 'piadina-cesar',
    nameSq: 'Piadina Cesar',
    nameEn: 'Piadina Cesar',
    descriptionSq: 'Sallate jeshile, fileto pule, miser, parmigiano, salce cesar',
    descriptionEn: 'Green salad, chicken breast, corn, parmigiano, caesar sauce',
    price: 300,
    category: 'piadina',
    emoji: '🌯'
  },
  {
    id: 'piadina-gustosa',
    nameSq: 'Piadina Gustosa',
    nameEn: 'Piadina Gustosa',
    descriptionSq: 'Mozzrela, proshut, sallam pikant, gorgonzola, sallate jeshile, domate',
    descriptionEn: 'Mozzarella, ham, spicy salami, gorgonzola, green salad, tomatoes',
    price: 300,
    category: 'piadina',
    emoji: '🌯'
  },
  {
    id: 'piadina-mamma-mia',
    nameSq: 'Piadina Mamma Mia',
    nameEn: 'Piadina Mamma Mia',
    descriptionSq: 'Mozzarela, fileto pule, veze, patate, sallate jeshile, domate, salce cesar',
    descriptionEn: 'Mozzarella, chicken breast, boiled egg, potatoes, green salad, tomatoes, caesar sauce',
    price: 350,
    category: 'piadina',
    emoji: '🌮'
  },

  // === SANDWICH ===
  {
    id: 'sandwich-normal',
    nameSq: 'Sandwich Normal',
    nameEn: 'Normal Sandwich',
    descriptionSq: 'Majonez, sallam, proshut, domate, kastravec, ullinj, mozzarela',
    descriptionEn: 'Mayonnaise, salami, ham, tomatoes, cucumber, olives, mozzarella',
    price: 150,
    category: 'sandwich',
    emoji: '🥪'
  },
  {
    id: 'sandwich-fshati',
    nameSq: 'Sandwich Fshati',
    nameEn: 'Village Sandwich',
    descriptionSq: 'Majonez, domate, kastravec, ullinj, kungull, patellxhan, speca, mozzarela',
    descriptionEn: 'Mayonnaise, tomatoes, cucumber, olives, zucchini, eggplant, peppers, mozzarella',
    price: 150,
    category: 'sandwich',
    emoji: '🥪'
  },
  {
    id: 'sandwich-prosh-kerp',
    nameSq: 'Sandwich Proshte & Kerpudhe',
    nameEn: 'Ham & Mushroom Sandwich',
    descriptionSq: 'Majonez, proshut, kerpudh, domate, kastravec, ullinj, mozzarela',
    descriptionEn: 'Mayonnaise, ham, mushrooms, tomatoes, cucumber, olives, mozzarella',
    price: 200,
    category: 'sandwich',
    emoji: '🥪'
  },
  {
    id: 'sandwich-4-djathrat',
    nameSq: 'Sandwich 4 Djathrat',
    nameEn: '4 Cheeses Sandwich',
    descriptionSq: 'Majonez, mozzarela, gorgonzola, emental, parmigiano, domate, kastravec, ullinj',
    descriptionEn: 'Mayonnaise, mozzarella, gorgonzola, emmental, parmigiano, tomatoes, cucumber, olives',
    price: 200,
    category: 'sandwich',
    emoji: '🥪'
  },
  {
    id: 'sandwich-pikant',
    nameSq: 'Sandwich Pikant',
    nameEn: 'Spicy Sandwich',
    descriptionSq: 'Majonez, sallam pikant, domate, kastravec, ullinj, mozzarela',
    descriptionEn: 'Mayonnaise, spicy salami, tomatoes, cucumber, olives, mozzarella',
    price: 200,
    category: 'sandwich',
    spicy: true,
    emoji: '🥪'
  },
  {
    id: 'sandwich-tonno',
    nameSq: 'Sandwich Tonno',
    nameEn: 'Tuna Sandwich',
    descriptionSq: 'Majonez, tonno, domate, kastravec, ullinj, mozzarela',
    descriptionEn: 'Mayonnaise, tuna, tomatoes, cucumber, olives, mozzarella',
    price: 200,
    category: 'sandwich',
    emoji: '🥪'
  },
  {
    id: 'sandwich-special',
    nameSq: 'Sandwich Special',
    nameEn: 'Special Sandwich',
    descriptionSq: 'Majonez, mozzrela, rukola, pomodorini, proshute krudo, parmigiano',
    descriptionEn: 'Mayonnaise, mozzarella, arugula, cherry tomatoes, prosciutto crudo, parmigiano',
    price: 250,
    category: 'sandwich',
    popular: true,
    emoji: '🥪'
  },
  {
    id: 'sandwich-mix',
    nameSq: 'Sandwich Mix',
    nameEn: 'Mix Sandwich',
    descriptionSq: 'Majonez, proshut, sallam, kerpudha, ton, speca, domate, kastravec, ullinj',
    descriptionEn: 'Mayonnaise, ham, salami, mushrooms, tuna, peppers, tomatoes, cucumber, olives',
    price: 250,
    category: 'sandwich',
    emoji: '🥪'
  },
  {
    id: 'sandwich-chicken',
    nameSq: 'Sandwich Chicken',
    nameEn: 'Chicken Sandwich',
    descriptionSq: 'Majonez, mozzarela, fileto pule, patante, domate, sallate jeshile',
    descriptionEn: 'Mayonnaise, mozzarella, chicken breast, potatoes, tomatoes, lettuce',
    price: 250,
    category: 'sandwich',
    emoji: '🥪'
  },

  // === PIJET ===
  {
    id: 'pije-uje',
    nameSq: 'Ujë',
    nameEn: 'Water',
    descriptionSq: 'Ujë i freskët natyral',
    descriptionEn: 'Chilled natural mineral water',
    price: 60,
    category: 'drinks',
    emoji: '🥤'
  },
  {
    id: 'pije-dhalle',
    nameSq: 'Dhallë',
    nameEn: 'Dhalle',
    descriptionSq: 'Dhallë e freskët shtëpie',
    descriptionEn: 'Fresh traditional ayran salad drink',
    price: 70,
    category: 'drinks',
    emoji: '🥛'
  },
  {
    id: 'pije-cocacola',
    nameSq: 'Coca Cola',
    nameEn: 'Coca Cola',
    descriptionSq: 'Pije freskuese gazuar',
    descriptionEn: 'Classic soda soft drink',
    price: 120,
    category: 'drinks',
    emoji: '🥤'
  },
  {
    id: 'pije-fanta',
    nameSq: 'Fanta',
    nameEn: 'Fanta',
    descriptionSq: 'Pije freskuese me shije portokalli',
    descriptionEn: 'Carbonated orange soda drink',
    price: 120,
    category: 'drinks',
    emoji: '🥤'
  },
  {
    id: 'pije-amita',
    nameSq: 'Amita',
    nameEn: 'Amita Juice',
    descriptionSq: 'Lëng frutash i paketuar',
    descriptionEn: 'Assorted fruit juice flavor carton',
    price: 120,
    category: 'drinks',
    emoji: '🧃'
  },
  {
    id: 'pije-bravo',
    nameSq: 'Bravo',
    nameEn: 'Bravo Juice',
    descriptionSq: 'Lëng frutash i shijshëm',
    descriptionEn: 'Bravo premium fruit juice drink',
    price: 150,
    category: 'drinks',
    emoji: '🧃'
  },
  {
    id: 'pije-peroni',
    nameSq: 'Peroni',
    nameEn: 'Peroni Beer',
    descriptionSq: 'Birrë Italiane e ftohtë',
    descriptionEn: 'Premium chilled Italian lager beer',
    price: 150,
    category: 'drinks',
    emoji: '🍺'
  },
  {
    id: 'pije-peja',
    nameSq: 'Peja',
    nameEn: 'Peja Beer',
    descriptionSq: 'Birrë vendase tradicionale',
    descriptionEn: 'Traditional crispy local beer',
    price: 150,
    category: 'drinks',
    emoji: '🍺'
  },
  {
    id: 'pije-amstel',
    nameSq: 'Amstel',
    nameEn: 'Amstel Beer',
    descriptionSq: 'Birrë premium e importuar',
    descriptionEn: 'Premium imported lager beer',
    price: 180,
    category: 'drinks',
    emoji: '🍺'
  },
  {
    id: 'pije-heineken',
    nameSq: 'Heineken',
    nameEn: 'Heineken Beer',
    descriptionSq: 'Birrë globale e cilësisë së lartë',
    descriptionEn: 'Chilled premium Heineken imported beer',
    price: 200,
    category: 'drinks',
    emoji: '🍺'
  }
];

export const GENUINE_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Asel Sarybaeva',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    rating: 5,
    timeSq: 'Një vit më parë',
    timeEn: 'A year ago',
    textSq: 'Pica dhe calzone jashtëzakonisht të mira, brumi është i përsosur 😍 Shërbim shumë i mirë dhe jashtëzakonisht miqësor.',
    textEn: 'Very good pizza and calzone, the dough is perfect 😍 Very kind and nice service',
    isLocalGuide: true,
    reviewsCount: 63,
    photosCount: 1460,
    foodRating: 5
  },
  {
    id: 'rev-2',
    author: 'Anesti Sufja',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    rating: 5,
    timeSq: '9 muaj më parë',
    timeEn: '9 months ago',
    textSq: 'Ushqim i mirë, shërbim i mrekullueshëm, dhe njerëz shumë të këndshëm e mikpritës!',
    textEn: 'Good food, good service, and nice people!',
    isLocalGuide: false,
    reviewsCount: 1,
    photosCount: 2,
    foodRating: 5
  },
  {
    id: 'rev-3',
    author: 'Diana Aliabieva',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    rating: 5,
    timeSq: '11 muaj më parë',
    timeEn: '11 months ago',
    textSq: 'Kjo ishte vërtet e shijshme. Vend i këndshëm dhe pica të gatuara shkëlqyeshëm. Lloji i porosisë: Dine in.',
    textEn: 'That was tasty. Authentic vibes and perfectly baked. Order type: Dine in.',
    isLocalGuide: true,
    reviewsCount: 15,
    photosCount: 58,
    foodRating: 5
  },
  {
    id: 'rev-4',
    author: 'Erion Hoxha',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    rating: 5,
    timeSq: '3 muaj më parë',
    timeEn: '3 months ago',
    textSq: 'Brinja më e mirë e picës në Kashar. Brumi është i lehtë dhe i pjekur mirë në furrë druri. Shija e përbërësve është unike dhe personeli shumë i edukuar.',
    textEn: 'The best pizza crust in Kashar. Extremely light slow-fermented dough baked in a proper wood oven. Friendly staff!',
    isLocalGuide: false,
    reviewsCount: 12,
    photosCount: 8,
    foodRating: 5
  }
];

export const HOURLY_POPULARITY = [
  { hour: '11:00', value: 20 },
  { hour: '12:00', value: 55 },
  { hour: '13:00', value: 75 },
  { hour: '14:00', value: 45 },
  { hour: '15:00', value: 30 },
  { hour: '16:00', value: 35 },
  { hour: '17:00', value: 50 },
  { hour: '18:00', value: 70 },
  { hour: '19:00', value: 95 },
  { hour: '20:00', value: 100 },
  { hour: '21:00', value: 85 },
  { hour: '22:00', value: 40 },
  { hour: '23:00', value: 10 }
];
