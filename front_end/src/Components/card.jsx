const Card = ({ name, image_url }) => {

    return (
        <div>
            <p><b>{name}</b></p>
            <img src={image_url} alt={name}/>
        </div>
    );
}

export default Card;
