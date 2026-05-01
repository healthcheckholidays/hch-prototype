export function Timeline({ events }) {
  return (
    <div className="timeline">
      {events.map((event, i) => (
        <div className="tl-item" key={i}>
          <div className="tl-left">
            <div className="tl-time">{event.time}</div>
            <div className={`tl-dot tl-dot-${event.type}`} />
            {i < events.length - 1 && <div className="tl-line" />}
          </div>
          <div className="tl-right">
            <div className="tl-title">{event.title}</div>
            <div className="tl-desc">{event.description}</div>
            {event.tags && (
              <div className="tl-tags">
                {event.tags.map((tag, ti) => (
                  <span key={ti} className={`tag tag-${tagClass(event.type)}`}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function tagClass(type) {
  if (type === 'health') return 'green'
  if (type === 'explore') return 'blue'
  if (type === 'food') return 'amber'
  return ''
}
