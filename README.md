# Home Assignment

## How To Run
- Clone the repository or download the zip folder and unzip it.
- run command `yarn add` or `npm install` in the project folder to install dependencies.
- run command `yarn start` or `npm start` to run the project.

## How to Use
- Enter the username to search in the input field and click on the `Search` button.
   - While the response from fetch request is still pending, the `Search` button and input fields are set to disable.
- When the result is fetched, the user can view the gists links with filetype tags and avatars of people who forked the gist (latest 3 forks).
  - **Note:** If a filetype is none, then none is displayed in tag. And it displays all filetypes of files in tags instead of unique one.
- When a gist link is clicked, its files data is displayed below the link.
- If no gist found with the entered username, message is displayed.
**Note:** If the api limit exceeded, message is displayed.
