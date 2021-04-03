import {useState} from 'react';
import './App.css';

function App() {

  let [username, setUsername] = useState("");
  let [userData, setUserData] = useState([]);
  let [fileContent, setFileContent] = useState({});

  let onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  let getGists =  (e) => {
    fetch(`https://api.github.com/users/${username}/gists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data)=>getAvatars(data));
  
  }

  let getAvatars = (data) => {
    var dataWithForks = []
    if (data && data.length > 0) {
      data.forEach((gist) => {
      fetch(`https://api.github.com/gists/${gist.id}/forks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data1) => {
          if (data1.length > 0) {
            if (data1.length > 3) gist.forks = data1.slice(0,3);
            else gist.forks = data1;
          }
          else gist.forks = [] 
          dataWithForks.push(gist); 
          if(dataWithForks.length===data.length){
            console.log(dataWithForks)
            setUserData(dataWithForks);
          }
        });
    });
    } 
    else {
      setUserData([{no_user:'No user found with that name'}])
    }
  }

  let displayContent = (url) => {
    let allcontents = ''
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== null) {
          let dcontents = Object.getOwnPropertyNames(data.files);
          dcontents.forEach(c => {
            allcontents += c + '\n';
          })
        }
        const dataObject = {url: url, contents: allcontents};
        setFileContent(dataObject);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Search For Github Gist By Username</h3>
        <input 
        className="search"
        type="text" 
        placeholder="Enter username"
        onChange={onChangeUsername}/>
        <button className="search-button" onClick={getGists}>Search</button>
      </header>
      <div className="result-display">
      <strong>Search results for username: {username}</strong>
      <br/><br/>
      {
      userData.length > 1 ? 
      (!userData[0].no_user ?
        userData.map((user) => (
          <>
          <div className="gist">
          {/* onClick={()=>{displayContent(user.url)}} */}
            <span className="gist-link" >{user.url}</span>
            <span className="lang-tags">
            {
            Object.getOwnPropertyNames(user.files).map((file) => (
              user.files[file].language ? <span className="tags-badge">{user.files[file].language}</span>: ''
            ))
            }
            </span>
            <span className="avatar-wrap">
            {user.forks.map((fork => (
              <img src={fork.owner.avatar_url} alt={fork.owner.login} title={fork.owner.login} class="avatar"/>
            )))}
            </span>
          </div>
          <br/>
          {/* {fileContent && fileContent.url === user.url ? <span>{fileContent.contents}</span> : ''} */}
          <br/>
          </>
        )) 
      : 
      <p>{userData[0].no_user}</p>
      )
      :
       '' } 
      </div>
    </div>
  );
}

export default App;
