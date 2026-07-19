import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Files, Trash2, UploadCloud, ArrowUpRight } from "lucide-react";
import * as api from "../api/endpoints";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import StorageGauge from "../components/ui/StorageGauge";
import { FileIcon } from "../components/ui/FileTypeBadge";
import { formatBytes, formatDate } from "../utils/format";
import EmptyState from "../components/ui/EmptyState";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    api
      .getDashboard()
      .then(({ data }) => mounted && setData(data))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Couldn't load dashboard.")
      )
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = (data?.user?.name || user?.name || "there").split(" ")[0];

  const stats = [
    {
      label: "Total files",
      value: data?.summary?.totalFiles ?? "—",
      icon: Files,
      color: "bg-cobalt-soft text-cobalt",
      to: "/files",
    },
    {
      label: "In trash",
      value: data?.summary?.trashedFiles ?? "—",
      icon: Trash2,
      color: "bg-coral-soft text-coral",
      to: "/trash",
    },
    {
      label: "Plan",
      value: data?.user?.plan ? data.user.plan : "free",
      icon: UploadCloud,
      color: "bg-mint-soft text-mint",
      capitalize: true,
      to: "/settings",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <div>
        <h2 className="font-display font-semibold text-2xl text-ink">
          Hey {firstName} 👋
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Here's what's happening in your vault.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Storage card */}
        <div className="bg-surface rounded-xl2 shadow-card p-6 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-ink-muted mb-4 self-start uppercase tracking-wide">
            Storage
          </p>
          {loading ? (
            <div className="w-32 h-32 rounded-full bg-paper animate-pulse" />
          ) : (
            <StorageGauge
              usedBytes={data?.storage?.usedBytes || 0}
              limitBytes={data?.storage?.limitBytes || 1}
            />
          )}
          <Link
            to="/files"
            className="mt-4 text-xs font-medium text-cobalt hover:underline flex items-center gap-1"
          >
            Manage files <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((s) => (
            <Link
              to={s.to}
              key={s.label}
              className="bg-surface rounded-xl2 shadow-card p-5 flex flex-col gap-3 hover:shadow-pop transition-shadow"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={17} />
              </div>
              <div>
                <p
                  className={`font-display font-semibold text-xl text-ink ${
                    s.capitalize ? "capitalize" : ""
                  }`}
                >
                  {loading ? "···" : s.value}
                </p>
                <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
              </div>
            </Link>
          ))}

          <div className="sm:col-span-3 bg-surface rounded-xl2 shadow-card p-5">
            <p className="text-xs font-medium text-ink-muted mb-3 uppercase tracking-wide">
              Recent activity
            </p>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-paper rounded-lg animate-pulse" />
                ))}
              </div>
            ) : data?.recentFiles?.length ? (
              <ul className="divide-y divide-line">
                {data.recentFiles.map((f) => (
                  <li key={f._id} className="flex items-center gap-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-paper flex items-center justify-center shrink-0">
                      <FileIcon mimeType={f.mimeType} size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">
                        {f.originalName}
                      </p>
                      <p className="text-xs text-ink-faint font-mono">
                        {formatBytes(f.fileSize)} · {formatDate(f.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={UploadCloud}
                title="No files yet"
                description="Upload your first file to see it here."
                action={
                  <Link
                    to="/files"
                    className="text-sm font-medium bg-cobalt text-white px-4 py-2 rounded-lg hover:bg-cobalt-deep transition-colors"
                  >
                    Go to My Files
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
