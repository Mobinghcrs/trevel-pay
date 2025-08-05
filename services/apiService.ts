
import {
  Flight,
  Hotel,
  Car,
  Driver,
  CryptoCurrency,
  PhysicalCurrency,
  P2POffer,
  UserProfile,
  AdminUser,
  Wallet,
  CashDeliveryRequest,
  Order,
  ProductOrder,
  P2POrder,
  BankTransferOrder,
  BankRecipientDetails,
  RevenueDataPoint,
  P2PVolume,
  TopCurrency,
  RevenueSettings,
  Store,
  Product,
  ShoppingCategory,
  ShippingAddress,
  CarBooking,
  FlightOrder,
  Passenger,
  PromoSlide,
  Agent,
  AgentTransaction,
  FinancialAccount,
  JournalEntry,
  LedgerEntry,
  FinancialSummary,
  AiIntent,
  VirtualCard,
  Transaction,
  PaymentRequest,
  Room,
  HotelGuest,
  HotelBookingOrder,
} from '../types';
import * as db from './dummyDataService';
import * as gemini from './geminiService';
import { setCurrentUser, getCurrentUser, clearCurrentUser } from './currentUser';

const simulateDelay = <T>(data: T, errorChance = 0): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < errorChance) {
                reject(new Error("A simulated network error occurred."));
            } else {
                resolve(data);
            }
        }, 300 + Math.random() * 500);
    });
};

// --- Auth Service ---
export const authenticate = (email: string, password: string, role: 'user' | 'agent' | 'merchant'): Promise<{name: string, email: string, role: 'user' | 'agent' | 'merchant'}> => {
    try {
        const user = db.authenticateInDb(email, password, role);
        setCurrentUser({ name: user.name, role: user.role, email: user.email });
        window.dispatchEvent(new Event('authchange')); // Notify router of auth change
        return simulateDelay(user);
    } catch (e) {
        return Promise.reject(e);
    }
}

// --- Flight Services ---
export const searchFlights = async (origin: string, destination: string, date: string): Promise<Flight[]> => {
  const data = db.findFlights(origin, destination);
  return simulateDelay(data);
};

export const createFlightBooking = (flight: Flight, passengers: Passenger[], totalPrice: number): Promise<FlightOrder> => {
    try {
        const newOrder = db.createFlightBookingInDb(flight, passengers, totalPrice);
        return simulateDelay(newOrder, 0.1); // 10% chance of failure
    } catch (e) {
        return Promise.reject(e);
    }
};

// --- Hotel Services ---
export const searchHotels = async (destination: string, checkIn: string, checkOut: string, guests: number): Promise<Hotel[]> => {
  const data = db.findHotels(destination);
  return simulateDelay(data);
};
export const createHotelBooking = (hotel: Hotel, room: Room, guests: HotelGuest[], checkIn: string, checkOut: string, totalPrice: number): Promise<HotelBookingOrder> => {
    try {
        const newOrder = db.createHotelBookingInDb(hotel, room, guests, checkIn, checkOut, totalPrice);
        return simulateDelay(newOrder, 0.1); // 10% chance of failure
    } catch (e) {
        return Promise.reject(e);
    }
};

// --- Car Rental Services ---
export const searchCars = async (location: string, pickupDate: string, dropoffDate: string): Promise<Car[]> => {
  const data = db.findCars(location);
  return simulateDelay(data);
};
export const createCarBooking = (
  car: Car,
  driver: Driver,
  pickupDate: string,
  dropoffDate: string,
  location: string,
  totalPrice: number
): Promise<CarBooking> => {
    const data = db.createCarBookingInDb({ car, driver, pickupDate, dropoffDate, location, totalPrice });
    return simulateDelay(data, 0.1); // 10% chance of failure
};

