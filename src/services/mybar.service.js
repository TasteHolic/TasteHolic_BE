import { getBar, addBar, viewBar, deleteBar, searchBar } from "../repositories/mybar.repository.js";
import { responseFromMyBar } from "../dtos/mybar.dto.js";
import { DuplicateAlcoholError, NoAlcoholError } from "../error.js";

export const myBarPost = async (data) => {
      const barId = await addBar({
          userId: data.userId,
          alcoholId: data.alcoholId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          name: data.name,
          category: data.category,
      });
  
      if (barId === null) {
          throw new DuplicateAlcoholError("이미 마이바에 추가되어있는 술입니다.", data);  // 에러 던지기
      }
    
      const bar = await getBar(barId);
      return bar;
  };

  export const myBarGet = async (userId) => {
    const bar = await viewBar(userId);
    
    if (!bar) {
      return null;
    }
  
    return responseFromMyBar(bar);
  };

  export const myBarDelete = async (barId) => {
    const deletedBar = await deleteBar(barId);

    if (deletedBar === null) {
        throw new NoAlcoholError("마이바에 존재하지 않는 술입니다.");  // 에러 던지기
    }
  
    return deletedBar;
  };

  export const myBarSearch = async (userId) => {
    const bar = await searchBar(userId);
    
    if (!bar) {
      return null;
    }
  
    return responseFromMyBar(bar);
  };