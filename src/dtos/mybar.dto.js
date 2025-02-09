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