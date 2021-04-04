import {useState} from 'react';
import './App.css';

function App() {

  let [username, setUsername] = useState("");
  let [userData, setUserData] = useState([]); //Gists details for the username entered (fetched from api)
  let [fileContent, setFileContent] = useState({}); //Content of the files of the gist clicked (fetched from api)
  let [disableSearch, setDisableSearch] = useState(false); //To disable search field and button while waiting for response from api

  //Change function attached to input field
  let onChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  /**This function is called when used clicks the search button.
  *It gets the response from api and send data to getAvatars method.
  */
  let getGists =  (e) => {
    setDisableSearch(true);
    fetch(`https://api.github.com/users/${username}/gists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data)=> {
        if (Array.isArray(data)) getAvatars(data)
        else {
          setUserData([data])
          setDisableSearch(false)
        }
      });
  
  }

  /**This function get avators of latest 3 forks of a gist and concatenate it with the gists data.
  */
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
            if (data1.length > 3) gist.forks = data1.slice(-3);
            else gist.forks = data1;
          }
          else gist.forks = [] 
          dataWithForks.push(gist); 
          if(dataWithForks.length===data.length){
            console.log(dataWithForks)
            setUserData(dataWithForks);
          }
        })
    });
    } 
    else {
      setUserData([{message:'No gist found with that username'}]) //If no gist found with that username
    }
    setDisableSearch(false);
  }

  /**This method is to get file contents for a specific gist using its url.
  */
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
          let dcontents = Object.getOwnPropertyNames(data.files); //getting files names
          //concatenating all files content
          dcontents.forEach(c => {
            allcontents += '\n---' + c
            allcontents += '\n' + data.files[c].content + '\n';
          })
          const dataObject = {url: url, contents: allcontents};
          setFileContent(dataObject);
        }
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
        disabled={disableSearch}
        onChange={onChangeUsername}/>
        <button disabled={disableSearch} 
        className="search-button" 
        onClick={getGists}>
          Search
        </button>
      </header>
      <div className="result-display">
      {
        userData.length > 0 ? 
        (<>
          <strong>Search results for username: {username}</strong>
          <br/><br/>
            {!userData[0].message ?
              userData.map((user) => (
                <>
                  <div className="gist">
                    <span className="gist-link" onClick={()=>{displayContent(user.url)}}>{user.url}</span>
                    <span className="lang-tags">
                    {
                      Object.getOwnPropertyNames(user.files).map((file) => (
                        user.files[file].language ? <span className="tags-badge">{user.files[file].language}</span>: ''
                      ))
                    }
                    </span>
                    <span className="avatar-wrap">
                    {
                      user.forks.map((fork => (
                        <img src={fork.owner.avatar_url} alt={fork.owner.login} title={fork.owner.login} class="avatar"/>
                      )))
                    }
                    </span>
                  </div>
                  <br/>
                    {fileContent && fileContent.url === user.url ? <span className="file-content">{fileContent.contents}<br/></span> : ''}
                  <br/>
                </>
              )) 
            : 
              <p>{userData[0].message}</p>
            }
        </>)
      :
        '' 
      } 
      </div>
    </div>
  );
}

export default App;
