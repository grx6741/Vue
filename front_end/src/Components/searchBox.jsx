import { useState } from "react";
import React from "react";

const SearchBox = ({ addAnimes , setLoading, reset }) => {
    const [text, setText] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        reset();
        setLoading(true);
        // clearAnimePage();
        fetch('http://127.0.0.1:5000/getAnime/' + text.replace(' ', '-'))
            .then(resp => resp.json())
            .then( links_and_names => {
                addAnimes(links_and_names);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error: " , error)
            });
    }

    return (
        <>
            <form onSubmit={handleSubmit} id="form">
                <input type="text" name="name" placeholder="Enter Name" value={text} onChange={(e) => { 
                    setText(e.target.value);
                }}/>
                <input type="submit" value="Enter"/>
            </form>
        </>
    );
}

export default SearchBox;
