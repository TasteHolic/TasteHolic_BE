export const bodyToBar = (body) => {
    const date = new Date().toISOString();
  
    return {
      userId: 1,
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