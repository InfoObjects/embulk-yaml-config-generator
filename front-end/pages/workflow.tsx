import type { NextPage } from "next";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";

const Workflow: NextPage = () => {
  const [activeWindow, setActiveWindow] = useState("code");
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "65px",
          left: "0px",
          width: "50%",
          bottom: "0px",
          overflow: "auto",
        }}
      >
        <div className="dig-btn-box">
          <a href="#" className="dig-btn">
            <p className="fs-2 mb-1">
              <i className="fa-solid fa-plus-circle"></i>
            </p>
            <p className="fs-6 mb-1">Add Step</p>
          </a>

          <a href="#" className="dig-btn">
            <p className="fs-2 mb-1">
              <i className="fa-solid fa-infinity"></i>
            </p>
            <p className="fs-6 mb-1">Add Loop</p>
          </a>
          <a href="#" className="dig-btn">
            <p className="fs-2 mb-1">
              <i className="fa-solid fa-project-diagram"></i>
            </p>
            <p className="fs-6 mb-1">
              Call Another
              <br />
              Workflow
            </p>
          </a>
          <a href="#" className="dig-btn">
            <p className="fs-2 mb-1">
              <i className="fa-solid fa-file-code"></i>
            </p>
            <p className="fs-6 mb-1">Call Embulk</p>
          </a>
          <a href="#" className="dig-btn">
            <p className="fs-2 mb-1">
              <i className="fa-solid fa-code"></i>
            </p>
            <p className="fs-6 mb-1">Print Workflow</p>
          </a>
          <a href="#" className="dig-btn">
            <p className="fs-2 mb-1">
              <i className="fa-solid fa-subscript"></i>
            </p>
            <p className="fs-6 mb-1">
              Self Environment
              <br />
              Variable
            </p>
          </a>
          <a href="#" className="dig-btn">
            <p className="fs-2">
              <i className="fa-solid fa-calendar-plus"></i>
            </p>
            <p className="fs-6">Add Schedule</p>
          </a>
          <a href="#" className="dig-btn">
            <p className="fs-2">
              <i className="fa-solid fa-futbol"></i>
            </p>
            <p className="fs-6">Handle Error</p>
          </a>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: "65px",
          right: "0px",
          width: "50%",
          bottom: "0px",
          overflow: "auto",
        }}
      >
        <div className="d-flex justify-content-end align-items-center pb-2 mb-1 border-bottom">
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group me-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fa-solid fa-edit"></i> Edit
              </button>
            </div>

            <div className="btn-group me-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fa-solid fa-save"></i> Download
              </button>
            </div>

            <div className="btn-group me-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fa-solid fa-check-to-slot"></i> Deploy
              </button>
            </div>
            <div className="btn-group me-2">
              <button
                type="button"
                onClick={() => setActiveWindow("code")}
                className={
                  "btn btn-sm btn-" +
                  (activeWindow === "code" ? "secondary" : "outline-secondary")
                }
              >
                <i className="fa-solid fa-edit"></i> Code
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow("workflow")}
                className={
                  "btn btn-sm btn-" +
                  (activeWindow === "workflow"
                    ? "secondary"
                    : "outline-secondary")
                }
              >
                <i className="fa-solid fa-edit"></i> Workflow
              </button>
            </div>
          </div>
        </div>

        {activeWindow === "code" && (
          <pre>
            <code>digdag code</code>
          </pre>
        )}
        {activeWindow === "workflow" && (
          <>
            <h4>flowchart</h4>
          </>
        )}
      </div>
    </>
  );
};

export default Workflow;
