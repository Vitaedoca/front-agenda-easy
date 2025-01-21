export default function RenderEventContent(eventInfo: any) {
  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      padding: '8px', 
      border: '1px solid #ddd', 
      borderRadius: '6px', 
      backgroundColor: '#f9f9f9', 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}>
      <span style={{ fontWeight: 'bold', color: '#333' }}>
        {eventInfo.timeText}
      </span>
      <span style={{ color: '#555', fontStyle: 'italic' }}>
        {eventInfo.event.title}
      </span>
      {eventInfo.isStart && (
        <span style={{ fontSize: '12px', color: '#888' }}>{eventInfo.isStart}</span>
      )}
      {eventInfo.isEnd && (
        <span style={{ fontSize: '12px', color: '#888' }}>{eventInfo.isEnd}</span>
      )}
    </div>
  );
}