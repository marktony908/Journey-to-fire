import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({});
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedLead, setSelectedLead] = useState(null);

  const token = localStorage.getItem("journey_fire_token");

  useEffect(() => {

    if (!token) {
      navigate("/admin");
      return;
    }

    loadDashboard();

  }, [token, navigate]);


  const loadDashboard = async () => {

    setLoading(true);
    setError("");

    try {

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const [
        dashboardResponse,
        leadsResponse,
        adminResponse
      ] = await Promise.all([

        fetch(`${API_URL}/admin/dashboard`, {
          headers
        }),

        fetch(`${API_URL}/admin/leads`, {
          headers
        }),

        fetch(`${API_URL}/admin/me`, {
          headers
        })

      ]);


      if (
        dashboardResponse.status === 401 ||
        leadsResponse.status === 401 ||
        adminResponse.status === 401
      ) {

        handleLogout();
        return;
      }


      const dashboardData =
        await dashboardResponse.json();

      const leadsData =
        await leadsResponse.json();

      const adminData =
        await adminResponse.json();


      if (!dashboardResponse.ok) {

        throw new Error(
          dashboardData.message ||
          "Unable to load dashboard."
        );

      }


      if (!leadsResponse.ok) {

        throw new Error(
          leadsData.message ||
          "Unable to load investors."
        );

      }


      setStats(
        dashboardData.stats || {}
      );

      setLeads(
        leadsData.leads || []
      );

      setAdmin(
        adminData.admin || null
      );

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };


  const handleLogout = () => {

    localStorage.removeItem(
      "journey_fire_token"
    );

    localStorage.removeItem(
      "journey_fire_admin"
    );

    navigate("/admin");

  };


  const filteredLeads = leads.filter((lead) => {

    const investor =
      lead.investor || {};

    const project =
      lead.project || {};

    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      !searchText ||
      investor.full_name
        ?.toLowerCase()
        .includes(searchText) ||
      investor.phone
        ?.toLowerCase()
        .includes(searchText) ||
      investor.email
        ?.toLowerCase()
        .includes(searchText) ||
      investor.location
        ?.toLowerCase()
        .includes(searchText) ||
      project.name
        ?.toLowerCase()
        .includes(searchText);


    const matchesStatus =
      statusFilter === "all" ||
      lead.status === statusFilter;


    return (
      matchesSearch &&
      matchesStatus
    );

  });


  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-KE",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  };


  if (loading) {

    return (
      <div className="dashboard-loading">

        <div className="loading-fire">
          🔥
        </div>

        <h2>
          Loading your dashboard...
        </h2>

        <p>
          Gathering the latest investor journeys.
        </p>

      </div>
    );

  }


  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="sidebar-brand">

          <div className="brand-fire">
            🔥
          </div>

          <div>
            <h2>
              Journey to Fire
            </h2>

            <span>
              ADMIN PANEL
            </span>
          </div>

        </div>


        <nav className="sidebar-nav">

          <button className="nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .getElementById("investors-section")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            <span>♙</span>
            Investors
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .getElementById("referrals-section")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            <span>↗</span>
            Referrals
          </button>

        </nav>


        <div className="sidebar-bottom">

          {admin && (

            <div className="admin-profile">

              <div className="profile-avatar">
                {admin.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <strong>
                  {admin.name}
                </strong>

                <small>
                  {admin.email}
                </small>

              </div>

            </div>

          )}


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              INVESTOR MANAGEMENT
            </p>

            <h1>
              Welcome back
              {admin?.name
                ? `, ${admin.name.split(" ")[0]}`
                : ""}
            </h1>

            <p>
              Track every investor journey
              from first interest to conversion.
            </p>

          </div>


          <button
            className="refresh-button"
            onClick={loadDashboard}
          >
            ↻ Refresh
          </button>

        </header>


        {error && (

          <div className="dashboard-error">
            {error}
          </div>

        )}


        {/* STATISTICS */}

        <section className="stats-grid">

          <div className="stat-card">

            <span className="stat-icon">
              👥
            </span>

            <div>

              <span className="stat-label">
                Total Investors
              </span>

              <strong>
                {stats.total_investors || 0}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🔥
            </span>

            <div>

              <span className="stat-label">
                Total Leads
              </span>

              <strong>
                {stats.total_leads || 0}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🆕
            </span>

            <div>

              <span className="stat-label">
                New Leads
              </span>

              <strong>
                {stats.new_leads || 0}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              ↗
            </span>

            <div>

              <span className="stat-label">
                Referrals
              </span>

              <strong>
                {stats.total_referrals || 0}
              </strong>

            </div>

          </div>

        </section>


        {/* LEAD BREAKDOWN */}

        <section className="breakdown-card">

          <div>

            <span>Contacted</span>
            <strong>
              {stats.contacted_leads || 0}
            </strong>
          </div>

          <div>

            <span>Interested</span>
            <strong>
              {stats.interested_leads || 0}
            </strong>
          </div>

          <div>

            <span>Follow-up</span>
            <strong>
              {stats.follow_up_leads || 0}
            </strong>
          </div>

          <div>

            <span>Converted</span>
            <strong>
              {stats.converted_leads || 0}
            </strong>
          </div>

          <div>

            <span>Lost</span>
            <strong>
              {stats.lost_leads || 0}
            </strong>
          </div>

        </section>


        {/* INVESTORS */}

        <section
          className="investors-section"
          id="investors-section"
        >

          <div className="section-header">

            <div>

              <p className="section-eyebrow">
                LIVE INVESTOR DATA
              </p>

              <h2>
                Investor Journeys
              </h2>

            </div>

            <span className="lead-count">
              {filteredLeads.length} records
            </span>

          </div>


          {/* FILTERS */}

          <div className="filters">

            <div className="search-box">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search name, phone, email, location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="all">
                All statuses
              </option>

              <option value="new">
                New
              </option>

              <option value="contacted">
                Contacted
              </option>

              <option value="interested">
                Interested
              </option>

              <option value="follow-up">
                Follow-up
              </option>

              <option value="converted">
                Converted
              </option>

              <option value="lost">
                Lost
              </option>

            </select>

          </div>


          {/* TABLE */}

          <div className="table-wrapper">

            <table className="investor-table">

              <thead>

                <tr>

                  <th>Investor</th>

                  <th>Contact</th>

                  <th>Location</th>

                  <th>Project</th>

                  <th>Budget</th>

                  <th>Payment</th>

                  <th>Status</th>

                  <th>Assigned To</th>

                  <th></th>

                </tr>

              </thead>


              <tbody>

                {filteredLeads.length === 0 ? (

                  <tr>

                    <td
                      colSpan="9"
                      className="empty-state"
                    >

                      <div>
                        🔥
                      </div>

                      <strong>
                        No investor records found
                      </strong>

                      <span>
                        New submissions will appear here automatically.
                      </span>

                    </td>

                  </tr>

                ) : (

                  filteredLeads.map((lead) => {

                    const investor =
                      lead.investor || {};

                    const project =
                      lead.project || {};

                    return (

                      <tr key={lead.id}>

                        <td>

                          <strong className="investor-name">
                            {investor.full_name || "-"}
                          </strong>

                          <small>
                            #{lead.id}
                          </small>

                        </td>


                        <td>

                          <div className="contact-cell">

                            <span>
                              {investor.phone || "-"}
                            </span>

                            <small>
                              {investor.email || "No email"}
                            </small>

                          </div>

                        </td>


                        <td>
                          {investor.location || "-"}
                        </td>


                        <td>
                          {project.name || "-"}
                        </td>


                        <td>
                          {investor.budget || "-"}
                        </td>


                        <td>
                          {investor.payment_plan || "-"}
                        </td>


                        <td>

                          <span
                            className={`status-badge status-${lead.status}`}
                          >
                            {lead.status}
                          </span>

                        </td>


                        <td>

                          {lead.assigned_admin
                            ? lead.assigned_admin.name
                            : (
                              <span className="unassigned">
                                Unassigned
                              </span>
                            )}

                        </td>


                        <td>

                          <button
                            className="view-button"
                            onClick={() =>
                              setSelectedLead(lead)
                            }
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* REFERRALS */}

        <section
          id="referrals-section"
          className="referrals-section"
        >

          <div className="section-header">

            <div>

              <p className="section-eyebrow">
                NETWORK GROWTH
              </p>

              <h2>
                Referral Activity
              </h2>

            </div>

          </div>


          {leads.filter(
            (lead) => lead.referral
          ).length === 0 ? (

            <div className="no-referrals">
              No referrals have been submitted yet.
            </div>

          ) : (

            <div className="referral-grid">

              {leads
                .filter(
                  (lead) => lead.referral
                )
                .map((lead) => (

                  <div
                    className="referral-card"
                    key={lead.referral.id}
                  >

                    <span className="referral-icon">
                      ↗
                    </span>

                    <div>

                      <strong>
                        {lead.referral.name}
                      </strong>

                      <p>
                        {lead.referral.phone}
                      </p>

                      {lead.referral.email && (

                        <p>
                          {lead.referral.email}
                        </p>

                      )}

                      <small>
                        Referred by{" "}
                        {lead.referral.referrer?.name ||
                          "Investor"}
                      </small>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

      </main>


      {/* INVESTOR DETAILS MODAL */}

      {selectedLead && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedLead(null)
          }
        >

          <div
            className="investor-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <p>
                  INVESTOR #{selectedLead.id}
                </p>

                <h2>
                  {selectedLead.investor?.full_name}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedLead(null)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-grid">

              <div className="detail-item">

                <span>Phone</span>

                <strong>
                  {selectedLead.investor?.phone || "-"}
                </strong>

              </div>


              <div className="detail-item">

                <span>Email</span>

                <strong>
                  {selectedLead.investor?.email || "-"}
                </strong>

              </div>


              <div className="detail-item">

                <span>Location</span>

                <strong>
                  {selectedLead.investor?.location || "-"}
                </strong>

              </div>


              <div className="detail-item">

                <span>Project</span>

                <strong>
                  {selectedLead.project?.name || "-"}
                </strong>

              </div>


              <div className="detail-item">

                <span>Budget</span>

                <strong>
                  {selectedLead.investor?.budget || "-"}
                </strong>

              </div>


              <div className="detail-item">

                <span>Payment Plan</span>

                <strong>
                  {selectedLead.investor?.payment_plan || "-"}
                </strong>

              </div>


              <div className="detail-item">

                <span>Assigned Admin</span>

                <strong>
                  {selectedLead.assigned_admin?.name ||
                    "Unassigned"}
                </strong>

              </div>


              <div className="detail-item">

                <span>Submitted</span>

                <strong>
                  {formatDate(
                    selectedLead.created_at
                  )}
                </strong>

              </div>

            </div>


            {selectedLead.referral && (

              <div className="modal-referral">

                <h3>
                  Referral
                </h3>

                <p>
                  <strong>
                    {selectedLead.referral.name}
                  </strong>
                </p>

                <p>
                  {selectedLead.referral.phone}
                </p>

                <p>
                  {selectedLead.referral.email ||
                    "No email"}
                </p>

                <small>
                  Relationship:{" "}
                  {selectedLead.referral.relationship ||
                    "Not specified"}
                </small>

              </div>

            )}


            <div className="modal-notes">

              <h3>
                Admin Notes
              </h3>

              <p>
                {selectedLead.notes ||
                  "No notes have been added yet."}
              </p>

            </div>


            <div className="modal-footer">

              <span
                className={`status-badge status-${selectedLead.status}`}
              >
                {selectedLead.status}
              </span>

              <button
                className="close-modal"
                onClick={() =>
                  setSelectedLead(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;