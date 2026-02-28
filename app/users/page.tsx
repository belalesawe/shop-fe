import { getUsers } from "@/lib/api";
import type { User } from "@/types/user";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users: User[] = [];
  let error: string | null = null;

  try {
    users = await getUsers();
  } catch (e) {
    error =
      e instanceof Error ? e.message : "Failed to load users";
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Users
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No users found.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-zinc-900 dark:text-zinc-50 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
