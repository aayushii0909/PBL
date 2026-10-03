import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/api';
import { formatDate, calculateAge } from '../utils/helpers';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import PetCard from '../components/PetCard';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    totalPets: 0,
    totalVaccinations: 0,
    totalMedicalRecords: 0,
    totalVetVisits: 0,
    upcomingReminders: 0,
    overdueVaccinations: 0,
    pets: [],
    upcomingVaccinations: [],
    recentActivity: [],
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getDashboard();
      if (!result.success) {
        setError(result.message || 'Failed to load dashboard.');
        setLoading(false);
        return;
      }
      setData(result.data);
      setError('');
      setLoading(false);
    };
    load();
  }, []);

  const summary = [
    { label: 'Total Pets', value: data.totalPets, tone: 'blue' },
    { label: 'Vaccinations', value: data.totalVaccinations, tone: 'green' },
    { label: 'Medical Records', value: data.totalMedicalRecords, tone: 'teal' },
    { label: 'Vet Visits', value: data.totalVetVisits, tone: 'navy' },
    { label: 'Upcoming Reminders', value: data.upcomingReminders, tone: 'amber' },
  ];

  const firstName = (user?.fullName || user?.name || 'User').split(' ')[0];
  const pets = data.pets || [];

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '40vh' }}>
        <div className="loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="welcome-banner">
        <div>
          <h2>Hello, {firstName}</h2>
          <p>Here is an overview of your pets&apos; health records.</p>
        </div>
        <Button onClick={() => navigate('/pets/add')}>Add New Pet</Button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="summary-grid">
        {summary.map((item) => (
          <div key={item.label} className={`summary-card tone-${item.tone}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="dashboard-columns">
        <Card
          title="My Pets"
          actions={
            <Button variant="ghost" onClick={() => navigate('/pets')}>
              View all
            </Button>
          }
        >
          {pets.length === 0 ? (
            <EmptyState
              title="No pets yet"
              message="Add your first pet to get started."
              action={<Button onClick={() => navigate('/pets/add')}>Add New Pet</Button>}
            />
          ) : (
            <div className="pet-grid compact">
              {pets.slice(0, 4).map((pet) => (
                <PetCard key={pet.id} pet={pet} compact onView={() => navigate('/pets')} />
              ))}
            </div>
          )}
        </Card>

        <Card
          title="Upcoming Vaccinations"
          actions={
            <Button variant="ghost" onClick={() => navigate('/vaccinations')}>
              Manage
            </Button>
          }
        >
          {(data.upcomingVaccinations || []).length === 0 ? (
            <EmptyState
              title="No vaccination due dates"
              message="Add vaccination records to track due dates."
            />
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Vaccine</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.upcomingVaccinations.map((v) => (
                    <tr key={v.id}>
                      <td>{v.petName}</td>
                      <td>{v.vaccineName}</td>
                      <td>{formatDate(v.nextDueDate)}</td>
                      <td>
                        <StatusBadge status={v.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Card title="Recent Activity">
        {(data.recentActivity || []).length === 0 ? (
          <EmptyState title="No recent activity" message="Records you add will appear here." />
        ) : (
          <ul className="activity-list">
            {data.recentActivity.map((item) => (
              <li key={item.id}>
                <span>{item.text}</span>
                <time>{formatDate(item.date)}</time>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {pets.length > 0 && (
        <p className="dashboard-footnote">
          Showing ages for reference — e.g. {pets[0].name} is {calculateAge(pets[0].dateOfBirth)}.
        </p>
      )}
    </div>
  );
}
