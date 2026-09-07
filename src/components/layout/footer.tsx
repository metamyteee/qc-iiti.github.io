
import React from "react";

const footerLinkClass =
  "text-inherit no-underline inline-block border-b-2 border-blueLight px-[2px] font-title transition-[border-bottom] duration-500 hover:border-blueDark";

const Footer: React.FC = () => {
  return (
    <div
      id="Footer"
      className="relative z-10 flex flex-row flex-wrap justify-evenly bg-footerBg p-[min(2.5vw,20px)] text-footerFg"
    >
      <div className="m-[min(2.5vw,20px)] flex-grow rounded-[10pt] bg-[#1d1d1d] p-[5vh_5vw]">
        <h4 className="my-[1.33em] font-title text-base font-normal uppercase">
          © 2026 Quantum Computing Club, IIT Indore
        </h4>
        <p className="my-[1em]">Made with ❤️ by the QC IITI Web Dev Team.</p>
        <p className="my-[1em]">&nbsp;</p>
        <p className="my-[1em]">
          See a bug? Raise an{" "}
          <a
            href="https://github.com/qc-iiti/qc-iiti.github.io/issues"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            Issue
          </a>
          !
        </p>
      </div>

      <div className="m-[min(2.5vw,20px)] flex-grow rounded-[10pt] bg-[#1d1d1d] p-[5vh_5vw]">
        <h4 className="my-[1.33em] font-title text-base font-normal">
          Contact Us
        </h4>

        <p className="my-[1em]">
          <a href="mailto:quantum@iiti.ac.in" className={footerLinkClass}>
            quantum@iiti.ac.in
          </a>
        </p>

        <h4 className="my-[1.33em] font-title text-base font-normal">
          Follow Us
        </h4>

        <p className="my-[1em]">
          <a
            href="https://github.com/qc-iiti"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            GitHub
          </a>
        </p>

        <p className="my-[1em]">
          <a
            href="https://linkedin.com/company/quantumcomputingclub"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            LinkedIn
          </a>
        </p>

        <p className="my-[1em]">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            Instagram
          </a>
        </p>

        <p className="my-[1em]">
          <a
            href="https://medium.com/me/following-feed/publications/8215bca10bec"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            Medium
          </a>
        </p>
      </div>

      <div className="m-[min(2.5vw,20px)] flex-grow rounded-[10pt] bg-[#1d1d1d] p-[5vh_5vw]">
        <h5 className="my-[1.67em] text-[0.83em] font-bold">
          President
        </h5>
        <p className="my-[1em]">V Hemal</p>
        <p className="my-[1em]">
          <a href="tel:+918870547675" className={footerLinkClass}>
            +91 88705 47675
          </a>{" "}
          /{" "}
          <a
            href="mailto:ep240051020@iiti.ac.in"
            className={footerLinkClass}
          >
            ep240051020@iiti.ac.in
          </a>
        </p>

        <h5 className="my-[1.67em] text-[0.83em] font-bold">
          Software Domain Head
        </h5>
        <p className="my-[1em]">Aarush Bindod</p>
        <p className="my-[1em]">
          <a href="tel:+919422747359" className={footerLinkClass}>
            +91 94227 47359
          </a>{" "}
          /{" "}
          <a
            href="mailto:ep240051001@iiti.ac.in"
            className={footerLinkClass}
          >
            ep240051001@iiti.ac.in
          </a>
        </p>

        <h5 className="my-[1.67em] text-[0.83em] font-bold">
          Hardware &amp; Devices Head
        </h5>
        <p className="my-[1em]">Arham Aneeq</p>
        <p className="my-[1em]">
          <a href="tel:+919136607511" className={footerLinkClass}>
            +91 91366 07511
          </a>{" "}
          /{" "}
          <a
            href="mailto:mems240005009@iiti.ac.in"
            className={footerLinkClass}
          >
            mems240005009@iiti.ac.in
          </a>
        </p>

        <h5 className="my-[1.67em] text-[0.83em] font-bold">
          Algorithm Head
        </h5>
        <p className="my-[1em]">Abhiroop Gohar</p>
        <p className="my-[1em]">
          <a href="tel:+919140781550" className={footerLinkClass}>
            +91 91407 81550
          </a>{" "}
          /{" "}
          <a
            href="mailto:ep240051002@iiti.ac.in"
            className={footerLinkClass}
          >
            ep240051002@iiti.ac.in
          </a>
        </p>

        <h5 className="my-[1.67em] text-[0.83em] font-bold">
          Content Team Head
        </h5>
        <p className="my-[1em]">Samvaadi Dadhi</p>
        <p className="my-[1em]">
          <a href="tel:+917822009400" className={footerLinkClass}>
            +91 78220 09400
          </a>{" "}
          /{" "}
          <a
            href="mailto:ep240051019@iiti.ac.in"
            className={footerLinkClass}
          >
            ep240051019@iiti.ac.in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;

