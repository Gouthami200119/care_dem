import React, { useState, useEffect, useMemo } from 'react';
import { 
  Language, 
  AppView, 
  FamilyStep, 
  CareType, 
  FamilyRequestData, 
  CareLevel, 
  DementiaStatus,
  ChatMessage,
  CareHome
} from './types';
import { TRANSLATIONS, MOCK_HOMES } from './constants';
import { Button, Card, Checkbox, Input, Select } from './components/Shared';
import { getChatResponse } from './services/geminiService';

// --- Icons ---
const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
  </svg>
);

const FriendlyBotIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Antenna */}
    <line x1="12" y1="2" x2="12" y2="5" />
    <circle cx="12" cy="2" r="1" fill="currentColor" stroke="none" />
    {/* Head */}
    <rect x="3" y="5" width="18" height="16" rx="5" ry="5" />
    {/* Eyes */}
    <circle cx="9" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="11" r="1.5" fill="currentColor" stroke="none" />
    {/* Blush (Optional, simplistic) */}
    {/* Smile */}
    <path d="M9 15c1.5 1.5 4.5 1.5 6 0" />
  </svg>
);

// --- Comprehensive German PLZ Mapping (2-digit prefixes) ---
const PLZ_REGIONS: Record<string, string> = {
  '01': 'Dresden', '02': 'Görlitz', '03': 'Cottbus', '04': 'Leipzig', '05': 'Region 05', '06': 'Halle (Saale)', '07': 'Jena/Gera', '08': 'Zwickau', '09': 'Chemnitz',
  '10': 'Berlin', '12': 'Berlin', '13': 'Berlin', '14': 'Potsdam', '15': 'Frankfurt (Oder)', '16': 'Oranienburg', '17': 'Neubrandenburg', '18': 'Rostock', '19': 'Schwerin',
  '20': 'Hamburg', '21': 'Lüneburg', '22': 'Hamburg', '23': 'Lübeck', '24': 'Kiel', '25': 'Elmshorn', '26': 'Oldenburg', '27': 'Bremerhaven', '28': 'Bremen', '29': 'Celle',
  '30': 'Hannover', '31': 'Hildesheim', '32': 'Minden', '33': 'Bielefeld', '34': 'Kassel', '35': 'Gießen', '36': 'Fulda', '37': 'Göttingen', '38': 'Braunschweig', '39': 'Magdeburg',
  '40': 'Düsseldorf', '41': 'Mönchengladbach', '42': 'Wuppertal', '44': 'Dortmund', '45': 'Essen', '46': 'Oberhausen', '47': 'Duisburg', '48': 'Münster', '49': 'Osnabrück',
  '50': 'Köln', '51': 'Köln', '52': 'Aachen', '53': 'Bonn', '54': 'Trier', '55': 'Mainz', '56': 'Koblenz', '57': 'Siegen', '58': 'Hagen', '59': 'Hamm',
  '60': 'Frankfurt am Main', '61': 'Bad Homburg', '63': 'Aschaffenburg', '64': 'Darmstadt', '65': 'Wiesbaden', '66': 'Saarbrücken', '67': 'Ludwigshafen', '68': 'Mannheim', '69': 'Heidelberg',
  '70': 'Stuttgart', '71': 'Böblingen', '72': 'Tübingen', '73': 'Göppingen', '74': 'Heilbronn', '75': 'Pforzheim', '76': 'Karlsruhe', '77': 'Offenburg', '78': 'Konstanz', '79': 'Freiburg',
  '80': 'München', '81': 'München', '82': 'Starnberg', '83': 'Rosenheim', '84': 'Landshut', '85': 'Ingolstadt', '86': 'Augsburg', '87': 'Kempten', '88': 'Lindau', '89': 'Ulm',
  '90': 'Nürnberg', '91': 'Erlangen', '92': 'Amberg', '93': 'Regensburg', '94': 'Passau', '95': 'Hof', '96': 'Bamberg', '97': 'Würzburg', '98': 'Suhl', '99': 'Erfurt'
};

// --- Default Data Factory ---
const getInitialFamilyData = (): FamilyRequestData => ({
  careTypes: [],
  careLevel: CareLevel.NONE,
  dementiaStatus: DementiaStatus.UNSURE,
  conditions: [],
  notes: '',
  zip: '',
  city: '',
  radius: 10,
  selectedHomes: [],
  firstName: '',
  lastName: '',
  birthDate: '',
  currentStreet: '',
  currentHouseNumber: '',
  currentZip: '',
  currentCity: '',
  currentAddressNotes: '',
  insuranceProvider: '',
  insuranceNumber: '',
  docIdCard: false,
  docCareLevel: false,
  docPowerOfAttorney: false,
  needsParking: false,
  fileDoctorLetter: null,
  filePowerOfAttorney: null,
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  isLegalGuardian: false,
  acceptedAGB: false,
  acceptedPrivacy: false,
  acceptedReliefBilling: false,
  acceptedWaitlist: false
});

