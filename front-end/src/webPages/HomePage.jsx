import React from 'react';
import './HomePage.css';
import ProgressBar from '../components/ProgressBar';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  function handleClick() {
    navigate('/upload'); 
}

  return (
    <div className='wrapper'>
      <div className='header'></div>

      <div className='container Body text-center'>
        <div className='row'>
          <div className='col-12'>
            <h1 className='title'>Upload Images of a Person</h1>
          </div>
          <div className='col-12'>
            <button type="button" className="btn btn-success" onClick={handleClick}>Upload</button>
          </div>
          <div className='col-12'>
            <p className='explain'>Add 3 images of a person to customize the 3D Avatar</p>
          </div>
          <div className='col-12 img-list'>
            <p className='image-tips-text'>Image Tips:</p>
            <div className='row'>
              <div className='col-4'>
                <img className='image-demo' src='front_face_demo.jpg' />
                <p className='image-label'>Front Facing</p>
              </div>
              <div className='col-4'>
                <img className='image-demo' src='left_face_demo.jpg' />
                <p className='image-label'>Left Facing</p>
              </div>
              <div className='col-4'>
                <img className='image-demo' src='right_face_demo.jpg' />
                <p className='image-label'>Right Facing</p>
              </div>
            </div>
            <div>
            </div>
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

export default HomePage;
