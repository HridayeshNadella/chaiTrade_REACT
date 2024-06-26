import React, { useState, useEffect } from 'react';
import BlogList from './BlogList';
import image from '../../images/charts.jpg'
import axios from "../../api/axiosConfig.js"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/Footer.jsx';

const MyBlog_appContainerStyle = {
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'sans-serif',
  zIndex: 1,
};

const MyBlog_backgroundPicStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  objectFit: 'cover',
};

const MyBlog_containerStyle = {
  maxWidth: '700px',
  width: '100%',
  padding: '1rem',
  margin: '0 auto',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'sans-serif',
  zIndex: 1,
};

const MyBlog_uploadStyle = {
  borderRadius: '12px',
  background: '#f9f9f9',
  padding: '25px',
  margin: '2rem 0',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.24)',
};

const MyBlog_inputTextStyle = {
  borderRadius: '8px',
  width: '95%',
  fontSize: '0.9rem',
  border: '1px solid #ccc',
  background: '#fff',
  padding: '12px',
  margin : "15px 0px"
};

const MyBlog_textareaStyle = {
  height: '120px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  border: '1px solid #ccc',
  padding: '12px',
  width: '590px',
  resize: 'none',
};

const MyBlog_submitButtonStyle = {
  cursor: 'pointer',
  width: '100%',
  border: 'none',
  background: '#4caf50',
  color: '#fff',
  margin: '0.5rem 0 0 0',
  padding: '10px',
  fontSize: '1rem',
  borderRadius: '8px',
  transition: 'background-color 0.3s ease-in-out',
};

const MyBlog_focusStyle = {
  outline: '0',
  border: '2px solid #72ac99',
};

export default function BlogPage() {
  const navigate = useNavigate();
  const reduxUserData = useSelector((state) => state.userData)
  const [userData, setUserData] = useState(reduxUserData.currentUser)

  useEffect(() => {
    if(reduxUserData.isUserloggedIn === false)
      navigate('/login')
    else
      setUserData(reduxUserData.currentUser);
  }, []);

  const [formData, setFormData] = useState({
    authorName: userData.userName,
    title: '',
    content: '',
    authorAvatar: userData.profileImage
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("🔐 Field can't be empty", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    else {
      try {
        const postedResult = axios.post('/blog/postBlog', formData)
        toast.success('📜 Blog Posted!!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFormData({
          authorName: userData.userName,
          title: '',
          content: '',
          authorAvatar: userData.profileImage
        })
      }
      catch (err) {
        toast.error("🔐 Error in posting the blog", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }

  return (
    <>
      <div style={MyBlog_appContainerStyle}>
        <img src={image} style={MyBlog_backgroundPicStyle} alt="background" />
        <div style={MyBlog_containerStyle}>
          <form id="comment_upload" onSubmit={handleSubmit} style={MyBlog_uploadStyle}>
            <div className="icons">
              <h3>Post Something</h3>
            </div>

            <input
              name="title"
              id="MyBlog_title"
              placeholder="Title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              style={MyBlog_inputTextStyle}
            />

            <textarea
              name="content"
              id="content"
              placeholder="Type your message here...."
              value={formData.content}
              onChange={handleInputChange}
              style={MyBlog_textareaStyle}
            />

            <button
              name="submit"
              type="submit"
              id="contact-submit"
              style={{ ...MyBlog_submitButtonStyle, ...MyBlog_focusStyle }}>Submit</button>

          </form>
        </div>
        <BlogList />
      </div>

      <Footer/>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </>
  );

};