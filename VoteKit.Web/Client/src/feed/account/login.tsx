import "../css/modules/login.scss";
import Modal from "../../components/modal";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon } from "../../components/icon";
import { formatError, schema } from "../gql/client";
import { useProject } from "../state";
import { ProjectAuthMethod } from "../../gql/feed/schema";

export default function LoginModal({ onClose }) {
  const project = useProject();
  const [mode, setMode] = useState("info");

  useEffect(() => {
    (document.activeElement as HTMLElement)?.blur()
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className="modal modal-login panel" style={{ width: "400px" }}>
        <AnimatePresence>
          {mode == "info" ? (
            <motion.div
              className="login-info"
              initial={{ height: "auto", opacity: 1, zIndex: 1 }}
              animate={{ height: "auto", opacity: 1, zIndex: 1 }}
              exit={{ height: "0", opacity: 0, zIndex: 0 }}
              key={"info"}
            >
              <div className="panel-body">
                <header>Claim your account</header>
                <p>You need to login to vote or make a suggestion.</p>

                <ul className="bullets">
                  <li>
                    <CheckIcon/> Vote, comment, and give feedback
                  </li>
                  <li>
                    <CheckIcon/> Keep your data after closing the browser
                  </li>
                  <li>
                    <CheckIcon/> Get notified when someone responds
                  </li>
                </ul>

                <aside className="options">
                  <div className="option" onClick={() => setMode(project.authMethod == ProjectAuthMethod.Mail ? "email" : "password")}>
                    <MailIcon/> Continue with Email
                  </div>
                </aside>

                <p>By continuing, you are indicating that you agree to the Terms of Service and Privacy Policy.</p>
              </div>
            </motion.div>
          ) : null}

          {mode == "email" ? (
            <motion.div
              className="login-email"
              initial={{ height: "0", opacity: 0 }}
              animate={{ height: "auto", opacity: 1, zIndex: 1 }}
              exit={{ height: "0", opacity: 0, zIndex: 0 }}
              key={"email"}
            >
              <MailLogin setMode={setMode} onClose={onClose}/>
            </motion.div>
          ) : null}

          {mode == "password" ? (
            <motion.div
              className="login-password"
              initial={{ height: "0", opacity: 0 }}
              animate={{ height: "auto", opacity: 1, zIndex: 1 }}
              exit={{ height: "0", opacity: 0, zIndex: 0 }}
              key={"password"}
            >
              <PasswordLogin setMode={setMode} onClose={onClose}/>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Modal>
  );
}

function MailLogin({ setMode, onClose }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const emailRef = useRef<HTMLInputElement>();
  const codeRef = useRef<HTMLInputElement>();

  const project = useProject();

  useEffect(() => {
    if (emailRef.current && !codeRef.current) {
      emailRef.current.focus();
    } else if (codeRef.current) {
      codeRef.current.focus();
    }
  }, [emailRef.current, codeRef.current]);

  const [userBeginLogin, { error: beginError, data: beginData, loading: beginLoading }] = schema.useBeginPasswordlessLoginMutation();

  const [userCompleteLogin, { error: completeError, loading: completeLoading }] = schema.useCompletePasswordlessLoginMutation({
    refetchQueries: ["me"],
    awaitRefetchQueries: true,
  });

  const enteringCode = !!beginData?.beginPasswordlessLogin;

  return (
    <>
      {beginLoading || completeLoading ? <div className="spinner-overlay"/> : null}

      <div className="panel-header">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMode("info");
          }}
        >
          <ChevronLeftIcon/>
        </a>
        <span className={"m-r-auto m-l-auto"}>Sign In With Email</span>
      </div>
      <div className="panel-body">
        <form
          className="w-100"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              if (!enteringCode) {
                await userBeginLogin({
                  variables: {
                    input: { email },
                  },
                });
              } else {
                await userCompleteLogin({
                  variables: {
                    input: {
                      token: beginData.beginPasswordlessLogin,
                      code,
                    },
                  },
                });

                onClose();
              }
            } catch (e) {
            }
          }}
        >
          <div className="flex flex-col m-gap-t-def">
            {!enteringCode ? (
              <>
                <label htmlFor="login-email">Email Address</label>
                <div className="flex">
                  <input
                    ref={emailRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="login-email"
                    className="input-control flex-grow"
                    type="text"
                    placeholder="me@example.com"
                  />
                  <input type="submit" value="Submit" className="m-l-10"/>
                </div>
                {beginError ? <p className="m-t-15 m-b-0 alert alert-error">{beginError.message}</p> : null}
              </>
            ) : (
              <>
                <p className="m-0">
                  Please enter the <strong>code</strong> we sent to your email <strong>{email}</strong>
                </p>

                <div className="flex m-t-15">
                  <input ref={codeRef} value={code} onChange={(e) => setCode(e.target.value)} className="input-control flex-grow" type="text"/>
                  <input type="submit" value="Submit" className="m-l-10"/>
                </div>

                {completeError ? <p className="m-t-15 m-b-0 alert alert-error">{completeError.message}</p> : null}
              </>
            )}
          </div>
        </form>
        <p className="m-t-30">By continuing, you are indicating that you agree to the Terms of Service and Privacy Policy.</p>
      </div>
    </>
  );
}

function PasswordLogin({ setMode, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, registerRes] = schema.useRegisterMutation({
    refetchQueries: ["me"]
  });

  return <>
    {registerRes.loading ? <div className="spinner-overlay"/> : null}

    <div className="panel-header">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setMode("info");
        }}
      >
        <ChevronLeftIcon/>
      </a>
      <span className={"m-r-auto m-l-auto"}>Sign In With Password</span>
    </div>

    <div className="panel-body">
      <form className="w-100" onSubmit={async (e) => {
        e.preventDefault();

        try {
          await register({
            variables: {
              input: {
                email,
                password
              }
            }
          });

          onClose();
        } catch (e) {
        }
      }}>
        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="login-email">Email Address</label>
          <div className="flex">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="login-email"
              className="input-control flex-grow"
              type="text"
              placeholder="me@example.com"
            />
          </div>
        </div>
        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="login-password">Password</label>
          <div className="flex">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="login-password"
              className="input-control flex-grow"
              type="password"
            />
          </div>
        </div>
        {registerRes.error ? <aside className="m-gap-t-def m-b-0 alert alert-error">{formatError(registerRes.error)}</aside> : null}
        <div className="flex flex-col m-gap-t-def">
          <input type="submit" value="Submit"/>
        </div>
      </form>
    </div>
  </>
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#31AF91" d="M8 16A8 8 0 108 0a8 8 0 000 16z"/>
      <path
        fill="#fff"
        d="M6.787 12.15L3.1 8.462a.12.12 0 010-.174l1.062-1.063a.12.12 0 01.175 0l2.538 2.538 4.775-4.776a.12.12 0 01.175 0l1.063 1.063a.12.12 0 010 .175L6.963 12.15a.12.12 0 01-.175 0z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
      <path
        fill="#7E7E7E"
        d="M13.612 0H2.387A2.394 2.394 0 00-.001 2.394v6.904a2.394 2.394 0 002.388 2.394h11.225A2.393 2.393 0 0016 9.298V2.394A2.394 2.394 0 0013.612 0zm0 1.23h.099L8 5.39 2.289 1.23h11.323zM14.769 9.3a1.163 1.163 0 01-1.157 1.163H2.387A1.163 1.163 0 011.23 9.299V2.394c.001-.124.022-.246.062-.363l6.35 4.621a.615.615 0 00.727 0l6.344-4.621c.04.117.06.24.062.363l-.006 6.905z"
      />
    </svg>
  );
}
