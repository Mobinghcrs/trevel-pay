import {
  Flight, Hotel, Car, Driver, UserProfile, Wallet, CryptoCurrency, PhysicalCurrency, P2POffer, P2POrder,
  CashDeliveryRequest, AdminUser, RevenueDataPoint, P2PVolume, TopCurrency, RevenueSettings, Room, Store, Product, ShoppingCategory, Order, ProductOrder, BankTransferOrder, BankRecipientDetails, ShippingAddress, CarBooking, FlightOrder, Passenger, PromoSlide, Agent, AgentTransaction, FinancialAccount, JournalEntry, LedgerEntry, FinancialSummary, VirtualCard, Transaction, PaymentRequest, Merchant, HotelGuest, HotelBookingOrder, UserTransferOrder, RideOption, TaxiOrder, ESimPlan, ESimOrder, Tour, TourBookingOrder, InvestableAsset, InvestmentOrder, TopUpOrder, Deal, DealOrder, InternetPackage, InternetPackageOrder, GiftCard, GiftCardOrder, Stay, StayBookingOrder, Country, City, Airport
} from '../types';
import { ICONS, COMMON_CRYPTO_CURRENCIES, COMMON_FIAT_CURRENCIES } from '../constants';

// --- IN-MEMORY DATABASE ---

let flights: Flight[] = [
    {
        id: 'fl-1', flightNumber: 'SA001', airline: 'Super Airways', type: 'Systemic',
        origin: { code: 'JFK', city: 'New York' }, destination: { code: 'LHR', city: 'London' },
        departureTime: new Date(Date.now() + 2 * 3600000).toISOString(), arrivalTime: new Date(Date.now() + 10 * 3600000).toISOString(),
        duration: '8h 00m', price: 450.75,
    },
    {
        id: 'fl-2', flightNumber: 'CF002', airline: 'Concept Flights', type: 'Charter',
        origin: { code: 'JFK', city: 'New York' }, destination: { code: 'LHR', city: 'London' },
        departureTime: new Date(Date.now() + 4 * 3600000).toISOString(), arrivalTime: new Date(Date.now() + 12 * 3600000).toISOString(),
        duration: '8h 00m', price: 510.50,
    },
    {
        id: 'fl-3', flightNumber: 'TP123', airline: 'Tehran Pars', type: 'Systemic',
        origin: { code: 'IKA', city: 'Tehran' }, destination: { code: 'CDG', city: 'Paris' },
        departureTime: new Date(Date.now() + 6 * 3600000).toISOString(), arrivalTime: new Date(Date.now() + 12.5 * 3600000).toISOString(),
        duration: '6h 30m', price: 620.00,
    },
];

// --- USER DATA REWORK FOR ROLES ---
let currentUserEmail: string | null = null;

const users: { profile: UserProfile, role: 'user' | 'agent' | 'merchant', password?: string }[] = [
    {
        profile: {
            userId: '@janedoe',
            name: 'Jane Doe',
            email: 'user@example.com',
            memberSince: '2023-01-15T10:00:00Z',
            avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
            wallets: [
              { type: 'Fiat', name: 'US Dollar', currency: 'USD', balance: 10000.00 },
              { type: 'Fiat', name: 'Euro', currency: 'EUR', balance: 2500.00 },
              { type: 'Crypto', name: 'Bitcoin', currency: 'BTC', balance: 0.05 },
              { type: 'Fiat', name: 'Iranian Rial', currency: 'IRR', balance: 10000000 },
            ],
            investments: [
                { assetSymbol: 'BTC', amount: 0.05, avgCostBasis: 50000 },
                { assetSymbol: 'ETH', amount: 0.5, avgCostBasis: 3000 },
            ],
        },
        role: 'user',
        password: 'password'
    },
    {
        profile: {
            userId: '@globalexchange',
            name: 'Global Exchange',
            email: 'agent@example.com',
            memberSince: '2022-03-01T09:00:00Z',
            avatarUrl: 'https://i.pravatar.cc/150?u=agent',
            wallets: [
              { type: 'Fiat', name: 'USD Float', currency: 'USD', balance: 500000.00 },
              { type: 'Fiat', name: 'EUR Float', currency: 'EUR', balance: 750000.00 },
              { type: 'Crypto', name: 'USDT Float', currency: 'USDT', balance: 1000000.00 },
            ],
            investments: [],
        },
        role: 'agent',
        password: 'password'
    },
    {
        profile: {
            userId: '@superstore',
            name: 'Super Store',
            email: 'merchant@example.com',
            memberSince: '2023-01-01T09:00:00Z',
            avatarUrl: 'https://i.pravatar.cc/150?u=merchant',
            wallets: [
              { type: 'Fiat', name: 'USD Sales', currency: 'USD', balance: 12345.67 },
            ],
            investments: [],
        },
        role: 'merchant',
        password: 'password'
    }
];


let userProfile = users.find(u => u.role === 'user')?.profile!; // For legacy functions

let p2pOrders: P2POrder[] = [];
let productOrders: ProductOrder[] = [];
let bankTransferOrders: BankTransferOrder[] = [];
let flightOrders: FlightOrder[] = [];
let hotelBookingOrders: HotelBookingOrder[] = [];
let stayBookingOrders: StayBookingOrder[] = [];
let userTransferOrders: UserTransferOrder[] = [];
let taxiOrders: TaxiOrder[] = [];
let esimOrders: ESimOrder[] = [];
let tourBookingOrders: TourBookingOrder[] = [];
let investmentOrders: InvestmentOrder[] = [];
let topUpOrders: TopUpOrder[] = [];
let dealOrders: DealOrder[] = [];
let internetPackageOrders: InternetPackageOrder[] = [];
let giftCardOrders: GiftCardOrder[] = [];
let agentTransactions: AgentTransaction[] = [];
let transactions: Transaction[] = [];
let paymentRequests: PaymentRequest[] = [];


let cashDeliveryRequests: CashDeliveryRequest[] = [
    {
        id: 'req-12345',
        user: 'Jane Doe',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        currency: 'EUR',
        amount: '500',
        country: 'France',
        city: 'Paris',
        address: '123 Champs-Élysées',
        contact: '+33 1 23 45 67 89',
        status: 'Approved',
    },
    {
        id: 'req-67890',
        user: 'Jane Doe',
        timestamp: new Date().toISOString(),
        currency: 'JPY',
        amount: '50000',
        country: 'Japan',
        city: 'Tokyo',
        address: '456 Shibuya Crossing',
        contact: '+81 3-1234-5678',
        status: 'Pending',
    }
];

const cars: Car[] = [
    {
      id: 'car-1', name: 'Peugeot 207', brand: 'Peugeot',
      imageUrl: 'https://s100.saadatrent.com/sites/default/files/styles/750_450/public/images/present/peugeot207.png',
      pricePerDay: 45, type: 'Economy', seats: 5, transmission: 'Automatic', fuel: 'Gasoline',
      features: ['Bluetooth', 'Air Conditioning', 'Parking Sensors', 'USB Port'],
    },
    {
      id: 'car-2', name: 'Cerato', brand: 'Kia',
      imageUrl: 'https://s100.saadatrent.com/sites/default/files/styles/750_450/public/images/present/cerato-white.png',
      pricePerDay: 70, type: 'SUV', seats: 5, transmission: 'Automatic', fuel: 'Gasoline',
      features: ['Sunroof', 'Leather Seats', 'Rear Camera', 'Apple CarPlay'],
    },
    {
      id: 'car-3', name: 'Tucson', brand: 'Hyundai',
      imageUrl: 'https://s100.saadatrent.com/sites/default/files/styles/750_450/public/images/present/tucson-2018.png',
      pricePerDay: 85, type: 'SUV', seats: 5, transmission: 'Automatic', fuel: 'Gasoline',
      features: ['Panoramic Roof', 'Heated Seats', 'GPS Navigation', 'Blind Spot Detection'],
    },
];

