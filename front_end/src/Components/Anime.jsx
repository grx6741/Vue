import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const Anime = ({ name, link, animeData, setAnimeData }) => {
    const nav = useNavigate();
    const username = localStorage.getItem("name");

    if ( username === null) {
        nav('/signin');
    }

    const getAnimeInfo = async (name, link) => {
        const resp = await fetch('http://localhost:5000/getAnimeInfo/' + link)
        if (resp.ok) {
            const anime_info = await resp.json();
            return ({
                name : name,
                link : link,
                image_url : anime_info.image_url,
                info : anime_info.synopsis,
                latest_ep : anime_info.latest_ep
            });
        }
    }

    useEffect(() => {
        if (animeData.name === '') {
            getAnimeInfo(name, link)
                .then(info => { 
                    setAnimeData({...info, selected_ep: 1});
                });
        }
    }, [animeData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/getAnimeVideoURL/${animeData.link}/${animeData.selected_ep}`)
            .then(resp => resp.json())
            .then(data => {
                console.log(data.link);
                localStorage.setItem("anime_url", animeData.link)
                localStorage.setItem("video_url", data.link);
                localStorage.setItem("latest_ep", animeData.latest_ep);
                localStorage.setItem("anime_name", animeData.name);
                localStorage.setItem("ep_num", animeData.selected_ep);
                nav("/video");
            })
    }

    return (
        <>
            <div>
                <div>
                    <h1>{animeData.name}</h1>
                    <img alt={animeData.name} src={animeData.image_url}/>
                    <p>{animeData.info}</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="list">Choose Episode : </label>
                        <select onChange={(e) => {
                            setAnimeData({...animeData, selected_ep: Number(e.target.value)});
                        }}>
                            { [...Array(animeData.latest_ep)].map((x, i) => <option key={i}> {i + 1}</option>) }
                        </select>
                        <input type="submit" value="Watch"/>
                    </form>
                </div>
            </div> 
        </>
    );
}

export default Anime;
