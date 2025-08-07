
import React, { useState, useEffect, useCallback } from 'react';
import { ESimPlan, ESimOrder, SimStep } from '../../types';
import { getESimPlans, purchaseESim } from '../../services/apiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { ICONS } from '../../constants';
import QRCode from 'react-qr-code';

const countries = ['Turkey', 'UAE', 'USA', 'Europe']; // Mock list of available countries
const countryFlags: Record<string, string> = {
    'Turkey': '🇹🇷',
    'UAE': '🇦🇪',
    'USA': '🇺🇸',
    'Europe': '🇪🇺',
};

const SimPage: React.FC = () => {
    const [step, setStep] = useState<SimStep>('country_select');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [plans, setPlans] = useState<ESimPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<ESimPlan | null>(null);
    const [finalOrder, setFinalOrder] = useState<ESimOrder | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCountrySelect = useCallback(async (country: string) => {
        setSelectedCountry(country);
        setIsLoading(true);
        setError(null);
        setPlans([]);
        try {
            const planData = await getESimPlans(country);
            setPlans(planData);
            setStep('plan_list');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load eSIM plans.");
            setStep('country_select');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handlePlanSelect = (plan: ESimPlan) => {
        setSelectedPlan(plan);
        setStep('payment');
    };
    
    const handleConfirmPurchase = async () => {
        if (!selectedPlan) return;

        setIsLoading(true);
        setError(null);
        try {
            const order = await purchaseESim(selectedPlan.id);
            setFinalOrder(order);
            setStep('activation');
        } catch (err) {
            alert(`Purchase failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setError(err instanceof Error ? err.message : 'Purchase failed.');
            setStep('plan_list'); // Go back on failure
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetFlow = () => {
        setStep('country_select');
        setSelectedCountry('');
        setPlans([]);
        setSelectedPlan(null);
        setFinalOrder(null);
        setError(null);
    };

    const renderContent = () => {
        if (isLoading && step !== 'plan_list') {
            return <Spinner message="Processing..." />;
        }

        switch(step) {
            case 'activation':
                return finalOrder ? (
                    <div>
                        <div className="text-center mb-4">
                             <h2 className="text-2xl font-bold text-slate-900">Activate Your eSIM</h2>
                             <p className="text-slate-600 mt-1">Scan the QR code below to install your eSIM profile.</p>
                        </div>
                        <Card className="p-6 items-center flex flex-col gap-4">
                            <div className="p-4 bg-white border inline-block">
                                <QRCode value={finalOrder.qrCodeValue} size={200} />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">{finalOrder.plan.country} - {finalOrder.plan.dataAmountGB}GB</p>
                                <p className="text-sm text-slate-500">Valid for {finalOrder.plan.validityDays} days</p>
                            </div>
                            <div className="text-xs text-slate-600 bg-slate-100 p-3 rounded-md">
                                <strong>Instructions:</strong> Go to Settings &gt; Cellular/Mobile Data &gt; Add eSIM. Scan the QR code. Follow the on-screen prompts to complete installation.
                            </div>
                            <button onClick={resetFlow} className="w-full bg-teal-600 text-white mt-4 py-2 rounded-md font-semibold">Done</button>
                        </Card>
                    </div>
                ) : null;
            case 'payment':
                 return selectedPlan ? (
                    <div>
                        <button onClick={() => setStep('plan_list')} className="text-sm text-teal-600 hover:underline mb-4">&larr; Back to Plans</button>
                        <h2 className="text-2xl font-bold text-center mb-4">Confirm Your Purchase</h2>
                        <Card className="p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between"><span className="text-slate-600">Country:</span><span className="font-semibold">{selectedPlan.country}</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Data:</span><span className="font-semibold">{selectedPlan.dataAmountGB} GB</span></div>
                                <div className="flex justify-between"><span className="text-slate-600">Validity:</span><span className="font-semibold">{selectedPlan.validityDays} Days</span></div>
                                <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3"><span>Total:</span><span>${selectedPlan.priceUSD.toFixed(2)}</span></div>
                            </div>
                            <button onClick={handleConfirmPurchase} disabled={isLoading} className="w-full mt-6 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-500 disabled:bg-slate-400">
                                {isLoading ? 'Processing...' : 'Confirm & Pay'}
                            </button>
                        </Card>
                    </div>
                ) : null;
            case 'plan_list':
                return (
                    <div>
                        <button onClick={() => setStep('country_select')} className="text-sm text-teal-600 hover:underline mb-4">&larr; Change Country</button>
                        <h2 className="text-2xl font-bold text-center mb-4">Available Plans for {selectedCountry}</h2>
                        {isLoading ? <Spinner message={`Loading plans for ${selectedCountry}...`} /> : (
                            <div className="space-y-4">
                                {plans.length > 0 ? plans.map(plan => (
                                    <Card key={plan.id} className="p-4 flex justify-between items-center border-slate-200">
                                        <div>
                                            <p className="font-bold text-lg text-slate-800">{plan.dataAmountGB} GB</p>
                                            <p className="text-sm text-slate-500">Valid for {plan.validityDays} days</p>
                                        </div>
                                        <button onClick={() => handlePlanSelect(plan)} className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold">${plan.priceUSD.toFixed(2)}</button>
                                    </Card>
                                )) : <p className="text-center text-slate-500">No plans found for {selectedCountry}.</p>}
                            </div>
                        )}
                    </div>
                );
            case 'country_select':
            default:
                return (
                     <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {countries.map(country => (
                                <Card key={country} onClick={() => handleCountrySelect(country)} className="p-4 items-center justify-center flex flex-col gap-2 text-center">
                                    <span className="text-4xl">{countryFlags[country] || '🌐'}</span>
                                    <p className="font-semibold text-slate-800">{country}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

        }
    }

    return (
        <div className="max-w-xl mx-auto">
             <div className="text-center mb-8">
                 <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {ICONS.sim}
                </div>
                <h1 className="text-3xl font-bold text-slate-900">eSIM Marketplace</h1>
                <p className="text-slate-600 mt-1">Stay connected globally. Purchase an eSIM before you travel.</p>
            </div>
            {error && step !== 'activation' && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center mb-4">{error}</p>}
            {renderContent()}
        </div>
    );
};

export default SimPage;