import { useDonors } from "../../context/DonorContext";

export default function StatsCards() {
  const { donors, loading } = useDonors();

  const safeDonors = Array.isArray(donors) ? donors : [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const totalDonors = safeDonors.length;
  const activeDonors = safeDonors.filter(d => d?.isActive).length;
  const inactiveDonors = safeDonors.filter(d => d?.isActive === false).length;

  const newDonors = safeDonors.filter(d =>
    new Date(d.createdAt) >= sevenDaysAgo
  ).length;

  return (
    <div className="stats" dir="rtl">

      <div className="card">
        <h3>إجمالي المتبرعين</h3>
        <p>{loading ? "..." : totalDonors}</p>
      </div>

      <div className="card">
        <h3>النشطين</h3>
        <p>{loading ? "..." : activeDonors}</p>
      </div>

      <div className="card">
        <h3>غير النشطين</h3>
        <p>{loading ? "..." : inactiveDonors}</p>
      </div>

      <div className="card">
        <h3>جدد (7 أيام)</h3>
        <p>{loading ? "..." : newDonors}</p>
      </div>

    </div>
  );
}