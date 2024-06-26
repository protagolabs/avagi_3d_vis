import * as ActionType from './Actions';

const initialState = {
  loading: false,
  downloaded: true,
  data: null,
  error: null,
  frontImg: null,
  leftImg: null,
  rightImg: null
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
      case ActionType.UPLOAD_IMAGE_DONE:
        const {frontSrc, leftSrc, rightSrc} = action.payload;
        return { ...state, frontImg: frontSrc, leftImg: leftSrc, rightImg: rightSrc};

      case ActionType.FETCH_DATA_BEGIN:
        return { ...state, loading: true, data: null, error: null };
      case ActionType.FETCH_DATA_SUCCESS:
        return { ...state, loading: false, data: action.payload, error: null };
      case ActionType.FETCH_DATA_FAILURE:
        return { ...state, loading: false, data: null, error: action.payload };

      case ActionType.DOWNLOAD_GLB_BEGIN:
        return { ...state, downloaded: false, data: null, error: null };
      case ActionType.DOWNLOAD_GLB_SUCCESS:
        return { ...state, downloaded: true, data: action.payload, error: null };
      case ActionType.DOWNLOAD_GLB_FAILURE:
        return { ...state, downloaded: true, data: null, error: action.payload };
        
      default:
        return state;
    }
  };