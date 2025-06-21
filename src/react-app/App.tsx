import * as React from 'react';
import { useState, useCallback, FormEvent, FocusEvent, ChangeEvent, useEffect } from 'react';
import FormField from './components/FormField';
import Button from './components/Button';
import './styles.css'; // Import your CSS file for styles
import { FormData, FormErrors, ParticipationType } from './types';

const initialFormData: FormData = {
  civilite: '',
  nom: '',
  prenom: '',
  email: '',
  organisation: '',
  fonction: '',
  pays: '', // Ajouté ici
  typeParticipation: '',
  besoinHebergement: false,
  restrictionsAlimentaires: '',
  attente: '',
};

const initialErrors: FormErrors = {};

// --- Animated Background ---
interface AnimatedItem {
  id: string;
  type: 'Projet' | 'Formation';
  title: string;
  icon: React.ReactElement;
  description: string;
  positionClasses: string; // Tailwind classes for top/left/right
  animationName: 'floatType1' | 'floatType2' | 'floatType3';
  animationDuration: string;
  animationDelay: string;
}

const ProjectIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`w-7 h-7 mr-3 text-sky-700/70 ${className}`}>
    <path d="M12 6.525A5.475 5.475 0 006.525 12 5.475 5.475 0 0012 17.475 5.475 5.475 0 0017.475 12 5.475 5.475 0 0012 6.525zM4.05 10.95a7.5 7.5 0 017.5-7.5v1.5a6 6 0 00-6 6H4.05zm15.9 2.1a7.5 7.5 0 01-7.5 7.5v-1.5a6 6 0 006-6h1.5zm-2.1-15.9a7.5 7.5 0 017.5 7.5h-1.5a6 6 0 00-6-6V4.05zm-12.3 0V5.1a6 6 0 00-6 6H1.95a7.5 7.5 0 017.5-7.5zM12 1.95A10.05 10.05 0 001.95 12h1.5A8.55 8.55 0 0112 3.45V1.95zm0 20.1A10.05 10.05 0 0022.05 12h-1.5A8.55 8.55 0 0112 20.55V22.05z"></path>
  </svg>
);

const FormationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`w-7 h-7 mr-3 text-emerald-700/70 ${className}`}>
    <path d="M4 19.5V4.5C4 3.121 5.121 2 6.5 2H17.5C18.879 2 20 3.121 20 4.5V19.5L12 15.5L4 19.5zM6.5 4a.5.5 0 00-.5.5v12.036l6-3.6 6 3.6V4.5a.5.5 0 00-.5-.5h-11z" />
    <path d="M2 22V7h2v13h16v2H2z" />
  </svg>
);

const animatedBackgroundItemsData: AnimatedItem[] = [
  { id: 'p1', type: 'Projet', title: 'Catalyseur ZLECAf', description: "Plateformes numériques innovantes.", icon: <ProjectIcon />, positionClasses: 'top-[8%] left-[2%]', animationName: 'floatType1', animationDuration: '35s', animationDelay: '0s' },
  { id: 'f1', type: 'Formation', title: 'Maîtrise ZLECAf', description: "Aspects juridiques et opérationnels.", icon: <FormationIcon />, positionClasses: 'top-[12%] right-[1%]', animationName: 'floatType2', animationDuration: '40s', animationDelay: '3s' },
  { id: 'p2', type: 'Projet', title: 'Observatoire ZLECAf', description: "Analyse de données et veille stratégique.", icon: <ProjectIcon />, positionClasses: 'bottom-[25%] left-[5%]', animationName: 'floatType3', animationDuration: '38s', animationDelay: '5s' },
  { id: 'f2', type: 'Formation', title: 'Export Pro Afrique', description: "Optimiser les chaînes de valeur.", icon: <FormationIcon />, positionClasses: 'bottom-[20%] right-[3%]', animationName: 'floatType1', animationDuration: '32s', animationDelay: '8s' },
  { id: 'p3', type: 'Projet', title: 'Ponts Commerciaux', description: "Partenariats transfrontaliers.", icon: <ProjectIcon />, positionClasses: 'top-[45%] left-[calc(50%-420px)]', animationName: 'floatType2', animationDuration: '42s', animationDelay: '1s' }, // Adjusted to be further left
  { id: 'f3', type: 'Formation', title: 'Leadership ZLECAf', description: "Compétences managériales.", icon: <FormationIcon />, positionClasses: 'top-[50%] right-[calc(50%-420px)]', animationName: 'floatType3', animationDuration: '36s', animationDelay: '6s' }, // Adjusted to be further right
];

