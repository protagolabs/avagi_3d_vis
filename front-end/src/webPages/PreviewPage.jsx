// src/pages/HomePage.jsx
import React, { useEffect, useRef } from 'react';
import './PreviewPage.css'
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import {init} from './main'
import { useSelector } from 'react-redux';

function PreviewPage() {

  const { frontImg, leftImg, rightImg, data } = useSelector(state => state.data);
  const generatedAvagi = data.jsonData.avatar_s3_link

  console.log(data)
  console.log(generatedAvagi)
  const avatarRef = useRef(null); 
  useEffect(() => {
    console.log(avatarRef.current);
    if (avatarRef.current) {
      if (generatedAvagi == null) {
        alert('failed to fetch generated 3D avagi')
      }
      init(generatedAvagi, avatarRef.current)
    } else {
      console.error('Avatar container is not available');
    }
  }, [generatedAvagi]);

  const inputImageList = [
    {id: 1, key: 'frontFacing', src: frontImg},
    {id: 2, key: 'leftFacing', src: leftImg},
    {id: 3, key: 'rightFacing', src: rightImg}
  ] 

  const navigate = useNavigate();
  const handleStartAgainClick = () => {
    navigate('/upload'); 
  };

  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = generatedAvagi; // Path to your generatedAvagi file, if it's a URL
    link.download = 'Avatar.glb'; // The default filename for downloading
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='wrapper'>
      <div className='header'></div>
      <div className='container Preview-Body text-center'>
        <p className='preview-title col-12'>Wohoo! Here you go</p>
        <div className='preview-content-wrapper'>
          <div className='avatar-preview-wrapper' ref={avatarRef} />
          <div className='input-image-display-wrapper'>
            {inputImageList.map(({id, key, src}) => (
              <div key={key} className='col-12'>
                <img className='image-demo' src={src} alt={`${key} avatar`} />
                <p className='image-label'>{key} Image</p>
              </div>
            ))}
          </div>
        </div>
        <div className='button-wrapper row'>
          <div className='col-6'><button type="button" className='btn' onClick={handleStartAgainClick}>Start Again</button></div>
          <div className='col-6'><button type="button" className='btn' onClick={handleDownloadClick}>Download</button></div>
      </div>
      </div>

      <div className='container footer-container'>
          <div className='row' id='footer'>
            <div className='col-4'><ProgressBar title='Step 1: Upload' content={`Try to upload clear images of your face. \nALL image formats are accepted`} is_activated='1'/></div>
            <div className='col-4'><ProgressBar title='Step 2: Generating' content='The time where we work the magic' is_activated='1'/></div>
            <div className='col-4'><ProgressBar title='Step 3: Success' content='Get your own 3D avatar' is_activated='1'/></div>
          </div>
      </div>
    </div>
  );
}

export default PreviewPage;