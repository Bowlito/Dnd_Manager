import { useFormContext, useFieldArray } from "react-hook-form";
import type { ICharacter } from "../../../types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

export const ActionsManager = () => {
    const { register, control } = useFormContext<ICharacter>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "actions",
    });

    return (
        <div className="lg:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-1">
                <h3 className="text-amber-500 font-bold uppercase text-xs">
                    Attaques & Sorts
                </h3>
                <Button
                    variant="secondary"
                    className="text-xs py-1 px-2"
                    onClick={() =>
                        append({
                            nom: "Nouvelle attaque",
                            bonus_attaque: 0,
                            degats: "1d6",
                            type_degats: "Tranchant",
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
                        className="grid grid-cols-12 gap-2 items-start bg-slate-900 p-2 rounded border border-slate-800"
                    >
                        <div className="col-span-4">
                            <Input
                                {...register(`actions.${index}.nom`)}
                                placeholder="Nom"
                                className="bg-transparent border-transparent"
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                type="number"
                                {...register(`actions.${index}.bonus_attaque`)}
                                placeholder="+Hit"
                                className="text-center"
                            />
                        </div>
                        <div className="col-span-3">
                            <Input
                                {...register(`actions.${index}.degats`)}
                                placeholder="Dégâts"
                                className="text-center bg-transparent border-transparent"
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                {...register(`actions.${index}.type_degats`)}
                                placeholder="Type"
                                className="text-center text-xs bg-transparent border-transparent"
                            />
                        </div>
                        <div className="col-span-1 text-right pt-1">
                            <Button
                                variant="icon"
                                onClick={() => remove(index)}
                            >
                                ×
                            </Button>
                        </div>
                    </div>
                ))}
                {fields.length === 0 && (
                    <p className="text-slate-500 text-xs italic text-center py-4">
                        Aucune attaque configurée.
                    </p>
                )}
            </div>
        </div>
    );
};
