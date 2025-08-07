import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShoppingCategory, Product, ProductOrder, ShoppingStep, ShippingAddress, VirtualCard, Wallet } from '../../types';
import { getShoppingCategories, getProductsByCategory, createProductOrder, getVirtualCards, getUserProfile } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import ProductCard from './components/ProductCard';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Sub-components for better structure ---

const CategoryCircle: React.FC<{
  category: ShoppingCategory;
  onClick: () => void;
  isActive: boolean;
}> = ({ category, onClick, isActive }) => (
  <button
    onClick={onClick}
    className="relative flex flex-col items-center justify-center gap-3 p-2 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 rounded-lg"
    aria-label={`Show ${category.name}`}
  >
    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform group-hover:scale-110 ${isActive ? 'bg-sky-600 border-sky-500' : 'bg-slate-800 border-slate-700 group-hover:border-sky-500 group-hover:bg-slate-700'}`}>
      <span className={isActive ? 'text-white' : 'text-sky-400'}>{category.icon}</span>
    </div>
    <span className={`font-semibold text-center transition-colors duration-300 ${isActive ? 'text-sky-600' : 'text-slate-700 group-hover:text-sky-600'}`}>{category.name}</span>
  </button>
);

const ProductListView: React.FC<{
    products: Product[];
    onSelect: (product: Product) => void;
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    categoryName: string;
}> = ({ products, onSelect, isLoading, searchTerm, setSearchTerm, categoryName }) => {
    
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);
    
    if (isLoading) return <Spinner message="Loading products..." />;
    
    return (
        <div>
             <div className="max-w-lg mx-auto mb-8">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search in ${categoryName}...`}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-full text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
                        aria-label="Search products"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            {filteredProducts.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={() => onSelect(product)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500">
                    No products found {searchTerm ? `for "${searchTerm}"` : ''} in this category.
                </div>
            )}
        </div>
    );
};

const ProductDetailView: React.FC<{ product: Product; onBack: () => void; onProceed: () => void; }> = ({ product, onBack, onProceed }) => (
    <div className="max-w-4xl mx-auto">
        <Card className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 border-slate-200">
            <div>
                <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
            </div>
            <div className="flex flex-col p-2">
                <span className="text-sm font-semibold text-sky-600 uppercase">{product.category}</span>
                <h1 className="text-3xl font-bold text-slate-900 my-2">{product.name}</h1>
                <p className="text-slate-600 flex-grow mb-4">{product.description}</p>
                <div className="text-4xl font-extrabold text-slate-800 mb-6">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="mt-auto space-y-2">
                    <button onClick={onProceed} className="w-full bg-sky-600 text-white py-3 rounded-md font-semibold hover:bg-sky-500 transition-colors">
                        Proceed to Buy
                    </button>
                     <button onClick={onBack} className="w-full bg-slate-200 text-slate-700 py-2 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                        &larr; Back to Products
                    </button>
                </div>
            </div>
        </Card>
    </div>
);

