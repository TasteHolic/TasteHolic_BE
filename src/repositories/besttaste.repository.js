import { prisma } from "../../db.config.js";

export const bestTasteList = async (req, res, next) => {
  try {
    const bestList = await prisma.$queryRaw`
      SELECT 
    id,  
    nameKor,
    imageUrl, 
    category,
    intro
FROM Alcohols
WHERE id IN (39, 14, 65, 62, 66)

UNION ALL

SELECT 
    id, 
    nameKor,
    'cocktail' AS category, 
    imageUrl,
    intro
FROM Cocktails
WHERE id IN (10, 4, 11);

    `;

    return bestList;
  } catch (error) {
    throw error;
  }
};
