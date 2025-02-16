import { prisma } from "../../db.config.js";

export const bestTasteList = async(req,res,next) => {
    return await prisma.cocktails.findMany({
        orderBy: { likes: "desc" },
        take: 8,
      });
}
