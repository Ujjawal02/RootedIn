import React from 'react'

const GrowthTimeline = ({ updates }) => {
  if (!updates || updates.length === 0) {
    return <p className="text-muted small mb-0">No updates posted yet....</p>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {updates.map((u) => (
        <div key={u._id} className="d-flex gap-3 border-bottom pb-3">
          <img src={u.image?.url} alt="Growth update" className="rounded"
            style={{ width: "100px", height: "100px", objectFit: "cover", flexShrink: 0 }} />
          <div>
            <p className="small text-muted mb-1">
              {new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="mb-0">{u.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GrowthTimeline;