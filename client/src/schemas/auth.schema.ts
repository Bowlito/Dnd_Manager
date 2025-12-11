import { z } from "zod";

export const loginSchema = z.object({
    // On utilise une Regex standard pour l'email, ça évite tout problème de version Zod
    email: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: "Format d'email invalide",
        }),

    // Pour le mot de passe, on garde min() avec la syntaxe objet qui est la plus sûre
    password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
