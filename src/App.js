import React, { useEffect, useState } from 'react';
import './App.css';
import Posts from './Posts'; 
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';


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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has login...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logout...
        setUser(null);  
      }
    })

    return () => {
      // perform some clean up
      unsubscribe();
    }
  }, [user, username]);

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

  // signup process  
  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
  }

  return (
    <div className="App">
     
     <Modal
      open={open}
      onClose={() => setOpen(false)}
     >
      <div style={modalStyle} className={classes.paper}>
        <form className='app__signup'>
        <center>
          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        
        </center>  

          <Input
            placeholder='username'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder='email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> 

          <Input
            placeholder='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> 

          <Button type='submit' onClick={signUp}>Sign Up</Button>
        </form>
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