const hotels: Hotel[] = [
    { id: 'hotel-1', name: `Grand Hotel Paris`, rating: 4.5, description: 'A luxurious hotel in the heart of Paris.', amenities: ['Pool', 'WiFi', 'Spa'], pricePerNight: 250, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800', rooms: [ { id: 'room-1a', name: 'Deluxe King', price: 250, beds: 1, capacity: 2 }] },
    { id: 'hotel-2', name: `Cozy Inn Tehran`, rating: 4.0, description: 'A charming inn.', amenities: ['WiFi', 'Breakfast'], pricePerNight: 120, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800', rooms: [ { id: 'room-2a', name: 'Standard Double', price: 120, beds: 2, capacity: 2 } ] }
];

const stays: Stay[] = [
    {
        id: 'stay-1', name: 'Modern Mountain Villa', type: 'Villa', location: 'Tehran', rating: 4.9,
        description: 'A stunning modern villa with panoramic views of the Alborz mountains. Features a private indoor pool and a large terrace.',
        amenities: ['Private Pool', 'WiFi', 'Full Kitchen', 'Mountain View', 'Free Parking', 'Smart TV'],
        pricePerNight: 450,
        images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800', 'https://images.unsplash.com/photo-1613977257522-6b9b33a5a3a7?q=80&w=800']
    },
    {
        id: 'stay-2', name: 'Chic Parisian Apartment', type: 'Apartment', location: 'Paris', rating: 4.7,
        description: 'Experience Paris like a local in this beautifully decorated apartment in the Le Marais district, steps away from Place des Vosges.',
        amenities: ['WiFi', 'Kitchenette', 'Nespresso Machine', 'City View', 'Air Conditioning'],
        pricePerNight: 220,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800']
    }
];

const tours: Tour[] = [
    {
        id: 'tour-1',
        name: 'Historic Tehran: Palaces and Bazaars',
        destination: 'Tehran',
        description: 'Explore the rich history of Iran\'s capital with a full-day tour of Golestan Palace, the National Museum, and the vibrant Grand Bazaar. Lunch at a traditional restaurant is included.',
        pricePerPerson: 75,
        duration: '8 hours',
        rating: 4.8,
        images: ['https://images.unsplash.com/photo-1599421497992-93220a52741b?q=80&w=800', 'https://images.unsplash.com/photo-1579726257213-2023075bf92a?q=80&w=800', 'https://images.unsplash.com/photo-1600262134293-24836a227129?q=80&w=800'],
        itinerary: [
            { time: '09:00', activity: 'Hotel Pickup' },
            { time: '10:00', activity: 'Visit Golestan Palace (UNESCO World Heritage Site)' },
            { time: '12:30', activity: 'Lunch at a traditional local restaurant' },
            { time: '14:00', activity: 'Explore the National Museum of Iran' },
            { time: '16:00', activity: 'Wander through the Grand Bazaar' },
            { time: '18:00', activity: 'Return to hotel' },
        ],
        inclusions: ['Professional guide', 'Air-conditioned vehicle', 'Lunch', 'Entrance fees'],
        exclusions: ['Gratuities', 'Personal expenses'],
    },
    {
        id: 'tour-2',
        name: 'Paris Eiffel Tower Summit & Seine River Cruise',
        destination: 'Paris',
        description: 'Experience the best of Paris with skip-the-line access to the Eiffel Tower summit, followed by a relaxing 1-hour cruise along the Seine River to see iconic landmarks.',
        pricePerPerson: 120,
        duration: '4 hours',
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760c0341?q=80&w=800', 'https://images.unsplash.com/photo-1550345332-0973a8f730A2?q=80&w=800', 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=800'],
        itinerary: [
            { time: '14:00', activity: 'Meet at the designated point near Eiffel Tower' },
            { time: '14:15', activity: 'Ascend to the Eiffel Tower summit with skip-the-line access' },
            { time: '16:00', activity: 'Board the Seine River cruise' },
            { time: '17:00', activity: 'See Notre Dame, Louvre Museum, and more from the water' },
            { time: '18:00', activity: 'Tour concludes at the dock' },
        ],
        inclusions: ['Eiffel Tower summit ticket', '1-hour Seine River cruise ticket', 'Host for guidance'],
        exclusions: ['Hotel pickup and drop-off', 'Food and drinks'],
    },
    {
        id: 'tour-3',
        name: 'Tokyo Food Tour in Shinjuku',
        destination: 'Tokyo',
        description: 'Dive into the culinary heart of Tokyo! This walking tour takes you through the vibrant streets of Shinjuku to sample authentic Japanese dishes like ramen, yakitori, and tempura at hidden local gems.',
        pricePerPerson: 95,
        duration: '3 hours',
        rating: 4.7,
        images: ['https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=800', 'https://images.unsplash.com/photo-1559632483-50d3d5a15645?q=80&w=800'],
        itinerary: [
            { time: '18:00', activity: 'Meet at Shinjuku Station' },
            { time: '18:15', activity: 'Explore Omoide Yokocho (Memory Lane) for Yakitori' },
            { time: '19:15', activity: 'Visit a local Izakaya for drinks and small plates' },
            { time: '20:00', activity: 'Enjoy a bowl of authentic ramen' },
            { time: '21:00', activity: 'Tour concludes' },
        ],
        inclusions: ['All food samples (Yakitori, Ramen, etc.)', '1 drink included', 'Local guide'],
        exclusions: ['Additional drinks', 'Hotel pickup and drop-off'],
    },
];


let adminUsers: AdminUser[] = [
  { ...users.find(u => u.role === 'user')!.profile, id: 'user-123', status: 'Active', role: 'Admin', accountType: 'Registered' },
  { 
    id: 'user-456', userId: '@johns', name: 'John Smith', email: 'john.smith@example.com', memberSince: '2023-05-20T10:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith', status: 'Active', role: 'Support', accountType: 'Registered',
    wallets: [{ type: 'Fiat', name: 'US Dollar', currency: 'USD', balance: 200 }],
    investments: [],
  },
   { 
    id: 'user-789', userId: '@mariag', name: 'Maria Garcia', email: 'maria.garcia@example.com', memberSince: '2023-08-10T10:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=mariagarcia', status: 'Suspended', role: 'Finance', accountType: 'Registered',
    wallets: [{ type: 'Fiat', name: 'Euro', currency: 'EUR', balance: 5000 }],
    investments: [],
  },
];

let revenueSettings: RevenueSettings = {
  flightBooking: { type: 'percentage', value: 5 },
  hotelBooking: { type: 'percentage', value: 12 },
  exchange: {
    p2p: { type: 'percentage', value: 0.5 },
    bankTransfer: { type: 'fixed', value: 2.50 },
    cashDelivery: { type: 'percentage', value: 3 },
  },
  marketplaceCommission: { type: 'percentage', value: 10 },
  userTransfer: { type: 'percentage', value: 1.5 },
};

const shoppingCategories: ShoppingCategory[] = [
    { id: 'cat-1', name: 'Electronics', icon: ICONS.electronics },
    { id: 'cat-2', name: 'Fashion & Apparel', icon: ICONS.clothing },
    { id: 'cat-3', name: 'Home Goods', icon: ICONS.homeGoods },
];

let stores: Store[] = [
    { id: 'store-1', name: 'Super Electronics', logoUrl: 'https://placehold.co/100x100/3b82f6/white?text=SE', description: 'The latest and greatest in tech and gadgets.' },
    { id: 'store-2', name: 'Fashion Forward', logoUrl: 'https://placehold.co/100x100/ec4899/white?text=FF', description: 'Trendy apparel and accessories for every style.' },
    { id: 'store-3', name: 'Home Comforts', logoUrl: 'https://placehold.co/100x100/84cc16/white?text=HC', description: 'Everything you need to make your house a home.' },
];

let products: Product[] = [
    { id: 'prod-1', storeId: 'store-1', name: 'SuperPhone 15 Pro', description: 'The fastest phone in the galaxy.', price: 999, imageUrl: 'https://images.unsplash.com/photo-1695026043138-c19131c39031?q=80&w=800', category: 'Electronics' },
    { id: 'prod-4', storeId: 'store-2', name: 'Classic Denim Jacket', description: 'A timeless piece for any wardrobe.', price: 89.99, imageUrl: 'https://images.unsplash.com/photo-1596755034363-7872085f9814?q=80&w=800', category: 'Fashion & Apparel' },
    { id: 'prod-6', storeId: 'store-3', name: 'Aromatic Soy Candle', description: 'Relaxing scents of lavender and chamomile.', price: 25, imageUrl: 'https://images.unsplash.com/photo-1601920138354-9dd15516a227129?q=80&w=800', category: 'Home Goods' },
];

let promoSlides: PromoSlide[] = [
    { id: 'promo-1', icon: 'plane', title: 'Special Flight Offers', subtitle: 'Book your dream vacation today!', link: 'flights' },
    { id: 'promo-2', icon: 'exchange', title: 'Best Exchange Rates', subtitle: 'Swap currencies with zero hidden fees.', link: 'exchange' },
    { id: 'promo-3', icon: 'store', title: 'Shop & Earn Rewards', subtitle: 'Get points on every purchase in our marketplace.', link: 'shopping' },
];

let agents: Agent[] = [
    { id: 'agent-1', name: 'Downtown Exchange Office', address: '123 Main St', city: 'New York', country: 'USA', phone: '+1 (212) 555-0123', operatingHours: 'Mon-Fri: 9am - 6pm', latitude: 40.7128, longitude: -74.0060, },
    { id: 'agent-3', name: 'Tehran Grand Bazaar Office', address: 'Pamenar, District 12', city: 'Tehran', country: 'Iran', phone: '+98 21 5555 9988', operatingHours: 'Sat-Thu: 10am - 8pm', latitude: 35.6796, longitude: 51.4225, }
];

let virtualCards: VirtualCard[] = [];

let esimPlans: ESimPlan[] = [
    { id: 'TR-5GB-7D', country: 'Turkey', dataAmountGB: 5, validityDays: 7, priceUSD: 12.50 },
    { id: 'TR-10GB-15D', country: 'Turkey', dataAmountGB: 10, validityDays: 15, priceUSD: 20.00 },
    { id: 'UAE-3GB-7D', country: 'UAE', dataAmountGB: 3, validityDays: 7, priceUSD: 15.00 },
    { id: 'UAE-5GB-15D', country: 'UAE', dataAmountGB: 5, validityDays: 15, priceUSD: 24.00 },
    { id: 'USA-10GB-30D', country: 'USA', dataAmountGB: 10, validityDays: 30, priceUSD: 30.00 },
    { id: 'EU-10GB-30D', country: 'Europe', dataAmountGB: 10, validityDays: 30, priceUSD: 35.00 },
];

let deals: Deal[] = [
    {
        id: 'deal-1',
        title: '5-Star Weekend at Grand Hotel Paris',
        category: 'hotel',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
        originalPrice: 250,
        discountPercentage: 50,
        relatedItemId: 'hotel-1',
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        totalAvailable: 50,
        soldCount: 22,
    },
    {
        id: 'deal-2',
        title: 'Historic Tehran: Palaces & Bazaars Tour',
        category: 'tour',
        imageUrl: 'https://images.unsplash.com/photo-1599421497992-93220a52741b?q=80&w=800',
        originalPrice: 75,
        discountPercentage: 60,
        relatedItemId: 'tour-1',
        validUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        totalAvailable: 100,
        soldCount: 81,
    },
    {
        id: 'deal-3',
        title: 'SuperPhone 15 Pro Limited Offer',
        category: 'product',
        imageUrl: 'https://images.unsplash.com/photo-1695026043138-c19131c39031?q=80&w=800',
        originalPrice: 999,
        discountPercentage: 50,
        relatedItemId: 'prod-1',
        validUntil: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
        totalAvailable: 20,
        soldCount: 5,
    },
];

const internetPackages: InternetPackage[] = [
    // Hamrahe Aval
    { id: 'ha-1', operator: 'Hamrahe Aval', dataAmountGB: 2, validityDays: 30, priceIRR: 150000, description: 'Monthly Basic' },
    { id: 'ha-2', operator: 'Hamrahe Aval', dataAmountGB: 5, validityDays: 30, priceIRR: 250000, description: 'Monthly Standard' },
    { id: 'ha-3', operator: 'Hamrahe Aval', dataAmountGB: 10, validityDays: 30, priceIRR: 400000, description: 'Monthly Pro' },
    // Irancell
    { id: 'ir-1', operator: 'Irancell', dataAmountGB: 3, validityDays: 30, priceIRR: 180000, description: '30-Day 3GB' },
    { id: 'ir-2', operator: 'Irancell', dataAmountGB: 7, validityDays: 30, priceIRR: 300000, description: '30-Day 7GB' },
    { id: 'ir-3', operator: 'Irancell', dataAmountGB: 1, validityDays: 7, priceIRR: 80000, description: 'Weekly Special' },
    // Rightel
    { id: 'ri-1', operator: 'Rightel', dataAmountGB: 4, validityDays: 30, priceIRR: 200000, description: 'Monthly 4GB' },
    // Shatel
    { id: 'sh-1', operator: 'Shatel', dataAmountGB: 8, validityDays: 30, priceIRR: 320000, description: 'Shatel Mobile Monthly' },
];

let giftCards: GiftCard[] = [
    {
        id: 'gc-1',
        brand: 'Amazon',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        balance: 50.00,
        price: 45.00,
        sellerName: 'UserA',
        sellerRating: 4.9,
    },
    {
        id: 'gc-2',
        brand: 'Starbucks',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
        balance: 25.00,
        price: 22.50,
        sellerName: 'UserB',
        sellerRating: 4.8,
    },
    {
        id: 'gc-3',
        brand: 'Apple',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        balance: 100.00,
        price: 92.00,
        sellerName: 'UserC',
        sellerRating: 5.0,
    },
];

// --- Location Data ---
let countries: Country[] = [
    { id: 'c-1', name: 'Iran', code: 'IR' },
    { id: 'c-2', name: 'France', code: 'FR' },
    { id: 'c-3', name: 'United Kingdom', code: 'GB' },
    { id: 'c-4', name: 'United States', code: 'US' },
    { id: 'c-5', name: 'Japan', code: 'JP' },
    { id: 'c-6', name: 'United Arab Emirates', code: 'AE' },
];

let cities: City[] = [
    { id: 'city-1', name: 'Tehran', countryId: 'c-1' },
    { id: 'city-2', name: 'Paris', countryId: 'c-2' },
    { id: 'city-3', name: 'London', countryId: 'c-3' },
    { id: 'city-4', name: 'New York', countryId: 'c-4' },
    { id: 'city-5', name: 'Tokyo', countryId: 'c-5' },
    { id: 'city-6', name: 'Dubai', countryId: 'c-6' },
];

let airports: Airport[] = [
    { id: 'arp-1', name: 'Imam Khomeini International Airport', iataCode: 'IKA', cityId: 'city-1' },
    { id: 'arp-2', name: 'Charles de Gaulle Airport', iataCode: 'CDG', cityId: 'city-2' },
    { id: 'arp-3', name: 'Heathrow Airport', iataCode: 'LHR', cityId: 'city-3' },
    { id: 'arp-4', name: 'John F. Kennedy International Airport', iataCode: 'JFK', cityId: 'city-4' },
    { id: 'arp-5', name: 'Haneda Airport', iataCode: 'HND', cityId: 'city-5' },
    { id: 'arp-6', name: 'Dubai International Airport', iataCode: 'DXB', cityId: 'city-6' },
];


// --- ACCOUNTING SYSTEM ---
const chartOfAccounts: FinancialAccount[] = [
    { id: '1010', name: 'House USD Bank Account', type: 'Asset', balance: 0 },
    { id: '1020', name: 'User Funds - USD Wallet', type: 'Asset', balance: 0 },
    { id: '2010', name: 'User Liabilities - USD Wallet', type: 'Liability', balance: 0 },
    { id: '2020', name: 'Accounts Payable - Airlines', type: 'Liability', balance: 0 },
    { id: '3010', name: 'Owner Equity', type: 'Equity', balance: 0 },
    { id: '4010', name: 'Flight Booking Revenue', type: 'Revenue', balance: 0 },
    { id: '4020', name: 'P2P Exchange Fee Revenue', type: 'Revenue', balance: 0 },
    { id: '4030', name: 'User Transfer Fee Revenue', type: 'Revenue', balance: 0 },
];
let journal: JournalEntry[] = [];
let ledger: LedgerEntry[] = [];

const postJournalEntry = (description: string, relatedDocumentId: string, debits: { accountId: string, amount: number }[], credits: { accountId: string, amount: number }[]) => {
    const journalId = `J-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newEntries: LedgerEntry[] = [];

    debits.forEach(d => {
        const entry: LedgerEntry = { id: `L-${Date.now()}-${Math.random()}`, journalId, accountId: d.accountId, type: 'debit', amount: d.amount, timestamp };
        newEntries.push(entry);
        ledger.push(entry);
    });
    credits.forEach(c => {
        const entry: LedgerEntry = { id: `L-${Date.now()}-${Math.random()}`, journalId, accountId: c.accountId, type: 'credit', amount: c.amount, timestamp };
        newEntries.push(entry);
        ledger.push(entry);
    });
    
    journal.push({ id: journalId, description, timestamp, entries: newEntries, relatedDocumentId });
};


// --- SERVICE FUNCTIONS ---

export const authenticateInDb = (email: string, password: string, role: 'user' | 'agent' | 'merchant'): { name: string, email: string, role: 'user' | 'agent' | 'merchant', userId: string } => {
    const user = users.find(u => u.profile.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
    if (!user) {
        throw new Error("Invalid email, password, or role.");
    }
    currentUserEmail = user.profile.email; // Set the currently "logged in" user
    return { name: user.profile.name, role: user.role, email: user.profile.email, userId: user.profile.userId };
};

export const findFlights = (origin: string, destination: string): Flight[] => flights;

export const createFlightBookingInDb = (flight: Flight, passengers: Passenger[], totalPrice: number): FlightOrder => {
    const profile = getProfile();
    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < totalPrice) {
        throw new Error(`Insufficient USD balance. You need $${totalPrice.toFixed(2)}.`);
    }
    usdWallet.balance -= totalPrice;

    const seatAssignments = passengers.map(p => ({ passengerId: p.id, seat: `${Math.floor(Math.random() * 30) + 1}${[...'ABCDEF'][Math.floor(Math.random()*6)]}` }));
    const gate = `${[...'ABC'][Math.floor(Math.random()*3)]}${Math.floor(Math.random()*15)+1}`;

    const newOrder: FlightOrder = { type: 'flight', id: `fl-ord-${Date.now()}`, timestamp: new Date().toISOString(), flight, passengers, totalPrice, seatAssignments, gate, };
    flightOrders.push(newOrder);
    
    // --- ACCOUNTING ---
    const commission = totalPrice * (revenueSettings.flightBooking.value / 100);
    const cost = totalPrice - commission;
    postJournalEntry(
        `Flight Booking - ${flight.flightNumber}`,
        newOrder.id,
        [{ accountId: '1020', amount: totalPrice }, { accountId: '5010', amount: cost }],
        [{ accountId: '2010', amount: totalPrice }, { accountId: '2020', amount: cost }, { accountId: '4010', amount: commission }]
    );
    // --- END ACCOUNTING ---
    
    return newOrder;
};

export const findHotels = (destination: string): Hotel[] => hotels;

export const createHotelBookingInDb = (hotel: Hotel, room: Room, guests: HotelGuest[], checkIn: string, checkOut: string, totalPrice: number): HotelBookingOrder => {
    const profile = getProfile();
    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < totalPrice) {
        throw new Error(`Insufficient USD balance. You need $${totalPrice.toFixed(2)}.`);
    }
    usdWallet.balance -= totalPrice;

    const newOrder: HotelBookingOrder = {
        type: 'hotel',
        id: `htl-ord-${Date.now()}`,
        timestamp: new Date().toISOString(),
        hotel,
        room,
        guests,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
    };
    hotelBookingOrders.push(newOrder);
    return newOrder;
};

// --- Stay Functions ---
export const findStaysInDb = (destination: string, checkIn: string, checkOut: string, guests: number): Stay[] => {
    return stays.filter(s => s.location.toLowerCase() === destination.toLowerCase());
};

export const createStayBookingInDb = (stay: Stay, guests: HotelGuest[], checkIn: string, checkOut: string, totalPrice: number): StayBookingOrder => {
    const profile = getProfile();
    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < totalPrice) {
        throw new Error(`Insufficient USD balance. You need $${totalPrice.toFixed(2)}.`);
    }
    usdWallet.balance -= totalPrice;

    const newOrder: StayBookingOrder = {
        type: 'stay',
        id: `stay-ord-${Date.now()}`,
        timestamp: new Date().toISOString(),
        stay,
        guests,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
    };
    stayBookingOrders.push(newOrder);
    return newOrder;
};


export const findCars = (location: string, pickupDate: string, dropoffDate: string): Car[] => cars;

export const createCarBookingInDb = (details: { car: Car; driver: Driver; pickupDate: string; dropoffDate: string; location: string; totalPrice: number; }): CarBooking => {
  const newBooking: CarBooking = { id: `booking-${Date.now()}`, ...details };
  const profile = getProfile();
  const usdWallet = profile.wallets.find(w => w.currency === 'USD');
  if (usdWallet && usdWallet.balance >= newBooking.totalPrice) {
      usdWallet.balance -= newBooking.totalPrice;
  } else {
      throw new Error(`Insufficient USD balance. You need $${newBooking.totalPrice.toFixed(2)}.`);
  }
  return newBooking;
};

// --- Tour Functions ---
export const searchToursInDb = (destination: string, date: string): Tour[] => {
    // For now, return all tours. In a real app, filter by destination and availability on date.
    return tours;
};

export const createTourBookingInDb = (tour: Tour, bookingDate: string, guests: number, totalPrice: number): TourBookingOrder => {
    const profile = getProfile();
    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < totalPrice) {
        throw new Error(`Insufficient USD balance. You need $${totalPrice.toFixed(2)}.`);
    }
    usdWallet.balance -= totalPrice;

    const newOrder: TourBookingOrder = {
        type: 'tour',
        id: `tour-ord-${Date.now()}`,
        timestamp: new Date().toISOString(),
        tour,
        bookingDate,
        guests,
        totalPrice,
    };
    tourBookingOrders.push(newOrder);
    return newOrder;
};

export const getCryptoData = (): CryptoCurrency[] => [
    { name: 'Bitcoin', symbol: 'BTC', priceUSD: 65432.10, change24h: 1.5, history: [64000, 64500, 65000, 64800, 65200, 65100, 65432] },
    { name: 'Ethereum', symbol: 'ETH', priceUSD: 3512.45, change24h: -2.1, history: [3600, 3580, 3550, 3570, 3540, 3530, 3512] },
];

export const getPhysicalData = (): PhysicalCurrency[] => [
    { currency: 'Euro', code: 'EUR', rate: 0.92, history: [0.91, 0.915, 0.918, 0.917, 0.921, 0.922, 0.92] },
    { currency: 'Japanese Yen', code: 'JPY', rate: 157.50, history: [156, 156.5, 157, 156.8, 157.2, 157.3, 157.5] },
];

export const getP2PData = (): P2POffer[] => [
    { id: 'p2p-sell-1', userName: 'SellerOne', userRating: 4.8, type: 'SELL', currency: 'USD', amountAvailable: 500, pricePerUnit: 3550, paymentMethods: ['Bank Transfer'], payoutDetails: { type: 'wallet', currency: 'LCU' } },
    { id: 'p2p-buy-1', userName: 'BuyerBob', userRating: 4.9, type: 'BUY', currency: 'USD', amountAvailable: 1000, pricePerUnit: 3545, paymentMethods: ['Bank Transfer', 'Cash Deposit'], payoutDetails: { type: 'bank', currency: 'USD', recipient: { fullName: 'Bob Builder', accountNumber: 'US123456789', bankName: 'Global Bank' } } },
];

// --- Investment Data & Functions ---
const investableAssets: InvestableAsset[] = [
    {
        symbol: 'BTC', name: 'Bitcoin', price: 65432.10, change24h: 1.5, marketCap: 1300000000000, volume24h: 45000000000,
        history: [{ time: 1, open: 64000, high: 65500, low: 63800, close: 65432.10 }],
    },
    {
        symbol: 'ETH', name: 'Ethereum', price: 3512.45, change24h: -2.1, marketCap: 420000000000, volume24h: 22000000000,
        history: [{ time: 1, open: 3600, high: 3610, low: 3500, close: 3512.45 }],
    },
    {
        symbol: 'SOL', name: 'Solana', price: 150.75, change24h: 3.2, marketCap: 68000000000, volume24h: 3000000000,
        history: [{ time: 1, open: 145, high: 152, low: 144, close: 150.75 }],
    }
];

export const getInvestableAssetsFromDb = (): InvestableAsset[] => investableAssets;

export const createInvestmentOrderInDb = (orderType: 'BUY' | 'SELL', asset: InvestableAsset, amountAsset: number, amountUSD: number, walletCurrency: string): InvestmentOrder => {
    const profile = getProfile();
    const fiatWallet = profile.wallets.find(w => w.currency === walletCurrency);
    let investment = profile.investments.find(i => i.assetSymbol === asset.symbol);
    
    const fee = amountUSD * 0.005; // 0.5% fee

    if (orderType === 'BUY') {
        if (!fiatWallet || fiatWallet.balance < (amountUSD + fee)) {
            throw new Error(`Insufficient ${walletCurrency} balance.`);
        }
        fiatWallet.balance -= (amountUSD + fee);

        if (investment) {
            const newTotalAmount = investment.amount + amountAsset;
            const newTotalCost = (investment.avgCostBasis * investment.amount) + amountUSD;
            investment.avgCostBasis = newTotalCost / newTotalAmount;
            investment.amount = newTotalAmount;
        } else {
            profile.investments.push({
                assetSymbol: asset.symbol,
                amount: amountAsset,
                avgCostBasis: amountUSD / amountAsset,
            });
        }
    } else { // SELL
        if (!investment || investment.amount < amountAsset) {
            throw new Error(`Insufficient ${asset.symbol} to sell.`);
        }
        if (!fiatWallet) {
            throw new Error(`${walletCurrency} wallet not found to receive funds.`);
        }
        
        investment.amount -= amountAsset;
        fiatWallet.balance += (amountUSD - fee);
        
        // Remove investment if fully sold
        if (investment.amount < 0.00000001) {
            profile.investments = profile.investments.filter(i => i.assetSymbol !== asset.symbol);
        }
    }

    const newOrder: InvestmentOrder = {
        type: 'investment',
        id: `inv-ord-${Date.now()}`,
        timestamp: new Date().toISOString(),
        asset: asset,
        orderType: orderType,
        amountAsset: amountAsset,
        amountUSD: amountUSD,
        pricePerUnit: asset.price,
        fee: fee,
    };
    investmentOrders.push(newOrder);
    return newOrder;
};

// --- Profile & Wallet Functions ---
export const getProfile = (): UserProfile => {
    if (!currentUserEmail) {
        // Default to the 'user' profile if no one is logged in (e.g., for initial render)
        return users.find(u => u.role === 'user')!.profile;
    }
    const user = users.find(u => u.profile.email === currentUserEmail);
    if (!user) {
        throw new Error("User not found");
    }
    return user.profile;
};

export const updateProfileInDb = (data: { name: string; email: string }): UserProfile => {
  let profile = getProfile();
  profile.name = data.name;
  profile.email = data.email;
  return profile;
};

export const addWalletInDb = (wallet: Wallet): UserProfile => {
    let profile = getProfile();
    if (profile.wallets.some(w => w.currency === wallet.currency)) {
        throw new Error(`A wallet for ${wallet.currency} already exists.`);
    }
    profile.wallets.push(wallet);
    return profile;
};

export const deleteWalletInDb = (currency: string): UserProfile => {
    let profile = getProfile();
    profile.wallets = profile.wallets.filter(w => w.currency !== currency);
    return profile;
};


// --- Order Functions ---
export const getOrders = (): Order[] => {
    const allOrders: Order[] = [...p2pOrders, ...productOrders, ...bankTransferOrders, ...flightOrders, ...hotelBookingOrders, ...stayBookingOrders, ...userTransferOrders, ...taxiOrders, ...esimOrders, ...tourBookingOrders, ...investmentOrders, ...topUpOrders, ...dealOrders, ...internetPackageOrders, ...giftCardOrders];
    return allOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const createP2POrderInDb = (details: { offer: P2POffer, tradeAmount: number, totalPrice: number, localCurrency: string }): P2POrder => {
    const profile = getProfile();
    const lcuWallet = profile.wallets.find(w => w.currency === 'LCU');
    const usdWallet = profile.wallets.find(w => w.currency === 'USD');

    if (details.offer.type === 'BUY') { // User is buying USD
        if (!lcuWallet || lcuWallet.balance < details.totalPrice) throw new Error("Insufficient LCU balance.");
        lcuWallet.balance -= details.totalPrice;
        if (usdWallet) usdWallet.balance += details.tradeAmount;
    } else { // User is selling USD
         if (!usdWallet || usdWallet.balance < details.tradeAmount) throw new Error("Insufficient USD balance.");
         usdWallet.balance -= details.tradeAmount;
         if (lcuWallet) lcuWallet.balance += details.totalPrice;
    }
    const newOrder: P2POrder = { type: 'p2p', id: `p2p-${Date.now()}`, timestamp: new Date().toISOString(), ...details };
    p2pOrders.push(newOrder);

    // --- ACCOUNTING ---
    const fee = details.totalPrice * (revenueSettings.exchange.p2p.value / 100);
    postJournalEntry(
        `P2P Trade Fee - ${details.offer.type}`,
        newOrder.id,
        // For simplicity, we assume the fee is taken from the user's primary currency.
        [{ accountId: '1020', amount: fee }],
        [{ accountId: '2010', amount: fee }, { accountId: '4020', amount: fee }]
    );
    // --- END ACCOUNTING ---

    return newOrder;
};

export const createBankTransferOrderInDb = (details: { fromCurrency: string; fromAmount: number; toCurrency: string; toAmount: number; recipient: BankRecipientDetails; }): BankTransferOrder => {
    const profile = getProfile();
    const fromWallet = profile.wallets.find(w => w.currency === details.fromCurrency);
    if (!fromWallet || fromWallet.balance < details.fromAmount) {
        throw new Error(`Insufficient balance in ${details.fromCurrency} wallet.`);
    }
    fromWallet.balance -= details.fromAmount;
    
    const newOrder: BankTransferOrder = {
        type: 'bank',
        id: `bnk-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'Processing',
        ...details,
    };
    bankTransferOrders.push(newOrder);
    
    // Simulate completion
    setTimeout(() => {
        const order = bankTransferOrders.find(o => o.id === newOrder.id);
        if (order) order.status = 'Completed';
    }, 5000);

    return newOrder;
};

export const createProductOrderInDb = (product: Product, shippingAddress: ShippingAddress): ProductOrder => {
    const profile = getProfile();
    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < product.price) {
        throw new Error(`Insufficient USD balance.`);
    }
    usdWallet.balance -= product.price;

    const newOrder: ProductOrder = {
        type: 'product',
        id: `prod-ord-${Date.now()}`,
        timestamp: new Date().toISOString(),
        product: product,
        totalPrice: product.price,
        shippingAddress: shippingAddress,
    };
    productOrders.push(newOrder);
    return newOrder;
}

