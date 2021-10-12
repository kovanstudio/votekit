import "../css/modules/login.scss";
import Modal from "../../components/modal";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon } from "../../components/icon";
import { schema, setLoginHandler } from "../gql/client";
import { useProject } from "../state";

export function LoginHandler() {
  const [show, setShow] = useState(false);

  const promise = useRef<any>(null);
  const resolver = useRef<any>(null);

  const handleClose = () => {
    resolver.current?.();
    setShow(false);
  };

  useEffect(() => {
    setLoginHandler(() => {
      if (promise.current) {
        return promise.current;
      }

      promise.current = new Promise((res) => {
        setShow(true);

        resolver.current = (arg) => {
          resolver.current = null;
          promise.current = null;

          res(arg);
        };
      });

      return promise.current;
    });

    return () => setLoginHandler(null);
  }, []);

  if (!show) return null;

  return <LoginModal onClose={handleClose} />;
}

export function LoginModal({ onClose }) {
  const [mode, setMode] = useState("info");

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
                    <CheckIcon /> Vote, comment, and give feedback
                  </li>
                  <li>
                    <CheckIcon /> Keep your data after closing the browser
                  </li>
                  <li>
                    <CheckIcon /> Get notified when someone responds
                  </li>
                </ul>

                <aside className="options">
                  <div className="option" onClick={() => setMode("email")}>
                    <MailIcon /> Continue with Email
                  </div>
                </aside>

                <p>By continuing, you are indicating that you agree to the Nolt Terms of Service and Privacy Policy.</p>
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
              <MailLogin setMode={setMode} onClose={onClose} />
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
      {beginLoading || completeLoading ? <div className="spinner-overlay" /> : null}

      <div className="panel-header">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMode("info");
          }}
        >
          <ChevronLeftIcon />
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
            } catch (e) {}
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
                  />
                  <input type="submit" value="Submit" className="m-l-10" />
                </div>
                {beginError ? <p className="m-t-15 m-b-0 alert alert-error">{beginError.message}</p> : null}
              </>
            ) : (
              <>
                <p className="m-0">
                  Please enter the <strong>code</strong> we sent to your email <strong>{email}</strong>
                </p>

                <div className="flex m-t-15">
                  <input ref={codeRef} value={code} onChange={(e) => setCode(e.target.value)} className="input-control flex-grow" type="text" />
                  <input type="submit" value="Submit" className="m-l-10" />
                </div>

                {completeError ? <p className="m-t-15 m-b-0 alert alert-error">{completeError.message}</p> : null}
              </>
            )}
          </div>
        </form>
        <p className="m-t-30">By continuing, you are indicating that you agree to the Nolt Terms of Service and Privacy Policy.</p>
      </div>
    </>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#31AF91" d="M8 16A8 8 0 108 0a8 8 0 000 16z" />
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
