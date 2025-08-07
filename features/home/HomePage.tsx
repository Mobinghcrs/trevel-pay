
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { useNavigation } from '../../contexts/NavigationContext';
import { Page, UserProfile, Wallet, PromoSlide, AuthState } from '../../types';
import Card from '../../components/Card';
import { getUserProfile, getPromoSlides } from '../../services/apiService';
import Spinner from '../../components/Spinner';

// --- Sub-components for HomePage ---

const PromotionalSlider: React.FC = () => {
    const { navigate } = useNavigation();
    const [slides, setSlides] = useState<PromoSlide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await getPromoSlides();
                setSlides(data);
            } catch (error) {
                console.error("Failed to load promo slides", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % slides.length);
            }, 4000); // Change slide every 4 seconds
            return () => clearInterval(timer);
        }
    }, [slides.length]);

    if (isLoading) {
        return <div className="h-28 flex items-center justify-center"><Spinner message="Loading promotions..." /></div>
    }
    
    if (slides.length === 0) return null;

    const activeSlide = slides[currentSlide];

    return (
        <div className="mb-12">
            <div 
                onClick={() => navigate(activeSlide.link)} 
                className="relative h-28 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group border border-slate-200"
            >
                {slides.map((slide, index) => (
                    <div 
                        key={slide.id}
                        className="absolute inset-0 flex items-center p-6 gap-4 transition-opacity duration-700 ease-in-out"
                        style={{ opacity: currentSlide === index ? 1 : 0 }}
                        aria-hidden={currentSlide !== index}
                    >
                        <div className="flex-shrink-0 bg-teal-100 text-teal-600 rounded-full p-3 transform transition-transform duration-500 group-hover:scale-110">
                            <div className="h-8 w-8">
                                {ICONS[slide.icon as keyof typeof ICONS] || ICONS.logo}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{slide.title}</h3>
                            <p className="text-slate-600 text-sm">{slide.subtitle}</p>
                        </div>
                    </div>
                ))}
                {/* Dots indicator */}
                <div className="absolute bottom-2 right-4 flex gap-1.5">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-teal-600 scale-125' : 'bg-teal-300/80 hover:bg-teal-400'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const WalletDisplayCard: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
    const { navigate } = useNavigation();

    const getCardStyle = (currency: string): { bg: string; pattern: string } => {
        switch (currency) {
            case 'USD':
                return { bg: 'bg-gradient-to-br from-green-500 to-emerald-700', pattern: '' };
            case 'EUR':
                return { bg: 'bg-gradient-to-br from-blue-500 to-indigo-700', pattern: '' };
            case 'BTC':
            case 'ETH':
                return {
                    bg: 'bg-gradient-to-br from-slate-800 to-black',
                    pattern: 'bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]',
                };
            default:
                return { bg: 'bg-gradient-to-br from-teal-500 to-teal-700', pattern: '' };
        }
    };

    const handleCharge = () => alert(`The ability to charge ${wallet.currency} will be available soon.`);
    const handleSell = () => navigate('exchange', { tab: 'swap', fromCurrency: wallet.currency });

    const { bg, pattern } = getCardStyle(wallet.currency);

    return (
        <div className={`w-80 h-48 rounded-xl shadow-lg relative flex flex-col justify-between p-5 text-white flex-shrink-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${bg} overflow-hidden`}>
            <div className={`absolute inset-0 opacity-50 ${pattern}`}></div>
            <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
            
            <div className="flex justify-between items-start z-10">
                <div className="w-10 h-8 bg-yellow-400/80 rounded-md border border-yellow-500/50"></div> {/* Chip */}
                <span className="font-bold text-lg">{wallet.currency}</span>
            </div>

            <div className="z-10">
                <p className="text-sm opacity-80">Balance</p>
                <p className="font-mono text-3xl tracking-wider">{wallet.balance.toLocaleString('en-US', { maximumFractionDigits: wallet.type === 'Crypto' ? 6 : 2 })}</p>
            </div>

            <div className="flex justify-between items-end z-10">
                <p className="font-semibold">{wallet.name}</p>
                <div className="flex items-center gap-2">
                    <button onClick={handleCharge} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full py-1.5 px-3 text-xs font-semibold" aria-label={`Charge ${wallet.currency}`}>
                        <div className="w-4 h-4">{ICONS.add}</div> Charge
                    </button>
                    <button onClick={handleSell} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full py-1.5 px-3 text-xs font-semibold" aria-label={`Sell from ${wallet.currency}`}>
                        <div className="w-4 h-4">{ICONS.swap}</div> Sell
                    </button>
                </div>
            </div>
        </div>
    );
};

