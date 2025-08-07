


import React from 'react';

export type Page = 'login' | 'home' | 'flights' | 'exchange' | 'profile' | 'orders' | 'notifications' | 'hotel' | 'car-rental' | 'shopping' | 'agents' | 'agent-transfer' | 'cards' | 'agent-reports' | 'merchant-pos' | 'user-transfer' | 'taxi' | 'sim';
export type ExchangeTab = 'rates' | 'p2p' | 'bank' | 'delivery' | 'swap' | 'ai-analyst';
export type FlightBookingStep = 'search' | 'passengers' | 'confirmation' | 'ticket';
export type HotelBookingStep = 'search' | 'guests' | 'confirmation' | 'success';
export type CarBookingStep = 'search' | 'details' | 'driver' | 'confirmation' | 'success';
export type AdminPage = 'dashboard' | 'forex-requests' | 'flight-management' | 'user-management' | 'revenue-models' | 'store-management' | 'promotions' | 'agent-management' | 'roles-permissions' | 'finance';
export type P2PCurrencyType = 'digital' | 'physical';
export type P2PTradeStep = 'selection' | 'list' | 'trade';
export type P2PTransactionType = 'BUY' | 'SELL';
export type ShoppingStep = 'list' | 'details' | 'checkout' | 'invoice';
export type TaxiStep = 'map_selection' | 'options' | 'payment' | 'booking' | 'tracking';
export type SimStep = 'country_select' | 'plan_list' | 'payment' | 'activation';


export interface AuthState {
  isLoggedIn: boolean;
  user?: {
    name: string;
    role: 'user' | 'agent' | 'guest' | 'merchant' | 'admin';
    email?: string;
    userId?: string;
  };
}

export interface PromoSlide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  link: Page;
}

