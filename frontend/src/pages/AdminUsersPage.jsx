import { useEffect, useState } from 'react';
import { HiOutlineRefresh, HiOutlineUsers } from 'react-icons/hi';
import adminUserService from '../services/adminUserService';
import { useAuth } from '../hooks/useAuth';

const ROLE_OPTIONS = ['USER', 'ADMIN', 'TECHNICIAN'];

/**
 * Admin user role management page.
 */
export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingUserId, setSavingUserId] = useState(null);
  const [draftRoles, setDraftRoles] = useState({});
  const [successMsg, setSuccessMsg] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminUserService.getAllUsers();
      setUsers(data);
      const initialRoles = Object.fromEntries(data.map((u) => [u.id, u.role]));
      setDraftRoles(initialRoles);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleSave = async (targetUser) => {
    const nextRole = draftRoles[targetUser.id];
    if (!nextRole || nextRole === targetUser.role) return;

    try {
      setSavingUserId(targetUser.id);
      setError(null);
      const updated = await adminUserService.updateUserRole(targetUser.id, nextRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSuccessMsg(`Updated ${updated.name}'s role to ${updated.role}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
      setDraftRoles((prev) => ({ ...prev, [targetUser.id]: targetUser.role }));
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="bookings-page" id="admin-users-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineUsers size={28} />
            User Role Management
          </h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadUsers} id="refresh-admin-users-btn">
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success" id="admin-users-success-msg">
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadUsers}>Try Again</button>
        </div>
      ) : (
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Provider</th>
                <th>Current Role</th>
                <th>New Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const draftRole = draftRoles[u.id] || u.role;
                const disableSelfDemotion = isSelf && draftRole !== 'ADMIN';

                return (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.provider}</td>
                    <td><span className="role-chip">{u.role}</span></td>
                    <td>
                      <select
                        className="role-select"
                        value={draftRole}
                        onChange={(e) => setDraftRoles((prev) => ({ ...prev, [u.id]: e.target.value }))}
                        disabled={savingUserId === u.id}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        disabled={savingUserId === u.id || draftRole === u.role || disableSelfDemotion}
                        onClick={() => handleRoleSave(u)}
                      >
                        {savingUserId === u.id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