const WalletSummary: React.FC<{ wallets?: Wallet[], isLoading: boolean }> = ({ wallets, isLoading }) => {
  if (isLoading) {
    return <div className="h-48 flex items-center justify-center"><Spinner message="Loading wallets..." /></div>;
  }
  if (!wallets || wallets.length === 0) {
    return (
        <Card className="p-4 text-center text-slate-500 my-8">
            You don't have any wallets. Visit your profile to add one.
        </Card>
    );
  }
  
  return (
    <div className="mb-12">
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {wallets.map(wallet => (
                <WalletDisplayCard key={wallet.currency} wallet={wallet} />
            ))}
        </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  comingSoon?: boolean;
}> = ({ title, icon, onClick, comingSoon }) => (
  <button
    onClick={onClick}
    disabled={comingSoon}
    className="relative flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={`Go to ${title}`}
  >
    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center border-2 border-teal-200/50 group-hover:bg-teal-200 transition-all duration-300">
      <span className="text-teal-600">{icon}</span>
    </div>
    <span className="font-semibold text-center text-slate-800 transition-colors duration-300">{title}</span>
    {comingSoon && (
      <div className="absolute top-2 right-2 text-xs bg-slate-800 text-white font-bold px-2 py-0.5 rounded-full">
        Soon
      </div>
    )}
  </button>
);

const UserDashboard: React.FC<{ user: AuthState['user'] }> = ({ user }) => {
  const { navigate } = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const isGuest = user?.role === 'guest';

  useEffect(() => {
    if (isGuest) {
      setIsLoadingProfile(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, [isGuest]);
  
  const features: { title: string; icon: React.ReactNode; action: () => void; comingSoon?: boolean; }[] = [
    { title: 'Flights', icon: ICONS.plane, action: () => navigate('flights') },
    { title: 'Hotels', icon: ICONS.hotel, action: () => navigate('hotel') },
    { title: 'Hot Deals', icon: ICONS.fire, action: () => navigate('deals') },
    { title: 'Exchange', icon: ICONS.exchange, action: () => navigate('exchange') },
    { title: 'Send Money', icon: ICONS.userArrows, action: () => navigate('user-transfer') },
    { title: 'Charge', icon: ICONS.charge, action: () => navigate('charge') },
    { title: 'Investment', icon: ICONS.investment, action: () => navigate('investment') },
    { title: 'Gift Cards', icon: ICONS.giftCard, action: () => navigate('gift-cards') },
    { title: 'Car Rental', icon: ICONS.car, action: () => navigate('car-rental') },
    { title: 'Shopping', icon: ICONS.store, action: () => navigate('shopping') },
    { title: 'Agents', icon: ICONS.buildingStorefront, action: () => navigate('agents') },
    { title: 'Taxi', icon: ICONS.taxi, action: () => navigate('taxi') },
    { title: 'eSIM', icon: ICONS.sim, action: () => navigate('sim') },
    { title: 'Tours', icon: ICONS.tourism, action: () => navigate('tour') },
    { title: 'Stays', icon: ICONS.accommodation, action: () => navigate('stays') },
  ];

  return (
    <>
      {isGuest ? <PromotionalSlider /> : <WalletSummary wallets={profile?.wallets} isLoading={isLoadingProfile} />}
      <div className="max-w-5xl mx-auto mt-12">
        <div className="text-xl font-bold text-slate-900 mb-4 px-1">All Services</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              icon={feature.icon}
              onClick={feature.action}
              comingSoon={feature.comingSoon}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const AgentDashboard: React.FC<{ user: AuthState['user'] }> = ({ user }) => {
  const { navigate } = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load agent profile", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, []);

  const agentFeatures: { title: string; icon: React.ReactNode; action: () => void; comingSoon?: boolean; }[] = [
    { title: 'Credit User', icon: ICONS.userPlus, action: () => navigate('agent-transfer') },
    { title: 'Send Money', icon: ICONS.userArrows, action: () => navigate('user-transfer') },
    { title: 'Exchange', icon: ICONS.exchange, action: () => navigate('exchange') },
    { title: 'Flights', icon: ICONS.plane, action: () => navigate('flights') },
    { title: 'Reports', icon: ICONS.chartBar, action: () => navigate('agent-reports') },
  ];

  return (
    <>
      <WalletSummary wallets={profile?.wallets} isLoading={isLoadingProfile} />
      <div className="max-w-5xl mx-auto mt-12">
        <div className="text-xl font-bold text-slate-900 mb-4 px-1">Agent Tools</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-6">
          {agentFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              icon={feature.icon}
              onClick={feature.action}
              comingSoon={feature.comingSoon}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const MerchantDashboard: React.FC<{ user: AuthState['user'] }> = ({ user }) => {
    const { navigate } = useNavigation();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
        setIsLoadingProfile(true);
        try {
            const profileData = await getUserProfile();
            setProfile(profileData);
        } catch (error) {
            console.error("Failed to load merchant profile", error);
        } finally {
            setIsLoadingProfile(false);
        }
        };
        loadProfile();
    }, []);

    const merchantFeatures: { title: string; icon: React.ReactNode; action: () => void; comingSoon?: boolean; }[] = [
        { title: 'Point of Sale', icon: ICONS.calculator, action: () => navigate('merchant-pos') },
        { title: 'Transactions', icon: ICONS.orders, action: () => navigate('orders') },
        { title: 'Full Panel', icon: ICONS.dashboard, action: () => window.location.hash = '#/merchant' },
    ];

    return (
        <>
        <WalletSummary wallets={profile?.wallets} isLoading={isLoadingProfile} />
        <div className="max-w-5xl mx-auto mt-12">
            <div className="text-xl font-bold text-slate-900 mb-4 px-1">Merchant Tools</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-6">
            {merchantFeatures.map((feature) => (
                <FeatureCard
                key={feature.title}
                title={feature.title}
                icon={feature.icon}
                onClick={feature.action}
                comingSoon={feature.comingSoon}
                />
            ))}
            </div>
        </div>
        </>
    );
};


interface HomePageProps {
    user?: {
        name: string;
        role: 'user' | 'agent' | 'guest' | 'merchant' | 'admin';
    };
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const displayName = user?.name.split(' ')[0] || 'There';
  const role = user?.role || 'guest';
  
  const welcomeMessage: { [key in 'guest' | 'user' | 'agent' | 'merchant']: string } = {
    guest: "Explore our features as a guest.",
    user: "A world of services, at your fingertips.",
    agent: "Your agent dashboard is ready.",
    merchant: "Welcome to your Merchant Dashboard."
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Hello, {displayName}</h1>
        <p className="mt-1 text-slate-600">{welcomeMessage[role as keyof typeof welcomeMessage]}</p>
      </div>
      
      {role === 'agent' && <AgentDashboard user={user} />}
      {role === 'merchant' && <MerchantDashboard user={user} />}
      {(role === 'user' || role === 'guest') && <UserDashboard user={user} />}
    </div>
  );
};

export default HomePage;