export interface AiIntent {
  service: Page | 'unknown';
  parameters: {
    origin?: string;
    destination?: string;
    date?: string;
    checkInDate?: string;
    checkOutDate?: string;
    fromCurrency?: string;
    toCurrency?: string;
    amount?: number;
    query?: string; // For shopping
    tab?: ExchangeTab; // for exchange sub-pages
  };
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: {
    code: string;
    city: string;
  };
  destination: {
    code: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type?: 'Systemic' | 'Charter';
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  description: string;
  amenities: string[];
  pricePerNight: number;
  imageUrl: string;
  rooms: Room[];
}

export interface Car {
  id:string;
  name: string;
  brand: string;
  imageUrl: string;
  pricePerDay: number;
  type: 'Economy' | 'SUV' | 'Luxury' | 'Van';
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Gasoline' | 'Diesel' | 'Electric';
  features: string[];
}

export interface Driver {
    id: string;
    fullName: string;
    dateOfBirth: string;
    licenseNumber: string;
}

export interface CarBooking {
  id: string;
  car: Car;
  driver: Driver;
  pickupDate: string;
  dropoffDate: string;
  location: string;
  totalPrice: number;
}


export interface Room {
    id: string;
    name: string;
    price: number;
    beds: number;
    capacity: number;
}

export interface HotelGuest {
    id: string;
    fullName: string;
    email: string;
    phone: string;
}


export interface Passenger {
  id: string; // For React key
  name: string;
  idOrPassport: string;
  dateOfBirth: string;
  passportExpirationDate: string;
  countryOfBirth: string;
  issuingCountry: string;
}

export interface CryptoCurrency {
  name: string;
  symbol: string;
  priceUSD: number;
  change24h: number;
  history?: number[];
}

export interface PhysicalCurrency {
  currency: string;
  code: string;
  rate: number;
  history?: number[];
}

export interface PayoutWallet {
    type: 'wallet';
    currency: string;
}
export interface PayoutBank {
    type: 'bank';
    currency: string;
    recipient: BankRecipientDetails;
}
export type PayoutDetails = PayoutWallet | PayoutBank;

export interface P2POffer {
  id: string;
  userName: string;
  userRating: number;
  type: P2PTransactionType;
  currency: 'USD';
  amountAvailable: number;
  pricePerUnit: number;
  paymentMethods: string[];
  payoutDetails: PayoutDetails;
}

export interface Wallet {
  type: 'Fiat' | 'Crypto' | 'Rewards';
  currency: string;
  balance: number;
  symbol?: string;
  name?: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  memberSince: string;
  avatarUrl: string;
  wallets: Wallet[];
}

export interface AdminUser extends UserProfile {
    id: string;
    status: 'Active' | 'Suspended';
    role: 'User' | 'Admin' | 'Support' | 'Finance';
    accountType: 'Registered' | 'Guest';
}

export interface CashDeliveryRequest {
  id: string;
  user: string; // For simplicity, we'll just use a name
  timestamp: string;
  currency: string;
  amount: string;
  country: string;
  city: string;
  address: string;
  contact: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export interface P2POrder {
    type: 'p2p';
    id: string;
    timestamp: string;
    offer: P2POffer;
    tradeAmount: number; // The amount of currency traded (e.g., 100 USD)
    totalPrice: number; // The total price paid in the local currency (e.g., 3550 LCU)
    localCurrency: string; // The local currency used (e.g., 'LCU')
}

// --- Shopping Types ---
export interface ShoppingCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
}

export interface Store {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
}

export interface Product {
    id: string;
    storeId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ProductOrder {
    type: 'product';
    id: string;
    timestamp: string;
    product: Product;
    totalPrice: number;
    shippingAddress: ShippingAddress;
}

export interface BankRecipientDetails {
    fullName: string;
    accountNumber: string; // IBAN or local account number
    bankName: string;
}

export interface BankTransferOrder {
    type: 'bank';
    id: string;
    timestamp: string;
    fromCurrency: string;
    fromAmount: number;
    toCurrency: string;
    toAmount: number;
    recipient: BankRecipientDetails;
    status: 'Processing' | 'Completed' | 'Failed';
}

export interface FlightOrder {
    type: 'flight';
    id: string;
    timestamp: string;
    flight: Flight;
    passengers: Passenger[];
    totalPrice: number;
    seatAssignments: { passengerId: string; seat: string; }[];
    gate: string;
}

export interface HotelBookingOrder {
    type: 'hotel';
    id: string;
    timestamp: string;
    hotel: Hotel;
    room: Room;
    guests: HotelGuest[];
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
}

export interface UserTransferOrder {
    type: 'user-transfer';
    id: string;
    timestamp: string;
    senderId: string;
    senderEmail: string;
    senderName: string;
    receiverId: string;
    receiverEmail: string;
    receiverName: string;
    amountSent: number;
    fee: number;
    amountReceived: number;
    currency: string;
}

export type RideProvider = 'Snapp' | 'Tapsi';
export type TaxiRideType = 'Eco' | 'Premium';

export interface RideOption {
  provider: RideProvider;
  rideType: TaxiRideType;
  price: number;
  eta: number; // minutes
}

export interface TaxiOrder {
    type: 'taxi';
    id: string;
    timestamp: string;
    provider: RideProvider;
    rideType: TaxiRideType;
    from: string;
    to: string;
    price: number;
    driverInfo: {
        name: string;
        carModel: string;
        licensePlate: string;
        rating: number;
    };
}

export interface ESimPlan {
    id: string;
    country: string;
    dataAmountGB: number;
    validityDays: number;
    priceUSD: number;
}

export interface ESimOrder {
    type: 'esim';
    id: string;
    timestamp: string;
    plan: ESimPlan;
    qrCodeValue: string; // This will be a stringified JSON for the QR code
}

export type Order = P2POrder | ProductOrder | BankTransferOrder | FlightOrder | HotelBookingOrder | UserTransferOrder | TaxiOrder | ESimOrder;


// --- Analytics Types ---
export interface RevenueDataPoint {
  month: string;
  flights: number;
  hotels: number;
  exchange: number;
}

export interface P2PVolume {
  buyVolume: number;
  sellVolume: number;
}

export interface TopCurrency {
  name: string;
  symbol: string;
  volumeUSD: number;
}

// --- Revenue Model Types ---
export interface FeeModel {
  type: 'fixed' | 'percentage';
  value: number;
}

export interface ExchangeFeeSettings {
  p2p: FeeModel;
  bankTransfer: FeeModel;
  cashDelivery: FeeModel;
}

export interface RevenueSettings {
  flightBooking: FeeModel;
  hotelBooking: FeeModel;
  exchange: ExchangeFeeSettings;
  marketplaceCommission: FeeModel;
  userTransfer: FeeModel;
}

// --- Agent Types ---
export interface Agent {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  operatingHours: string;
  latitude: number;
  longitude: number;
}

export interface AgentTransaction {
  id: string;
  timestamp: string;
  type: 'User Credit';
  userEmail: string;
  amount: number;
  currency: string;
  commission: number; // The commission earned by the agent on this transaction
}


// --- Professional Accounting Types ---

export interface FinancialAccount {
    id: string;
    name: string;
    type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    balance: number; // Calculated field, not stored
}

export interface LedgerEntry {
    id: string;
    journalId: string;
    accountId: string;
    accountName?: string; // For display purposes
    type: 'debit' | 'credit';
    amount: number;
    timestamp: string;
}

export interface JournalEntry {
    id: string;
    description: string;
    timestamp: string;
    entries: LedgerEntry[];
    relatedDocumentId?: string; // e.g., flight order ID, p2p trade ID
}

export interface FinancialSummary {
    totalRevenue: number;
    netProfit: number;
    userLiabilities: number;
    houseLiquidity: number;
}

// --- Virtual Card Type ---
export interface VirtualCard {
  id: string;
  userId: string; // The email of the user for simplicity
  walletCurrency: string;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string; // MM/YY
  cvv: string;
  status: 'Active' | 'Frozen' | 'Cancelled';
}

// --- Merchant Types ---
export interface Merchant {
  id: string;
  name: string;
  email: string;
  logoUrl: string;
  wallets: Wallet[];
}

export interface Transaction {
    id: string;
    merchantId: string;
    userId: string;
    userName: string; // Denormalized for easy display
    amount: number;
    currency: string;
    timestamp: string;
    status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
}

export interface PaymentRequest {
    id: string;
    merchantId: string;
    merchantName: string;
    merchantLogoUrl: string;
    userId: string;
    amount: number;
    currency: string;
    status: 'Pending' | 'Completed';
}