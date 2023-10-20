import { useState } from "react";
import "./styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import WebcamCapture from "../Components/Webcam";

const SignUp = () => {
    const nav = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [imgSrc, setImgSrc] = useState(null);
    const [msg, setMsg] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(imgSrc);
        fetch(`http://localhost:5000/signup/`, {
            method: 'POST',
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'

            },
            body: JSON.stringify({
                name: name,
                email: email,
                pass : pass,
                img : imgSrc
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem("name", name)
                    localStorage.setItem("email", email)
                    localStorage.setItem("pass", pass)
                    nav('/');
                } else {
                    setMsg(data.msg);
                }
            });
    };

    return (
        <>
            <div id="center-box">
                <div id="contents">
                    <div id="title">
                        <h1> SIGN UP </h1>
                    </div>

                    <div id="feilds">
                        <form onSubmit={handleSubmit}>
                            <div className="text-box">
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder={"username"}
                                />
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    placeholder={"email"}
                                />
                                <input
                                    onChange={(e) => setPass(e.target.value)}
                                    type="text"
                                    placeholder={"Password"}
                                />
                                <input type="submit" />
                            </div>
                            {msg && <p>msg</p>}
                            <WebcamCapture imgSrc={imgSrc} setImgSrc={setImgSrc} />
                        </form>

                        <Link to="/SignIn" id="linker">
                            SignIn
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
