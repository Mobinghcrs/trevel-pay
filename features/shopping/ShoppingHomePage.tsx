
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShoppingCategory, Product, ProductOrder, ShoppingStep, ShippingAddress, VirtualCard, Wallet } from '../../types';
import { getShoppingCategories, getProductsByCategory, createProductOrder, getVirtualCards, getUserProfile } from '../../services/apiService';
import Spinner from '../../components/Spinner';
import ProductCard from './components/ProductCard';
import Card from '../../components/Card';
import { ICONS } from '../../constants';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
                <div className="text-4xl font-extrabold text-slate-800 mb-6">${product.price.toFixed(2)}</div>
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
                                <input id="fullName" type="text" value={address.fullName} onChange={e => handleAddressChange('fullName', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label htmlFor="streetAddress" className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                <input id="streetAddress" type="text" value={address.streetAddress} onChange={e => handleAddressChange('streetAddress', e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500" placeholder="123 SuperApp Street" />
                            </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4 border-t border-slate-200 pt-6 mt-2">
                            <h3 className="text-lg font-semibold text-slate-800">Payment Method</h3>
                             <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500">
                                <option value="default">Default Wallet (USD)</option>
                                {cards.map(card => (
                                    <option key={card.id} value={card.id}>
                                        TRAVEL PAY Card ({card.cardNumber.slice(-4)}) - {card.walletCurrency}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-4 border-t border-slate-200 pt-6 mt-2">
                            <h3 className="text-lg font-semibold text-slate-800">Order Summary</h3>
                            {/* ... order summary ... */}
                            <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-4">
                                <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-md object-cover bg-white"/>
                                <p className="font-semibold text-slate-800 flex-grow">{product.name}</p>
                                <p className="font-bold text-lg text-slate-800">${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
                        <button type="button" onClick={onBack} className="bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 transition-colors">
                            Back to Details
                        </button>
                        <button type="submit" disabled={isProcessing} className="bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-500 transition-colors disabled:bg-slate-400">
                            {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                        </button>
                    </div>
                </Card>
            </form>
        </div>
    );
};


const InvoiceView: React.FC<{ order: ProductOrder; onBack: () => void; }> = ({ order, onBack }) => {
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Purchase Invoice", 14, 22);
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 14, 30);
        doc.text(`Date: ${new Date(order.timestamp).toLocaleString()}`, 14, 36);

        (doc as any).autoTable({
            startY: 45,
            head: [['Item', 'Description', 'Price']],
            body: [[order.product.name, order.product.description, `$${order.totalPrice.toFixed(2)}`]],
            theme: 'striped',
        });
        
        let finalY = (doc as any).lastAutoTable.finalY + 10;
        
        doc.setFontSize(14);
        doc.text("Shipping Address", 14, finalY);
        const address = order.shippingAddress;
        const addressText = `${address.fullName}\n${address.streetAddress}\n${address.city}, ${address.postalCode}\n${address.country}`;
        doc.setFontSize(11);
        doc.text(addressText, 14, finalY + 7);
        
        doc.save(`TravelPay_Invoice_${order.id.slice(-6)}.pdf`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="p-6 md:p-8 bg-white border border-slate-200 shadow-lg">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Purchase Successful!</h2>
                    <p className="text-slate-500 mt-1">Your order has been confirmed and is being processed.</p>
                </div>
                
                <div className="my-6 border-t border-slate-200" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Shipping To:</h3>
                        <div className="text-slate-600">
                            <p><strong>{order.shippingAddress.fullName}</strong></p>
                            <p>{order.shippingAddress.streetAddress}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Order Details:</h3>
                        <div className="text-slate-600 space-y-1">
                            <div className="flex justify-between"><span>Order ID:</span> <span className="font-mono">{order.id}</span></div>
                            <div className="flex justify-between"><span>Date:</span> <span className="font-mono">{new Date(order.timestamp).toLocaleDateString()}</span></div>
                        </div>
                    </div>
                </div>

                <div className="my-6 border-t border-slate-200" />
                
                <h3 className="font-semibold text-slate-800 mb-2">Items Ordered:</h3>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-4 border border-slate-200">
                    <img src={order.product.imageUrl} alt={order.product.name} className="h-16 w-16 rounded-md object-cover bg-white"/>
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-800">{order.product.name}</p>
                    </div>
                    <p className="font-semibold text-slate-800">${order.totalPrice.toFixed(2)}</p>
                </div>
                
                 <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-4 mt-6">
                    <span>Total Paid</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-2">
                    <button onClick={onBack} className="w-full bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-500 transition-colors">
                        Continue Shopping
                    </button>
                    <button onClick={handleDownloadPDF} className="w-full bg-slate-600 text-white py-2 rounded-md font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                        {ICONS.orders}
                        <span>Download Invoice</span>
                    </button>
                </div>
            </Card>
        </div>
    );
};


// --- Main Component ---

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

    // Data state
    const [categories, setCategories] = useState<ShoppingCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false); // For product loading and purchasing
    const [error, setError] = useState<string | null>(null);
    
    const handleSelectCategory = useCallback(async (category: ShoppingCategory) => {
        setSelectedCategory(category);
        setSearchTerm('');
        setIsActionLoading(true);
        setProducts([]);
        try {
            const productData = await getProductsByCategory(category.name);
            setProducts(productData);
        } catch (err) {
             setError(err instanceof Error ? err.message : "Failed to load products.");
        } finally {
            setIsActionLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const data = await getShoppingCategories();
                setCategories(data);
                if (data.length > 0) {
                  handleSelectCategory(data[0]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load categories.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [handleSelectCategory]);

    useEffect(() => {
        // Pre-fill search term from context
        if (context?.query) {
            setSearchTerm(context.query);
        }
    }, [context]);

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setStep('details');
    };

    const handleConfirmPurchase = async (address: ShippingAddress) => {
        if (!selectedProduct) return;
        setIsActionLoading(true);
        try {
            const newOrder = await createProductOrder(selectedProduct, address);
            setFinalOrder(newOrder);
            setStep('invoice');
        } catch (err) {
            alert(`Purchase failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsActionLoading(false);
        }
    };
    
    const resetFlow = () => {
        setStep('list');
        setSelectedProduct(null);
        setFinalOrder(null);
        if (selectedCategory) {
            handleSelectCategory(selectedCategory);
        }
    };
    
    const renderContent = () => {
        switch (step) {
            case 'details':
                return selectedProduct && <ProductDetailView product={selectedProduct} onBack={() => setStep('list')} onProceed={() => setStep('checkout')} />;
            case 'checkout':
                return selectedProduct && <CheckoutView product={selectedProduct} onBack={() => setStep('details')} onConfirm={handleConfirmPurchase} isProcessing={isActionLoading} />;
            case 'invoice':
                return finalOrder && <InvoiceView order={finalOrder} onBack={resetFlow} />;
            case 'list':
            default:
                return (
                    selectedCategory && <ProductListView products={products} onSelect={handleSelectProduct} isLoading={isActionLoading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} categoryName={selectedCategory.name} />
                );
        }
    };

    return (
        <div>
            <div className="text-center mb-12 md:mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Go Shopping</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                    Browse our products by category or search for what you need.
                </p>
            </div>

            {isLoading && <Spinner message="Loading categories..." />}
            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}

            {!isLoading && categories.length > 0 && (
                <>
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-8">
                            {categories.map((cat) => (
                                <CategoryCircle
                                    key={cat.id}
                                    category={cat}
                                    onClick={() => handleSelectCategory(cat)}
                                    isActive={selectedCategory?.id === cat.id}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-8 mt-8">
                        {selectedCategory && step === 'list' && (
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                                Showing products for: <span className="text-sky-600">{selectedCategory.name}</span>
                            </h2>
                        )}
                        {renderContent()}
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingHomePage;
