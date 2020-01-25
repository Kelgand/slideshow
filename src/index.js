import React from "react";
import ReactDOM from "react-dom";
import Slideshow from "./slideshow.jsx";
import "./styles.less";


var mountNode = document.getElementById("slideshow");
ReactDOM.render(<Slideshow />, mountNode);