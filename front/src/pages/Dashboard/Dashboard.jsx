import {
  FaUsers,
  FaTint,
  FaHeartbeat,
  FaHospital,
  FaBell,
  FaSearch,
  FaUserShield,
  FaMapMarkerAlt,
  FaChartLine,
  FaBars,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

import "./dashboard.css";

function Dashboard() {
  const dashboardStats = [
    {
      title: "إجمالي المتبرعين",
      value: "12,540",
      icon: <FaUsers />,
    },

    {
      title: "طلبات الدم",
      value: "1,280",
      icon: <FaTint />,
    },

    {
      title: "الحالات الحرجة",
      value: "245",
      icon: <FaHeartbeat />,
    },

    {
      title: "المستشفيات",
      value: "38",
      icon: <FaHospital />,
    },
  ];

  const dashboardChartData = [
    { name: "يناير", users: 400 },
    { name: "فبراير", users: 700 },
    { name: "مارس", users: 1000 },
    { name: "أبريل", users: 1400 },
    { name: "مايو", users: 1800 },
    { name: "يونيو", users: 2400 },
  ];

  return (
    <div className="bloodDashboard">

      {/* SIDEBAR */}

      <aside className="bloodSidebar">

        <div className="bloodLogo">
          بنك الدم الجزائري
        </div>

        <ul className="bloodMenu">

          <li className="bloodMenuActive">
            <FaChartLine />
            لوحة التحكم
          </li>

          <li>
            <FaUsers />
            المتبرعين
          </li>

          <li>
            <FaTint />
            طلبات الدم
          </li>

          <li>
            <FaHospital />
            المستشفيات
          </li>

          <li>
            <FaMapMarkerAlt />
            الولايات
          </li>

          <li>
            <FaBell />
            الإشعارات
          </li>

          <li>
            <FaUserShield />
            المشرفين
          </li>

        </ul>
      </aside>

      {/* MAIN */}

      <main className="bloodMainContent">

        {/* TOPBAR */}

        <div className="bloodTopbar">

          <div className="bloodTopbarLeft">
            <FaBars />

            <h2>لوحة التحكم</h2>
          </div>

          <div className="bloodSearchBox">

            <FaSearch />

            <input
              type="text"
              placeholder="ابحث هنا..."
            />

          </div>

        </div>

        {/* STATS */}

        <div className="bloodStatsGrid">

          {dashboardStats.map((item, index) => (

            <div
              className="bloodStatCard"
              key={index}
            >

              <div className="bloodStatIcon">
                {item.icon}
              </div>

              <div>
                <h3>{item.value}</h3>

                <p>{item.title}</p>
              </div>

            </div>

          ))}

        </div>

        {/* CHART */}

        <div className="bloodChartCard">

          <div className="bloodCardHeader">
            <h3>إحصائيات المتبرعين</h3>
          </div>

          <div className="bloodChartWrapper">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart
                data={dashboardChartData}
              >

                <XAxis dataKey="name" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#ff5c8a"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* TABLE */}

        <div className="bloodTableCard">

          <div className="bloodCardHeader">
            <h3>آخر طلبات التبرع</h3>
          </div>

          <table className="bloodTable">

            <thead>

              <tr>
                <th>الاسم</th>
                <th>فصيلة الدم</th>
                <th>الولاية</th>
                <th>الحالة</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td>فاعل خير</td>
                <td>O+</td>
                <td>الجزائر</td>

                <td>
                  <span className="bloodStatus bloodUrgent">
                    عاجل
                  </span>
                </td>
              </tr>

              <tr>
                <td>متبرع 24</td>
                <td>A+</td>
                <td>وهران</td>

                <td>
                  <span className="bloodStatus">
                    عادي
                  </span>
                </td>
              </tr>

              <tr>
                <td>فاعل خير</td>
                <td>B-</td>
                <td>سطيف</td>

                <td>
                  <span className="bloodStatus bloodUrgent">
                    عاجل
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;