import { calculateAge } from '../utils/helpers';
import Button from './Button';

function PetAvatar({ name, photo, size = 'md' }) {
  if (photo) {
    return <img src={photo} alt={name} className={`pet-avatar pet-avatar-${size}`} />;
  }
  const initial = (name || 'P').charAt(0).toUpperCase();
  return <div className={`pet-avatar pet-avatar-${size} pet-avatar-fallback`}>{initial}</div>;
}

export default function PetCard({ pet, onView, onEdit, onDelete, compact = false }) {
  return (
    <div className={`pet-card ${compact ? 'pet-card-compact' : ''}`}>
      <PetAvatar name={pet.name} photo={pet.photo} size={compact ? 'sm' : 'lg'} />
      <div className="pet-card-info">
        <h3>{pet.name}</h3>
        <p className="pet-meta">
          {pet.species}
          {pet.breed ? ` · ${pet.breed}` : ''}
        </p>
        {!compact && (
          <ul className="pet-details">
            <li>
              <span>Gender</span>
              <strong>{pet.gender || '—'}</strong>
            </li>
            <li>
              <span>Age</span>
              <strong>{calculateAge(pet.dateOfBirth)}</strong>
            </li>
            <li>
              <span>Weight</span>
              <strong>{pet.weight ? `${pet.weight} kg` : '—'}</strong>
            </li>
            {pet.dateOfBirth && (
              <li>
                <span>DOB</span>
                <strong>{pet.dateOfBirth}</strong>
              </li>
            )}
          </ul>
        )}
        {compact && pet.dateOfBirth && (
          <p className="pet-age">{calculateAge(pet.dateOfBirth)}</p>
        )}
      </div>
      {(onView || onEdit || onDelete) && (
        <div className="pet-card-actions">
          {onView && (
            <Button variant="ghost" onClick={() => onView(pet)}>
              View
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" onClick={() => onEdit(pet)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(pet)}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { PetAvatar };
