import { useState, useRef } from "react";

import SearchBox from "../Components/searchBox";
import Card from "../Components/card";

import './styles/Home.css';
import Anime from "../Components/Anime";

const Home = () => {
    const [animes, setAnimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [link, setLink] = useState('');
    const [animeData, setAnimeData] = useState({name: '', link: '', image_url: "", info: "", latest_ep: 0, selected_ep: 1});

    const resetAnimeData = () => {
        setAnimeData({name: '', link: '', image_url: "", info: "", latest_ep: 0, selected_ep: 1});
        setName('');
        setLink('');
    }

    return (
        <div id="home-page">
            <div id="top-bar">
                <SearchBox 
                    addAnimes={setAnimes} 
                    setLoading={setLoading}
                    reset={resetAnimeData}
                />
            </div>
            {(name !== '' || animeData.name !== '') ?
                <Anime 
                    name={name} 
                    link={link}
                    animeData={animeData}
                    setAnimeData={setAnimeData}
                /> : <></>}
            <div id="card-container">
                { 
                    !loading ? 
                        (animes.map((val, i) =>
                            <Card 
                                key={Math.floor(Math.random() * 10000000)}
                                name={val.name}
                                setName={setName}
                                setLink={setLink}
                                handleClick = {() => {
                                    resetAnimeData();
                                    setName(val.name)
                                    setLink(val.link)
                                }}
                            />
                        ))
                        : <p>Loading ...</p> 
                }
            </div>
        </div>
    );
}

export default Home;
