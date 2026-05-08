import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import { fetchUsers } from "../../api";

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getUsers = async () => {
			try {
				const data = await fetchUsers();
				setUsers(data);
			} catch (err) {
				setError("Failed to fetch users");
			} finally {
				setLoading(false);
			}
		};
		getUsers();
	}, []);

	return (
		<div style={{ display: "flex" }}>
			<AdminSidebar />
			<main style={{ flex: 1, padding: 32 }}>
				<h2>All Users</h2>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div>{error}</div>
				) : (
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ background: "#f6f6f6" }}>
								<th>Name</th>
								<th>Email</th>
								<th>Role</th>
							</tr>
						</thead>
						<tbody>
							{users.length === 0 && (
								<tr><td colSpan={3} style={{textAlign:'center'}}>No users found.</td></tr>
							)}
							{users.map((u, idx) => (
								<tr key={u._id || idx}>
									<td>{u.name}</td>
									<td>{u.email}</td>
									<td>{u.role || "user"}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</main>
		</div>
	);
};

export default AdminUsers;
// ...existing code from src/AdminUsers.js...
