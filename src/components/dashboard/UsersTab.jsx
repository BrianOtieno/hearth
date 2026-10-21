import React, { useState } from "react";
import { Users, Shield, Truck, Search } from "lucide-react";
import { apiFetch } from "../../services/api";

export default function UsersTab({ users, setUsers, userRole }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const isAdmin = userRole === "admin";

  // Handle promoting or changing user roles with the correct endpoint path
  async function handleUpdateRole(userId, newRole) {
    setLoadingId(userId);
    try {
      await apiFetch(`/users/${userId}/role`, {
        method: "PATCH",
        body: { role: newRole },
      });

      if (setUsers) {
        setUsers(
          users.map((u) =>
            (u.ID || u.id) === userId
              ? { ...u, role: newRole, Role: newRole }
              : u,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update user role", err);
      alert("Could not update user role.");
    } finally {
      setLoadingId(null);
    }
  }

  const filteredUsers = (users || []).filter((u) => {
    const name = (u.name || u.Username || u.username || "").toLowerCase();
    const email = (u.email || u.Email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  if (!isAdmin) {
    return (
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-8 text-center space-y-2">
        <Shield size={32} className="mx-auto text-rose-400" />
        <h3 className="font-serif text-lg">Restricted Access</h3>
        <p className="text-xs text-[#9c8e82]">
          Only administrators can manage system users and drivers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif text-2xl">Driver & User Management</h2>
        <p className="text-xs text-[#9c8e82] mt-0.5">
          Manage platform accounts, review permissions, and promote operators to
          driver roles.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-4 shadow-lg flex items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8e82]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-[#0e1113] text-[#fbf9f5] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#e2b774]"
          />
        </div>
      </div>

      {/* Users Ledger Table */}
      <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#9c8e82] border-b border-white/15 pb-3 flex items-center gap-2">
          <Users size={14} /> Registered System Users ({filteredUsers.length})
        </h3>

        {filteredUsers.length === 0 ? (
          <p className="text-xs text-[#9c8e82] text-center py-8 font-mono">
            No users found.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((u) => {
              const uId = u.ID || u.id;
              const name = u.name || u.Username || u.username || "Operator";
              const email = u.email || u.Email || "No email provided";
              const currentRole = (u.role || u.Role || "user").toLowerCase();
              const isUpdating = loadingId === uId;

              return (
                <div
                  key={uId}
                  className="bg-[#0e1113] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-medium">
                        {name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                          currentRole === "admin"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : currentRole === "driver"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {currentRole}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#9c8e82]">{email}</p>
                  </div>

                  {/* Role Promotion Action Buttons */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {currentRole !== "driver" && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateRole(uId, "driver")}
                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Truck size={12} /> Make Driver
                      </button>
                    )}
                    {currentRole !== "user" && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateRole(uId, "user")}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#9c8e82] hover:text-[#fbf9f5] border border-white/10 rounded-lg text-xs font-mono transition-colors disabled:opacity-50"
                      >
                        Demote to User
                      </button>
                    )}
                    {currentRole !== "admin" && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateRole(uId, "admin")}
                        className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Shield size={12} /> Make Admin
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
