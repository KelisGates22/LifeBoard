import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById, updateJob } from '../api/jobApi';

function EditJobPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);



  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(Number(id));
        const job = response.data;
        setCompany(job.company);
        setRole(job.role);
        setStatus(job.status);
        setJobUrl(job.jobUrl || '');
        setNotes(job.notes || '');
      } catch {
        setError('Failed to load job.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, []);

  const handleSubmit = async () => {
    if (!company || !role) {
      setError('Company and role are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateJob(Number(id), {
        company,
        role,
        status,
        jobUrl: jobUrl || null,
        notes: notes || null,
      });
      navigate('/dashboard');
    } catch {
      setError('Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Edit Job Application</h1>
          <span
            style={styles.back}
            onClick={() => navigate('/dashboard')}
          >
            ← Back
          </span>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Company *</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. Google"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <label style={styles.label}>Role *</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. Junior Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <label style={styles.label}>Status</label>
        <select
          style={styles.input}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <label style={styles.label}>Job URL (optional)</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. https://careers.google.com/jobs/123"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
        />

        <label style={styles.label}>Notes (optional)</label>
        <textarea
          style={styles.textarea}
          placeholder="e.g. Interview scheduled for Monday"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 16px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    height: 'fit-content',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  back: {
    color: '#4f46e5',
    cursor: 'pointer',
    fontSize: '14px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#444',
    marginTop: '8px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
  },
  button: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    margin: 0,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};

export default EditJobPage;