// --- Dynamic Home Generator ---
const generateMockHomesForZip = (zip: string, city: string): CareHome[] => {
  // If no zip but we have a city, try to reverse lookup a prefix for generation
  let prefix = zip.length >= 2 ? zip.substring(0, 2) : '10';
  if (!zip && city) {
     const foundPrefix = Object.keys(PLZ_REGIONS).find(key => 
        PLZ_REGIONS[key].toLowerCase().includes(city.toLowerCase())
     );
     if (foundPrefix) prefix = foundPrefix;
  }

  const regionName = PLZ_REGIONS[prefix] || (city ? city : "Neustadt");
  
  const homes: CareHome[] = [];
  const names = [
    `Seniorenresidenz ${regionName}`,
    `Pflegezentrum ${regionName}-Nord`,
    `Caritas-Haus St. Elisabeth`,
    `AWO Seniorenzentrum am Park`,
    `Diakonie Station ${regionName}`
  ];

  const descriptions = [
    "Modern facility with extensive garden.",
    "Specialized in dementia and palliative care.",
    "Family atmosphere with daily activities.",
    "Central location with excellent medical support.",
    "Quiet location, newly renovated rooms."
  ];

  for (let i = 0; i < 5; i++) {
    const supportedTypes: CareType[] = [CareType.LONG_TERM];
    if (i % 2 === 0) supportedTypes.push(CareType.SHORT_TERM);
    if (i % 3 === 0) supportedTypes.push(CareType.DAY_CARE);

    // Use specific ZIP if available, otherwise a generated one based on prefix
    const homeZip = zip.length === 5 ? zip : `${prefix}0${i}0`;

    homes.push({
      id: `gen_${prefix}_${i}`,
      name: names[i],
      zip: homeZip,
      city: regionName,
      distance: 1.5 + (i * 2.5),
      supportedTypes: supportedTypes,
      description: descriptions[i]
    });
  }
  return homes;
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.DE);
  const [isSimpleLanguage, setIsSimpleLanguage] = useState(false);
  const [view, setView] = useState<AppView>(AppView.LANDING);
  
  // Family Flow State
  const [step, setStep] = useState<FamilyStep>(FamilyStep.CARE_TYPE);
  const [formData, setFormData] = useState<FamilyRequestData>(getInitialFamilyData());
  const [locationInput, setLocationInput] = useState('');
  
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Care Home State
  const [careHomeStatuses, setCareHomeStatuses] = useState<Record<string, Record<CareType, boolean>>>({
    '1': { [CareType.LONG_TERM]: false, [CareType.SHORT_TERM]: true, [CareType.DAY_CARE]: false },
    '2': { [CareType.LONG_TERM]: true, [CareType.SHORT_TERM]: false, [CareType.DAY_CARE]: true },
  });

  const t = (key: string) => {
    let text = TRANSLATIONS[language][key] || key;
    if (isSimpleLanguage) {
      if (key === 'step.careType') return "Was suchen Sie?";
      if (key === 'btn.next') return "Weiter gehen";
      if (key === 'btn.back') return "Zurück gehen";
      if (key === 'step.medical') return "Gesundheit";
    }
    return text;
  };

  // --- Helper: Parsing Location Input ---
  const handleLocationChange = (val: string) => {
    setLocationInput(val);

    const zipMatch = val.match(/\b\d{5}\b/);
    const textMatch = val.replace(/[0-9]/g, '').replace(/[.,-]/g, ' ').trim();
    
    let newZip = '';
    let newCity = '';

    // 1. Determine ZIP
    if (zipMatch) {
      newZip = zipMatch[0];
    }

    // 2. Determine City
    if (textMatch.length >= 2) {
      // User typed a name, use it as priority
      newCity = textMatch;
      
      // If we have a city but no ZIP, try to find a ZIP prefix to help searching
      if (!newZip) {
         const foundPrefix = Object.keys(PLZ_REGIONS).find(key => 
            PLZ_REGIONS[key].toLowerCase() === textMatch.toLowerCase()
         );
         if (foundPrefix) newZip = `${foundPrefix}000`;
      }
    } else {
      // User didn't type a name, try to derive from ZIP
      if (newZip) {
        const prefix = newZip.substring(0, 2);
        newCity = PLZ_REGIONS[prefix] || '';
      }
    }

    // Update state, clearing values if input is deleted
    setFormData(prev => ({
      ...prev,
      zip: newZip || (val.trim().length === 0 ? '' : prev.zip),
      city: newCity || (val.trim().length === 0 ? '' : prev.city)
    }));
  };

  // --- Chat Assistant ---
  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;
    const userMsg = inputMsg;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputMsg('');
    setIsTyping(true);

    const prompt = isSimpleLanguage 
      ? `(Antworte in Einfacher Sprache) ${userMsg}`
      : userMsg;

    const response = await getChatResponse(prompt, language);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  // --- Helper: Family Flow ---
  const updateData = (field: keyof FamilyRequestData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fake file handler
  const handleFileUpload = (field: 'fileDoctorLetter' | 'filePowerOfAttorney', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleToggleCareType = (type: CareType) => {
    setFormData(prev => {
      const exists = prev.careTypes.includes(type);
      return {
        ...prev,
        careTypes: exists 
          ? prev.careTypes.filter(t => t !== type)
          : [...prev.careTypes, type]
      };
    });
  };

  const handleToggleCondition = (condition: string) => {
    setFormData(prev => {
        const exists = prev.conditions.includes(condition);
        return {
            ...prev,
            conditions: exists 
                ? prev.conditions.filter(c => c !== condition)
                : [...prev.conditions, condition]
        };
    });
  };

  const handleReset = () => {
    setFormData(getInitialFamilyData());
    setLocationInput('');
    setStep(FamilyStep.CARE_TYPE);
    setView(AppView.LANDING);
    window.scrollTo(0, 0);
  };

  // --- Filter Logic with Dynamic Generation ---
  const filteredHomes = useMemo(() => {
    // 1. Try to find static matches in constant data
    let matches = MOCK_HOMES.filter(home => {
      // Check Care Type
      if (!formData.careTypes.some(type => home.supportedTypes.includes(type))) return false;
      
      // Check Location
      if (formData.zip) {
         // Exact match
         if (home.zip === formData.zip) return true; 
         // Region match (1st digit) - good fallback for regional search
         if (home.zip.charAt(0) === formData.zip.charAt(0)) return true;
         return false;
      }
      return true;
    });

    // 2. If valid location (ZIP or City) but no/few static matches, generate dummy homes
    const hasValidLocation = formData.zip.length === 5 || formData.city.length > 2;
    
    if (hasValidLocation && matches.length < 3) {
      const generated = generateMockHomesForZip(formData.zip, formData.city);
      // Filter generated homes by requested care type
      const relevantGenerated = generated.filter(home => 
        formData.careTypes.some(type => home.supportedTypes.includes(type))
      );
      // Combine matches
      matches = [...matches, ...relevantGenerated];
    }
    
    return matches.sort((a, b) => a.distance - b.distance);
  }, [formData.zip, formData.city, formData.careTypes]);


  // --- Styles ---
  const appFontClass = isSimpleLanguage ? "text-xl leading-relaxed" : "text-lg leading-normal";

  // --- Views ---

  const renderHeader = () => (
    <header className="bg-white border-b-2 border-lilac-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap gap-4 justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setView(AppView.LANDING)}
        >
          <div className="bg-lilac-100 p-2 rounded-lg text-lilac-600 group-hover:bg-lilac-200 group-hover:text-lilac-800 transition-colors">
            <HomeIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-lilac-800 group-hover:text-lilac-900 transition-colors">
            {t('app.title')}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsSimpleLanguage(!isSimpleLanguage)}
            className={`px-4 py-2 rounded-full border-2 font-bold transition-all text-sm sm:text-base ${
              isSimpleLanguage 
                ? 'bg-sunny-300 border-sunny-400 text-sunny-900 shadow-md transform scale-105' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isSimpleLanguage ? '🙂 Einfache Sprache: AN' : 'Einfache Sprache'}
          </button>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {Object.values(Language).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
                  language === lang ? 'bg-white text-lilac-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );

  const renderLanding = () => (
    <div className={`max-w-5xl mx-auto px-6 py-16 text-center ${appFontClass}`}>
      <h2 className="text-5xl font-black text-lilac-900 mb-10 tracking-tight leading-tight">
        {t('landing.title')}
      </h2>
      <div className="grid md:grid-cols-2 gap-10 mt-16">
        <Card className="hover:shadow-2xl transition-all border-t-8 border-t-lilac-500 flex flex-col items-center p-12 cursor-pointer transform hover:-translate-y-1">
          <div className="w-24 h-24 bg-lilac-100 rounded-full flex items-center justify-center mb-8 text-5xl">👨‍👩‍👧</div>
          <h3 className="text-3xl font-bold text-lilac-900 mb-6">{t('landing.family')}</h3>
          <p className="text-gray-600 mb-8 text-xl">{t('landing.sub.family')}</p>
          <Button variant="primary" size="large" className="w-full mt-auto" onClick={() => setView(AppView.FAMILY_FLOW)}>
            {t('btn.next')} ➔
          </Button>
        </Card>

        <Card className="hover:shadow-2xl transition-all border-t-8 border-t-sunny-400 flex flex-col items-center p-12 cursor-pointer transform hover:-translate-y-1">
          <div className="w-24 h-24 bg-sunny-100 rounded-full flex items-center justify-center mb-8 text-5xl">🏥</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-6">{t('landing.carehome')}</h3>
          <p className="text-gray-600 mb-8 text-xl">{t('landing.sub.carehome')}</p>
          <Button variant="secondary" size="large" className="w-full mt-auto" onClick={() => setView(AppView.CARE_HOME_PORTAL)}>
            {t('carehome.login')}
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderFamilyFlow = () => {
    const canProceed = () => {
      if (step === FamilyStep.CARE_TYPE) return formData.careTypes.length > 0;
      if (step === FamilyStep.MEDICAL_INFO) return formData.careLevel !== CareLevel.NONE;
      if (step === FamilyStep.REGION) return formData.zip.length >= 4 || formData.city.length > 2;
      if (step === FamilyStep.HOME_SELECTION) return true; // Default selected
      if (step === FamilyStep.ADMISSION_DATA) return formData.firstName && formData.lastName;
      if (step === FamilyStep.CONTACT_INFO) return formData.contactName && formData.contactEmail;
      if (step === FamilyStep.DOCUMENTS_AND_EXTRAS) return true; // Optional fields
      if (step === FamilyStep.CONSENTS) return formData.acceptedAGB && formData.acceptedPrivacy && formData.acceptedReliefBilling;
      return true;
    };

    return (
      <div className={`max-w-3xl mx-auto px-6 py-10 pb-40 ${appFontClass}`}>
        {/* Progress Bar */}
        <div className="w-full bg-lilac-100 rounded-full h-4 mb-10 overflow-hidden">
          <div className="bg-lilac-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / 8) * 100}%` }}></div>
        </div>

        {/* STEP 1: Care Type */}
        {step === FamilyStep.CARE_TYPE && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-lilac-900">{t('step.careType')}</h2>
            <div className="grid gap-6">
              {[CareType.LONG_TERM, CareType.SHORT_TERM, CareType.DAY_CARE].map(type => (
                <button
                  key={type}
                  onClick={() => handleToggleCareType(type)}
                  className={`p-8 rounded-2xl border-4 text-left transition-all flex items-center justify-between group ${
                    formData.careTypes.includes(type) 
                      ? 'border-lilac-500 bg-lilac-50 text-lilac-900 shadow-lg scale-[1.02]' 
                      : 'border-gray-200 bg-white hover:border-lilac-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold text-2xl">{t(`type.${type.toLowerCase().replace('_', '')}`)}</span>
                  {formData.careTypes.includes(type) && <span className="text-3xl text-lilac-600">✓</span>}
                </button>
              ))}
            </div>
            {isSimpleLanguage && (
              <div className="bg-sunny-100 p-6 rounded-xl border-l-8 border-sunny-400 text-sunny-900 mt-4">
                <strong>Hilfe:</strong> Wählen Sie, was Sie brauchen. Sie können auch mehrere wählen.
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Medical */}
        {step === FamilyStep.MEDICAL_INFO && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-lilac-900">{t('step.medical')}</h2>
            <Card>
              <Select 
                label={t('label.carelevel')}
                value={formData.careLevel}
                onChange={(e) => updateData('careLevel', e.target.value)}
                options={[
                  { value: CareLevel.NONE, label: 'Bitte wählen...' },
                  { value: CareLevel.LEVEL_1, label: 'Pflegegrad 1' },
                  { value: CareLevel.LEVEL_2, label: 'Pflegegrad 2' },
                  { value: CareLevel.LEVEL_3, label: 'Pflegegrad 3' },
                  { value: CareLevel.LEVEL_4, label: 'Pflegegrad 4' },
                  { value: CareLevel.LEVEL_5, label: 'Pflegegrad 5' },
                ]}
              />
              <Select 
                label={t('label.dementia')}
                value={formData.dementiaStatus}
                onChange={(e) => updateData('dementiaStatus', e.target.value)}
                options={[
                  { value: DementiaStatus.UNSURE, label: t('opt.dementia_unsure') },
                  { value: DementiaStatus.DEMENTIA, label: t('opt.dementia_yes') },
                  { value: DementiaStatus.NO_DEMENTIA, label: t('opt.dementia_no') },
                ]}
              />

              <div className="my-6">
                <label className="block text-lg font-bold text-gray-800 mb-4">{t('label.conditions')}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'mobility', 'psychiatric', 'palliative', 
                    'diabetes', 'stroke', 'diet', 'woundcare', 'incontinence'
                  ].map(cond => (
                    <Checkbox 
                        key={cond}
                        label={t(`cond.${cond}`)} 
                        checked={formData.conditions.includes(cond)} 
                        onChange={() => handleToggleCondition(cond)} 
                        className="h-full"
                    />
                  ))}
                </div>
              </div>

              <Input label="Zusätzliche Notizen (Optional)" placeholder="Sonstige wichtige Informationen..." value={formData.notes} onChange={e => updateData('notes', e.target.value)} />
            </Card>
          </div>
        )}

        {/* STEP 3: Region */}
        {step === FamilyStep.REGION && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-lilac-900">{t('step.region')}</h2>
            <Card>
              <Input 
                label={t('label.location')} 
                value={locationInput} 
                onChange={e => handleLocationChange(e.target.value)} 
                placeholder="z.B. 10115 oder Berlin"
              />
              
              {/* Info Display for Auto-Detected Data */}
              {(formData.zip || formData.city) && (
                <div className="mb-6 p-4 bg-lilac-50 rounded-xl text-lilac-800 flex justify-between items-center">
                   <div>
                     <span className="text-xs font-bold uppercase tracking-wider opacity-70">Erkannt</span>
                     <div className="font-bold text-lg">{formData.zip} {formData.city}</div>
                   </div>
                   <div className="text-3xl">📍</div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-xl font-bold text-gray-800 mb-4">{t('label.radius')}: {formData.radius}km</label>
                <input type="range" min="5" max="50" step="5" value={formData.radius} onChange={e => updateData('radius', parseInt(e.target.value))} className="w-full h-4 bg-lilac-200 rounded-lg appearance-none cursor-pointer accent-lilac-600" />
                <div className="flex justify-between text-base text-gray-500 mt-2 font-medium">
                  <span>5km</span><span>25km</span><span>50km</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 4: Homes */}
        {step === FamilyStep.HOME_SELECTION && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-lilac-900">{t('step.homes')}</h2>
            <div className="space-y-6">
              {filteredHomes.length === 0 ? (
                <div className="p-10 text-center text-gray-500 bg-white rounded-2xl border-2 border-gray-200 text-xl">
                  Keine Heime gefunden.
                  <br/>
                  <span className="text-base text-gray-500">
                    Geben Sie eine gültige PLZ oder Stadt ein, um Ergebnisse zu sehen.
                  </span>
                </div>
              ) : (
                filteredHomes.map(home => (
                  <div key={home.id} className="bg-white p-6 rounded-2xl border-2 border-lilac-100 shadow-md flex items-start space-x-6 hover:border-lilac-300 transition-colors">
                     <input 
                      type="checkbox" 
                      className="mt-2 w-8 h-8 text-lilac-600 rounded-md border-gray-300 focus:ring-lilac-500" 
                      defaultChecked={true}
                      onChange={(e) => {
                        const current = formData.selectedHomes.length > 0 ? formData.selectedHomes : filteredHomes.map(h => h.id);
                        const next = e.target.checked 
                          ? [...current, home.id] 
                          : current.filter(id => id !== home.id);
                        updateData('selectedHomes', next);
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-2xl text-gray-900">{home.name}</h4>
                      <p className="text-lg text-gray-600 mt-1">{home.zip} {home.city} • {home.distance}km</p>
                      <p className="text-lg mt-2 text-gray-700">{home.description}</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        {home.supportedTypes.map(t => (
                          <span key={t} className="px-3 py-1 bg-sunny-100 text-sunny-900 text-sm font-bold rounded-full border border-sunny-200 uppercase tracking-wide">
                             {t === CareType.LONG_TERM ? 'Heimplatz' : t === CareType.SHORT_TERM ? 'Kurzzeit' : 'Tagespflege'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Admission Data */}
        {step === FamilyStep.ADMISSION_DATA && (
          <div className="space-y-8">
             <h2 className="text-4xl font-black text-lilac-900">{t('step.admission')}</h2>
             <Card>
                <h3 className="font-bold text-2xl mb-6 text-lilac-800 border-b-2 border-lilac-100 pb-2">Person (Patient)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Vorname" value={formData.firstName} onChange={e => updateData('firstName', e.target.value)} />
                  <Input label="Nachname" value={formData.lastName} onChange={e => updateData('lastName', e.target.value)} />
                </div>
                <Input label="Geburtsdatum" type="date" value={formData.birthDate} onChange={e => updateData('birthDate', e.target.value)} />
                
                <h4 className="font-bold text-xl mt-6 mb-4 text-gray-800">Aktuelle Adresse</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input className="md:col-span-2 mb-0" label={t('label.address_street')} value={formData.currentStreet} onChange={e => updateData('currentStreet', e.target.value)} />
                  <Input className="mb-0" label={t('label.address_housenr')} value={formData.currentHouseNumber} onChange={e => updateData('currentHouseNumber', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                   <Input className="mb-0" label={t('label.address_zip')} value={formData.currentZip} onChange={e => updateData('currentZip', e.target.value)} />
                   <Input className="md:col-span-2 mb-0" label={t('label.address_city')} value={formData.currentCity} onChange={e => updateData('currentCity', e.target.value)} />
                </div>
                <Input label={t('label.address_notes')} placeholder="Etage, Hinterhaus, Zugangscode..." value={formData.currentAddressNotes} onChange={e => updateData('currentAddressNotes', e.target.value)} />
                
                <h3 className="font-bold text-2xl mt-8 mb-6 text-lilac-800 border-b-2 border-lilac-100 pb-2">Versicherung</h3>
                <Input label="Krankenkasse" value={formData.insuranceProvider} onChange={e => updateData('insuranceProvider', e.target.value)} />
                <Input label="Versicherungsnummer" value={formData.insuranceNumber} onChange={e => updateData('insuranceNumber', e.target.value)} />

                <h3 className="font-bold text-2xl mt-8 mb-6 text-lilac-800 border-b-2 border-lilac-100 pb-2">Dokumente vorhanden?</h3>
                <div className="space-y-3">
                  <Checkbox label="Personalausweis" checked={formData.docIdCard} onChange={v => updateData('docIdCard', v)} />
                  <Checkbox label="Pflegegrad-Bescheid" checked={formData.docCareLevel} onChange={v => updateData('docCareLevel', v)} />
                  <Checkbox label="Vorsorgevollmacht" checked={formData.docPowerOfAttorney} onChange={v => updateData('docPowerOfAttorney', v)} />
                </div>
             </Card>
          </div>
        )}

        {/* STEP 6: Contact */}
        {step === FamilyStep.CONTACT_INFO && (
          <div className="space-y-8">
             <h2 className="text-4xl font-black text-lilac-900">{t('step.contact')}</h2>
             <Card>
                <Input label="Ihr Name" value={formData.contactName} onChange={e => updateData('contactName', e.target.value)} />
                <Input label="Handynummer" type="tel" value={formData.contactPhone} onChange={e => updateData('contactPhone', e.target.value)} />
                <Input label="E-Mail Adresse" type="email" value={formData.contactEmail} onChange={e => updateData('contactEmail', e.target.value)} />
                <Checkbox label="Ich bin Bevollmächtigter / Betreuer" checked={formData.isLegalGuardian} onChange={v => updateData('isLegalGuardian', v)} />
             </Card>
          </div>
        )}

        {/* STEP 7: Documents & Extras (NEW) */}
        {step === FamilyStep.DOCUMENTS_AND_EXTRAS && (
          <div className="space-y-8">
             <h2 className="text-4xl font-black text-lilac-900">{t('step.documents')}</h2>
             <Card className="space-y-8">
                {/* Parking Preference */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🅿️</span> Parkplatz
                  </h3>
                  <Checkbox 
                    label={t('label.parking')} 
                    checked={formData.needsParking} 
                    onChange={v => updateData('needsParking', v)} 
                  />
                </div>

                {/* File Uploads */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                       <span className="text-2xl">👨‍⚕️</span> {t('label.upload_doctor')}
                    </h3>
                    <div className="border-2 border-dashed border-lilac-300 rounded-xl p-6 text-center hover:bg-lilac-50 transition-colors">
                       <input type="file" id="doctorFile" className="hidden" onChange={(e) => handleFileUpload('fileDoctorLetter', e)} />
                       <label htmlFor="doctorFile" className="cursor-pointer block">
                          <div className="text-4xl mb-2">📄</div>
                          <span className="text-lilac-700 font-bold hover:underline">Datei auswählen</span>
                          {formData.fileDoctorLetter && (
                            <div className="mt-2 text-sm text-green-600 font-medium bg-green-50 py-1 px-2 rounded">
                                ✓ {formData.fileDoctorLetter}
                            </div>
                          )}
                       </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                       <span className="text-2xl">⚖️</span> {t('label.upload_poa')}
                    </h3>
                     <div className="border-2 border-dashed border-lilac-300 rounded-xl p-6 text-center hover:bg-lilac-50 transition-colors">
                       <input type="file" id="poaFile" className="hidden" onChange={(e) => handleFileUpload('filePowerOfAttorney', e)} />
                       <label htmlFor="poaFile" className="cursor-pointer block">
                          <div className="text-4xl mb-2">📜</div>
                          <span className="text-lilac-700 font-bold hover:underline">Datei auswählen</span>
                          {formData.filePowerOfAttorney && (
                            <div className="mt-2 text-sm text-green-600 font-medium bg-green-50 py-1 px-2 rounded">
                                ✓ {formData.filePowerOfAttorney}
                            </div>
                          )}
                       </label>
                    </div>
                  </div>
                </div>
             </Card>
          </div>
        )}

        {/* STEP 8: Consents */}
        {step === FamilyStep.CONSENTS && (
          <div className="space-y-8">
             <h2 className="text-4xl font-black text-lilac-900">{t('step.consents')}</h2>
             <Card className="space-y-6">
                <div className="p-6 bg-sunny-50 border-2 border-sunny-200 rounded-2xl">
                  <strong className="text-xl text-sunny-900 block mb-2">§45b SGB XI (Entlastungsbetrag)</strong>
                  <p className="mb-4 text-gray-700">{t('consent.45b')}</p>
                  <Checkbox 
                    label="Ja, ich bestätige (Wichtig!)" 
                    checked={formData.acceptedReliefBilling} 
                    onChange={v => updateData('acceptedReliefBilling', v)} 
                    required 
                    className="bg-white border-sunny-300"
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <Checkbox label={t('consent.agb')} checked={formData.acceptedAGB} onChange={v => updateData('acceptedAGB', v)} required />
                  <Checkbox label={t('consent.privacy')} checked={formData.acceptedPrivacy} onChange={v => updateData('acceptedPrivacy', v)} required />
                  <Checkbox label={t('consent.waitlist')} checked={formData.acceptedWaitlist} onChange={v => updateData('acceptedWaitlist', v)} />
                </div>
             </Card>
          </div>
        )}
        
        {/* STEP 9: Success */}
        {step === FamilyStep.SUCCESS && (
          <div className="text-center py-20 px-6">
            <div className="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-7xl shadow-lg">✓</div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">{t('success.title')}</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed">
              {t('success.message').replace('{email}', formData.contactEmail)}
            </p>
            <Button variant="primary" size="large" onClick={handleReset}>{t('btn.home')}</Button>
          </div>
        )}

        {/* Navigation Buttons */}
        {step !== FamilyStep.SUCCESS && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-lilac-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40">
            <div className="max-w-3xl mx-auto flex justify-between gap-6">
              <Button 
                variant="secondary" 
                size="large"
                onClick={() => step === 0 ? setView(AppView.LANDING) : setStep(s => s - 1)}
              >
                {t('btn.back')}
              </Button>
              <Button 
                variant="primary"
                size="large"
                disabled={!canProceed()}
                onClick={() => {
                  if (step === FamilyStep.CONSENTS) {
                    setStep(FamilyStep.SUCCESS);
                  } else {
                    setStep(s => s + 1);
                    window.scrollTo(0, 0);
                  }
                }}
                className="flex-1 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                {step === FamilyStep.CONSENTS ? t('btn.submit') : t('btn.next')}
              </Button>
            </div>
          </div>
        )}

        {/* Chat Assistant Trigger */}
        <div className="fixed bottom-32 right-6 z-40">
           <button 
            onClick={() => setShowChat(true)}
            className="bg-lilac-600 hover:bg-lilac-700 text-white p-5 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-110 border-4 border-white"
           >
             <FriendlyBotIcon className="w-10 h-10" />
             <span className="font-bold text-lg hidden sm:inline">{t('chat.trigger')}</span>
           </button>
        </div>

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-lilac-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-6">
            <div className="bg-white w-full sm:w-[500px] sm:rounded-3xl h-[85vh] sm:h-[700px] flex flex-col shadow-2xl border-4 border-lilac-200">
              <div className="p-6 border-b-2 border-lilac-100 flex justify-between items-center bg-lilac-50 rounded-t-[20px]">
                <div>
                  <h3 className="font-black text-2xl text-lilac-900">Assistent</h3>
                  <p className="text-sm text-lilac-600">Fragen Sie uns alles zur Pflege</p>
                </div>
                <button onClick={() => setShowChat(false)} className="text-lilac-400 hover:text-lilac-800 text-2xl font-bold bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {messages.length === 0 && (
                  <div className="text-center text-lg text-gray-500 mt-10 p-6 bg-lilac-50 rounded-2xl">
                    👋 Hallo! <br/>Fragen Sie mich nach "Pflegegrad", "Kosten" oder "Dokumenten".
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-5 text-lg shadow-sm ${
                      m.role === 'user' ? 'bg-lilac-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-sm text-lilac-500 animate-pulse font-medium px-2">Assistent schreibt...</div>}
              </div>
              <div className="p-6 border-t-2 border-lilac-100 bg-gray-50 rounded-b-[20px]">
                <div className="flex gap-3">
                  <input 
                    className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-lilac-500 focus:border-lilac-500 outline-none"
                    placeholder={t('chat.placeholder')}
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="primary" onClick={handleSendMessage} disabled={isTyping || !inputMsg}>➤</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCareHomePortal = () => {
    // Mock home ID 1 for MVP
    const homeId = '1';
    const status = careHomeStatuses[homeId] || {};

    const toggleStatus = (type: CareType) => {
      setCareHomeStatuses(prev => ({
        ...prev,
        [homeId]: {
          ...prev[homeId],
          [type]: !prev[homeId]?.[type]
        }
      }));
      // In a real app, this would trigger the SMS cascade logic on the backend
      if (!status[type]) {
         alert(`Availability for ${type} updated to FREE. \nSystem will now start SMS cascade to matching families.`);
      }
    };

    return (
      <div className={`max-w-7xl mx-auto px-6 py-10 ${appFontClass}`}>
         <div className="flex justify-between items-center mb-10">
           <h2 className="text-3xl font-black text-lilac-900">Dashboard: Seniorenzentrum Waldruhe</h2>
           <Button variant="outline" onClick={() => setView(AppView.LANDING)}>Logout</Button>
         </div>

         <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[CareType.LONG_TERM, CareType.SHORT_TERM, CareType.DAY_CARE].map(type => {
              const isFree = status[type];
              return (
                <Card key={type} className={`border-t-8 ${isFree ? 'border-t-green-500' : 'border-t-red-400'}`}>
                  <h3 className="font-bold text-2xl mb-6 text-gray-800">{t(`type.${type.toLowerCase().replace('_', '')}`)}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-bold px-4 py-2 rounded-lg ${isFree ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isFree ? t('carehome.free') : t('carehome.occupied')}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={isFree} onChange={() => toggleStatus(type)} />
                      <div className="w-16 h-9 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lilac-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </Card>
              );
            })}
         </div>

         <h3 className="text-2xl font-black mb-6 text-gray-900">Aktive Anfragen (Umkreis 10km)</h3>
         <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-lilac-50">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-bold text-lilac-900 uppercase tracking-wider">Type</th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-lilac-900 uppercase tracking-wider">Care Level</th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-lilac-900 uppercase tracking-wider">Dementia</th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-lilac-900 uppercase tracking-wider">Waiting Since</th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-lilac-900 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-lg">
                <tr>
                   <td className="px-8 py-6 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full bg-blue-100 text-blue-800">Short-term</span></td>
                   <td className="px-8 py-6 whitespace-nowrap">Level 3</td>
                   <td className="px-8 py-6 whitespace-nowrap">Yes</td>
                   <td className="px-8 py-6 whitespace-nowrap">2 Days</td>
                   <td className="px-8 py-6 whitespace-nowrap text-lilac-600 hover:text-lilac-900 cursor-pointer font-bold">Details & Contact</td>
                </tr>
                <tr>
                   <td className="px-8 py-6 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full bg-sunny-100 text-sunny-800">Day Care</span></td>
                   <td className="px-8 py-6 whitespace-nowrap">Level 2</td>
                   <td className="px-8 py-6 whitespace-nowrap">No</td>
                   <td className="px-8 py-6 whitespace-nowrap">14 Days</td>
                   <td className="px-8 py-6 whitespace-nowrap text-lilac-600 hover:text-lilac-900 cursor-pointer font-bold">Details & Contact</td>
                </tr>
              </tbody>
            </table>
         </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isSimpleLanguage ? 'text-xl' : 'text-lg'}`}>
      {renderHeader()}
      <main className="flex-1 relative bg-white">
        {view === AppView.LANDING && renderLanding()}
        {view === AppView.FAMILY_FLOW && renderFamilyFlow()}
        {view === AppView.CARE_HOME_PORTAL && renderCareHomePortal()}
      </main>
    </div>
  );
};

export default App;