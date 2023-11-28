const VIEW = "favorites/VIEW_FAVORITE";
const ADD = "favorites/ADD_FAVORITE";
const REMOVE = "favorites/REMOVE_FAVORITE";

//Actions:
const viewFavorites = (favorites) => {
  return {
    type: VIEW,
    payload: favorites,
  };
};

const addFavorite = (favorite) => {
  return {
    type: ADD,
    payload: favorite,
  };
};

const removeFavorite = (favoriteId) => {
  return {
    type: REMOVE,
    payload: favoriteId,
  };
};

//Thunk Action Creators:
//VIEW FAVORITES
export const loadCurrUserFavorites = () => async (dispatch) => {
  try {
    const response = await fetch("/api/current-user/favorites", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        `There was an error in loading your favorites list: ${response.status}`
      );
    }
    const favorites = await response.json();
    await dispatch(viewFavorites(favorites));
    return response;
  } catch (error) {
    throw new Error(
      `The following error occured while attempting to load your favorites list: ${error.message}`
    );
  }
};

//ADD TO FAVORITES
export const addToCurrUserFavorites = (favorite) => async (dispatch) => {
  try {
    const response = await fetch("/api/current-user/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(favorite),
    });
    if (!response.ok) {
      throw new Error(
        `There was an error in adding the selected product to your favorites list: ${response.status}`
      );
    }
    const newFavorite = await response.json();
    await dispatch(addFavorite(newFavorite));
    await dispatch(loadCurrUserFavorites());
    return response;
  } catch (error) {
    throw new Error(
      `The following error occured while attempting to add the selected product to your favorites list: ${error.message}`
    );
  }
};

//REMOVE FROM FAVORITES
export const removeFromCurrUserFavorites = (favoriteId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/current-user/favorites/${+favoriteId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `There was an error in deleting favorite #${favoriteId} from your favorites list: ${response.status}`
      );
    }
    const deleteFav = await response.json();
    await dispatch(removeFavorite(deleteFav));
    await dispatch(loadCurrUserFavorites());
    return deleteFav;
  } catch (error) {
    throw new Error(
      `The following error occured while attempting to remove favorite #${favoriteId} to your favorites list: ${error.message}`
    );
  }
};

//Reducer
const initialState = { allFavorites: [], byId: {}, removedFavorite: [] };

export default function reducer(state = initialState, action) {
  let newState = {};

  switch (action.type) {
    case VIEW:
      if (action.payload.Favorites) {
        const byId = {};
        action.payload.Favorites.forEach((favorite) => {
          byId[favorite.id] = favorite;
        });
        newState = {
          allFavorites: action.payload.Favorites,
          byId: byId,
        };
        return newState;
      } else {
        newState = action.payload;
        return newState;
      }
    case ADD:
      newState = {
        allFavorites: [...state.allFavorites, action.payload.id],
        byId: { ...state.byId, [action.payload.id]: action.payload },
      };
      return newState;
    case REMOVE:
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
}
