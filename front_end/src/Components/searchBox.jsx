import { useState } from "react";

const SearchBox = ({ addAnimes, clearAnimePage }) => {
    const [text, setText] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        clearAnimePage();
        fetch('http://127.0.0.1:5000/getAnime/' + text.replace(' ', '-'))
            .then(resp => resp.json())
            .then( links_and_names => {
                console.log(links_and_names);
                addAnimes(links_and_names);
            })
            .catch((error) => {
                console.error("Error: " , error)
            });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Enter Name" value={text} onChange={(e) => { 
                    setText(e.target.value);
                }}/>
            </form>
        </div>
    );
}

export default SearchBox;
