import { useFormContext } from "react-hook-form";
import type { ICharacter } from "../../../types/characterType";
import { Input } from "../../ui/Input";

export const CombatStatsSection = () => {
    const { register } = useFormContext<ICharacter>();

    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-fit">
            <h3 className="text-amber-500 font-bold uppercase text-xs mb-3 border-b border-slate-700 pb-1">
                Stats Vitales
            </h3>
            <div className="flex gap-2 mb-4">
                <Input
                    label="CA"
                    type="number"
                    {...register("stats.ca")}
                    className="text-center font-bold text-blue-400"
                />
                <Input
                    label="PV Max"
                    type="number"
                    {...register("stats.pv_max")}
                    className="text-center font-bold text-green-500"
                />
                <Input
                    label="Vitesse"
                    type="number"
                    {...register("stats.vitesse")}
                    className="text-center font-bold"
                />
                <Input
                    label="Init"
                    type="number"
                    {...register("stats.init")}
                    className="text-center font-bold text-yellow-500"
                />
            </div>
        </div>
    );
};
