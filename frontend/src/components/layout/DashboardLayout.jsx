import Sidebar from '../common/Sidebar'

const DashboardLayout = ({ role, children }) => {
  return (
    <div className="page-layout">
      <Sidebar role={role} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
