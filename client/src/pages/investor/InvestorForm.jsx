import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InvestorForm.css";

function InvestorForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    project: "",
    budget: "",
    paymentPlan: "",
    referredBy: "",
    referralName: "",
    referralPhone: "",
    referralEmail: "",
    referralRelationship: "",
  });

  const [hasReferral, setHasReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/investors/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong. Please try again."
        );
      }

      console.log(
        "Investor successfully registered:",
        data
      );

      navigate("/thank-you");
    } catch (err) {
      console.error(
        "Investor submission error:",
        err
      );

      setError(
        err.message ||
          "Unable to submit your information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investor-page">
      <div className="investor-container">

        {/* HEADER */}

        <div className="form-header">
          <div className="small-fire">🔥</div>

          <p className="form-eyebrow">
            A JOURNEY TO FIRE
          </p>

          <h1>Let's Begin Your Journey</h1>

          <p>
            Tell us a little about yourself and the
            opportunity you're interested in.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* =====================================================
              SECTION 01 — PERSONAL DETAILS
          ===================================================== */}

          <section className="form-section">

            <div className="section-title">

              <span>01</span>

              <div>
                <h2>Your Details</h2>
                <p>Let's get to know you.</p>
              </div>

            </div>

            <div className="form-grid">

              {/* FULL NAME */}

              <div className="input-group full">

                <label htmlFor="fullName">
                  Full Name *
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              {/* PHONE */}

              <div className="input-group">

                <label htmlFor="phone">
                  Phone Number *
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="input-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

              </div>

              {/* LOCATION */}

              <div className="input-group full">

                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Nairobi, Kiambu, Mombasa"
                />

              </div>

            </div>

          </section>

          {/* =====================================================
              SECTION 02 — INVESTMENT DETAILS
          ===================================================== */}

          <section className="form-section">

            <div className="section-title">

              <span>02</span>

              <div>
                <h2>Your Investment</h2>

                <p>
                  Tell us what caught your interest.
                </p>
              </div>

            </div>

            <div className="form-grid">

              {/* PROJECT */}

              <div className="input-group full">

                <label htmlFor="project">
                  Which project interests you? *
                </label>

                <select
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select a project
                  </option>

                  <option value="project-1">
                    Tsavo Project 1
                  </option>

                  <option value="project-2">
                    Tsavo Project 2
                  </option>

                  <option value="project-3">
                    Tsavo Project 3
                  </option>

                  <option value="project-4">
                    Tsavo Project 4
                  </option>

                  <option value="not-sure">
                    I'm not sure yet
                  </option>

                </select>

              </div>

              {/* BUDGET */}

              <div className="input-group">

                <label htmlFor="budget">
                  Investment Budget
                </label>

                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >

                  <option value="">
                    Select range
                  </option>

               

                  <option value="2m-3m">
                    KES 2M – 3M
                  </option>

                  <option value="3m-5m">
                    KES 3M – 5M
                  </option>

                  <option value="above-5m">
                    Above KES 5M
                  </option>

                </select>

              </div>

              {/* PAYMENT PLAN */}

              <div className="input-group">

                <label htmlFor="paymentPlan">
                  Preferred Payment Plan
                </label>

                <select
                  id="paymentPlan"
                  name="paymentPlan"
                  value={formData.paymentPlan}
                  onChange={handleChange}
                >

                  <option value="">
                    Select option
                  </option>

                  <option value="cash">
                    Cash
                  </option>

                  <option value="installments">
                    Installments
                  </option>

                  

                    <option value="not-sure">
                    Not sure yet
                  </option>

                </select>

              </div>

            </div>

          </section>

          {/* =====================================================
              SECTION 03 — REFERRAL
          ===================================================== */}

          <section className="form-section referral-section">

            <div className="section-title">

              <span>03</span>

              <div>

                <h2>Bring Someone Along</h2>

                <p>
                  Know someone who might be interested?
                  You can introduce them to fire the journey.
                </p>

              </div>

            </div>

            {/* REFERRAL QUESTION */}

            <div className="referral-question">

              <p>
                Would you like to refer a friend or
                colleague?
              </p>

              <div className="choice-buttons">

                <button
                  type="button"
                  className={
                    !hasReferral
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setHasReferral(false)
                  }
                >
                  No, maybe later
                </button>

                <button
                  type="button"
                  className={
                    hasReferral
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setHasReferral(true)
                  }
                >
                  Yes, I'd like to refer someone
                </button>

              </div>

            </div>

            {/* REFERRAL DETAILS */}

            {hasReferral && (

              <div className="referral-box">

                <div className="form-grid">

                  {/* REFERRAL NAME */}

                  <div className="input-group">

                    <label htmlFor="referralName">
                      Friend / Colleague Name *
                    </label>

                    <input
                      id="referralName"
                      type="text"
                      name="referralName"
                      value={formData.referralName}
                      onChange={handleChange}
                      placeholder="Full name"
                      required
                    />

                  </div>

                  {/* REFERRAL PHONE */}

                  <div className="input-group">

                    <label htmlFor="referralPhone">
                      Phone Number *
                    </label>

                    <input
                      id="referralPhone"
                      type="tel"
                      name="referralPhone"
                      value={formData.referralPhone}
                      onChange={handleChange}
                      placeholder="+254 7XX XXX XXX"
                      required
                    />

                  </div>

                  {/* REFERRAL EMAIL */}

                  <div className="input-group">

                    <label htmlFor="referralEmail">
                      Email
                    </label>

                    <input
                      id="referralEmail"
                      type="email"
                      name="referralEmail"
                      value={formData.referralEmail}
                      onChange={handleChange}
                      placeholder="Email address"
                    />

                  </div>

                  {/* RELATIONSHIP */}

                  <div className="input-group">

                    <label htmlFor="referralRelationship">
                      Relationship
                    </label>

                    <select
                      id="referralRelationship"
                      name="referralRelationship"
                      value={
                        formData.referralRelationship
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Select
                      </option>

                      <option value="friend">
                        Friend
                      </option>

                      <option value="colleague">
                        Work Colleague
                      </option>

                      <option value="family">
                        Family
                      </option>

                      <option value="business">
                        Business Contact
                      </option>

                      <option value="other">
                        Other
                      </option>

                    </select>

                  </div>

                </div>

              </div>

            )}

          </section>

          {/* =====================================================
              ERROR MESSAGE
          ===================================================== */}

          {error && (

            <div className="form-error">
              {error}
            </div>

          )}

          {/* =====================================================
              SUBMIT
          ===================================================== */}

          <div className="submit-area">

            <p>
              By submitting this form, you agree to be
              contacted regarding your investment interest.
            </p>

            <button
              className="submit-button"
              type="submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "SUBMITTING..."
                  : "START MY JOURNEY"}
              </span>

              <span>
                {loading
                  ? "..."
                  : "→"}
              </span>

            </button>

          </div>

        </form>

        {/* FOOTER */}

        <div className="form-footer">
          🔥 Let the fire in you clear the way.
        </div>

      </div>
    </div>
  );
}

export default InvestorForm;