import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./cleaning.css";
import upload from "../assets/upload.svg";
import frog from '../assets/frog-trash.svg';
import { useNavigate, useParams } from 'react-router-dom';
import trash from '../assets/dummy-trash.jpeg';
import axios from 'axios';
import { useLogoutFunction, useRedirectFunctions, withAuthInfo } from '@propelauth/react';




const Cleaning = withAuthInfo((props) => {
  const { id } = useParams();
   const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [post, setPostResult] = useState(null)


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    axios.get(`http://localhost:8080/trash-posts/${id}`, config)
    .then(response => {
      console.log("response from server", response.data);
      setPostResult(response.data);
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
    navigate('/leaderboard');

  };
  const config = {
    headers: {
      'Authorization': 'Bearer ' + props.accessToken
    }
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:5001/trash-posts/${id}`, config)
    .then(response => {
      console.log("response from server", response.data);
      setPostResult(response.data);
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
  }, []);

  return (
    <div>
      <div className="upload-container">
        <h1 className='thank-clean'>Thank you for cleaning!</h1>
        <div className='please-upload'>Be sure to upload an after photo to confirm the area is clear</div>
          <form onSubmit={handleSubmit} className='form-1'>
            <div className='right-header-1'>

               {post && <img className="prev-uploaded-pic" src={`http://localhost:8000/${post.image_before_url}`}></img>}
               <div>
                <h4>Before</h4>
               </div>
            </div>
              <div id="right-side-clean-1">
              {!selectedFile && (
                <div>
                    <label htmlFor="file-upload" className="custom-file-upload">
                      <img className="upload-pic" src={upload}></img>
                    </label>
                  
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
               )}

                
               
              <div>
              <h4>After</h4>
              </div>

               {selectedFile && (
                <div>
                    <img
                      className="chosen-pic"
                      src={URL.createObjectURL(selectedFile)}
                      alt="Selected"
                    />
                  </div>
               )}

               {selectedFile && post && <button className='leaderboard-button' type="submit" disabled={!selectedFile}>Get +{post.details.reward} Points</button>}
              </div>
            



          </form>
        </div>
   
    </div>
  );
});

export default Cleaning;
