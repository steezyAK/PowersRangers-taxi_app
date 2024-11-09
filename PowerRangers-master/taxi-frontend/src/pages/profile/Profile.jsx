import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

import "./Profile.css";

const Profile = () => {
  return (
    <div className="card">
      <div className="header">
        <div className="logo">
          <a href=".">Drop</a>
        </div>
        <div className="social">
          <a
            href="https://facebook.com"
            title="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <IconFacebook className="icon" /> */}
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            title="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <IconTwitter className="icon" /> */}
            <FaSquareXTwitter />
          </a>
          <a
            href="https://github.com/arkn98/coming-soon"
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <IconGithub className="icon" /> */}
            <FaGithub />
          </a>
        </div>
      </div>
      <div className="content">
        <div className="title-holder">
          <h1>Get ready for the change.</h1>
          <p>
            Website coming soon. Please check back to know more. Shoot us an
            email if you're curious.
          </p>
        </div>
        <a href="https://www.youtube.com/shorts/jw3jjN8kCyo">
          <div className="cta">Send us an email</div>
        </a>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default Profile;
