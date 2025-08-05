
import {
  Flight, Hotel, Car, Driver, UserProfile, Wallet, CryptoCurrency, PhysicalCurrency, P2POffer, P2POrder,
  CashDeliveryRequest, AdminUser, RevenueDataPoint, P2PVolume, TopCurrency, RevenueSettings, Room, Store, Product, ShoppingCategory, Order, ProductOrder, BankTransferOrder, BankRecipientDetails, ShippingAddress, CarBooking, FlightOrder, Passenger, PromoSlide, Agent, AgentTransaction, FinancialAccount, JournalEntry, LedgerEntry, FinancialSummary, VirtualCard, Transaction, PaymentRequest, Merchant, HotelGuest, HotelBookingOrder
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
            name: 'Jane Doe',
            email: 'user@example.com',
            memberSince: '2023-01-15T10:00:00Z',
            avatarUrl: 'https://i.pravatar.cc/150?u=janedoe',
            wallets: [
              { type: 'Fiat', name: 'US Dollar', currency: 'USD', balance: 1250.50 },
              { type: 'Fiat', name: 'Euro', currency: 'EUR', balance: 2500.00 },
              { type: 'Crypto', name: 'Bitcoin', currency: 'BTC', balance: 0.05 },
            ],
        },
        role: 'user',
        password: 'password'
    },
    {
        profile: {
            name: 'Global Exchange',
            email: 'agent@example.com',
            memberSince: '2022-03-01T09:00:00Z',
            avatarUrl: 'https://i.pravatar.cc/150?u=agent',
            wallets: [
              { type: 'Fiat', name: 'USD Float', currency: 'USD', balance: 500000.00 },
              { type: 'Fiat', name: 'EUR Float', currency: 'EUR', balance: 750000.00 },
              { type: 'Crypto', name: 'USDT Float', currency: 'USDT', balance: 1000000.00 },
            ],
        },
        role: 'agent',
        password: 'password'
    },
    {
        profile: {
            name: 'Super Store',
            email: 'merchant@example.com',
            memberSince: '2023-01-01T09:00:00Z',
            avatarUrl: 'https://i.pravatar.cc/150?u=merchant',
            wallets: [
              { type: 'Fiat', name: 'USD Sales', currency: 'USD', balance: 12345.67 },
            ],
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

let adminUsers: AdminUser[] = [
  { ...users.find(u => u.role === 'user')!.profile, id: 'user-123', status: 'Active', role: 'Admin', accountType: 'Registered' },
  { 
    id: 'user-456', name: 'John Smith', email: 'john.smith@example.com', memberSince: '2023-05-20T10:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=johnsmith', status: 'Active', role: 'Support', accountType: 'Registered',
    wallets: [{ type: 'Fiat', name: 'US Dollar', currency: 'USD', balance: 200 }],
  },
   { 
    id: 'user-789', name: 'Maria Garcia', email: 'maria.garcia@example.com', memberSince: '2023-08-10T10:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=mariagarcia', status: 'Suspended', role: 'Finance', accountType: 'Registered',
    wallets: [{ type: 'Fiat', name: 'Euro', currency: 'EUR', balance: 5000 }],
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
    { id: 'prod-6', storeId: 'store-3', name: 'Aromatic Soy Candle', description: 'Relaxing scents of lavender and chamomile.', price: 25, imageUrl: 'https://images.unsplash.com/photo-1601920138354-9dd15516315c?q=80&w=800', category: 'Home Goods' },
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

// --- ACCOUNTING SYSTEM ---
const chartOfAccounts: FinancialAccount[] = [
    { id: '1010', name: 'House USD Bank Account', type: 'Asset', balance: 0 },
    { id: '1020', name: 'User Funds - USD Wallet', type: 'Asset', balance: 0 },
    { id: '2010', name: 'User Liabilities - USD Wallet', type: 'Liability', balance: 0 },
    { id: '2020', name: 'Accounts Payable - Airlines', type: 'Liability', balance: 0 },
    { id: '3010', name: 'Owner Equity', type: 'Equity', balance: 0 },
    { id: '4010', name: 'Flight Booking Revenue', type: 'Revenue', balance: 0 },
    { id: '4020', name: 'P2P Exchange Fee Revenue', type: 'Revenue', balance: 0 },
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

export const authenticateInDb = (email: string, password: string, role: 'user' | 'agent' | 'merchant'): { name: string, email: string, role: 'user' | 'agent' | 'merchant' } => {
    const user = users.find(u => u.profile.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
    if (!user) {
        throw new Error("Invalid email, password, or role.");
    }
    currentUserEmail = user.profile.email; // Set the currently "logged in" user
    return { name: user.profile.name, role: user.role, email: user.profile.email };
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

export const findHotels = (destination: string): Hotel[] => [
    { id: 'hotel-1', name: `Grand Hotel ${destination}`, rating: 4.5, description: 'A luxurious hotel.', amenities: ['Pool', 'WiFi', 'Spa'], pricePerNight: 250, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800', rooms: [ { id: 'room-1a', name: 'Deluxe King', price: 250, beds: 1, capacity: 2 }] },
    { id: 'hotel-2', name: `Cozy Inn ${destination}`, rating: 4.0, description: 'A charming inn.', amenities: ['WiFi', 'Breakfast'], pricePerNight: 120, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800', rooms: [ { id: 'room-2a', name: 'Standard Double', price: 120, beds: 2, capacity: 2 } ] }
];

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

export const findCars = (location: string): Car[] => cars;

export const createCarBookingInDb = (details: { car: Car; driver: Driver; pickupDate: string; dropoffDate: string; location: string; totalPrice: number; }): CarBooking => {
  const newBooking: CarBooking = { id: `booking-${Date.now()}`, ...details };
  const profile = getProfile();
  const usdWallet = profile.wallets.find(w => w.currency === 'USD');
  if (usdWallet && usdWallet.balance >= newBooking.totalPrice) {
      usdWallet.balance -= newBooking.totalPrice;
  } else {
      throw new Error("Insufficient funds for car rental payment.");
  }
  return newBooking;
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
    const allOrders: Order[] = [...p2pOrders, ...productOrders, ...bankTransferOrders, ...flightOrders, ...hotelBookingOrders];
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


// --- Agent Role Functions ---
export const findUserByEmailInDb = (email: string): UserProfile => {
    const userAccount = users.find(u => u.profile.email.toLowerCase() === email.toLowerCase() && u.role === 'user');
    if (!userAccount) {
        throw new Error("No user found with that email, or the email belongs to an agent.");
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
    start.setUTCHours(0, 0, 0, 0);
    const startTime = start.getTime();

    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const endTime = end.getTime();

    return agentTransactions.filter(tx => {
        const txTime = new Date(tx.timestamp).getTime();
        return txTime >= startTime && txTime <= endTime;
    });
};

export const findUserByCardNumberInDb = (cardNumber: string): { user: UserProfile, card: VirtualCard } => {
    const card = virtualCards.find(c => c.cardNumber === cardNumber);
    if (!card) {
        throw new Error("No virtual card found with that number.");
    }

    // card.userId is the email
    const userAccount = users.find(u => u.profile.email === card.userId);
    if (!userAccount) {
        throw new Error(`No user found for the card holder (${card.userId}).`);
    }

    return { user: userAccount.profile, card };
};

// --- Virtual Card Functions ---
export const getVirtualCardsFromDb = (userEmail?: string): VirtualCard[] => {
    const targetEmail = userEmail || currentUserEmail;
    if (!targetEmail) return [];
    return virtualCards.filter(card => card.userId === targetEmail);
};

export const createVirtualCardInDb = (walletCurrency: string, userEmailOverride?: string): VirtualCard => {
    const targetEmail = userEmailOverride || currentUserEmail;
    if (!targetEmail) {
        throw new Error("No user logged in to create a card for.");
    }

    const userAccount = users.find(u => u.profile.email === targetEmail) || adminUsers.find(u => u.email === targetEmail);
    if (!userAccount) {
        throw new Error("User not found.");
    }
    
    const userProfile = 'profile' in userAccount ? userAccount.profile : userAccount;

    const wallet = userProfile.wallets.find(w => w.currency === walletCurrency && w.type === 'Fiat');
    if (!wallet) {
        throw new Error(`A Fiat wallet for ${walletCurrency} is required to create a card.`);
    }

    const cardNumber = '555888' + Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    const expiryDate = `${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}/${new Date().getFullYear() % 100 + 5}`;
    const cvv = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');

    const newCard: VirtualCard = {
        id: `vc-${Date.now()}`,
        userId: targetEmail,
        walletCurrency,
        cardHolderName: userProfile.name,
        cardNumber,
        expiryDate,
        cvv,
        status: 'Active',
    };
    virtualCards.push(newCard);
    return newCard;
};

export const updateVirtualCardStatusInDb = (cardId: string, status: VirtualCard['status']): VirtualCard => {
    const card = virtualCards.find(c => c.id === cardId);
    if (!card) {
        throw new Error("Virtual card not found.");
    }
    card.status = status;
    return card;
};

// --- MERCHANT FUNCTIONS ---
export const getMerchantRecentTransactionsFromDb = (): Transaction[] => {
    if (!currentUserEmail) return [];
    const merchant = users.find(u => u.profile.email === currentUserEmail);
    if (!merchant || merchant.role !== 'merchant') return [];
    return transactions
        .filter(t => t.merchantId === merchant.profile.email)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const createPaymentRequestInDb = (data: { amount: number, currency: string, mode: 'qr' | 'user_search', userId?: string }): { paymentId: string } => {
    if (!currentUserEmail) throw new Error("No merchant logged in.");
    const merchant = users.find(u => u.profile.email === currentUserEmail);
    if (!merchant || merchant.role !== 'merchant') throw new Error("No merchant logged in.");
    
    const userToCharge = users.find(u => u.profile.email === data.userId);
    if (data.mode === 'user_search' && !userToCharge) throw new Error("User not found.");
    
    const newRequest: PaymentRequest = {
        id: `pr-${Date.now()}`,
        merchantId: merchant.profile.email!,
        merchantName: merchant.profile.name,
        merchantLogoUrl: merchant.profile.avatarUrl || '',
        userId: data.userId || 'qr_scan_user',
        amount: data.amount,
        currency: data.currency,
        status: 'Pending'
    };
    paymentRequests.push(newRequest);
    return { paymentId: newRequest.id };
};

export const getPendingPaymentRequestForUser = (userId: string): PaymentRequest | null => {
    const request = paymentRequests.find(r => r.userId === userId && r.status === 'Pending');
    return request || null;
};

export const processPaymentInDb = (paymentRequestId: string): Transaction => {
    const requestIndex = paymentRequests.findIndex(r => r.id === paymentRequestId);
    if (requestIndex === -1) throw new Error("Payment request not found or already processed.");

    const request = paymentRequests[requestIndex];
    
    const user = users.find(u => u.profile.email === request.userId);
    if (!user) throw new Error("User for payment not found.");
    
    const userWallet = user.profile.wallets.find(w => w.currency === request.currency);
    if (!userWallet || userWallet.balance < request.amount) {
        throw new Error("Insufficient funds.");
    }
    
    const merchant = users.find(u => u.profile.email === request.merchantId);
    if (!merchant) throw new Error("Merchant not found.");
    const merchantWallet = merchant.profile.wallets.find(w => w.currency === request.currency);
    if(!merchantWallet) throw new Error("Merchant wallet not found.");

    // Process transaction
    userWallet.balance -= request.amount;
    merchantWallet.balance += request.amount;
    
    const newTransaction: Transaction = {
        id: request.id,
        merchantId: request.merchantId,
        userId: request.userId,
        userName: user.profile.name,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date().toISOString(),
        status: 'Completed'
    };
    transactions.push(newTransaction);
    
    // Remove the pending request
    paymentRequests.splice(requestIndex, 1);
    
    return newTransaction;
};


// --- ADMIN PANEL FUNCTIONS ---

export const getAdminCashRequestsData = (): CashDeliveryRequest[] => cashDeliveryRequests;

export const updateAdminCashRequestStatusInDb = (id: string, status: 'Approved' | 'Declined'): CashDeliveryRequest => {
    const request = cashDeliveryRequests.find(r => r.id === id);
    if (!request) {
        throw new Error("Request not found");
    }
    request.status = status;
    return request;
};

export const getAdminUsersData = (): AdminUser[] => adminUsers;

export const createAdminUserInDb = (userData: Omit<AdminUser, 'id' | 'memberSince' | 'wallets' | 'avatarUrl'>): AdminUser => {
    if (adminUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
    }
    const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        ...userData,
        memberSince: new Date().toISOString(),
        avatarUrl: `https://i.pravatar.cc/150?u=${userData.email}`,
        wallets: [],
    };
    adminUsers.push(newUser);
    return newUser;
}


export const updateAdminUserInDb = (userId: string, data: { name: string; email: string; avatarUrl: string }): AdminUser => {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.name = data.name;
    user.email = data.email;
    user.avatarUrl = data.avatarUrl;
    return user;
};

export const updateAdminUserStatusInDb = (userId: string, status: 'Active' | 'Suspended'): AdminUser => {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = status;
    return user;
};

export const adminAddUserWalletInDb = (userId: string, wallet: Wallet): AdminUser => {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    if (user.wallets.some(w => w.currency === wallet.currency)) throw new Error("Wallet already exists");
    user.wallets.push(wallet);
    return user;
};

export const adminUpdateUserWalletInDb = (userId: string, currency: string, balance: number): AdminUser => {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    const wallet = user.wallets.find(w => w.currency === currency);
    if (!wallet) throw new Error("Wallet not found");
    wallet.balance = balance;
    return user;
};

export const adminDeleteUserWalletInDb = (userId: string, currency: string): void => {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.wallets = user.wallets.filter(w => w.currency !== currency);
};

export const getAdminRevenueDataFromDb = (): RevenueDataPoint[] => [
  { month: 'Jan', flights: 20000, hotels: 15000, exchange: 5000 },
  { month: 'Feb', flights: 22000, hotels: 17000, exchange: 6000 },
  { month: 'Mar', flights: 25000, hotels: 19000, exchange: 7500 },
  { month: 'Apr', flights: 23000, hotels: 20000, exchange: 7000 },
  { month: 'May', flights: 28000, hotels: 22000, exchange: 8000 },
  { month: 'Jun', flights: 31000, hotels: 25000, exchange: 9500 },
];

export const getAdminP2PVolumeFromDb = (): P2PVolume => ({
    buyVolume: 125000,
    sellVolume: 98000,
});

export const getAdminTopCurrenciesFromDb = (): TopCurrency[] => [
    { name: 'Bitcoin', symbol: 'BTC', volumeUSD: 2500000 },
    { name: 'Ethereum', symbol: 'ETH', volumeUSD: 1800000 },
    { name: 'Tether', symbol: 'USDT', volumeUSD: 3500000 },
];

export const getRevenueSettingsFromDb = (): RevenueSettings => revenueSettings;
export const updateRevenueSettingsInDb = (settings: RevenueSettings): void => {
    revenueSettings = settings;
};

export const getAdminFlightsFromDb = (): Flight[] => flights;
export const createAdminFlightInDb = (flightData: Omit<Flight, 'id'>): Flight => {
    const newFlight: Flight = { id: `fl-${Date.now()}`, ...flightData };
    flights.push(newFlight);
    return newFlight;
};
export const updateAdminFlightInDb = (flightId: string, flightData: Partial<Omit<Flight, 'id'>>): Flight => {
    const flightIndex = flights.findIndex(f => f.id === flightId);
    if (flightIndex === -1) throw new Error("Flight not found");
    flights[flightIndex] = { ...flights[flightIndex], ...flightData };
    return flights[flightIndex];
};
export const deleteAdminFlightInDb = (flightId: string): void => {
    flights = flights.filter(f => f.id !== flightId);
};

export const getAllStoresFromDb = (): Store[] => stores;
export const createStoreInDb = (data: Omit<Store, 'id'>): Store => {
    const newStore = { id: `store-${Date.now()}`, ...data };
    stores.push(newStore);
    return newStore;
}
export const updateStoreInDb = (id: string, data: Partial<Store>): Store => {
    const index = stores.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Store not found");
    stores[index] = { ...stores[index], ...data };
    return stores[index];
}
export const deleteStoreInDb = (id: string): void => { stores = stores.filter(s => s.id !== id); }

export const getProductsByStoreIdFromDb = (storeId: string): Product[] => products.filter(p => p.storeId === storeId);
export const createProductInDb = (data: Omit<Product, 'id'>): Product => {
    const newProd = { id: `prod-${Date.now()}`, ...data };
    products.push(newProd);
    return newProd;
}
export const updateProductInDb = (id: string, data: Partial<Product>): Product => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    products[index] = { ...products[index], ...data };
    return products[index];
}
export const deleteProductInDb = (id: string): void => { products = products.filter(p => p.id !== id); }

export const getPromoSlidesFromDb = (): PromoSlide[] => promoSlides;
export const getAdminPromoSlidesFromDb = (): PromoSlide[] => promoSlides;
export const createAdminPromoSlideInDb = (slideData: Omit<PromoSlide, 'id'>): PromoSlide => {
    const newSlide: PromoSlide = { id: `promo-${Date.now()}`, ...slideData };
    promoSlides.push(newSlide);
    return newSlide;
};
export const updateAdminPromoSlideInDb = (slideId: string, slideData: Partial<Omit<PromoSlide, 'id'>>): PromoSlide => {
    const slideIndex = promoSlides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) throw new Error("Slide not found");
    promoSlides[slideIndex] = { ...promoSlides[slideIndex], ...slideData };
    return promoSlides[slideIndex];
};
export const deleteAdminPromoSlideInDb = (slideId: string): void => {
    promoSlides = promoSlides.filter(s => s.id !== slideId);
};

export const getAgentsFromDb = (): Agent[] => agents;
export const createAdminAgentInDb = (agentData: Omit<Agent, 'id'>): Agent => {
    const newAgent: Agent = { id: `agent-${Date.now()}`, ...agentData };
    agents.push(newAgent);
    return newAgent;
};
export const updateAdminAgentInDb = (agentId: string, agentData: Partial<Omit<Agent, 'id'>>): Agent => {
    const agentIndex = agents.findIndex(a => a.id === agentId);
    if (agentIndex === -1) throw new Error("Agent not found");
    agents[agentIndex] = { ...agents[agentIndex], ...agentData };
    return agents[agentIndex];
};
export const deleteAdminAgentInDb = (agentId: string): void => {
    agents = agents.filter(a => a.id !== agentId);
};

export const updateAdminVirtualCardStatusInDb = updateVirtualCardStatusInDb;

// --- ADMIN FINANCE MODULE ---
export const getChartOfAccountsFromDb = (): FinancialAccount[] => chartOfAccounts;
export const getJournalEntriesFromDb = (): JournalEntry[] => {
    // Add account names for easier display
    return journal.map(j => ({
        ...j,
        entries: j.entries.map(e => ({
            ...e,
            accountName: chartOfAccounts.find(a => a.id === e.accountId)?.name || 'Unknown'
        }))
    }));
};
export const getGeneralLedgerFromDb = (): LedgerEntry[] => ledger;
export const getFinancialSummaryFromDb = (): FinancialSummary => {
    const revenueAccounts = chartOfAccounts.filter(a => a.type === 'Revenue').map(a => a.id);
    const expenseAccounts = chartOfAccounts.filter(a => a.type === 'Expense').map(a => a.id);

    const totalRevenue = ledger
        .filter(e => revenueAccounts.includes(e.accountId))
        .reduce((sum, e) => sum + (e.type === 'credit' ? e.amount : -e.amount), 0);

    const totalExpenses = ledger
        .filter(e => expenseAccounts.includes(e.accountId))
        .reduce((sum, e) => sum + (e.type === 'debit' ? e.amount : -e.amount), 0);

    const netProfit = totalRevenue - totalExpenses;

    const userLiabilities = ledger
        .filter(e => e.accountId === '2010') // User Liabilities - USD Wallet
        .reduce((sum, e) => sum + (e.type === 'credit' ? e.amount : -e.amount), 0);
        
    const houseLiquidity = ledger
        .filter(e => e.accountId === '1010') // House USD Bank Account
        .reduce((sum, e) => sum + (e.type === 'debit' ? e.amount : -e.amount), 0);

    return { totalRevenue, netProfit, userLiabilities, houseLiquidity };
};