// --- Ride Hailing Functions ---
export const searchRidesInDb = (from: string, to: string): RideOption[] => {
    // Simulate getting prices and ETAs from Snapp and Tapsi
    const snappPrice = Math.floor(Math.random() * 200000) + 100000;
    const tapsiPrice = snappPrice * (Math.random() * 0.2 + 0.9); // Tapsi price is between 90% and 110% of Snapp's

    return [
        { provider: 'Snapp', rideType: 'Eco', price: snappPrice, eta: Math.floor(Math.random() * 5) + 2 },
        { provider: 'Snapp', rideType: 'Premium', price: snappPrice * 1.5, eta: Math.floor(Math.random() * 5) + 1 },
        { provider: 'Tapsi', rideType: 'Eco', price: tapsiPrice, eta: Math.floor(Math.random() * 6) + 3 },
        { provider: 'Tapsi', rideType: 'Premium', price: tapsiPrice * 1.6, eta: Math.floor(Math.random() * 5) + 2 },
    ];
};

export const bookRideInDb = (option: RideOption, from: string, to: string): TaxiOrder => {
    const profile = getProfile();
    const usdWallet = profile.wallets.find(w => w.currency === 'USD'); // Assuming payment from USD wallet for now
    if (!usdWallet || usdWallet.balance < (option.price / 400000)) { // Assuming a rough conversion rate for validation
        throw new Error(`Insufficient USD balance for this ride.`);
    }
    // In a real app, you'd convert IRR to USD and deduct. Here, we'll just deduct a small USD amount to simulate cost.
    usdWallet.balance -= (option.price / 400000);

    const newOrder: TaxiOrder = {
        type: 'taxi',
        id: `taxi-${Date.now()}`,
        timestamp: new Date().toISOString(),
        provider: option.provider,
        rideType: option.rideType,
        from,
        to,
        price: option.price,
        driverInfo: {
            name: option.provider === 'Snapp' ? 'Ali Rezaei' : 'Sara Ahmadi',
            carModel: option.provider === 'Snapp' ? 'Peugeot 206' : 'Saipa Tiba',
            licensePlate: `${Math.floor(Math.random()*90)+10} | ${Math.floor(Math.random()*900)+100}`,
            rating: 4.8,
        },
    };
    taxiOrders.push(newOrder);
    return newOrder;
};

