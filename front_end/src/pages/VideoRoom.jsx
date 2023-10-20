import './styles/VideoRoom.css';
import React, {useEffect, useState} from 'react';
import videojs from 'video.js';
import { VideoJS } from '../Components/VideoPlayer';
import { Link, useNavigate } from 'react-router-dom';
import Comment from '../Components/Comments';

const VideoRoom = () => {
    const nav = useNavigate(); 
    const playerRef = React.useRef(null);

    const name = localStorage.getItem("name");
    const link = localStorage.getItem("anime_url");
    const anime_name = localStorage.getItem("anime_name");

    const [url, setUrl] = useState(localStorage.getItem("video_url"));
    const [epNum, setEpNum] = useState(localStorage.getItem("ep_num"));
    const latest_ep = localStorage.getItem("latest_ep");
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    if (!name) {
        nav('/signup');
    }

    const refreshComments = () => {
        fetch(`http://localhost:5000/getComments/${link}`)
            .then(resp => resp.json())
            .then(comms => {
                setComments(comms)
                console.log(comms)
            })
    }

    useEffect(() => {
        refreshComments();
        console.log(comments)
    }, [comments.length])

    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        width: "640",
        height: "480",
        fluid: true,
        sources: [{
            src: url,
            type: 'application/x-mpegURL'
        }]
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });

    };

    const onPause = () => {
        console.log("paused");
    }

    const onPlay = () => {
        console.log("playing");
    }

    return (
        <>
            <div id="top-bar">
                <Link to='/'>Home</Link>
                <h3>{anime_name} : {epNum}</h3>
            </div>
            <div>
                <div id="container">
                    <div id="episodes">
                        {
                            [...Array(Number(latest_ep))].map((x, i) =>
                                <div id="episode" key={i}>
                                    <button 
                                        id="episode-button"
                                        onClick={() => {
                                            fetch(`http://localhost:5000/getAnimeVideoURL/${link}/${i + 1}`)
                                                .then(resp => resp.json())
                                                .then(data => {setUrl(data.link)});
                                        }}
                                    ><b>{i + 1}</b></button>
                                </div>
                            )
                        }
                    </div>
                    <VideoJS 
                        options={videoJsOptions} 
                        onReady={handlePlayerReady}
                        onPlay={onPlay}
                        onPause={onPause}
                    />
                </div>
            </div>
            <div id="comments">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (comment !== '') {
                        fetch(`http://localhost:5000/addComment/${link}/${name}/${comment}`)
                            .then(resp => resp.json())
                            .then(() => {
                                setComment('');
                                refreshComments();
                            })
                    }
                }}>
                    <input
                        type="text" 
                        onChange={(e) => setComment(e.target.value)}
                    />
                </form>
                {comments && comments.map((comment, i) => 
                    <Comment 
                        username={comment.user_name} 
                        comment={comment.comment}
                    />
                )}
            </div>
        </>
    );
}

export default VideoRoom;