// --- Exchange Services ---
export const getCryptoPrices = (): Promise<CryptoCurrency[]> => simulateDelay(db.getCryptoData());
export const getPhysicalRates = (): Promise<PhysicalCurrency[]> => simulateDelay(db.getPhysicalData());
export const getP2POffers = (): Promise<P2POffer[]> => simulateDelay(db.getP2PData());
export const createCashDeliveryRequest = (request: Omit<CashDeliveryRequest, 'id' | 'user' | 'timestamp' | 'status'>): Promise<CashDeliveryRequest> => {
    const data = db.addCashRequest(request);
    return simulateDelay(data);
};
export const swapAssets = (fromCurrency: string, toCurrency: string, amount: number): Promise<UserProfile> => {
    try {
        const data = db.swapAssetsInDb(fromCurrency, toCurrency, amount);
        return simulateDelay(data);
    } catch (e) {
        return Promise.reject(e);
    }
};

// --- Profile & Wallet Services ---
export const getUserProfile = (): Promise<UserProfile> => simulateDelay(db.getProfile());
export const updateUserProfile = (data: { name: string; email: string; }): Promise<UserProfile> => simulateDelay(db.updateProfileInDb(data));
export const addWallet = (wallet: Wallet): Promise<UserProfile> => simulateDelay(db.addWalletInDb(wallet));
export const deleteWallet = (currency: string): Promise<UserProfile> => simulateDelay(db.deleteWalletInDb(currency));

// --- Order Services ---
export const getOrders = (): Promise<Order[]> => simulateDelay(db.getOrders());
export const createP2POrder = (details: { offer: P2POffer, tradeAmount: number, totalPrice: number, localCurrency: string }): Promise<P2POrder> => {
    try {
        const order = db.createP2POrderInDb(details);
        return simulateDelay(order);
    } catch(e) {
        return Promise.reject(e);
    }
};
export const createBankTransferOrder = (details: { fromCurrency: string; fromAmount: number; toCurrency: string; toAmount: number; recipient: BankRecipientDetails; }): Promise<BankTransferOrder> => {
    try {
        const order = db.createBankTransferOrderInDb(details);
        return simulateDelay(order);
    } catch(e) {
        return Promise.reject(e);
    }
};

// --- Shopping Services ---
export const getShoppingCategories = (): Promise<ShoppingCategory[]> => simulateDelay(db.getShoppingCategoriesFromDb());
export const getProductsByCategory = (categoryName: string): Promise<Product[]> => simulateDelay(db.getProductsByCategoryFromDb(categoryName));
export const createProductOrder = (product: Product, shippingAddress: ShippingAddress): Promise<ProductOrder> => {
    try {
        const order = db.createProductOrderInDb(product, shippingAddress);
        return simulateDelay(order);
    } catch(e) {
        return Promise.reject(e);
    }
};

// --- Agent Services ---
export const findUserForAgent = (email: string): Promise<UserProfile> => {
    try {
        const user = db.findUserByEmailInDb(email);
        return simulateDelay(user);
    } catch (e) {
        return Promise.reject(e);
    }
}
export const agentTransferToUser = (userEmail: string, amount: number, currency: string): Promise<{ agentProfile: UserProfile, userProfile: UserProfile }> => {
    try {
        const data = db.agentTransferToUserInDb(userEmail, amount, currency);
        return simulateDelay(data);
    } catch(e) {
        return Promise.reject(e);
    }
}

export const findUserByCardNumber = (cardNumber: string): Promise<{ user: UserProfile, card: VirtualCard }> => {
    try {
        const data = db.findUserByCardNumberInDb(cardNumber);
        return simulateDelay(data);
    } catch(e) {
        return Promise.reject(e);
    }
};


// --- Promo Slides Service ---
export const getPromoSlides = (): Promise<PromoSlide[]> => simulateDelay(db.getPromoSlidesFromDb());

// --- Agent Locations Service ---
export const getAgents = (): Promise<Agent[]> => simulateDelay(db.getAgentsFromDb());

// --- Agent Reporting Service ---
export const getAgentTransactionHistory = (startDate: string, endDate: string): Promise<AgentTransaction[]> => {
    const data = db.getAgentTransactionsFromDb(startDate, endDate);
    return simulateDelay(data);
};

// --- AI Services ---
export const getAiMarketAnalysisStream = gemini.generateMarketAnalysisStream;
export const getIntentFromQuery = (query: string): Promise<AiIntent> => gemini.getIntentFromQuery(query);

