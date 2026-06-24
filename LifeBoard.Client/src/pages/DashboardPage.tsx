import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, deleteJob } from '../api/jobApi';
import type { JobApplication } from '../types';

function DashboardPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      setJobs(response.data);
    } catch {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchJobs();
    })();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((job) => job.id !== id));
    } catch {
      setError('Failed to delete job.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return '#3b82f6';
      case 'Interview': return '#f59e0b';
      case 'Offer': return '#22c55e';
      case 'Rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const statusCounts = {
    Applied: jobs.filter((j) => j.status === 'Applied').length,
    Interview: jobs.filter((j) => j.status === 'Interview').length,
    Offer: jobs.filter((j) => j.status === 'Offer').length,
    Rejected: jobs.filter((j) => j.status === 'Rejected').length,
  };

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>LifeBoard</h1>
        <div style={styles.headerActions}>
          <button style={styles.addButton} onClick={() => navigate('/add-job')}>
            + Add Job
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Stats Cards */}
      <div style={styles.statsRow}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} style={styles.statCard}>
            <span style={{ ...styles.statDot, backgroundColor: getStatusColor(status) }} />
            <div>
              <p style={styles.statCount}>{count}</p>
              <p style={styles.statLabel}>{status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Job List */}
      {jobs.length === 0 ? (
        <div style={styles.empty}>
          <p>No job applications yet.</p>
          <button style={styles.addButton} onClick={() => navigate('/add-job')}>
            Add your first job
          </button>
        </div>
      ) : (
        <div style={styles.jobList}>
          {jobs.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.jobInfo}>
                <h2 style={styles.company}>{job.company}</h2>
                <p style={styles.role}>{job.role}</p>
                <p style={styles.date}>
                  Applied: {new Date(job.appliedDate).toLocaleDateString()}
                </p>
                {job.notes && <p style={styles.notes}>{job.notes}</p>}
              </div>
              <div style={styles.jobActions}>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(job.status),
                  }}
                >
                  {job.status}
                </span>
                <button
                  style={styles.editButton}
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: '120px',
  },
  statDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  statCount: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  statLabel: {
    margin: 0,
    fontSize: '12px',
    color: '#666',
  },
  jobList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  jobInfo: {
    flex: 1,
  },
  company: {
    margin: '0 0 4px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  role: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    color: '#444',
  },
  date: {
    margin: '0 0 4px 0',
    fontSize: '12px',
    color: '#888',
  },
  notes: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
  },
  jobActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  statusBadge: {
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  editButton: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #4f46e5',
    backgroundColor: 'white',
    color: '#4f46e5',
    fontSize: '12px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #ef4444',
    backgroundColor: 'white',
    color: '#ef4444',
    fontSize: '12px',
    cursor: 'pointer',
  },
  addButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 0',
    color: '#666',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};

export default DashboardPage;