import { useFormContext } from "react-hook-form";
import { formatMod, getMod } from "../../../utils/rules";
import type { ICharacter } from "../../../types/characterType";
import { Input } from "../../ui/Input";

export const AttributesSection = () => {
    const { register, watch } = useFormContext<ICharacter>();
    const stats = watch("caracteristiques");

    return (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {(
                [
                    "force",
                    "dexterite",
                    "constitution",
                    "intelligence",
                    "sagesse",
                    "charisme",
                ] as const
            ).map((statName) => {
                const val = Number(stats?.[statName] || 10);
                const mod = getMod(val);

                return (
                    <div
                        key={statName}
                        className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center flex flex-col items-center relative group hover:border-amber-500/50 transition-colors"
                    >
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">
                            {statName.slice(0, 3)}
                        </label>

                        <span
                            className={`text-2xl font-bold leading-none mb-2 ${
                                mod >= 0 ? "text-white" : "text-red-400"
                            }`}
                        >
                            {formatMod(val)}
                        </span>

                        <Input
                            type="number"
                            {...register(`caracteristiques.${statName}`)}
                            className="text-center font-bold h-10 w-full"
                        />
                    </div>
                );
            })}
        </div>
    );
};