// --- Virtual Card Services ---
export const getVirtualCards = (): Promise<VirtualCard[]> => simulateDelay(db.getVirtualCardsFromDb());
export const createVirtualCard = (walletCurrency: string): Promise<VirtualCard> => {
    try {
        const card = db.createVirtualCardInDb(walletCurrency);
        return simulateDelay(card);
    } catch (e) {
        return Promise.reject(e);
    }
};
export const updateVirtualCardStatus = (cardId: string, status: VirtualCard['status']): Promise<VirtualCard> => {
    try {
        const card = db.updateVirtualCardStatusInDb(cardId, status);
        return simulateDelay(card);
    } catch (e) {
        return Promise.reject(e);
    }
};


// --- MERCHANT SERVICES ---
export const getMerchantRecentTransactions = (): Promise<Transaction[]> => {
    return simulateDelay(db.getMerchantRecentTransactionsFromDb());
}
export const findUserForPayment = (email: string): Promise<UserProfile> => {
    return simulateDelay(db.findUserByEmailInDb(email));
}
export const createPaymentRequest = (data: { amount: number, currency: string, mode: 'qr' | 'user_search', userId?: string }): Promise<{paymentId: string}> => {
    return simulateDelay(db.createPaymentRequestInDb(data));
}
export const getPendingPaymentRequest = (userId: string): Promise<PaymentRequest | null> => {
    return simulateDelay(db.getPendingPaymentRequestForUser(userId));
}
export const processPayment = (paymentRequestId: string): Promise<Transaction> => {
    return simulateDelay(db.processPaymentInDb(paymentRequestId));
}


// --- ADMIN PANEL SERVICES ---

// Forex
export const getAdminCashRequests = (): Promise<CashDeliveryRequest[]> => simulateDelay(db.getAdminCashRequestsData());
export const updateAdminCashRequestStatus = (id: string, status: 'Approved' | 'Declined'): Promise<CashDeliveryRequest> => simulateDelay(db.updateAdminCashRequestStatusInDb(id, status));

// Users
export const getAdminUsers = (): Promise<AdminUser[]> => simulateDelay(db.getAdminUsersData());
export const createAdminUser = (userData: Omit<AdminUser, 'id' | 'memberSince' | 'wallets' | 'avatarUrl'>): Promise<AdminUser> => simulateDelay(db.createAdminUserInDb(userData));
export const updateAdminUser = (userId: string, data: { name: string; email: string; avatarUrl: string }): Promise<AdminUser> => simulateDelay(db.updateAdminUserInDb(userId, data));
export const updateAdminUserStatus = (userId: string, status: 'Active' | 'Suspended'): Promise<AdminUser> => simulateDelay(db.updateAdminUserStatusInDb(userId, status));
export const adminAddUserWallet = (userId: string, wallet: Wallet): Promise<AdminUser> => simulateDelay(db.adminAddUserWalletInDb(userId, wallet));
export const adminUpdateUserWallet = (userId: string, currency: string, balance: number): Promise<AdminUser> => simulateDelay(db.adminUpdateUserWalletInDb(userId, currency, balance));
export const adminDeleteUserWallet = (userId: string, currency: string): Promise<void> => simulateDelay(db.adminDeleteUserWalletInDb(userId, currency));

// Dashboard Analytics
export const getAdminRevenueData = (): Promise<RevenueDataPoint[]> => simulateDelay(db.getAdminRevenueDataFromDb());
export const getAdminP2PVolume = (): Promise<P2PVolume> => simulateDelay(db.getAdminP2PVolumeFromDb());
export const getAdminTopCurrencies = (): Promise<TopCurrency[]> => simulateDelay(db.getAdminTopCurrenciesFromDb());

// Revenue Models
export const getRevenueSettings = (): Promise<RevenueSettings> => simulateDelay(db.getRevenueSettingsFromDb());
export const updateRevenueSettings = (settings: RevenueSettings): Promise<void> => simulateDelay(db.updateRevenueSettingsInDb(settings));

