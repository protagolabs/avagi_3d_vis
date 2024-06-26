// src/pages/AboutPage.jsx
import React, { useState, useEffect }from 'react';
import './AwaitPage.css'
import ProgressBar from '../components/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



function AwaitPage() {
    const { loading, data, error } = useSelector(state => state.data);
    const navigate = useNavigate();


    useEffect(() => {
        if (!loading && data) {
          navigate('/preview')
        } else if (!loading && error) {
          alert('Failed to fetch data: ' + error);
          navigate('/upload');
        }
    }, [loading, data, error])

    return (
        <div className='wrapper'>
          <div className='header'></div>
          <div className='container Await-Body text-center'>
            <p className='title'>Waiting</p>
            <p className='explain'>Please wait for a while, we need some time to generate the 3D Avatar.</p>
            <img className='wait-bar' src='wait_bar.png' />
          </div>
          <div className='container footer-container'>
              <div className='row' id='footer'>
                <div className='col-4'><ProgressBar title='Step 1: Upload' content={`Try to upload clear images of your face. \nALL image formats are accepted`} is_activated='1'/></div>
                <div className='col-4'><ProgressBar title='Step 2: Generating' content='The time where we work the magic' is_activated='1'/></div>
                <div className='col-4'><ProgressBar title='Step 3: Success' content='Get your own 3D avatar' is_activated=''/></div>
              </div>
          </div>
        </div>
      );
}

export default AwaitPage;
