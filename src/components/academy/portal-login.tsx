import { ArrowRight } from "lucide-react";
import { useState, type CSSProperties, type FormEvent } from "react";
import academyLogo from "@/assets/portal/darltech-academy-logo.png";
import welcomeArtwork from "@/assets/portal/student-portal-panel.jpg";
import { Checkbox } from "@/components/ui/checkbox";
import { useFitScale } from "@/hooks/use-fit-scale";

/* Desktop student sign-in, built to the DarlTech "Student portal" design. */
export function PortalLogin({
  email,
  password,
  errors,
  onEmail,
  onPassword,
  onSubmit,
}: {
  email: string;
  password: string;
  errors: Record<string, string>;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  // The 1280x800 design shrinks to fit the window, so the page never scrolls,
  // and stretches to fill the whole window.
  const { scale, viewportWidth, viewportHeight } = useFitScale(1280, 800);

  return (
    <main className="academy-login">
      <section
        className="academy-login__layout"
        aria-label="Student portal sign in"
        style={
          {
            zoom: scale,
            width: Math.max(1280, viewportWidth),
            height: Math.max(800, viewportHeight),
            "--login-height": `${Math.max(800, viewportHeight)}px`,
          } as CSSProperties
        }
      >
        <div className="academy-login__artwork-panel">
          <img
            className="academy-login__artwork"
            src={welcomeArtwork}
            alt="Welcome to Student portal. Do extraordinary things."
          />
        </div>

        <div className="academy-login__form-panel">
          <div className="academy-login__content">
            <img className="academy-login__logo" src={academyLogo} alt="DarlTech Academy" />

            <h1 className="academy-login__title">Welcome Back!</h1>

            <form className="academy-login__form" onSubmit={onSubmit} noValidate>
              <div className="academy-login__fields">
                <div className="academy-login__field">
                  <label className="academy-login__label" htmlFor="d-email">
                    Email Address
                  </label>
                  <input
                    className="academy-login__input"
                    id="d-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "d-email-err" : undefined}
                  />
                  {errors.email && (
                    <p id="d-email-err" className="academy-login__error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="academy-login__field">
                  <label className="academy-login__label" htmlFor="d-pass">
                    Password
                  </label>
                  <input
                    className="academy-login__input"
                    id="d-pass"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => onPassword(e.target.value)}
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={errors.password ? "d-pass-err" : undefined}
                  />
                  {errors.password && (
                    <p id="d-pass-err" className="academy-login__error">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <label className="academy-login__remember" htmlFor="d-remember">
                <Checkbox
                  id="d-remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="academy-login__checkbox"
                />
                <span>Remember me</span>
              </label>

              <button className="academy-login__submit" type="submit">
                Login
              </button>

              <div className="academy-login__footer">
                <button
                  className="academy-login__forgot"
                  type="button"
                  onClick={() => setMessage("Password reset is coming soon.")}
                >
                  Forgot password?
                </button>
              </div>

              {message ? (
                <p className="academy-login__message" role="status">
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <span className="academy-login__arrow" aria-hidden="true">
          <ArrowRight className="academy-login__arrow-icon" />
        </span>
      </section>
    </main>
  );
}
