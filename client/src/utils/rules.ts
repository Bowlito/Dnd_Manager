// Une simple fonction pure qui sera utilisée partout
export const getMod = (val: number) => Math.floor((val - 10) / 2);

export const formatMod = (val: number) => {
    const mod = getMod(val);
    return mod >= 0 ? `+${mod}` : `${mod}`;
};
