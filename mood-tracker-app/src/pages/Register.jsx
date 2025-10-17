import React, { useState } from "react";
import { UserPlus, Mail, Lock, User, Sun, Coffee, Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "", 
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");
        
        // Validation des champs requis
        if (!formData.username.trim()) {
            setError("Le nom d'utilisateur est requis.");
            setIsLoading(false);
            return;
        }

        if (!formData.email.trim()) {
            setError("L'email est requis.");
            setIsLoading(false);
            return;
        }

        if (!formData.password.trim()) {
            setError("Le mot de passe est requis.");
            setIsLoading(false);
            return;
        }

        // Validation des longueurs maximales selon le backend
        if (formData.firstName && formData.firstName.length > 50) {
            setError("Le prénom ne peut pas dépasser 50 caractères.");
            setIsLoading(false);
            return;
        }

        if (formData.lastName && formData.lastName.length > 50) {
            setError("Le nom ne peut pas dépasser 50 caractères.");
            setIsLoading(false);
            return;
        }

        if (formData.username.length > 50) {
            setError("Le nom d'utilisateur ne peut pas dépasser 50 caractères.");
            setIsLoading(false);
            return;
        }

        if (formData.email.length > 100) {
            setError("L'email ne peut pas dépasser 100 caractères.");
            setIsLoading(false);
            return;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Veuillez saisir un email valide.");
            setIsLoading(false);
            return;
        }

        // Validation de confirmation du mot de passe
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas!");
            setIsLoading(false);
            return;
        }

        // Validation du mot de passe selon les critères du backend
        if (formData.password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            setIsLoading(false);
            return;
        }

        if (formData.password.length > 50) {
            setError("Le mot de passe ne peut pas dépasser 50 caractères.");
            setIsLoading(false);
            return;
        }

        if (!/(?=.*[A-Z])/.test(formData.password)) {
            setError("Le mot de passe doit contenir au moins une lettre majuscule.");
            setIsLoading(false);
            return;
        }

        if (!/(?=.*[a-z])/.test(formData.password)) {
            setError("Le mot de passe doit contenir au moins une lettre minuscule.");
            setIsLoading(false);
            return;
        }

        if (!/(?=.*\d)/.test(formData.password)) {
            setError("Le mot de passe doit contenir au moins un chiffre.");
            setIsLoading(false);
            return;
        }

        if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
            setError("Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&).");
            setIsLoading(false);
            return;
        }

        try {
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };

            const response = await apiService.register(userData);
            
            setSuccess("Compte créé avec succès ! Redirection vers la connexion...");
            
            // Rediriger vers la page de login après 2 secondes
            setTimeout(() => {
                navigate("/login");
            }, 2000);
            
        } catch (error) {
            setError(error.message || "Erreur lors de la création du compte. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-200">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Sun className="w-8 h-8 text-amber-600" />
                        <h1 className="text-3xl font-bold text-amber-900">MoodFlow</h1>
                        <Coffee className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="text-amber-700">Créez votre compte pour commencer votre voyage bien-être</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl">
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-amber-900">
                                <User className="w-4 h-4 inline mr-2" />
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                                placeholder="Jean"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-amber-900">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                                placeholder="Dupont"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-amber-900">
                            <User className="w-4 h-4 inline mr-2" />
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                            placeholder="nom_utilisateur"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-amber-900">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                            placeholder="jean.dupont@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-amber-900">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 pr-12 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-amber-600 hover:text-amber-800 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-amber-900">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 pr-12 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-amber-600 hover:text-amber-800 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center text-sm">
                        <label className="flex items-start text-amber-700">
                            <input type="checkbox" className="mr-2 mt-0.5 text-amber-600" required />
                            <span>
                                J'accepte les{" "}
                                <a href="#" className="text-amber-600 hover:text-amber-800 transition-colors underline">
                                    conditions d'utilisation
                                </a>{" "}
                                et la{" "}
                                <a href="#" className="text-amber-600 hover:text-amber-800 transition-colors underline">
                                    politique de confidentialité
                                </a>
                            </span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Création du compte...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Créer mon compte
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-amber-700">
                        Déjà un compte ?{" "}
                        <a href="/login" className="text-amber-600 hover:text-amber-800 font-medium transition-colors">
                            Se connecter
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;