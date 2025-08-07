
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
  RideOption,
  TaxiOrder,
  ESimPlan,
  ESimOrder,
} from '../types';
import * as db from './dummyDataService';
import * as gemini from './geminiService';
import { setCurrentUser } from './currentUser';

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
export const authenticate = (email: string, password: string, role: 'user' | 'agent' | 'merchant'): Promise<{name: string, email: string, role: 'user' | 'agent' | 'merchant', userId?: string}> => {
    try {
        const user = db.authenticateInDb(email, password, role);
        setCurrentUser({ name: user.name, role: user.role, email: user.email, userId: user.userId });
        window.dispatchEvent(new Event('authchange')); // Notify router of auth change
        return simulateDelay(user);
    } catch (e) {
        return Promise.reject(e);
    }
}

// --- Flight Services ---
export const searchFlights = (origin: string, destination: string, date: string): Promise<Flight[]> => {
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
export const searchHotels = (destination: string, checkIn: string, checkOut: string, guests: number): Promise<Hotel[]> => {
  const data = db.findHotels(destination);
  return simulateDelay(data);
};
export const createHotelBooking = (hotel: Hotel, room: Room, guests: HotelGuest[], checkIn: string, checkOut: string, totalPrice: number): Promise<HotelBookingOrder> => {
    try {
        const newOrder = db.createHotelBookingInDb(hotel, room, guests, checkIn, checkOut, totalPrice);
        return simulateDelay(newOrder, 0.1);
    } catch (e) {
        return Promise.reject(e);
    }
};

// --- Car Rental Services ---
export const searchCars = async (location: string, pickupDate: string, dropoffDate: string): Promise<Car[]> => {
  const data = db.findCars(location, pickupDate, dropoffDate);
  return simulateDelay(data);
};
export const createCarBooking = (car: Car, driver: Driver, pickupDate: string, dropoffDate: string, location: string, totalPrice: number): Promise<CarBooking> => {
  try {
    const newBooking = db.createCarBookingInDb({ car, driver, pickupDate, dropoffDate, location, totalPrice });
    return simulateDelay(newBooking, 0.1);
  } catch(e) {
    return Promise.reject(e);
  }
};

// --- Exchange & Market Data ---
export const getCryptoPrices = (): Promise<CryptoCurrency[]> => simulateDelay(db.getCryptoData());
export const getPhysicalRates = (): Promise<PhysicalCurrency[]> => simulateDelay(db.getPhysicalData());
export const getP2POffers = (): Promise<P2POffer[]> => simulateDelay(db.getP2PData());
export const createP2POrder = (details: { offer: P2POffer, tradeAmount: number, totalPrice: number, localCurrency: string }): Promise<P2POrder> => {
    try {
        return simulateDelay(db.createP2POrderInDb(details));
    } catch (e) {
        return Promise.reject(e);
    }
};
export const createBankTransferOrder = (details: { fromCurrency: string; fromAmount: number; toCurrency: string; toAmount: number; recipient: BankRecipientDetails; }): Promise<BankTransferOrder> => {
    try {
        return simulateDelay(db.createBankTransferOrderInDb(details));
    } catch(e) {
        return Promise.reject(e);
    }
};
export const createCashDeliveryRequest = (request: Omit<CashDeliveryRequest, 'id' | 'user' | 'timestamp' | 'status'>): Promise<CashDeliveryRequest> => {
    return simulateDelay(db.addCashRequest(request));
};
export const swapAssets = (from: string, to: string, amount: number): Promise<UserProfile> => {
    try {
        return simulateDelay(db.swapAssetsInDb(from, to, amount));
    } catch(e) {
        return Promise.reject(e);
    }
};

// --- User Profile & Wallets ---
export const getUserProfile = (): Promise<UserProfile> => simulateDelay(db.getProfile());
export const updateUserProfile = (data: { name: string; email: string }): Promise<UserProfile> => simulateDelay(db.updateProfileInDb(data));
export const addWallet = (wallet: Wallet): Promise<UserProfile> => simulateDelay(db.addWalletInDb(wallet));
export const deleteWallet = (currency: string): Promise<UserProfile> => simulateDelay(db.deleteWalletInDb(currency));

// --- Orders ---
export const getOrders = (): Promise<Order[]> => simulateDelay(db.getOrders());

// --- Shopping ---
export const getShoppingCategories = (): Promise<ShoppingCategory[]> => simulateDelay(db.getShoppingCategoriesFromDb());
export const getProductsByCategory = (category: string): Promise<Product[]> => simulateDelay(db.getProductsByCategoryFromDb(category));
export const createProductOrder = (product: Product, shippingAddress: ShippingAddress): Promise<ProductOrder> => {
    try {
        return simulateDelay(db.createProductOrderInDb(product, shippingAddress));
    } catch (e) {
        return Promise.reject(e);
    }
};

// --- Promotions ---
export const getPromoSlides = (): Promise<PromoSlide[]> => simulateDelay(db.getPromoSlidesFromDb());

// --- Agents ---
export const getAgents = (): Promise<Agent[]> => simulateDelay(db.getAgentsFromDb());
export const findUserForAgent = (email: string): Promise<UserProfile> => simulateDelay(db.findUserByEmailInDb(email));
export const agentTransferToUser = (email: string, amount: number, currency: string): Promise<any> => {
    try {
        return simulateDelay(db.agentTransferToUserInDb(email, amount, currency));
    } catch(e) {
        return Promise.reject(e);
    }
};
export const getAgentTransactionHistory = (start: string, end: string): Promise<AgentTransaction[]> => simulateDelay(db.getAgentTransactionsFromDb(start, end));

// --- User-to-User Transfers ---
export const findUserByUserId = (userId: string): Promise<UserProfile> => simulateDelay(db.findUserByUserIdInDb(userId));
export const initiateUserTransfer = (receiverId: string, amount: number, currency: string): Promise<UserProfile> => {
    try {
        return simulateDelay(db.initiateUserTransferInDb(receiverId, amount, currency));
    } catch (e) {
        return Promise.reject(e);
    }
};

// --- Virtual Cards ---
export const getVirtualCards = (): Promise<VirtualCard[]> => simulateDelay(db.getVirtualCardsFromDb());
export const createVirtualCard = (walletCurrency: string): Promise<VirtualCard> => simulateDelay(db.createVirtualCardInDb(walletCurrency));
export const updateVirtualCardStatus = (cardId: string, status: VirtualCard['status']): Promise<VirtualCard> => simulateDelay(db.updateVirtualCardStatusInDb(cardId, status));
export const findUserByCardNumber = (cardNumber: string): Promise<{ user: UserProfile, card: VirtualCard }> => simulateDelay(db.findUserByCardNumberInDb(cardNumber));


// --- Merchant Services ---
export const getMerchantRecentTransactions = (): Promise<Transaction[]> => simulateDelay(db.getMerchantRecentTransactionsFromDb());
export const findUserForPayment = (email: string): Promise<UserProfile> => simulateDelay(db.findUserByEmailInDb(email));
export const createPaymentRequest = (data: any): Promise<{ paymentId: string }> => simulateDelay(db.createPaymentRequestInDb(data));
export const getPendingPaymentRequest = (userId: string): Promise<PaymentRequest | null> => simulateDelay(db.getPendingPaymentRequestForUser(userId));
export const processPayment = (paymentRequestId: string): Promise<Transaction> => simulateDelay(db.processPaymentInDb(paymentRequestId));

// --- Ride Hailing / Taxi ---
export const searchRides = (from: string, to: string): Promise<RideOption[]> => simulateDelay(db.searchRidesInDb(from, to));
export const bookRide = (option: RideOption, from: string, to: string): Promise<TaxiOrder> => {
    try {
        return simulateDelay(db.bookRideInDb(option, from, to));
    } catch(e) { return Promise.reject(e); }
};

// --- eSIM ---
export const getESimPlans = (country: string): Promise<ESimPlan[]> => simulateDelay(db.getESimPlansInDb(country));
export const purchaseESim = (planId: string): Promise<ESimOrder> => {
    try {
        return simulateDelay(db.purchaseESimInDb(planId));
    } catch (e) { return Promise.reject(e); }
};


// --- ADMIN PANEL SERVICES ---
export const getAdminCashRequests = (): Promise<CashDeliveryRequest[]> => simulateDelay(db.getAdminCashRequestsData());
export const updateAdminCashRequestStatus = (id: string, status: 'Approved' | 'Declined'): Promise<CashDeliveryRequest> => simulateDelay(db.updateAdminCashRequestStatusInDb(id, status));
export const getAdminUsers = (): Promise<AdminUser[]> => simulateDelay(db.getAdminUsersData());
export const createAdminUser = (data: any): Promise<AdminUser> => simulateDelay(db.createAdminUserInDb(data));
export const updateAdminUser = (id: string, data: any): Promise<AdminUser> => simulateDelay(db.updateAdminUserInDb(id, data));
export const updateAdminUserStatus = (id: string, status: 'Active' | 'Suspended'): Promise<AdminUser> => simulateDelay(db.updateAdminUserStatusInDb(id, status));
export const adminAddUserWallet = (id: string, wallet: Wallet): Promise<AdminUser> => simulateDelay(db.adminAddUserWalletInDb(id, wallet));
export const adminUpdateUserWallet = (id: string, currency: string, balance: number): Promise<AdminUser> => simulateDelay(db.adminUpdateUserWalletInDb(id, currency, balance));
export const adminDeleteUserWallet = (id: string, currency: string): Promise<void> => simulateDelay(db.adminDeleteUserWalletInDb(id, currency));
export const getAdminRevenueData = (): Promise<RevenueDataPoint[]> => simulateDelay(db.getAdminRevenueDataFromDb());
export const getAdminP2PVolume = (): Promise<P2PVolume> => simulateDelay(db.getAdminP2PVolumeFromDb());
export const getAdminTopCurrencies = (): Promise<TopCurrency[]> => simulateDelay(db.getAdminTopCurrenciesFromDb());
export const getRevenueSettings = (): Promise<RevenueSettings> => simulateDelay(db.getRevenueSettingsFromDb());
export const updateRevenueSettings = (settings: RevenueSettings): Promise<void> => simulateDelay(db.updateRevenueSettingsInDb(settings));
export const getAdminFlights = (): Promise<Flight[]> => simulateDelay(db.getAdminFlightsFromDb());
export const createAdminFlight = (data: any): Promise<Flight> => simulateDelay(db.createAdminFlightInDb(data));
export const updateAdminFlight = (id: string, data: any): Promise<Flight> => simulateDelay(db.updateAdminFlightInDb(id, data));
export const deleteAdminFlight = (id: string): Promise<void> => simulateDelay(db.deleteAdminFlightInDb(id));
export const getAdminStores = (): Promise<Store[]> => simulateDelay(db.getAllStoresFromDb());
export const createAdminStore = (data: any): Promise<Store> => simulateDelay(db.createStoreInDb(data));
export const updateAdminStore = (id: string, data: any): Promise<Store> => simulateDelay(db.updateStoreInDb(id, data));
export const deleteAdminStore = (id: string): Promise<void> => simulateDelay(db.deleteStoreInDb(id));
export const getAdminProducts = (storeId: string): Promise<Product[]> => simulateDelay(db.getProductsByStoreIdFromDb(storeId));
export const createAdminProduct = (data: any): Promise<Product> => simulateDelay(db.createProductInDb(data));
export const updateAdminProduct = (id: string, data: any): Promise<Product> => simulateDelay(db.updateProductInDb(id, data));
export const deleteAdminProduct = (id: string): Promise<void> => simulateDelay(db.deleteProductInDb(id));
export const getAdminPromoSlides = (): Promise<PromoSlide[]> => simulateDelay(db.getAdminPromoSlidesFromDb());
export const createAdminPromoSlide = (data: any): Promise<PromoSlide> => simulateDelay(db.createAdminPromoSlideInDb(data));
export const updateAdminPromoSlide = (id: string, data: any): Promise<PromoSlide> => simulateDelay(db.updateAdminPromoSlideInDb(id, data));
export const deleteAdminPromoSlide = (id: string): Promise<void> => simulateDelay(db.deleteAdminPromoSlideInDb(id));
export const getAdminAgents = (): Promise<Agent[]> => simulateDelay(db.getAgentsFromDb());
export const createAdminAgent = (data: any): Promise<Agent> => simulateDelay(db.createAdminAgentInDb(data));
export const updateAdminAgent = (id: string, data: any): Promise<Agent> => simulateDelay(db.updateAdminAgentInDb(id, data));
export const deleteAdminAgent = (id: string): Promise<void> => simulateDelay(db.deleteAdminAgentInDb(id));
export const getAdminVirtualCards = (email: string): Promise<VirtualCard[]> => simulateDelay(db.getVirtualCardsFromDb(email));
export const createAdminVirtualCard = (email: string, currency: string): Promise<VirtualCard> => simulateDelay(db.createVirtualCardInDb(currency, email));
export const updateAdminVirtualCardStatus = (id: string, status: VirtualCard['status']): Promise<VirtualCard> => simulateDelay(db.updateAdminVirtualCardStatusInDb(id, status));

// --- Admin Finance ---
export const getFinancialSummary = (): Promise<FinancialSummary> => simulateDelay(db.getFinancialSummaryFromDb());
export const getJournalEntries = (): Promise<JournalEntry[]> => simulateDelay(db.getJournalEntriesFromDb());
export const getGeneralLedger = (): Promise<LedgerEntry[]> => simulateDelay(db.getGeneralLedgerFromDb());
export const getChartOfAccounts = (): Promise<FinancialAccount[]> => simulateDelay(db.getChartOfAccountsFromDb());


// --- Gemini AI Services ---
export const getIntentFromQuery = (query: string): Promise<AiIntent> => gemini.getIntentFromQuery(query);
export const getAiMarketAnalysisStream = (query: string): AsyncGenerator<string> => gemini.generateMarketAnalysisStream(query);
