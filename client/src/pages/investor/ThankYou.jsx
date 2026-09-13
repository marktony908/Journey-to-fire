import { Link } from "react-router-dom";
import "./ThankYou.css";

function ThankYou() {
  return (
    <div className="thank-you-page">
      <div className="thank-you-content">

        <div className="thank-fire">🔥</div>

        <p className="thank-small">JOURNEY STARTED</p>

        <h1>
          Thank You
        </h1>

        <p className="thank-message">
          We've received your details.
          <br />
          Your journey has officially begun.
        </p>

        <div className="thank-divider"></div>

        <p className="thank-quote">
          “Let the fire in you clear the way.”
        </p>

        <Link to="/" className="back-home">
          BACK TO HOME
        </Link>

      </div>
    </div>
  );
}

export default ThankYou;