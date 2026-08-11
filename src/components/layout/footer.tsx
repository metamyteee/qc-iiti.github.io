import React from "react";

const Footer: React.FC = () => {
  return (
    <div id="Footer">
      <div className="footerSection">
        <h4>© 2025 Quantum Computing Club, IIT Indore</h4>
        <p>Made with ❤️ by the QC IITI Web Dev Team.</p>
        <p>&nbsp;</p>
        <p>
          See a bug? Raise an{" "}
          <a
            href="https://github.com/qc-iiti/qc-iiti.github.io/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Issue
          </a>
          !
        </p>
      </div>
      <div className="footerSection">
        <h4>Contact Us</h4>
        <p>
          <a href="mailto:quantum@iiti.ac.in">quantum@iiti.ac.in</a>
        </p>
        <h4>Follow Us</h4>
        <p>
          <a href="https://github.com/qc-iiti" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
        <p>
          <a
            href="https://linkedin.com/company/quantumcomputingclub"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
        <p>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </p>
      </div>
      <div className="footerSection">
        <h5>President</h5>
        <p>Arham Aneeq</p>
        <p>
          <a href="tel:+919136607511">+91 91366 07511</a> /{" "}
          <a href="mailto:mems240005009@iiti.ac.in">mems240005009@iiti.ac.in</a>
        </p>

        <h5>Vice-Presidents</h5>
        <p>
          Aarush Bindod (<a href="tel:+919422747359">+91 94227 47359</a> /{" "}
          <a href="mailto:ep240051001@iiti.ac.in">ep240051001@iiti.ac.in</a>)
        </p>
        <p>
          V Hemal (<a href="mailto:ep240051020@iiti.ac.in">ep240051020@iiti.ac.in</a>)
        </p>
      </div>
    </div>
  );
};

export default Footer;
