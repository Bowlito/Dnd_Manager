import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

// Context & Schema
import { useAuth } from "../../contexts/authContext";
import { loginSchema, type LoginSchemaType } from "../../schemas/auth.schema";

// UI Components
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    // Configuration du formulaire via React Hook Form et Zod
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });

    // Gestion de la soumission
    const onSubmit = async (data: LoginSchemaType) => {
        try {
            await login(data);

            // Feedback visuel succès
            enqueueSnackbar("Bienvenue Grand Maître !", {
                variant: "success",
            });

            navigate("/");
        } catch (err: any) {
            console.error("Erreur login:", err);

            // Feedback visuel erreur via Notistack
            if (err.response?.status === 401) {
                enqueueSnackbar("Email ou mot de passe incorrect.", {
                    variant: "error",
                });
            } else {
                enqueueSnackbar("Erreur serveur, veuillez réessayer.", {
                    variant: "error",
                });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 px-4">
            <PageHeader title="Connexion" subtitle="Accès Maître du Jeu" />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-slate-900 p-8 rounded-xl border border-slate-700 shadow-xl space-y-6 mt-6"
            >
                {/* Champ Email */}
                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        {...register("email")}
                        type="text"
                        className={`w-full bg-slate-950 border rounded p-3 text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.email
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-700 focus:border-amber-500 focus:ring-amber-500/20"
                        }`}
                        placeholder="admin@dnd.com"
                    />
                    {errors.email && (
                        <p className="text-red-400 text-xs mt-1 font-bold">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Champ Mot de passe */}
                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">
                        Mot de passe
                    </label>
                    <input
                        {...register("password")}
                        type="password"
                        className={`w-full bg-slate-950 border rounded p-3 text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.password
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-700 focus:border-amber-500 focus:ring-amber-500/20"
                        }`}
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="text-red-400 text-xs mt-1 font-bold">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Bouton de soumission */}
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 text-lg font-bold flex justify-center items-center gap-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin">⚔️</span>{" "}
                            Connexion...
                        </>
                    ) : (
                        "Se connecter"
                    )}
                </Button>
            </form>
        </div>
    );
}
