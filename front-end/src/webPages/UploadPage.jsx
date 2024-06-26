// src/pages/AboutPage.jsx
import React, { useState, useEffect }from 'react';
import './UploadPage.css'
import ProgressBar from '../components/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { uploadImageDone, fetchData } from '../stateManagements/Actions'

function UploadPage() {

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  const [images, setImages] = useState({
    frontFacing: 'image_placeholder.jpg',
    leftFacing: 'image_placeholder.jpg',
    rightFacing: 'image_placeholder.jpg'
  });

  const [isDisabled, setIsDisabled] = useState(true);

  const [hasImage, setHasImage] = useState({
    frontFacing: false,
    leftFacing: false,
    rightFacing: false
  })

  useEffect(() => {
    const checkPlaceholders = Object.values(images).some(image => image === 'image_placeholder.jpg');
    setIsDisabled(checkPlaceholders);
  }, [images]);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleClick = () => {
    if (!isDisabled) {
      const formData = new FormData();
      let frontSrc = null;
      let leftSrc = null;
      let rightSrc = null;

      Object.entries(images).forEach(([key, src]) => {
          const blob = dataURLtoBlob(src); 
          switch (key) {
            case 'frontFacing':
              frontSrc = src;
            case 'leftFacing':
              leftSrc = src;
            case 'rightFacing':
              rightSrc = src;
          }
          formData.append(key, new File([blob], `${key}.jpg`, { type: 'image/jpeg' }));
      });

      dispatch(uploadImageDone(frontSrc, leftSrc, rightSrc));
      dispatch(fetchData(formData))
      navigate('/await'); 
    };
  }


  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Create an image element
        const img = new Image();
        img.onload = () => {
          // Once the image is loaded, draw it on a canvas
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          // Convert the canvas content to a JPEG URL
          canvas.toBlob((blob) => {
            // Create a new File object
            const newFile = new File([blob], `${key}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            // Update the state with the new JPEG image
            const readerJPEG = new FileReader();
            readerJPEG.onloadend = () => {
              setImages(prevImages => ({ ...prevImages, [key]: readerJPEG.result }));
              setHasImage(prevHasImages => ({...prevHasImages, [key]: true}))
            };
            readerJPEG.readAsDataURL(newFile);
          }, 'image/jpeg', 1); // The last parameter here is the quality of the JPEG
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('the uploaded file must be image!')
    }
  };

  const triggerFileInput = (key) => {
    const fileInput = document.getElementById(`file-input-${key}`);
  
    if (hasImage[key]){
      // If there's an image already, set it back to placeholder, update the state, and clear the input.
      setImages(prevImages => ({...prevImages, [key]: 'image_placeholder.jpg'}));
      setHasImage(prevHasImages => ({...prevHasImages, [key]: false}));
      // Clear the input file after removing the image
      if (fileInput) {
        fileInput.value = "";
      }
    } else {
      // Trigger the file input only if it's in the placeholder state
      fileInput && fileInput.click();
    }
  };
  

  return (
    <div className='wrapper'>
      <div className='header'></div>
      <div className='container Upload-Body text-center'>
        <div className='row'>
          <div className='col-12'>
            <h1 className='title'>Confirm the Images</h1>
          </div>
          <div className='col-12 img-list'>
            <div className='row'>
              {Object.entries(images).map(([key, src]) => (
                <div className='col-4' key={key}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageChange(e, key)} 
                    style={{display: 'none'}} 
                    id={`file-input-${key}`} 
                  />
                  <div className='image-demo-wrapper'>
                    <img className={`image-demo ${hasImage[key] && 'has-image'}`} src={src} onClick={() => triggerFileInput(key)} />
                    {hasImage[key] && <p className='remove-text'>Remove Image</p>}
                  </div>
                  <p className='image-label'>{`${key} Image`}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='col-12'>
            <button type="button" className={`${isDisabled ? 'btn-disabled' : 'btn-abled'}`} onClick={handleClick}>Generate</button>
          </div>
          <div className='col-12'>
            <p className='explain'>Please make sure to upload pictures with clear faces</p>
          </div>
        </div>
      </div>
      <div className='container footer-container'>
          <div className='row' id='footer'>
            <div className='col-4'><ProgressBar title='Step 1: Upload' content={`Try to upload clear images of your face. \nALL image formats are accepted`} is_activated='1'/></div>
            <div className='col-4'><ProgressBar title='Step 2: Generating' content='The time where we work the magic' is_activated=''/></div>
            <div className='col-4'><ProgressBar title='Step 3: Success' content='Get your own 3D avatar' is_activated=''/></div>
          </div>
      </div>
    </div>
  );
}

export default UploadPage;
