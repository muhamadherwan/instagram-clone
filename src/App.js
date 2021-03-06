import React, { useEffect, useState } from 'react';
import './App.css';
import Posts from './Posts'; 
import ImageUpload from './ImageUpload';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed'; 
//import logo from './igherwan.png';

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
  const [openSignIn, setOpenSignIn] = useState(false);
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
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
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

    setOpen(false);
  }

  // signin process
  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
      
    setOpenSignIn(false);
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
     
     {/* sign in modal */}
     <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
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

          <Button type='submit' onClick={signIn}>Sign In</Button>
        </form>
      </div>
     </Modal>


      <div className='app__header'>
        <img 
        className='app__headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        //src={logo}
        alt="ig"
        />

        {/* auth button part */}
        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}

      </div>

      <div className='app__posts'>
        <div className='app__postsLeft'>
          {
            posts.map(( {id, post} ) => (
              <Posts key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        
        <div className='app__postsRight'>
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      
      {/* upload post */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ): (
        <h3>Sorry please login to upload</h3>  
      )}

    </div>
  );
}

export default App;
