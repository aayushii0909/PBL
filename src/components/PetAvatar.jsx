const SPECIES_COLORS = {
  Dog: '#3B82C4',
  Cat: '#5BA88A',
  Bird: '#E8A838',
  Rabbit: '#7B8CDE',
  Other: '#6B7C93',
};

export default function PetAvatar({ name = '?', species = 'Other', photo, size = 'md' }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  const bg = SPECIES_COLORS[species] || SPECIES_COLORS.Other;

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`pet-avatar pet-avatar-${size} pet-avatar-img`}
      />
    );
  }

  return (
    <div
      className={`pet-avatar pet-avatar-${size}`}
      style={{ background: bg }}
      aria-label={`${name} avatar`}
    >
      {initial}
    </div>
  );
}
