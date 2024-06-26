import { Form } from "react-router-dom";

export const UPLOAD_IMAGE_DONE = 'UPLOAD_IMAGE_DONE'

export const FETCH_DATA_BEGIN = 'FETCH_DATA_BEGIN';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

export const DOWNLOAD_GLB_BEGIN = 'DOWNLOAD_GLB_BEGIN';
export const DOWNLOAD_GLB_SUCCESS = 'DOWNLOAD_GLB_SUCCESS';
export const DOWNLOAD_GLB_FAILURE = 'DOWNLOAD_GLB_FAILURE';


export const uploadImageDone = (frontSrc, leftSrc, rightSrc) => ({
    type: UPLOAD_IMAGE_DONE,
    payload : {frontSrc, leftSrc, rightSrc}
})

export const fetchDataBegin = () => ({
    type: FETCH_DATA_BEGIN
  });
  
export const fetchDataSuccess = jsonData => ({
    type: FETCH_DATA_SUCCESS,
    payload: { jsonData }
  });
  
export const fetchDataFailure = error => ({
    type: FETCH_DATA_FAILURE,
    payload: { error }
  });

export const downloadGlbBegin = () => ({
    type: DOWNLOAD_GLB_BEGIN
});


export const downloadGlbSuccess = jsonData => ({
    type: DOWNLOAD_GLB_SUCCESS,
    payload: { jsonData }
});

export const downloadGlbFailure = error => ({
    type: DOWNLOAD_GLB_FAILURE,
    payload: { error }
});
  
export const fetchData = formData => {
    return dispatch => {
      console.log('calling API')
      dispatch(fetchDataBegin());
      // Simulate API call
      fetch('http://127.0.0.1:8999/avagi/generate', {
        method: 'POST',
        body: formData
      })
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchDataSuccess(json));
        return json;
      })
      .catch(error => dispatch(fetchDataFailure(error)));
    };
};


export const downloadGlb = s3_download_link => {
  return dispatch => {
    console.log('calling API')
    dispatch(downloadGlbBegin());

    const formData = new FormData();
    formData.append('s3_download_link', s3_download_link)
    formData.append('local_file_path', '/Users/mymac/netmind/3d_avagi/front-end')
    // Simulate API call
    fetch('http://127.0.0.1:8999/avagi/download', {
      method: 'POST',
      body: formData
    })
    .then(handleErrors)
    .then(res => res.json())
    .then(json => {
      dispatch(downloadGlbSuccess(json));
      return json;
    })
    .catch(error => dispatch(downloadGlbFailure(error)));
  };
};
  
  // Handle HTTP errors since fetch won't reject an HTTP error status.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }