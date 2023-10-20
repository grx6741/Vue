import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useState, useCallback, ReactDOM } from "react";

const WebcamCapture = ({ imgSrc, setImgSrc }) => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(true);

  const capture = useCallback(() => {
    if (capturing) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
    setCapturing((prev) => !prev);
  }, [webcamRef, capturing, setCapturing, setImgSrc]);

  return (
    <>
      <button type="button" onClick={capture}>{!capturing ? "Retake" : "Capture"}</button>
      {!capturing ? (
        <img alt="WebCamImage" src={imgSrc} />
      ) : (
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      )}
    </>
  );
};

export default WebcamCapture;
