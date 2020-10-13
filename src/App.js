import React, { useEffect, useState } from 'react';
import './App.css';
import Posts from './Posts'; 
import { db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';


// modal style
function getModalStyle(){
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const usesStyles = makeStyles((theme) => ({
  paper:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border:'2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
  },
}));

function App() {

  // modal style
  const classes = usesStyles(); 
  const [modalStyle] = useState(getModalStyle);

  // use hook to set state values
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // fetch posts from database
    db.collection('posts').onSnapshot(snapshot => {
      // every time new post is added, this code fires..
      setPosts(snapshot.docs.map(doc=>
        ({
          id: doc.id,
          post: doc.data()
        })));
    }) 
  }, []);


  return (
    <div className="App">
     
     <Modal
      open={open}
      onClose={() => setOpen(false)}
     >
      <div style={modalStyle} className={classes.paper}>
        <h2>Text in a modal</h2>
      </div>

     </Modal>
     
     
      <div className='app__header'>
        <img 
        className='app__headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="ig"
        /> <h4>from HERWAN</h4>
      </div>
      
      <Button onClick={() => setOpen(true)}>Sign Up</Button>

      {
        posts.map(( {id, post} ) => (
          <Posts key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }

    </div>
  );
}

export default App;
