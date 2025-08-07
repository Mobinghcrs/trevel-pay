import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../../constants';
import { createTopUpOrder, getUserProfile, getInternetPackages, createInternetPackageOrder } from '../../services/apiService';
import Card from '../../components/Card';
import PaymentModal from '../../components/PaymentModal';
import { useNavigation } from '../../contexts/NavigationContext';
import { InternetPackage } from '../../types';
import Spinner from '../../components/Spinner';

type Operator = 'Hamrahe Aval' | 'Irancell' | 'Rightel' | 'Shatel' | 'Unknown';
type ChargeTab = 'top-up' | 'internet';

const operatorPrefixes: { [key in Operator]?: string[] } = {
    'Hamrahe Aval': ['0910', '0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919', '0990', '0991', '0992', '0993', '0994'],
    'Irancell': ['0930', '0933', '0935', '0936', '0937', '0938', '0939', '0901', '0902', '0903', '0904', '0905', '0941'],
    'Rightel': ['0920', '0921', '0922'],
    'Shatel': ['0998'],
};

const topUpAmounts = [20000, 50000, 100000, 200000, 500000];

const ChargePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ChargeTab>('top-up');
    const [mobileNumber, setMobileNumber] = useState('');
    
    // Top-up state
    const [topUpAmount, setTopUpAmount] = useState(50000);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    // Internet package state
    const [packages, setPackages] = useState<InternetPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<InternetPackage | null>(null);
    const [isLoadingPackages, setIsLoadingPackages] = useState(false);
    
    // Payment flow state
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { navigate } = useNavigation();

    const detectedOperator: Operator = useMemo(() => {
        if (mobileNumber.length < 4) return 'Unknown';
        for (const op in operatorPrefixes) {
            if (operatorPrefixes[op as Operator]?.includes(mobileNumber.substring(0, 4))) {
                return op as Operator;
            }
        }
        return 'Unknown';
    }, [mobileNumber]);

    // Fetch packages when operator changes
    useEffect(() => {
        if (detectedOperator !== 'Unknown' && activeTab === 'internet') {
            const fetchPackages = async () => {
                setIsLoadingPackages(true);
                setPackages([]);
                try {
                    const data = await getInternetPackages(detectedOperator);
                    setPackages(data);
                } catch (e) {
                    setError("Could not load internet packages.");
                } finally {
                    setIsLoadingPackages(false);
                }
            };
            fetchPackages();
        } else {
            setPackages([]);
        }
    }, [detectedOperator, activeTab]);

    const handleAmountClick = (value: number) => {
        setTopUpAmount(value);
        setIsCustom(false);
        setCustomAmount('');
    };

    const handleCustomAmountClick = () => {
        setIsCustom(true);
        setTopUpAmount(0);
    };
    
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        setTopUpAmount(Number(value));
    };

    const handleProceedToPay = async () => {
        setError(null);
        if (mobileNumber.length !== 11 || !mobileNumber.startsWith('09')) {
            setError('Please enter a valid 11-digit mobile number.');
            return;
        }
        if (detectedOperator === 'Unknown') {
            setError('Operator for this number could not be identified.');
            return;
        }
        
        const finalAmount = activeTab === 'top-up' ? topUpAmount : selectedPackage?.priceIRR || 0;
        if (finalAmount <= 0) {
            setError('Please select a valid amount or package.');
            return;
        }
        
        try {
            const profile = await getUserProfile();
            const irrWallet = profile.wallets.find(w => w.currency === 'IRR');
            if (!irrWallet || irrWallet.balance < finalAmount) {
                setError(`Insufficient IRR wallet balance. You need ${finalAmount.toLocaleString('en-US')} IRR.`);
                return;
            }
            setIsPaymentModalOpen(true);
        } catch(e) {
            setError('Error checking wallet balance.');
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            if (activeTab === 'top-up') {
                await createTopUpOrder({
                    operator: detectedOperator,
                    mobileNumber,
                    amount: topUpAmount,
                });
            } else if (selectedPackage) {
                await createInternetPackageOrder({
                    operator: detectedOperator,
                    mobileNumber,
                    package: selectedPackage,
                });
            }
            setPaymentWasSuccessful(true);
        } catch(e) {
             throw e; // Re-throw to be caught by the payment modal
        }
    };
    
    const handleModalClose = () => {
        setIsPaymentModalOpen(false);
        if (paymentWasSuccessful) {
            alert('Purchase successful!');
            navigate('orders');
        }
    }

    const paymentAmount = useMemo(() => {
        return activeTab === 'top-up' ? topUpAmount : selectedPackage?.priceIRR ?? 0;
    }, [activeTab, topUpAmount, selectedPackage]);

    return (
        <>
        <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.charge}
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Mobile Top-up & Internet</h1>
                <p className="text-slate-600 mt-1">Top up your phone or buy an internet package.</p>
            </div>

            <Card className="p-6 border-slate-200">
                <div className="space-y-6">
                    {/* Phone Number Input */}
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                        <input
                            id="mobileNumber"
                            type="tel"
                            value={mobileNumber}
                            onChange={e => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={11}
                            placeholder="e.g., 09123456789"
                            className="w-full bg-slate-100 border-slate-300 rounded-md px-3 py-3 text-lg tracking-wider text-center"
                        />
                    </div>

                    {/* Operator Logos */}
                    <div className="flex justify-around items-center">
                        {(['Hamrahe Aval', 'Irancell', 'Rightel', 'Shatel'] as Operator[]).map(op => (
                            <div key={op} className={`p-2 border-2 rounded-lg transition-all duration-300 ${detectedOperator === op ? 'border-teal-500 scale-110' : 'border-transparent'}`}>
                                <p className="font-bold text-slate-700 text-sm">{op.replace(' Aval', '')}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setActiveTab('top-up')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'top-up' ? 'bg-white shadow' : ''}`}>Top-up</button>
                        <button onClick={() => setActiveTab('internet')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'internet' ? 'bg-white shadow' : ''}`}>Internet Packages</button>
                    </div>

                    {/* Content Area */}
                    <div>
                        {activeTab === 'top-up' ? (
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Top-up Amount (IRR)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {topUpAmounts.map(val => (
                                        <button key={val} onClick={() => handleAmountClick(val)} className={`py-3 rounded-lg font-semibold border-2 ${!isCustom && topUpAmount === val ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-100 text-slate-800 border-slate-200 hover:border-teal-400'}`}>
                                            {val.toLocaleString('en-US')}
                                        </button>
                                    ))}
                                    <button onClick={handleCustomAmountClick} className={`py-3 rounded-lg font-semibold border-2 col-span-3 ${isCustom ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-100 text-slate-800 border-slate-200 hover:border-teal-400'}`}>
                                        Custom Amount
                                    </button>
                                </div>
                                {isCustom && (
                                    <input
                                        type="text"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        placeholder="Enter amount in IRR"
                                        className="w-full mt-3 bg-slate-100 border-slate-300 rounded-md px-3 py-3 text-lg text-center"
                                    />
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select a Package</label>
                                {isLoadingPackages ? <Spinner message="Loading packages..." /> : (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                        {packages.length > 0 ? packages.map(pkg => (
                                            <button key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`w-full text-left p-3 rounded-lg border-2 flex justify-between items-center ${selectedPackage?.id === pkg.id ? 'bg-teal-50 border-teal-500' : 'bg-slate-50 border-slate-200 hover:border-teal-400'}`}>
                                                <div>
                                                    <p className="font-bold text-slate-800">{pkg.dataAmountGB} GB</p>
                                                    <p className="text-xs text-slate-500">{pkg.validityDays} Days - {pkg.description}</p>
                                                </div>
                                                <p className="font-semibold text-teal-600">{pkg.priceIRR.toLocaleString('en-US')} IRR</p>
                                            </button>
                                        )) : <p className="text-center text-slate-500 text-sm py-4">Select an operator to see packages.</p>}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {error && <p className="text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

                    <button onClick={handleProceedToPay} className="w-full bg-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-700 transition-colors">
                        Proceed to Pay
                    </button>
                </div>
            </Card>
        </div>
        <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={handleModalClose}
            amount={paymentAmount}
            onSuccess={handlePaymentSuccess}
        />
        </>
    );
};

export default ChargePage;