// --- Exchange Functions ---
export const addCashRequest = (request: Omit<CashDeliveryRequest, 'id' | 'user' | 'timestamp' | 'status'>): CashDeliveryRequest => {
    const newRequest: CashDeliveryRequest = {
        id: `req-${Date.now()}`,
        user: getProfile().name,
        timestamp: new Date().toISOString(),
        status: 'Pending',
        ...request
    };
    cashDeliveryRequests.push(newRequest);
    return newRequest;
};

export const swapAssetsInDb = (fromCurrency: string, toCurrency: string, amount: number): UserProfile => {
    const profile = getProfile();
    const fromWallet = profile.wallets.find(w => w.currency === fromCurrency);
    const toWallet = profile.wallets.find(w => w.currency === toCurrency);
    
    if (!fromWallet || !toWallet) throw new Error("One or both wallets not found.");
    if (fromWallet.balance < amount) throw new Error("Insufficient balance.");

    // This is a mock conversion via USD, where the rate is OTHER_CUR per 1 USD
    const rates: Record<string, number> = { 'USD': 1 };
    getPhysicalData().forEach(r => (rates[r.code] = r.rate));
    
    // Mock crypto/other rates
    rates['BTC'] = 1 / 65000;
    rates['ETH'] = 1 / 3500;
    rates['USDT'] = 1;
    rates['LCU'] = 3550; // from P2P page, 1 USD = 3550 LCU
    
    // The formula for conversion is: amount_in_usd = amount_in_other / (other_per_usd)
    const amountInUSD = amount / (rates[fromCurrency] || 1);
    const resultAmount = amountInUSD * (rates[toCurrency] || 1);

    fromWallet.balance -= amount;
    toWallet.balance += resultAmount;
    
    return profile;
};