const AnimatedFloatingItem: React.FC<{ item: AnimatedItem }> = ({ item }) => {
  return (
    <div
      className={`absolute ${item.positionClasses} w-60 p-4 rounded-xl shadow-xl bg-white/30 dark:bg-sky-900/30 backdrop-blur-md border border-white/20`}
      style={{
        animationName: item.animationName,
        animationDuration: item.animationDuration,
        animationDelay: item.animationDelay,
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      }}
    >
      <div className="flex items-start">
        {item.icon}
        <div>
          <h4 className="font-semibold text-sm text-slate-700 dark:text-sky-100">{item.title}</h4>
          <p className="text-xs text-slate-600 dark:text-sky-200/80">{item.description}</p>
        </div>
      </div>
    </div>
  );
};
// --- End Animated Background ---

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Debounce content load state change for smoother transitions
    const timer = setTimeout(() => setIsContentLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [showIntro, submissionSuccess]); // Re-trigger on view change

  const validateField = <K extends keyof FormData,>(name: K, value: FormData[K]): string | undefined => {
    switch (name) {
      case 'nom':
        return value && String(value).trim().length >= 2 ? undefined : 'Le nom doit comporter au moins 2 caractères.';
      case 'prenom':
        return value && String(value).trim().length >= 2 ? undefined : 'Le prénom doit comporter au moins 2 caractères.';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(value)) ? undefined : 'Veuillez saisir une adresse e-mail valide.';
      case 'typeParticipation':
        return Array.isArray(value) && value.length > 0 ? undefined : 'Veuillez sélectionner un type de participation.';
      case 'civilite':
        return value ? undefined : 'Veuillez sélectionner une civilité.';
      case 'pays':
        return value && value.length >= 2 ? undefined : 'Veuillez sélectionner un pays.';
      default:
        return undefined;
    }
  };

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'typeParticipation') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => {
        const arr = Array.isArray(prev.typeParticipation) ? prev.typeParticipation : [];
        return {
          ...prev,
          typeParticipation: checked
            ? [...arr, value as ParticipationType]
            : arr.filter((v: string) => v !== value)
        };
      });
      return;
    }

    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (errors[name as keyof FormData]) {
      const fieldError = validateField(name as keyof FormData, fieldValue as FormData[keyof FormData]);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [errors]); // Dependency on `errors` ensures re-validation logic is current

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target as { name: keyof FormData }; // Type assertion
    const value = formData[name];
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  }, [formData]); // Dependency on `formData` ensures validation uses current field value


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      // Validate only required fields or fields that have specific validation rules
      if (key === 'civilite' || key === 'nom' || key === 'prenom' || key === 'email' || key === 'typeParticipation' || key === 'pays') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setIsContentLoaded(false); // Start transition for submission
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        setShowIntro(false); 
        // setIsContentLoaded(true) will be handled by useEffect for new view
        console.log('Form data submitted:', formData);
      }, 1500);
    }
  }, [formData]); // Dependency on formData
  
  const handleProceedToForm = useCallback(() => {
    setShowIntro(false);
    setIsContentLoaded(false); // Trigger exit animation for intro, entry for form
  }, []);

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setSubmissionSuccess(false);
    setIsSubmitting(false);
    setShowIntro(true); 
    setIsContentLoaded(false); // Trigger exit/entry animations
  }, []);
  
  const participationOptions = Object.values(ParticipationType).map(type => ({
    value: type,
    label: type,
  }));

  const countries = [
    "Afrique du Sud", "Algérie", "Allemagne", "Angola", "Arabie Saoudite", "Argentine", "Australie", "Autriche",
    "Bénin", "Botswana", "Brésil", "Burkina Faso", "Burundi",
    "Cameroun", "Canada", "Centrafrique", "Chili", "Chine", "Congo", "Congo (RDC)", "Corée du Sud", "Côte d'Ivoire",
    "Danemark", "Djibouti", "Égypte", "Émirats arabes unis", "Espagne", "États-Unis", "Éthiopie",
    "Finlande", "France",
    "Gabon", "Gambie", "Ghana", "Grèce", "Guinée", "Guinée-Bissau", "Guinée équatoriale",
    "Hongrie",
    "Inde", "Indonésie", "Irak", "Irlande", "Islande", "Israël", "Italie",
    "Japon", "Jordanie",
    "Kenya", "Koweït",
    "Lesotho", "Liban", "Libéria", "Libye", "Luxembourg",
    "Madagascar", "Malawi", "Mali", "Maroc", "Maurice", "Mauritanie", "Mexique", "Mozambique",
    "Namibie", "Niger", "Nigéria", "Norvège", "Nouvelle-Zélande",
    "Ouganda", "Ouzbékistan",
    "Pakistan", "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal",
    "Qatar",
    "République tchèque", "Roumanie", "Royaume-Uni", "Russie", "Rwanda",
    "Sénégal", "Serbie", "Sierra Leone", "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Suède", "Suisse", "Syrie",
    "Tanzanie", "Tchad", "Thaïlande", "Togo", "Tunisie", "Turquie",
    "Ukraine", "Uruguay",
    "Venezuela", "Vietnam",
    "Yémen",
    "Zambie", "Zimbabwe",
    "Autre"
  ];

  const CommonFooterContent: React.FC<{isLoaded: boolean}> = ({ isLoaded }: { isLoaded: boolean }) => (
    <footer className={`w-full max-w-3xl mt-12 text-center text-sm text-gray-600 dark:text-gray-400 transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-2">
        <a href="https://crpdc-club2droit.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          Visitez crpdc-club2droit.com
        </a>
      </div>
      <div className="flex justify-center space-x-4 mb-2">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" clipRule="evenodd" />
          </svg>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} Crpdc-club2droit. Tous droits réservés.</p>
    </footer>
  );

  return (
    <div className="relative min-h-screen w-full" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
      {/* Animated Background - z-0 */}
      <div className="absolute inset-0 z-0 overflow-hidden"> {/* Added overflow-hidden here too */}
        {animatedBackgroundItemsData.map(item => (
          <AnimatedFloatingItem key={item.id} item={item} />
        ))}
      </div>

      {/* Main Content Area - z-10 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 sombre-main-content">
        {submissionSuccess && (
          <div 
            className={`bg-white/90 dark:bg-slate-800/90 p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md
                        transform transition-all duration-500 ease-out
                        ${isContentLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20 text-green-500 mx-auto mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Merci pour votre inscription !</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">Votre inscription au colloque a été enregistrée avec succès. Nous vous contacterons bientôt avec plus de détails.</p>
            <Button onClick={handleReset} variant="success" fullWidth>
              Faire une autre inscription
            </Button>
          </div>
        )}

        {showIntro && !submissionSuccess && (
          <div 
            className={`bg-white/90 dark:bg-slate-800/90 p-6 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-2xl
                        transform transition-all duration-700 ease-out
                        ${isContentLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-95'}`}
          >
            <header className="mb-8 text-center"> {/* Centered intro header text */}
              <div className="flex justify-center mb-6">
                <img 
                  src="./image.jpeg" 
                  alt="Illustration thématique pour le colloque ZLECAf" 
                  className="rounded-lg shadow-lg object-cover w-full max-w-md mx-auto"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-sky-700 dark:text-sky-400">Colloque sur la ZLECAf</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-6 text-base sm:text-lg">
                Rejoignez-nous pour un événement exceptionnel dédié au partage des connaissances et à l'innovation autour de la Zone de Libre-Échange Continentale Africaine (ZLECAf).
              </p>
            </header>

            <div className="my-10 space-y-6 text-left">
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-5.582M12 15.75a3 3 0 0 1-6 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-white">Réseautage de Qualité</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Échangez avec des experts, des chercheurs et des professionnels de divers horizons impliqués dans la ZLECAf.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-white">Contenu Avant-Gardiste</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Accédez à des présentations et des ateliers sur les dernières avancées, défis et opportunités de la ZLECAf.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-white">Développement Stratégique</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Une opportunité unique pour comprendre les enjeux et contribuer au développement de la ZLECAf.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center"> {/* Centered intro button */}
              <Button onClick={handleProceedToForm} variant="primary" className="px-10 py-4 text-lg">
                Commencer l'inscription
              </Button>
            </div>
          </div>
        )}

        {!showIntro && !submissionSuccess && (
          <div 
            className={`bg-white/90 dark:bg-slate-800/90 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-3xl
                        transform transition-all duration-700 ease-out
                        ${isContentLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-95'}`}
          >
            <header className="mb-8 text-center">
              <h1 className="sombre-header">Inscription au Colloque ZLECAf</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base">Remplissez le formulaire ci-dessous pour vous inscrire.</p>
            </header>
            
            <form onSubmit={handleSubmit} noValidate className="text-white">
              {/* Civilité en premier */}
              <div className="mb-4">
                <label className="block mb-2 font-medium text-white">
                  Civilité <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-row gap-4">
                  {['M.', 'Mme'].map((option, idx) => (
                    <label
                      key={option}
                      className={`
                        flex items-center px-4 py-2 rounded-xl border-2 cursor-pointer transition min-w-[120px]
                        ${formData.civilite === option
                          ? 'border-red-400 bg-white/10'
                          : 'border-slate-300 bg-white/5 hover:border-sky-400'}
                      `}
                    >
                      <input
                        type="radio"
                        name="civilite"
                        value={option}
                        checked={formData.civilite === option}
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                      <span className={`
                        flex items-center justify-center w-7 h-7 rounded-md font-bold mr-3
                        ${formData.civilite === option
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-600 text-white'}
                      `}>
                        {idx === 0 ? 'A' : 'B'}
                      </span>
                      <span className="font-semibold text-white">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.civilite && (
                  <p className="text-xs text-red-600 mt-1">{errors.civilite}</p>
                )}
              </div>

              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField
                  id="nom" label="Nom" name="nom" type="text" value={formData.nom}
                  onChange={handleChange} onBlur={handleBlur} error={errors.nom} isRequired
                  placeholder="Votre nom de famille"
                />
                <FormField
                  id="prenom" label="Prénom" name="prenom" type="text" value={formData.prenom}
                  onChange={handleChange} onBlur={handleBlur} error={errors.prenom} isRequired
                  placeholder="Votre prénom"
                />
              </div>

              {/* Email */}
              <FormField
                id="email" label="Adresse E-mail" name="email" type="email" value={formData.email}
                onChange={handleChange} onBlur={handleBlur} error={errors.email} isRequired
                placeholder="exemple@domaine.com"
              />
             
              {/* Niveau d’études */}
              <div className="mb-4">
                <label className="block mb-2 font-medium text-white">
                  Niveau d’études <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {participationOptions.map((option, idx) => (
                    <label
                      key={option.value}
                      className={`
                        flex items-center px-5 py-3 rounded-xl border-2 cursor-pointer transition min-w-[120px]
                        ${formData.typeParticipation === option.value
                          ? 'border-red-400 bg-white/10'
                          : 'border-slate-300 bg-white/5 hover:border-sky-400'}
                      `}
                    >
                      <input
                        type="radio"
                        name="typeParticipation"
                        value={option.value}
                        checked={formData.typeParticipation === option.value}
                        onChange={e => setFormData(prev => ({ ...prev, typeParticipation: e.target.value }))}
                        className="hidden"
                        required
                      />
                      <span className={`
                        flex items-center justify-center w-7 h-7 rounded-md font-bold mr-3 text-base
                        ${formData.typeParticipation === option.value
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-600 text-white'}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-semibold text-white">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.typeParticipation && (
                  <p className="text-xs text-red-600 mt-1">{errors.typeParticipation}</p>
                )}
              </div>
              <FormField
                id="besoinHebergement" label="J'ai besoin d'un certificat" name="besoinHebergement" type="checkbox"
                value={formData.besoinHebergement} onChange={handleChange} onBlur={handleBlur}
              />
        

              <FormField
                id="attente" label="Avez-vous des attentes particulieres par rapport au colloque" name="attente"
                type="textarea" value={formData.attente} onChange={handleChange} onBlur={handleBlur}
                error={errors.attente} isRequired
                placeholder="Indiquez ici vos attentes particulières" rows={4}
              />

              {/* Champ pour le pays */}
              <div className="mb-4">
                <label htmlFor="pays" className="block mb-2 font-medium text-white">
                  Pays <span className="text-red-500">*</span>
                </label>
                <select
                  id="pays"
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-800 text-white"
                  required
                >
                  <option value="">Sélectionnez votre pays</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.pays && (
                  <p className="text-xs text-red-600 mt-1">{errors.pays}</p>
                )}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <Button type="reset" variant="secondary" onClick={handleReset} disabled={isSubmitting} className="w-full sm:w-auto">
                  Réinitialiser
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer l\'inscription'}
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-right">Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires.</p>
            </form>
          </div>
        )}
        <CommonFooterContent isLoaded={isContentLoaded} />
      </div>
    </div>
  );
};

export default App;