const CheckoutView: React.FC<{ product: Product; onBack: () => void; onConfirm: (address: ShippingAddress) => void; isProcessing: boolean }> = ({ product, onBack, onConfirm, isProcessing }) => {
    const [address, setAddress] = useState<ShippingAddress>({ fullName: '', streetAddress: '', city: '', postalCode: '', country: '' });
    const [paymentMethod, setPaymentMethod] = useState('default'); // 'default' or card.id
    const [cards, setCards] = useState<VirtualCard[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [cardData, profileData] = await Promise.all([getVirtualCards(), getUserProfile()]);
                setCards(cardData);
                setWallets(profileData.wallets);
            } catch (e) { console.error("Failed to load user payment data", e); }
        };
        fetchUserData();
    }, []);

    const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        for (const key in address) {
            if (!address[key as keyof ShippingAddress]) {
                alert(`Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return;
            }
        }
        if (paymentMethod !== 'default') {
            const selectedCard = cards.find(c => c.id === paymentMethod);
            if (!selectedCard) { alert("Invalid card selected."); return; }
            if (selectedCard.status !== 'Active') { alert("Selected card is not active."); return; }

            const linkedWallet = wallets.find(w => w.currency === selectedCard.walletCurrency);
            if (!linkedWallet || linkedWallet.balance < product.price) {
                alert(`Insufficient balance in the wallet linked to the selected card (${selectedCard.walletCurrency}).`);
                return;
            }
        }
        onConfirm(address);
    }
    
    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <Card className="p-6 border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Checkout</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800">Shipping Address</h3>
                            {/* ... address fields ... */}
                             <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input id="fullName" value={address.fullName} onChange={e => handleAddressChange('fullName', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="streetAddress" className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                <input id="streetAddress" value={address.streetAddress} onChange={e => handleAddressChange('streetAddress', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
                            </div>
                             <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <input id="city" value={address.city} onChange={e => handleAddressChange('city', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                                <input id="postalCode" value={address.postalCode} onChange={e => handleAddressChange('postalCode', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                <input id="country" value={address.country} onChange={e => handleAddressChange('country', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2" />
                            </div>
                        </div>
                        <div className="md:col-span-2 pt-4 mt-4 border-t">
                             <h3 className="text-lg font-semibold text-slate-800">Payment</h3>
                              <p className="text-sm text-slate-500 mb-2">Pay with your TRAVEL PAY wallet or a linked virtual card.</p>
                              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2">
                                <option value="default">Default Wallet (USD)</option>
                                {cards.map(card => <option key={card.id} value={card.id}>Card •••• {card.cardNumber.slice(-4)} ({card.walletCurrency})</option>)}
                              </select>
                        </div>
                    </div>
                     <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-6">
                        <button type="button" onClick={onBack} className="bg-slate-200 text-slate-800 px-6 py-2 rounded-md font-semibold hover:bg-slate-300">
                          Back
                        </button>
                        <button type="submit" disabled={isProcessing} className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-500 disabled:bg-slate-400">
                          {isProcessing ? 'Processing...' : `Pay $${product.price.toFixed(2)}`}
                        </button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

const InvoiceView: React.FC<{ order: ProductOrder; onBack: () => void; }> = ({ order, onBack }) => {
    
    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Purchase Invoice", 14, 22);
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 14, 30);
        doc.text(`Date: ${new Date(order.timestamp).toLocaleString()}`, 14, 36);

        autoTable(doc, {
            startY: 45,
            head: [['Item', 'Details']],
            body: [
                ['Product', order.product.name],
                ['Category', order.product.category],
                ['Price', `$${order.totalPrice.toFixed(2)}`],
                ['Shipping To', `${order.shippingAddress.fullName}\n${order.shippingAddress.streetAddress}\n${order.shippingAddress.city}, ${order.shippingAddress.postalCode}\n${order.shippingAddress.country}`]
            ]
        });
        
        doc.save(`invoice_${order.id}.pdf`);
    };

    return (
        <div className="max-w-xl mx-auto">
             <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                     <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Purchase Complete!</h1>
                <p className="text-slate-600 mt-2">Your order has been placed successfully.</p>
            </div>
             <Card className="p-6 border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{order.product.name}</h3>
                        <p className="text-sm text-slate-500 font-mono">ID: {order.id}</p>
                    </div>
                    <p className="font-bold text-xl text-slate-800">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div className="my-4 border-t pt-4">
                    <h4 className="font-semibold text-slate-700 mb-1">Shipping to:</h4>
                    <address className="not-italic text-sm text-slate-600">
                        {order.shippingAddress.fullName}<br/>
                        {order.shippingAddress.streetAddress}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                        {order.shippingAddress.country}
                    </address>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={handleDownload} className="w-full bg-slate-600 text-white py-2 rounded-md font-semibold hover:bg-slate-700 flex items-center justify-center gap-2">
                        {ICONS.orders} Download Invoice
                    </button>
                    <button onClick={onBack} className="w-full bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700">
                        Continue Shopping
                    </button>
                </div>
            </Card>
        </div>
    );
};

// --- Main Page Component ---
interface ShoppingHomePageProps {
    context?: {
        query?: string;
    } | null;
}

const ShoppingHomePage: React.FC<ShoppingHomePageProps> = ({ context }) => {
    // Flow control state
    const [step, setStep] = useState<ShoppingStep>('list');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [finalOrder, setFinalOrder] = useState<ProductOrder | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Data state
    const [categories, setCategories] = useState<ShoppingCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<ShoppingCategory | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Initial category loading
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getShoppingCategories();
                setCategories(data);
                if (data.length > 0) {
                    setActiveCategory(data[0]);
                }
            } catch (e) { console.error(e) } 
            finally { setIsLoadingCategories(false); }
        };
        fetchCategories();
    }, []);

    // Product loading when category changes
    useEffect(() => {
        if (!activeCategory) return;
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            try {
                const data = await getProductsByCategory(activeCategory.name);
                setProducts(data);
            } catch (e) { console.error(e) } 
            finally { setIsLoadingProducts(false); }
        };
        fetchProducts();
    }, [activeCategory]);
    
    // Handle AI context
    useEffect(() => {
        if (context?.query) {
            setSearchTerm(context.query);
        }
    }, [context]);

    const handleConfirmOrder = async (address: ShippingAddress) => {
        if (!selectedProduct) return;
        setIsProcessing(true);
        try {
            const order = await createProductOrder(selectedProduct, address);
            setFinalOrder(order);
            setStep('invoice');
        } catch (e) {
            alert(`Order failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const resetFlow = () => {
        setStep('list');
        setSelectedProduct(null);
        setFinalOrder(null);
    };

    const renderContent = () => {
        switch(step) {
            case 'details':
                return selectedProduct && <ProductDetailView product={selectedProduct} onBack={() => setStep('list')} onProceed={() => setStep('checkout')} />;
            case 'checkout':
                return selectedProduct && <CheckoutView product={selectedProduct} onBack={() => setStep('details')} onConfirm={handleConfirmOrder} isProcessing={isProcessing} />;
            case 'invoice':
                return finalOrder && <InvoiceView order={finalOrder} onBack={resetFlow} />;
            case 'list':
            default:
                return activeCategory ? (
                    <ProductListView products={products} onSelect={(p) => {setSelectedProduct(p); setStep('details');}} isLoading={isLoadingProducts} searchTerm={searchTerm} setSearchTerm={setSearchTerm} categoryName={activeCategory.name} />
                ) : <p className="text-center text-slate-500">Select a category to start shopping.</p>;
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.store}
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
                <p className="text-slate-600 mt-1">Shop from our curated list of partner stores.</p>
            </div>
            
            {/* Category Selector */}
            {step === 'list' && (
                <div className="mb-10">
                    {isLoadingCategories ? <Spinner message="Loading categories..." /> : (
                        <div className="flex justify-center items-center gap-4 md:gap-8 overflow-x-auto pb-4 -mx-4 px-4">
                            {categories.map(cat => (
                                <CategoryCircle key={cat.id} category={cat} onClick={() => setActiveCategory(cat)} isActive={activeCategory?.id === cat.id} />
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {renderContent()}
        </div>
    );
};

export default ShoppingHomePage;