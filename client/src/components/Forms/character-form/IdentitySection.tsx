import { useFormContext } from "react-hook-form";
import type { ICharacter } from "../../../types/characterType";
import type { IOption } from "../../../types/optionType";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";

interface Props {
    races: IOption[];
    classes: IOption[];
}

export const IdentitySection = ({ races, classes }: Props) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<ICharacter>();

    // Transformation des données pour le composant Select UI
    const raceOptions = races.map((r) => ({ label: r.nom, value: r.nom }));
    const classOptions = classes.map((c) => ({ label: c.nom, value: c.nom }));

    return (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row gap-6">
            <div className="shrink-0 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-slate-500 text-xs text-center p-2 font-mono">
                    Avatar
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="md:col-span-2">
                    <Input
                        label="Nom"
                        placeholder="Nom du héros"
                        {...register("nom", { required: "Le nom est requis" })}
                        error={errors.nom?.message}
                        className="bg-transparent border-b border-t-0 border-x-0 rounded-none border-slate-600 text-2xl font-serif font-bold focus:border-amber-500 px-0"
                    />
                </div>

                <div>
                    <Select
                        label="Race"
                        options={raceOptions}
                        placeholder="-- Choisir --"
                        {...register("race", { required: true })}
                    />
                </div>

                <div>
                    <Select
                        label="Classe"
                        options={classOptions}
                        placeholder="-- Choisir --"
                        {...register("classe", { required: true })}
                    />
                </div>

                <div>
                    <Input
                        label="Niveau"
                        type="number"
                        {...register("niveau")}
                    />
                </div>

                <div>
                    <Input
                        label="Historique"
                        placeholder="Soldat..."
                        {...register("historique")}
                    />
                </div>
            </div>
        </div>
    );
};
