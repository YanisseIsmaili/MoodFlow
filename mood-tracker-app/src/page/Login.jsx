import React, { useState } from "react";
import { LogIn, Mail, Lock, Sun, Coffee } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        alert(`Email: ${email}\nPassword: ${password}`);
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
                    <p className="text-amber-700">Connectez-vous à votre espace bien-être</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-amber-900">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-amber-900">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/60 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder-amber-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-amber-700">
                            <input type="checkbox" className="mr-2 text-amber-600" />
                            Se souvenir de moi
                        </label>
                        <a href="#" className="text-amber-600 hover:text-amber-800 transition-colors">
                            Mot de passe oublié ?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        Se connecter
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-amber-700">
                        Pas encore de compte ?{" "}
                        <a href="/register" className="text-amber-600 hover:text-amber-800 font-medium transition-colors">
                            S'inscrire
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;