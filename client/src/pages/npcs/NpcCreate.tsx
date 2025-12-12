import { useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../../api/axios";
import type { INpc } from "../../types/npcType";

// UI Components
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function NpcCreate() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, control, handleSubmit } = useForm<INpc>({
        defaultValues: {
            nom: "",
            race: "Humain",
            occupation: "",
            alignement: "Neutre",
            // RP
            voix: "",
            apparence: "",
            personnalite: "",
            but: "",
            secret: "",
            // Combat
            ca: 10,
            pv_max: 10,
            vitesse: 9,
            initiative: 0,
            // Stats
            force: 10,
            dexterite: 10,
            constitution: 10,
            intelligence: 10,
            sagesse: 10,
            charisme: 10,
            // Attaques
            attaques: [{ nom: "Attaque de base", bonus: 2, degats: "1d4" }],
            est_actif: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "attaques",
    });

    const onSubmit: SubmitHandler<INpc> = async (data) => {
        setIsSubmitting(true);
        try {
            // Conversion des types (HTML renvoie des strings)
            const payload = {
                ...data,
                pv: Number(data.pv_max), // On initialise les PV actuels au max
                pv_max: Number(data.pv_max),
                ca: Number(data.ca),
                vitesse: Number(data.vitesse),
                force: Number(data.force),
                dexterite: Number(data.dexterite),
                constitution: Number(data.constitution),
                intelligence: Number(data.intelligence),
                sagesse: Number(data.sagesse),
                charisme: Number(data.charisme),
                attaques: data.attaques.map((att) => ({
                    ...att,
                    bonus: Number(att.bonus),
                })),
            };

            await api.post("/npcs", payload);
            enqueueSnackbar("Nouveau PNJ créé avec succès !", {
                variant: "success",
            });
            navigate("/npcs");
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Erreur lors de la création.", {
                variant: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* EN-TÊTE FIXE */}
            <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800 sticky top-2 z-20 backdrop-blur shadow-lg">
                <Link
                    to="/npcs"
                    className="text-slate-400 hover:text-amber-500 font-bold text-sm uppercase tracking-wide"
                >
                    ← Annuler
                </Link>
                <h1 className="text-xl font-bold text-slate-100 font-serif tracking-wider">
                    Nouveau PNJ
                </h1>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="primary"
                    isLoading={isSubmitting}
                >
                    Enregistrer
                </Button>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* === COLONNE GAUCHE : IDENTITÉ & RP === */}
                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                        <h2 className="text-amber-500 font-bold uppercase text-xs border-b border-slate-700 pb-2 mb-4">
                            Identité
                        </h2>
                        <Input
                            label="Nom"
                            {...register("nom", { required: true })}
                            placeholder="Ex: Bob l'Aubergiste"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Race"
                                {...register("race")}
                                placeholder="Ex: Nain"
                            />
                            <Input
                                label="Occupation"
                                {...register("occupation")}
                                placeholder="Ex: Forgeron"
                            />
                        </div>
                        <Input
                            label="Alignement"
                            {...register("alignement")}
                            placeholder="Ex: Loyal Bon"
                        />
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                        <h2 className="text-indigo-400 font-bold uppercase text-xs border-b border-slate-700 pb-2 mb-4">
                            Roleplay
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Voix / Ton"
                                {...register("voix")}
                                placeholder="Grave, accent..."
                            />
                            <Input
                                label="Apparence"
                                {...register("apparence")}
                                placeholder="Cicatrice..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                Personnalité
                            </label>
                            <textarea
                                {...register("personnalite")}
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm h-20 focus:outline-none focus:border-indigo-500"
                                placeholder="Jovial mais avare..."
                            />
                        </div>
                        <Input
                            label="But / Motivation"
                            {...register("but")}
                            placeholder="S'enrichir..."
                        />
                        <div>
                            <label className="block text-xs font-bold text-purple-400 uppercase mb-1">
                                Secret
                            </label>
                            <textarea
                                {...register("secret")}
                                className="w-full bg-slate-900 border border-purple-500/30 rounded p-2 text-white text-sm h-20 focus:outline-none focus:border-purple-500"
                                placeholder="Est en fait un dragon..."
                            />
                        </div>
                    </div>
                </div>

                {/* === COLONNE DROITE : COMBAT === */}
                <div className="space-y-6">
                    {/* STATS VITALES */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-red-400 font-bold uppercase text-xs border-b border-slate-700 pb-2 mb-4">
                            Statblock
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Input
                                label="CA"
                                type="number"
                                {...register("ca")}
                                className="text-center font-bold text-blue-400"
                            />
                            <Input
                                label="PV Max"
                                type="number"
                                {...register("pv_max")}
                                className="text-center font-bold text-green-500"
                            />
                            <Input
                                label="Vitesse"
                                type="number"
                                {...register("vitesse")}
                                className="text-center"
                            />
                        </div>

                        {/* CARACTÉRISTIQUES */}
                        <div className="grid grid-cols-6 gap-2">
                            {[
                                "force",
                                "dexterite",
                                "constitution",
                                "intelligence",
                                "sagesse",
                                "charisme",
                            ].map((stat) => (
                                <div key={stat} className="text-center">
                                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">
                                        {stat.slice(0, 3)}
                                    </label>
                                    <input
                                        type="number"
                                        {...register(stat as any)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-center text-white text-sm focus:border-amber-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ATTAQUES */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
                            <h2 className="text-red-400 font-bold uppercase text-xs">
                                Attaques
                            </h2>
                            <Button
                                variant="secondary"
                                className="text-xs py-1 px-2"
                                onClick={() =>
                                    append({
                                        nom: "Nouvelle attaque",
                                        bonus: 0,
                                        degats: "",
                                    })
                                }
                            >
                                + Ajouter
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-12 gap-2 items-center bg-slate-900 p-2 rounded border border-slate-800"
                                >
                                    <div className="col-span-5">
                                        <input
                                            {...register(
                                                `attaques.${index}.nom`
                                            )}
                                            placeholder="Nom"
                                            className="w-full bg-transparent border-none text-white text-sm focus:ring-0"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            {...register(
                                                `attaques.${index}.bonus`
                                            )}
                                            placeholder="+Hit"
                                            className="w-full bg-slate-800 rounded text-center text-amber-500 font-bold text-sm p-1"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <input
                                            {...register(
                                                `attaques.${index}.degats`
                                            )}
                                            placeholder="Dégâts (ex: 1d6+2)"
                                            className="w-full bg-transparent text-right text-slate-400 text-sm"
                                        />
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-slate-600 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
