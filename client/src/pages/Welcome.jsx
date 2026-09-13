import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="fire-glow"></div>

      <div className="welcome-content">
        <div className="fire-symbol">🔥</div>

        <p className="eyebrow">
          YOUR JOURNEY STARTS HERE
        </p>

        <h1>
          A Journey
          <span> to Fire</span>
        </h1>

        <div className="divider"></div>

        <p className="tagline">
          Let the fire in you
          <br />
          clear the way.
        </p>

        <p className="description">
          Every great journey begins with a single step.
          Discover opportunities, ignite your vision,
          and take the first step toward your future.
        </p>

        <button
          className="begin-button"
          onClick={() => navigate("/invest")}
        >
          <span>BEGIN THE JOURNEY</span>
          <span className="arrow">→</span>
        </button>

        <p className="bottom-text">
          DREAM · INVEST · BUILD · GROW
        </p>
      </div>
    </div>
  );
}

export default Welcome;