import React, { useEffect, useState } from 'react';
import './App.css';
import Posts from './Posts'; 
import { db } from './firebase';


function App() {

  // use hook to set state values
  const [posts, setPosts] = useState([]);
  //   {
  //     username:'Muhamad Herwan',
  //     caption:'Focus on impact! ',
  //     imageUrl:'https://media1.tenor.com/images/c581b5c680dfa66b6e419bdf2182a6e0/tenor.gif?itemid=14169217'
  //   },
  //   {
  //     username:'Zaidi Ibrahim',
  //     caption:'Be bold.',
  //     imageUrl:'https://1.bp.blogspot.com/-HiwbcC7eOl4/W03MJvkMC-I/AAAAAAAAFcU/l3Bmyc9KE2IOoZqCKB8dh29ug5iXBrUugCLcBGAs/s1600/tenor.gif',
  //   }    
  // ]);

  useEffect(() => {
    // fetch posts from database
    db.collection('posts').onSnapshot(snapshot => {
      // every time new post is added, this code fires..
      setPosts(snapshot.docs.map(doc=>doc.data()))
    }) 
  }, []);

  return (
    <div className="App">
      
      <div className='app__header'>
        <img 
        className='app__headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="ig"
        />
      </div>
      
      {
        posts.map(post => (
          <Posts username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }

    </div>
  );
}

export default App;
