export default function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'Ready to Ship': 'bg-blue-100 text-blue-800',
    Dispatched: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}