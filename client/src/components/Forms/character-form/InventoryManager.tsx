import { useFormContext, useFieldArray } from "react-hook-form";
import type { ICharacter } from "../../../types/characterType";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

export const InventoryManager = () => {
    const { register, control } = useFormContext<ICharacter>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "inventaire.equipement",
    });

    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-1">
                <h3 className="text-amber-500 font-bold uppercase text-xs">
                    Inventaire
                </h3>
                <div className="flex gap-2 text-xs items-center">
                    <Input
                        label="Or (PO)"
                        type="number"
                        {...register("inventaire.pieces.po")}
                        className="w-16 text-center border-slate-600"
                    />
                    <Button
                        variant="secondary"
                        className="text-xs py-1 px-2 h-fit mt-5"
                        onClick={() =>
                            append({
                                nom: "Nouvel objet",
                                quantite: 1,
                                equipe: false,
                            })
                        }
                    >
                        + Objet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex gap-2 items-center border-b border-slate-700/50 pb-1 hover:bg-slate-700/30 p-1 rounded transition-colors"
                    >
                        {/* Checkbox simple reste en HTML natif pour l'instant */}
                        <input
                            type="checkbox"
                            {...register(
                                `inventaire.equipement.${index}.equipe`
                            )}
                            className="accent-amber-500 cursor-pointer w-4 h-4"
                            title="Équipé ?"
                        />

                        <Input
                            {...register(
                                `inventaire.equipement.${index}.quantite`
                            )}
                            type="number"
                            className="w-12 text-center text-xs p-1 h-8"
                        />
                        <Input
                            {...register(`inventaire.equipement.${index}.nom`)}
                            placeholder="Nom de l'objet"
                            className="bg-transparent border-transparent h-8 p-1"
                        />

                        <Button variant="icon" onClick={() => remove(index)}>
                            ×
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
