import React from "react";

const Card = ({ name , handleClick, setName, setLink }) => {
    return (
        <div className="cards" >
            <button className="cards-button" onClick={handleClick}>
                <b>{name}</b>
            </button>
        </div>
    );
}

export default Card;