// --- Shopping Functions ---
export const getShoppingCategoriesFromDb = (): ShoppingCategory[] => shoppingCategories;
export const getProductsByCategoryFromDb = (categoryName: string): Product[] => products.filter(p => p.category === categoryName);


// --- Deals Functions ---
export const getDealsFromDb = (): Deal[] => deals;

export const createDealOrderInDb = (deal: Deal, details: Pick<HotelGuest, 'fullName' | 'email'> | ShippingAddress): DealOrder => {
    const profile = getProfile();
    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    const dealPrice = deal.originalPrice * (1 - deal.discountPercentage / 100);

    if (!usdWallet || usdWallet.balance < dealPrice) {
        throw new Error(`Insufficient USD balance. You need $${dealPrice.toFixed(2)}.`);
    }
    usdWallet.balance -= dealPrice;

    // Decrement available deals
    const dealInDb = deals.find(d => d.id === deal.id);
    if (dealInDb && dealInDb.soldCount < dealInDb.totalAvailable) {
        dealInDb.soldCount += 1;
    } else {
        throw new Error("This deal is sold out.");
    }

    const newOrder: DealOrder = {
        type: 'deal',
        id: `deal-ord-${Date.now()}`,
        timestamp: new Date().toISOString(),
        deal: deal,
        totalPrice: dealPrice,
        details: details,
    };
    dealOrders.push(newOrder);
    
    return newOrder;
};