// Flights
export const getAdminFlights = (): Promise<Flight[]> => simulateDelay(db.getAdminFlightsFromDb());
export const createAdminFlight = (data: Omit<Flight, 'id'>): Promise<Flight> => simulateDelay(db.createAdminFlightInDb(data));
export const updateAdminFlight = (id: string, data: Partial<Omit<Flight, 'id'>>): Promise<Flight> => simulateDelay(db.updateAdminFlightInDb(id, data));
export const deleteAdminFlight = (id: string): Promise<void> => simulateDelay(db.deleteAdminFlightInDb(id));

// Stores
export const getAdminStores = (): Promise<Store[]> => simulateDelay(db.getAllStoresFromDb());
export const createAdminStore = (data: Omit<Store, 'id'>): Promise<Store> => simulateDelay(db.createStoreInDb(data));
export const updateAdminStore = (id: string, data: Partial<Store>): Promise<Store> => simulateDelay(db.updateStoreInDb(id, data));
export const deleteAdminStore = (id: string): Promise<void> => simulateDelay(db.deleteStoreInDb(id));

// Products
export const getAdminProducts = (storeId: string): Promise<Product[]> => simulateDelay(db.getProductsByStoreIdFromDb(storeId));
export const createAdminProduct = (data: Omit<Product, 'id'>): Promise<Product> => simulateDelay(db.createProductInDb(data));
export const updateAdminProduct = (id: string, data: Partial<Product>): Promise<Product> => simulateDelay(db.updateProductInDb(id, data));
export const deleteAdminProduct = (id: string): Promise<void> => simulateDelay(db.deleteProductInDb(id));

// Promotions
export const getAdminPromoSlides = (): Promise<PromoSlide[]> => simulateDelay(db.getAdminPromoSlidesFromDb());
export const createAdminPromoSlide = (data: Omit<PromoSlide, 'id'>): Promise<PromoSlide> => simulateDelay(db.createAdminPromoSlideInDb(data));
export const updateAdminPromoSlide = (id: string, data: Partial<Omit<PromoSlide, 'id'>>): Promise<PromoSlide> => simulateDelay(db.updateAdminPromoSlideInDb(id, data));
export const deleteAdminPromoSlide = (id: string): Promise<void> => simulateDelay(db.deleteAdminPromoSlideInDb(id));

// Agents
export const getAdminAgents = (): Promise<Agent[]> => simulateDelay(db.getAgentsFromDb());
export const createAdminAgent = (data: Omit<Agent, 'id'>): Promise<Agent> => simulateDelay(db.createAdminAgentInDb(data));
export const updateAdminAgent = (id: string, data: Partial<Omit<Agent, 'id'>>): Promise<Agent> => simulateDelay(db.updateAdminAgentInDb(id, data));
export const deleteAdminAgent = (id: string): Promise<void> => simulateDelay(db.deleteAdminAgentInDb(id));

// Virtual Cards (Admin)
export const getAdminVirtualCards = (userEmail: string): Promise<VirtualCard[]> => simulateDelay(db.getVirtualCardsFromDb(userEmail));
export const createAdminVirtualCard = (userEmail: string, walletCurrency: string): Promise<VirtualCard> => {
    try {
        const card = db.createVirtualCardInDb(walletCurrency, userEmail);
        return simulateDelay(card);
    } catch(e) {
        return Promise.reject(e);
    }
}
export const updateAdminVirtualCardStatus = (cardId: string, status: VirtualCard['status']): Promise<VirtualCard> => {
    try {
        const card = db.updateAdminVirtualCardStatusInDb(cardId, status);
        return simulateDelay(card);
    } catch (e) {
        return Promise.reject(e);
    }
};

// --- Finance Module ---
export const getChartOfAccounts = (): Promise<FinancialAccount[]> => simulateDelay(db.getChartOfAccountsFromDb());
export const getJournalEntries = (): Promise<JournalEntry[]> => simulateDelay(db.getJournalEntriesFromDb());
export const getGeneralLedger = (): Promise<LedgerEntry[]> => simulateDelay(db.getGeneralLedgerFromDb());
export const getFinancialSummary = (): Promise<FinancialSummary> => simulateDelay(db.getFinancialSummaryFromDb());
