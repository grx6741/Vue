import { useState } from "react";
import Card from './card.jsx';
import SearchBox from './searchBox.jsx';


const Catalogue = () => {
    const [animes, setAnimes] = useState([{}]);

    const [animeName, setAnimeName] = useState("");
    const [animeImageURL, setAnimeImageURL] = useState("");
    const [animeInfo, setAnimeInfo] = useState("");

    const getAnimeInfo = async (name, link) => {
        const resp = await fetch('http://127.0.0.1:5000/getAnimeInfo/' + link)
        if (resp.ok) {
            const anime_info = await resp.json();
            setAnimeName(name);
            setAnimeImageURL(anime_info.image_url);
            setAnimeInfo(anime_info.synopsis);
            console.log(anime_info);
        }
    }

    const clearAnimePage = () => {
        setAnimeName("");
        setAnimeImageURL("");
        setAnimeInfo("");
    }

    return (
        <>
            <SearchBox addAnimes={setAnimes} clearAnimePage={clearAnimePage}/>
            <div>
                <h1>{animeName}</h1>
                <img alt={animeName} src={animeImageURL}/>
                <p>{animeInfo}</p>
            </div>
            <ul>
                { 
                    animes.map((val, i) => {
                        return (
                            <>
                                <button key={i} onClick={() => {
                                    getAnimeInfo(val.name, val.link);
                                }}>
                                    {val.name}
                                </button>
                                <br />
                            </>
                        )
                    }) 
                }
            </ul>
        </>
    );
}

export default Catalogue;