// --- Agent Role Functions ---
export const findUserByEmailInDb = (email: string): UserProfile => {
    const userAccount = users.find(u => u.profile.email.toLowerCase() === email.toLowerCase());
    if (!userAccount) {
        throw new Error("No user found with that email.");
    }
    return userAccount.profile;
};

export const findUserByUserIdInDb = (userId: string): UserProfile => {
    const userAccount = users.find(u => u.profile.userId.toLowerCase() === userId.toLowerCase());
    if (!userAccount) {
        throw new Error("No user found with that user ID.");
    }
    return userAccount.profile;
};

export const agentTransferToUserInDb = (userEmail: string, amount: number, currency: string): { agentProfile: UserProfile, userProfile: UserProfile } => {
    const agentProfile = getProfile();
    const userProfile = findUserByEmailInDb(userEmail);

    const agentWallet = agentProfile.wallets.find(w => w.currency === currency);
    let userWallet = userProfile.wallets.find(w => w.currency === currency);

    if (!agentWallet || agentWallet.balance < amount) {
        throw new Error(`Agent has insufficient ${currency} balance.`);
    }

    if (!userWallet) {
        // Create wallet for user if it doesn't exist
        const asset = [...COMMON_CRYPTO_CURRENCIES, ...COMMON_FIAT_CURRENCIES].find(c => c.symbol === currency);
        userWallet = {
            type: COMMON_FIAT_CURRENCIES.some(c => c.symbol === currency) ? 'Fiat' : 'Crypto',
            name: asset?.name || currency,
            currency: currency,
            balance: 0,
        };
        userProfile.wallets.push(userWallet);
    }
    
    agentWallet.balance -= amount;
    userWallet.balance += amount;

    // Log the transaction for reporting
    const commission = amount * 0.01; // 1% commission for the agent
    agentTransactions.push({
        id: `agt-tx-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'User Credit',
        userEmail: userEmail,
        amount: amount,
        currency: currency,
        commission: commission,
    });

    return { agentProfile, userProfile };
};

export const getAgentTransactionsFromDb = (startDate: string, endDate: string): AgentTransaction[] => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return agentTransactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return txDate >= start && txDate <= end;
    });
};

export const agentCreateTopUpForUserInDb = (userEmail: string, details: { operator: string, mobileNumber: string, amount: number }): TopUpOrder => {
    const agentProfile = getProfile();
    const MOCK_IRR_USD_RATE = 500000;
    const costInUsd = details.amount / MOCK_IRR_USD_RATE;

    const agentUsdWallet = agentProfile.wallets.find(w => w.currency === 'USD');
    if (!agentUsdWallet || agentUsdWallet.balance < costInUsd) {
        throw new Error(`Agent has insufficient USD balance. Required: $${costInUsd.toFixed(2)}`);
    }

    agentUsdWallet.balance -= costInUsd;

    const newOrder: TopUpOrder = {
        type: 'top-up',
        id: `tu-agt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...details,
        currency: 'IRR',
        purchasedByAgentInfo: {
            agentId: agentProfile.userId,
            agentName: agentProfile.name,
        }
    };
    topUpOrders.push(newOrder);

    const commission = costInUsd * 0.02; // 2% commission
    agentTransactions.push({
        id: `agt-tx-tu-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'User Top-up',
        userEmail: userEmail,
        amount: costInUsd,
        currency: 'USD',
        commission: commission,
    });

    return newOrder;
};

export const agentPurchaseESimForUserInDb = (userEmail: string, planId: string): ESimOrder => {
    const agentProfile = getProfile();
    
    const plan = esimPlans.find(p => p.id === planId);
    if (!plan) {
        throw new Error("eSIM plan not found.");
    }

    const agentUsdWallet = agentProfile.wallets.find(w => w.currency === 'USD');
    if (!agentUsdWallet || agentUsdWallet.balance < plan.priceUSD) {
        throw new Error(`Agent has insufficient USD balance. Required: $${plan.priceUSD.toFixed(2)}`);
    }

    agentUsdWallet.balance -= plan.priceUSD;

    const user = findUserByEmailInDb(userEmail);

    const newOrder: ESimOrder = {
        type: 'esim',
        id: `esim-agt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        plan,
        qrCodeValue: JSON.stringify({
            planId: plan.id,
            userId: user.userId,
            activationCode: `LPA:1$rsp.truphone.com$${Math.random().toString(36).substring(2).toUpperCase()}`
        }),
        purchasedByAgentInfo: {
            agentId: agentProfile.userId,
            agentName: agentProfile.name,
        }
    };
    esimOrders.push(newOrder);
    
    const commission = plan.priceUSD * 0.05; // 5% commission
    agentTransactions.push({
        id: `agt-tx-esim-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'User eSIM Purchase',
        userEmail: userEmail,
        amount: plan.priceUSD,
        currency: 'USD',
        commission: commission,
    });

    return newOrder;
};

// --- User-to-User Transfer Functions ---
export const initiateUserTransferInDb = (receiverId: string, amount: number, currency: string): UserProfile => {
    const senderProfile = getProfile();
    const receiverProfile = findUserByUserIdInDb(receiverId);

    const senderWallet = senderProfile.wallets.find(w => w.currency === currency);
    let receiverWallet = receiverProfile.wallets.find(w => w.currency === currency);

    if (!senderWallet) {
        throw new Error(`You do not have a ${currency} wallet.`);
    }

    const feeModel = revenueSettings.userTransfer;
    const fee = feeModel.type === 'fixed' ? feeModel.value : amount * (feeModel.value / 100);
    const totalDeducted = amount + fee;

    if (senderWallet.balance < totalDeducted) {
        throw new Error(`Insufficient balance. You need ${totalDeducted.toFixed(2)} ${currency}.`);
    }

    if (!receiverWallet) {
        // Create wallet for receiver if it doesn't exist
        const asset = [...COMMON_CRYPTO_CURRENCIES, ...COMMON_FIAT_CURRENCIES].find(c => c.symbol === currency);
        receiverWallet = {
            type: COMMON_FIAT_CURRENCIES.some(c => c.symbol === currency) ? 'Fiat' : 'Crypto',
            name: asset?.name || currency,
            currency: currency,
            balance: 0,
        };
        receiverProfile.wallets.push(receiverWallet);
    }
    
    senderWallet.balance -= totalDeducted;
    receiverWallet.balance += amount;

    // Log the order for both users
    const newOrder: UserTransferOrder = {
        type: 'user-transfer',
        id: `utx-${Date.now()}`,
        timestamp: new Date().toISOString(),
        senderId: senderProfile.userId,
        senderEmail: senderProfile.email,
        senderName: senderProfile.name,
        receiverId: receiverProfile.userId,
        receiverEmail: receiverProfile.email,
        receiverName: receiverProfile.name,
        amountSent: amount,
        fee: fee,
        amountReceived: amount,
        currency: currency,
    };
    userTransferOrders.push(newOrder);

    // --- ACCOUNTING ---
    postJournalEntry(
        `User Transfer Fee - ${currency}`,
        newOrder.id,
        [{ accountId: '1020', amount: fee }],
        [{ accountId: '2010', amount: fee }, { accountId: '4030', amount: fee }]
    );
    // --- END ACCOUNTING ---

    return senderProfile;
};

// --- eSIM Functions ---
export const getESimPlansInDb = (country: string): ESimPlan[] => {
    return esimPlans.filter(p => p.country === country);
};

export const purchaseESimInDb = (planId: string): ESimOrder => {
    const profile = getProfile();
    const plan = esimPlans.find(p => p.id === planId);

    if (!plan) throw new Error("eSIM plan not found.");

    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < plan.priceUSD) {
        throw new Error(`Insufficient USD balance. You need $${plan.priceUSD.toFixed(2)}.`);
    }

    usdWallet.balance -= plan.priceUSD;

    const newOrder: ESimOrder = {
        type: 'esim',
        id: `esim-${Date.now()}`,
        timestamp: new Date().toISOString(),
        plan,
        qrCodeValue: JSON.stringify({
            planId: plan.id,
            userId: profile.userId,
            activationCode: `LPA:1$rsp.truphone.com$${Math.random().toString(36).substring(2).toUpperCase()}`
        }),
    };
    esimOrders.push(newOrder);
    return newOrder;
};

// --- Mobile Top-up Functions ---
export const createTopUpOrderInDb = (details: { operator: string, mobileNumber: string, amount: number }): TopUpOrder => {
    const profile = getProfile();
    const irrWallet = profile.wallets.find(w => w.currency === 'IRR');
    if (!irrWallet || irrWallet.balance < details.amount) {
        throw new Error(`Insufficient IRR balance. You need ${details.amount.toLocaleString()} IRR.`);
    }
    irrWallet.balance -= details.amount;

    const newOrder: TopUpOrder = {
        type: 'top-up',
        id: `tu-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...details,
        currency: 'IRR',
    };
    topUpOrders.push(newOrder);
    return newOrder;
};

export const getInternetPackagesFromDb = (operator: string): InternetPackage[] => {
    return internetPackages.filter(p => p.operator === operator);
};

export const createInternetPackageOrderInDb = (details: { operator: string, mobileNumber: string, package: InternetPackage }): InternetPackageOrder => {
    const profile = getProfile();
    const irrWallet = profile.wallets.find(w => w.currency === 'IRR');
    const price = details.package.priceIRR;

    if (!irrWallet || irrWallet.balance < price) {
        throw new Error(`Insufficient IRR balance. You need ${price.toLocaleString()} IRR.`);
    }
    irrWallet.balance -= price;

    const newOrder: InternetPackageOrder = {
        type: 'internet-package',
        id: `ip-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...details,
    };
    internetPackageOrders.push(newOrder);
    return newOrder;
};

// --- Gift Card Functions ---
export const getGiftCardListingsFromDb = (): GiftCard[] => giftCards;

export const createGiftCardOrderInDb = (cardId: string): GiftCardOrder => {
    const profile = getProfile();
    const card = giftCards.find(c => c.id === cardId);
    if (!card) throw new Error("Gift card not found.");

    const usdWallet = profile.wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < card.price) {
        throw new Error(`Insufficient USD balance. You need $${card.price.toFixed(2)}.`);
    }

    usdWallet.balance -= card.price;
    
    // In a real app, transfer funds to seller and mark card as sold
    giftCards = giftCards.filter(c => c.id !== cardId);

    const newOrder: GiftCardOrder = {
        type: 'gift-card',
        id: `gc-ord-${Date.now()}`,
        timestamp: new Date().toISOString(),
        giftCard: card,
        pricePaid: card.price,
    };
    giftCardOrders.push(newOrder);
    return newOrder;
};


// --- ADMIN PANEL FUNCTIONS ---
// ... (existing admin functions remain here, trimmed for brevity)
export const getAdminCashRequestsData = (): CashDeliveryRequest[] => cashDeliveryRequests;
export const updateAdminCashRequestStatusInDb = (id: string, status: 'Approved' | 'Declined'): CashDeliveryRequest => {
    const request = cashDeliveryRequests.find(r => r.id === id);
    if (!request) throw new Error("Request not found");
    request.status = status;
    return request;
};
export const getAdminUsersData = (): AdminUser[] => {
    return users.map(u => ({
        ...u.profile,
        id: u.profile.userId,
        status: (u.profile as any).status || 'Active', // Mock status
        role: u.role === 'user' ? 'User' : u.role.charAt(0).toUpperCase() + u.role.slice(1) as any,
        accountType: 'Registered'
    }));
};
export const createAdminUserInDb = (data: any): AdminUser => { /* ... implementation ... */ return data as AdminUser; };
export const updateAdminUserInDb = (id: string, data: any): AdminUser => { /* ... implementation ... */ return data as AdminUser; };
export const updateAdminUserStatusInDb = (id: string, status: 'Active' | 'Suspended'): AdminUser => {
    const user = adminUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");
    user.status = status;
    return user;
};
export const adminAddUserWalletInDb = (id: string, wallet: Wallet): AdminUser => {
    const user = adminUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");
    if (user.wallets.some(w => w.currency === wallet.currency)) throw new Error("Wallet already exists");
    user.wallets.push(wallet);
    return user;
};
export const adminUpdateUserWalletInDb = (id: string, currency: string, balance: number): AdminUser => {
    const user = adminUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");
    const wallet = user.wallets.find(w => w.currency === currency);
    if (!wallet) throw new Error("Wallet not found");
    wallet.balance = balance;
    return user;
};
export const adminDeleteUserWalletInDb = (id: string, currency: string): void => {
    const user = adminUsers.find(u => u.id === id);
    if (!user) throw new Error("User not found");
    user.wallets = user.wallets.filter(w => w.currency !== currency);
};
export const getAdminRevenueDataFromDb = (): RevenueDataPoint[] => [
    { month: 'Jan', flights: 22000, hotels: 15000, exchange: 8000 },
    { month: 'Feb', flights: 25000, hotels: 18000, exchange: 9500 },
];
export const getAdminP2PVolumeFromDb = (): P2PVolume => ({ buyVolume: 120000, sellVolume: 95000 });
export const getAdminTopCurrenciesFromDb = (): TopCurrency[] => [
    { name: 'US Dollar', symbol: 'USD', volumeUSD: 500000 },
    { name: 'Euro', symbol: 'EUR', volumeUSD: 350000 },
];
export const getRevenueSettingsFromDb = (): RevenueSettings => revenueSettings;
export const updateRevenueSettingsInDb = (settings: RevenueSettings): void => { revenueSettings = settings; };
export const getAdminFlightsFromDb = (): Flight[] => flights;
export const createAdminFlightInDb = (data: any): Flight => {
    const newFlight: Flight = { id: `fl-${Date.now()}`, ...data };
    flights.push(newFlight);
    return newFlight;
};
export const updateAdminFlightInDb = (id: string, data: any): Flight => {
    const index = flights.findIndex(f => f.id === id);
    if (index === -1) throw new Error("Flight not found");
    flights[index] = { ...flights[index], ...data };
    return flights[index];
};
export const deleteAdminFlightInDb = (id: string): void => { flights = flights.filter(f => f.id !== id); };
export const getAllStoresFromDb = (): Store[] => stores;
export const createStoreInDb = (data: any): Store => {
    const newStore = { id: `store-${Date.now()}`, ...data };
    stores.push(newStore);
    return newStore;
};
export const updateStoreInDb = (id: string, data: any): Store => {
    const index = stores.findIndex(s => s.id === id);
    stores[index] = { ...stores[index], ...data };
    return stores[index];
};
export const deleteStoreInDb = (id: string): void => { stores = stores.filter(s => s.id !== id); };
export const getProductsByStoreIdFromDb = (storeId: string): Product[] => products.filter(p => p.storeId === storeId);
export const createProductInDb = (data: any): Product => {
    const newProduct = { id: `prod-${Date.now()}`, ...data };
    products.push(newProduct);
    return newProduct;
};
export const updateProductInDb = (id: string, data: any): Product => {
    const index = products.findIndex(p => p.id === id);
    products[index] = { ...products[index], ...data };
    return products[index];
};
export const deleteProductInDb = (id: string): void => { products = products.filter(p => p.id !== id); };
export const getAdminPromoSlidesFromDb = (): PromoSlide[] => promoSlides;
export const createAdminPromoSlideInDb = (data: any): PromoSlide => {
    const newSlide = { id: `promo-${Date.now()}`, ...data };
    promoSlides.push(newSlide);
    return newSlide;
};
export const updateAdminPromoSlideInDb = (id: string, data: any): PromoSlide => {
    const index = promoSlides.findIndex(s => s.id === id);
    promoSlides[index] = { ...promoSlides[index], ...data };
    return promoSlides[index];
};
export const deleteAdminPromoSlideInDb = (id: string): void => { promoSlides = promoSlides.filter(s => s.id !== id); };
export const getAgentsFromDb = (): Agent[] => agents;
export const createAdminAgentInDb = (data: any): Agent => {
    const newAgent = { id: `agent-${Date.now()}`, ...data };
    agents.push(newAgent);
    return newAgent;
};
export const updateAdminAgentInDb = (id: string, data: any): Agent => {
    const index = agents.findIndex(a => a.id === id);
    agents[index] = { ...agents[index], ...data };
    return agents[index];
};
export const deleteAdminAgentInDb = (id: string): void => { agents = agents.filter(a => a.id !== id); };

// --- Financial System DB Functions ---
export const getFinancialSummaryFromDb = (): FinancialSummary => { /* ... */ return { totalRevenue: 1, netProfit: 1, userLiabilities: 1, houseLiquidity: 1 }};
export const getJournalEntriesFromDb = (): JournalEntry[] => journal;
export const getGeneralLedgerFromDb = (): LedgerEntry[] => ledger;
export const getChartOfAccountsFromDb = (): FinancialAccount[] => chartOfAccounts;
export const getPromoSlidesFromDb = (): PromoSlide[] => promoSlides;

// --- Virtual Card DB Functions ---
export const getVirtualCardsFromDb = (email?: string): VirtualCard[] => {
    const userEmail = email || currentUserEmail;
    return virtualCards.filter(vc => vc.userId === userEmail);
};

export const createVirtualCardInDb = (walletCurrency: string, userEmailOverride?: string): VirtualCard => {
    const user = getProfile();
    const newCard: VirtualCard = {
        id: `vc-${Date.now()}`,
        userId: userEmailOverride || user.email,
        walletCurrency,
        cardHolderName: user.name,
        cardNumber: `5558${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: `0${Math.floor(Math.random() * 9) + 1}/${new Date().getFullYear() % 100 + 5}`,
        cvv: `${Math.floor(100 + Math.random() * 900)}`,
        status: 'Active',
    };
    virtualCards.push(newCard);
    return newCard;
};

export const updateVirtualCardStatusInDb = (cardId: string, status: VirtualCard['status']): VirtualCard => {
    const card = virtualCards.find(c => c.id === cardId);
    if (!card) throw new Error("Card not found");
    card.status = status;
    return card;
};

export const findUserByCardNumberInDb = (cardNumber: string): { user: UserProfile, card: VirtualCard } => {
    throw new Error("This functionality is part of a secure backend and not mocked.");
};

export const updateAdminVirtualCardStatusInDb = (id: string, status: VirtualCard['status']): VirtualCard => {
    const card = virtualCards.find(c => c.id === id);
    if (!card) throw new Error("Card not found");
    card.status = status;
    return card;
};

// --- Merchant DB Functions ---
export const getMerchantRecentTransactionsFromDb = (): Transaction[] => transactions;
export const createPaymentRequestInDb = (data: { amount: number; currency: string; mode: 'qr' | 'user_search'; userId?: string }): { paymentId: string } => {
    const merchantProfile = getProfile();
    const newRequest: PaymentRequest = {
        id: `pr-${Date.now()}`,
        merchantId: merchantProfile.userId,
        merchantName: merchantProfile.name,
        merchantLogoUrl: merchantProfile.avatarUrl,
        userId: data.userId || '@any', // For QR, any user can pay
        amount: data.amount,
        currency: data.currency,
        status: 'Pending',
    };
    paymentRequests.push(newRequest);
    return { paymentId: newRequest.id };
};
export const getPendingPaymentRequestForUser = (userEmail: string): PaymentRequest | null => {
    const user = findUserByEmailInDb(userEmail);
    // Find requests for this user or any-user (for QR)
    const request = paymentRequests.find(pr => (pr.userId === user.email || pr.userId === '@any') && pr.status === 'Pending');
    return request || null;
};
export const processPaymentInDb = (paymentRequestId: string): Transaction => {
    const request = paymentRequests.find(pr => pr.id === paymentRequestId);
    if (!request) throw new Error("Payment request not found.");
    if (request.status !== 'Pending') throw new Error("Payment request already processed.");

    const userProfile = getProfile();
    const merchant = users.find(u => u.profile.userId === request.merchantId)?.profile;
    if (!merchant) throw new Error("Merchant not found");

    const userWallet = userProfile.wallets.find(w => w.currency === request.currency);
    const merchantWallet = merchant.wallets.find(w => w.currency === request.currency);

    if (!userWallet || userWallet.balance < request.amount) {
        throw new Error(`Insufficient ${request.currency} balance.`);
    }

    userWallet.balance -= request.amount;
    if (merchantWallet) {
        merchantWallet.balance += request.amount;
    }

    request.status = 'Completed';

    const newTransaction: Transaction = {
        id: request.id,
        merchantId: merchant.userId,
        userId: userProfile.userId,
        userName: userProfile.name,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date().toISOString(),
        status: 'Completed',
    };
    transactions.push(newTransaction);
    return newTransaction;
};

// --- Admin Location DB Functions ---
export const getAdminCountries = (): Country[] => countries;
export const createAdminCountryInDb = (data: Omit<Country, 'id'>): Country => {
    const newCountry: Country = { id: `c-${Date.now()}`, ...data };
    countries.push(newCountry);
    return newCountry;
};
export const updateAdminCountryInDb = (id: string, data: Partial<Omit<Country, 'id'>>): Country => {
    const index = countries.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Country not found");
    countries[index] = { ...countries[index], ...data };
    return countries[index];
};
export const deleteAdminCountryInDb = (id: string): void => {
    countries = countries.filter(c => c.id !== id);
    // Cascade delete
    cities.filter(c => c.countryId === id).forEach(city => deleteAdminCityInDb(city.id));
};

export const getAdminCities = (): City[] => cities;
export const createAdminCityInDb = (data: Omit<City, 'id'>): City => {
    const newCity: City = { id: `city-${Date.now()}`, ...data };
    cities.push(newCity);
    return newCity;
};
export const updateAdminCityInDb = (id: string, data: Partial<Omit<City, 'id'>>): City => {
    const index = cities.findIndex(c => c.id === id);
    if (index === -1) throw new Error("City not found");
    cities[index] = { ...cities[index], ...data };
    return cities[index];
};
export const deleteAdminCityInDb = (id: string): void => {
    cities = cities.filter(c => c.id !== id);
    // Cascade delete
    airports.filter(a => a.cityId === id).forEach(airport => deleteAdminAirportInDb(airport.id));
};

export const getAdminAirports = (): Airport[] => airports;
export const createAdminAirportInDb = (data: Omit<Airport, 'id'>): Airport => {
    const newAirport: Airport = { id: `arp-${Date.now()}`, ...data };
    airports.push(newAirport);
    return newAirport;
};
export const updateAdminAirportInDb = (id: string, data: Partial<Omit<Airport, 'id'>>): Airport => {
    const index = airports.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Airport not found");
    airports[index] = { ...airports[index], ...data };
    return airports[index];
};
export const deleteAdminAirportInDb = (id: string): void => {
    airports = airports.filter(a => a.id !== id);
};

export const getFlightSearchLocationsFromDb = (): { name: string, code: string }[] => {
    return airports.map(airport => {
        const city = cities.find(c => c.id === airport.cityId);
        return {
            name: `${city?.name || 'Unknown City'}, ${airport.name}`,
            code: airport.iataCode
        };
    });
};