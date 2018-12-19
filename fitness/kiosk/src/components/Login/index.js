import React from "react";

const Login = props => (
  <div tabindex="-1" style={{ position: "relative", zIndex: 1050 }}>
    <div className="">
      <div
        className="modal fade show"
        style={{ display: "block" }}
        role="dialog"
        tabindex="-1"
      >
        <div className="modal-dialog loginPopup" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Welcome back!</h5>
              <button type="button" className="close" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="text-center modal-body">
              <form className="loginPopup-form">
                <fieldset className="fieldset">
                  <div className="field">
                    <input type="email" required value="" placeholder="Email" />
                  </div>
                  <div className="field">
                    <input
                      type="password"
                      required
                      value=""
                      placeholder="Password"
                    />
                  </div>
                </fieldset>

                <div className="loginPopup-form-links">
                  <a href="/">forgot password?</a>
                </div>

                <fieldset className="loginPopup-form-actions">
                  <button type="submit" className="btn btn-primary btn-sm">
                    Log In
                  </button>
                  <a href="/" className="btn btn-secondary btn-sm">
                    Create Account
                  </a>
                </fieldset>
              </form>
            </div>
            <div className="modal-footer" />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </div>
  </div>
);

export default Login;
