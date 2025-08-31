export function EditProfileModal({ open, onOpenChange }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%',
      height: '100%', background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff', padding: '20px', borderRadius: '12px', width: '400px'
      }}>
        <h2>Edit Profile</h2>
        <p>This is a placeholder modal. Add form fields here.</p>
        <button
          style={{
            marginTop: '10px', padding: '8px 16px',
            background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px'
          }}
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
