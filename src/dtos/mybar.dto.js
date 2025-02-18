export const bodyToBar = (body, userId) => {
    const date = new Date().toISOString();
  
    return {
      userId: userId,
      alcoholId: body.alcoholId,
      createdAt: date,
      updatedAt: date,
      name:body.name,
      category: body.category,
    };
  };

  export const responseFromMyBar = (bar) => {
    return {
      data: bar,
    };
  };

  export const findAlcoholsByCategory = async (category) => {
    try {
      const alcohols = await prisma.alcohols.findMany({
        where: {
          OR: [
            { categoryEng: category },
            { categoryKor: category },
            { Category: category },
          ],
        },
        select: {
          id: true,
          nameEng: true,  
          id: true,
          nameKor: true,
        },
      });
      return alcohols;
    } catch (error) {
      console.error('Error fetching alcohols by category:', error);
      throw error;
    }
  };
  
  