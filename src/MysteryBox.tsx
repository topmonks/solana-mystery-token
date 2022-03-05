import React, { useEffect, useState } from "react";
import styled from "styled-components";

const MysteryBoxContainer = styled.div`
  .m-auto {
    margin: auto !important;
  }

  .h-screen {
    height: 60vh;
  }

  .w-screen {
    width: 60vh;
  }

  .h-40 {
    height: 90%;
  }

  .w-40 {
    width: 90%;
  }

  .absolute {
    position: absolute !important;
  }
  .flex {
    display: flex !important;
  }

  .justify-center {
    justify-content: center !important;
  }

  .items-center {
    align-items: center !important;
  }

  .relative {
    position: relative !important;
  }

  .hexagon {
    z-index: -2;
    position: relative;
    width: 55vh;
    height: 55vh;
    background-color: var(--glow);
    margin: 29.19px 0;
    -webkit-filter: blur(20px);
    filter: blur(64px);
    border-radius: 50%;
  }
  .hexagon:before,
  .hexagon:after {
    content: "";
    position: absolute;
    width: 0;
    border-left: 80px solid transparent;
    border-right: 80px solid transparent;
  }
  .hexagon:before {
    bottom: 100%;
    border-bottom: 46.19px solid var(--glow);
  }
  .hexagon:after {
    top: 100%;
    width: 0;
    border-top: 46.19px solid var(--glow);
  }
  .back {
    background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxBackground_2x_b2espr.png");
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
  .top {
    background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxTopFlap_2x_f9cb8g.png");
    background-size: cover;
    background-position: center;
    z-index: 1;
  }
  .left {
    background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxLeftFlap_2x_y8u4gz.png");
    background-size: cover;
    background-position: center;
    z-index: 1;
  }
  .right {
    background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxRightFlap_2x_abexhh.png");
    background-size: cover;
    background-position: center;
    z-index: 1;
  }
  #cube {
    animation: hover 1.5s ease-in-out infinite alternate;
    transition: transform 300ms;
    animation-play-state: running;
  }
  @keyframes hover {
    from {
      transform: translateY(-0.5rem);
    }
    to {
      transform: translateY(0.5rem);
    }
  }
  .powerup {
    //background-image: url("");
    background-size: cover;
    border-radius: 50%;
    z-index: 100;
    overflow: hidden;
    height: 48px;
    width: 48px;
    z-index: -5;
  }

  .start {
    opacity: 0.5 !important;
  }

  #cube {
    transition: all 750ms;
    .top {
      transition: all 750ms;
    }
    .left {
      transition: all 750ms;
    }
    .right {
      transition: all 750ms;
    }
    .powerup {
      transition: all 750ms;
    }
    .hexagon {
      transition: all 750ms;
    }
    .back {
      transition: all 750ms;
    }

    .closed {
      animation-play-state: paused;

      .top {
        transform: translateY(-3rem);
        opacity: 0.1;
      }
      .left {
        transform: translateY(-3rem);
        opacity: 0.1;
      }
      .right {
        transform: translateY(-3rem);
        opacity: 0.1;
      }
      .powerup {
        opacity: 1;
        z-index: 10;
        height: 80px;
        width: 80px;
      }
      .hexagon {
        opacity: 0.1;
      }
      .back {
        opacity: 0.1;
      }
    }

    .opened {
      animation-play-state: paused;

      .top {
        transform: translateY(-3rem);
        opacity: 0.1;
      }
      .left {
        transform: translateY(-3rem);
        opacity: 0.1;
      }
      .right {
        transform: translateY(-3rem);
        opacity: 0.1;
      }
      .powerup {
        opacity: 1;
        z-index: 10;
        height: 80px;
        width: 80px;
      }
      .hexagon {
        opacity: 0.1;
      }
      .back {
        opacity: 0.1;
      }
    }
  }
`;

const mysteryTokens = ["bnb.png", "btc.png", "eth.png", "hoge.png", "sol.png"];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export interface MysteryBoxProps {
  boxState: string | null;
  setOpenCube: Function;
}

function MysteryBox(props: MysteryBoxProps) {
  const [cubeState, setCubeState] = useState(
    props.boxState === null ? "start" : props.boxState
  );
  const [topStyle, setTopStyle] = useState({});
  const [backStyle, setBackStyle] = useState({});
  const [rightStyle, setRightStyle] = useState({});
  const [leftStyle, setLeftStyle] = useState({});
  const [powerupStyle, setPowerupStyle] = useState({});
  const [powerupImage, setPowerupImage] = useState("");
  const [glowStyle, setGlowStyle] = useState({});
  const [cubeStyle, setCubeStyle] = useState({});

  let c = 0;
  console.log(cubeState);

  useEffect(
    () => setCubeState(props.boxState === null ? "start" : props.boxState),
    [props.boxState]
  );

  useEffect(() => {
    props.setOpenCube(openCube);
  }, [props.setOpenCube]);

  function openCube() {
    if (cubeState !== "opened") {
      award();
      setTopStyle({
        transform: "translateY(-3rem)",
        opacity: 0.1,
      });
      setLeftStyle({ transform: "translateX(-3rem)", opacity: 0.1 });
      setRightStyle({ transform: "translateX(3rem)", opacity: 0.1 });
      setBackStyle({ opacity: 0.1 });
      setGlowStyle({ opacity: 0.5 });
      setPowerupStyle({
        opacity: 1,
        zIndex: 10,
        height: "300px",
        width: "300px",
      });
      setCubeState("opened");
      setCubeStyle({ animationPlayState: "paused" });
    } else {
      // ctop.style.transform = "translateY(0)";
      // cleft.style.transform = "translateX(0)";
      // cright.style.transform = "translateX(0)";
      // cube.style.opacity = 1;
      // this.isOpen = false;
      // ctop.style.opacity = 1;
      // cleft.style.opacity = 1;
      // cright.style.opacity = 1;
      // cback.style.opacity = 1;
      // glow.style.opacity = 1;
      // powerup.style.opacity = 0;
      // powerup.style.zIndex = 0;
      // cube.style.animationPlayState = "running";
      // powerup.style.height = "48px";
      // powerup.style.width = "48px";
      // changeVar("rgba(255,195,26,0.4)");
    }
  }

  function changeVar(glow: string) {
    document.documentElement.style.setProperty("--glow", glow);
  }
  function award() {
    const randomTokenIndex = getRandomInt(mysteryTokens.length - 1);
    setPowerupImage(mysteryTokens[randomTokenIndex]);
    changeVar("rgba(69,185,251,0.33)");
  }

  return (
    <MysteryBoxContainer>
      <div
        onClick={() => openCube()}
        className={`m-auto bg-black h-screen w-screen flex justify-center items-center ${cubeState}`}
      >
        <div
          id="cube"
          className={`h-40 w-40 relative flex justify-center items-center cursor-pointer ${cubeState}`}
          style={cubeStyle}
        >
          <div className="hexagon absolute" style={glowStyle} />
          <div
            style={backStyle}
            className="cube back h-40 w-40 absolute top-0 left-0"
          />
          <div
            style={topStyle}
            className="cube d top h-40 w-40 absolute top-0 left-0"
          />
          <div
            style={leftStyle}
            className="cube left h-40 w-40 absolute top-0 left-0"
          />
          <div
            style={rightStyle}
            className="cube right h-40 w-40 absolute top-0 left-0"
          />
          <img
            className="powerup absolute"
            src={powerupImage}
            style={powerupStyle}
          />
        </div>
      </div>
    </MysteryBoxContainer>
  );
}

export default MysteryBox;
