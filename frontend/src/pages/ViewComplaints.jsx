import { useEffect, useState, useMemo, useRef } from "react";
import { issueApi } from "../api/issueApi";
import { useAuth } from "../context/AuthContext";

/* Config  */
const STATUS = {
    received: { label: "Received", bg: "#e8f0fe", color: "#1a56db", dot: "#1a56db", step: 1 },
    in_review: { label: "In Review", bg: "#fef3c7", color: "#92400e", dot: "#f59e0b", step: 2 },
    in_progress: { label: "In Progress", bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6", step: 3 },
    resolved: { label: "Resolved", bg: "#d1fae5", color: "#065f46", dot: "#10b981", step: 4 },
    closed: { label: "Closed", bg: "#fee2e2", color: "#991b1b", dot: "#ef4444", step: 5 },
};

const STATUS_STEPS = Object.entries(STATUS).map(([key, v]) => ({ key, ...v }));

/* SVG Icons  */
const Icons = {
    Road: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L8 22M16 2l4 20M4 8h16M4 16h16" />
        </svg>
    ),
    Safety: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
        </svg>
    ),
    Sanitation: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    ),
    Water: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6 10 4 14 4 17a8 8 0 0 0 16 0c0-3-2-7-8-15z" />
        </svg>
    ),
    Electricity: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
    Other: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 12h6M12 9v6" />
        </svg>
    ),
    Pin: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Clock: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
    ),
    Chat: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Search: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
    ),
    ChevronDown: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
        </svg>
    ),
    Close: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    ),
    Send: (p) => (
        <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
    ),
    ThumbUp: ({ filled, ...p }) => (
        <svg {...p} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
    ),
    ThumbDown: ({ filled, ...p }) => (
        <svg {...p} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
            <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
    ),
    Inbox: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
    Eye: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    Gear: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    Check: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    Lock: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
};

const TYPE_ICONS_MAP = {
    "Road Infrastructure": Icons.Road,
    "Public Safety": Icons.Safety,
    "Sanitation": Icons.Sanitation,
    "Water Supply": Icons.Water,
    "Electricity": Icons.Electricity,
    "Other": Icons.Other,
};

const STATUS_STEP_ICONS = [Icons.Inbox, Icons.Eye, Icons.Gear, Icons.Check, Icons.Lock];

const fDate = (iso) => {
    if (!iso) return "—";
    const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    const days = Math.floor(diff / 86400);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const fDateTime = (iso) => iso
    ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

/* ─── Toast  */
function Toast({ msg, type = "info", onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
    const clr = { success: "#16a34a", error: "#dc2626", info: "#2563eb" }[type] ?? "#2563eb";
    return (
        <div style={{
            position: "fixed", top: 18, right: 18, zIndex: 9999,
            background: "#fff", border: `1.5px solid ${clr}33`, color: clr,
            borderRadius: 10, padding: "10px 16px", fontWeight: 600, fontSize: 13,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontFamily: "system-ui, sans-serif",
            animation: "toastIn .3s ease",
        }}>{msg}</div>
    );
}

/* ─── Status Badge  */
function StatusBadge({ status }) {
    const s = STATUS[status] ?? STATUS.received;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
            background: s.bg, color: s.color, whiteSpace: "nowrap",
            fontFamily: "system-ui, sans-serif",
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
            {s.label}
        </span>
    );
}

/* ─── Progress Tracker (read-only for users)  */
function ProgressTracker({ status }) {
    const curStep = STATUS[status]?.step ?? 1;
    const accent = STATUS[status]?.color ?? "#1a56db";
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Complaint Progress
                </span>
                <StatusBadge status={status} />
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
                <div style={{ position: "absolute", left: 14, right: 14, top: 13, height: 2, background: "#e5e7eb", zIndex: 0 }} />
                <div style={{
                    position: "absolute", left: 14, top: 13, height: 2, zIndex: 1,
                    background: accent, transition: "width .6s ease",
                    width: `calc(${((curStep - 1) / (STATUS_STEPS.length - 1)) * 100}% - 8px)`,
                }} />
                {STATUS_STEPS.map((step, i) => {
                    const done = i + 1 <= curStep;
                    const active = i + 1 === curStep;
                    const StepIcon = STATUS_STEP_ICONS[i];
                    return (
                        <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                border: `2px solid ${done ? accent : "#d1d5db"}`,
                                background: active ? accent : done ? "#eff6ff" : "#fff",
                                color: active ? "#fff" : done ? accent : "#d1d5db",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all .25s",
                                boxShadow: active ? `0 0 0 3px ${accent}22` : "none",
                            }}>
                                <StepIcon width={12} height={12} />
                            </div>
                            <span style={{
                                marginTop: 5, fontSize: 9, fontWeight: 600, textAlign: "center",
                                color: active ? accent : done ? "#4b5563" : "#d1d5db",
                                maxWidth: 52, lineHeight: 1.3,
                            }}>{step.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Voting  */
function VotingPanel({ itemId, votes, onVote, userVote }) {
    const { upvotes = 0, downvotes = 0 } = votes;
    const total = upvotes + downvotes;
    const pct = total > 0 ? Math.round((upvotes / total) * 100) : 50;
    const net = upvotes - downvotes;

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, background: "#fafafa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Community Vote
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: net > 0 ? "#16a34a" : net < 0 ? "#dc2626" : "#9ca3af" }}>
                    {net > 0 ? "+" : ""}{net} net
                </span>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {[
                    { dir: "up", count: upvotes, active: userVote === "up", activeClr: "#16a34a", activeBg: "#f0fdf4", activeBorder: "#86efac", label: "Upvote" },
                    { dir: "down", count: downvotes, active: userVote === "down", activeClr: "#dc2626", activeBg: "#fff1f2", activeBorder: "#fca5a5", label: "Downvote" },
                ].map(({ dir, label, count, active, activeClr, activeBg, activeBorder }) => (
                    <button key={dir} onClick={() => onVote(itemId, dir)} style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        padding: "14px 0", borderRadius: 10,
                        border: `1.5px solid ${active ? activeBorder : "#e5e7eb"}`,
                        background: active ? activeBg : "#fff",
                        color: active ? activeClr : "#9ca3af",
                        cursor: "pointer", transition: "all .18s",
                    }}>
                        {dir === "up"
                            ? <Icons.ThumbUp filled={active} width={18} height={18} />
                            : <Icons.ThumbDown filled={active} width={18} height={18} />
                        }
                        <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{count}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {active ? "Voted ✓" : label}
                        </span>
                    </button>
                ))}
            </div>
            <div style={{ height: 5, borderRadius: 999, background: "#fee2e2", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#22c55e", width: `${pct}%`, borderRadius: 999, transition: "width .6s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, fontWeight: 600 }}>
                <span style={{ color: "#16a34a" }}>{pct}% support</span>
                <span style={{ color: "#9ca3af" }}>{total} votes</span>
            </div>
        </div>
    );
}

/* ─── Comments  */
function CommentSection({ itemId, comments, onAddComment }) {
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [busy, setBusy] = useState(false);
    const endRef = useRef(null);

    const submit = async () => {
        if (!text.trim()) return;
        setBusy(true);
        await onAddComment(itemId, name.trim() || "Anonymous", text.trim());
        setText(""); setBusy(false);
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    };

    const field = {
        width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb",
        borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#374151",
        outline: "none", fontFamily: "system-ui, sans-serif", boxSizing: "border-box",
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Icons.Chat width={14} height={14} stroke="#6b7280" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Comments</span>
                <span style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 99, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{comments.length}</span>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <input placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)}
                    style={{ ...field, marginBottom: 8 }} />
                <textarea rows={3} placeholder="Write a comment…"
                    value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && e.ctrlKey && submit()}
                    style={{ ...field, resize: "none", lineHeight: 1.6 }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <button onClick={submit} disabled={!text.trim() || busy} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 8, border: "none",
                        background: text.trim() && !busy ? "#2563eb" : "#e5e7eb",
                        color: text.trim() && !busy ? "#fff" : "#9ca3af",
                        fontSize: 12, fontWeight: 700, cursor: text.trim() && !busy ? "pointer" : "not-allowed",
                        transition: "all .2s",
                    }}>
                        <Icons.Send width={12} height={12} />
                        Post Comment
                    </button>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {comments.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "#d1d5db", fontSize: 13 }}>
                        No comments yet. Start the discussion!
                    </div>
                ) : comments.map((c, i) => (
                    <div key={c.id} ref={i === comments.length - 1 ? endRef : null}
                        style={{
                            background: c.isOwn ? "#eff6ff" : "#f9fafb",
                            border: `1px solid ${c.isOwn ? "#bfdbfe" : "#e5e7eb"}`,
                            borderRadius: 8, padding: "10px 12px",
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: "50%",
                                    background: c.isOwn ? "#2563eb" : "#e5e7eb",
                                    color: c.isOwn ? "#fff" : "#6b7280",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, fontWeight: 800,
                                }}>{(c.user ?? "A")[0].toUpperCase()}</div>
                                <span style={{ fontSize: 12, fontWeight: 700, color: c.isOwn ? "#2563eb" : "#374151" }}>
                                    {c.isOwn ? "You" : c.user}
                                </span>
                            </div>
                            <span style={{ fontSize: 10, color: "#9ca3af" }}>{fDateTime(c.time)}</span>
                        </div>
                        <p style={{ margin: 0, paddingLeft: 30, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{c.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Detail Drawer  */
function Drawer({ complaint, votes, userVote, comments, onVote, onComment, onClose }) {
    if (!complaint) return null;
    const cat = complaint.category ?? "Other";
    const TypeIcon = TYPE_ICONS_MAP[cat] ?? Icons.Other;
    const accent = STATUS[complaint.status]?.color ?? "#2563eb";

    return (
        <>
            <div onClick={onClose} style={{
                position: "fixed", inset: 0, zIndex: 40,
                background: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)",
                animation: "fadeBg .2s ease",
            }} />
            <div style={{
                position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 50,
                width: "100%", maxWidth: 640, background: "#fff",
                boxShadow: "-4px 0 40px rgba(0,0,0,0.12)",
                display: "flex", flexDirection: "column",
                animation: "slideIn .3s ease",
                fontFamily: "system-ui, sans-serif",
            }}>
                <div style={{ height: 3, background: accent, flexShrink: 0 }} />

                {/* Header */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8,
                                    background: "#f3f4f6", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    color: "#6b7280", flexShrink: 0,
                                }}>
                                    <TypeIcon width={15} height={15} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>{cat}</span>
                                <StatusBadge status={complaint.status} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>
                                {complaint.title}
                            </h2>
                            <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 11, color: "#9ca3af", flexWrap: "wrap" }}>
                                {(complaint.address || complaint.location) && (
                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <Icons.Pin width={11} height={11} />
                                        {complaint.address || complaint.location}
                                    </span>
                                )}
                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <Icons.Clock width={11} height={11} />
                                    {fDate(complaint.createdAt)}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb",
                            background: "#f9fafb", cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center", color: "#6b7280", flexShrink: 0,
                        }}>
                            <Icons.Close width={14} height={14} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {complaint.description && (
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Description</p>
                            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.75 }}>{complaint.description}</p>
                        </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                        {[
                            { label: "ID", value: complaint._id, mono: true },
                            { label: "Priority", value: complaint.priority ?? "Normal" },
                            { label: "Category", value: cat },
                            { label: "Filed", value: fDate(complaint.createdAt) },
                            { label: "Updated", value: fDate(complaint.updatedAt ?? complaint.createdAt) },
                        ].map(({ label, value, mono }) => (
                            <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 8, padding: "8px 10px" }}>
                                <p style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 2px" }}>{label}</p>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: mono ? "monospace" : "inherit" }}>
                                    {value || "—"}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Progress — read only */}
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
                        <ProgressTracker status={complaint.status} />
                    </div>

                    <VotingPanel itemId={complaint._id} votes={votes} onVote={onVote} userVote={userVote} />

                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
                        <CommentSection itemId={complaint._id} comments={comments} onAddComment={onComment} />
                    </div>
                </div>
            </div>
        </>
    );
}

/* ─── Complaint Card  */
function ComplaintCard({ complaint, votes, userVote, commentCount, onOpen, onVote }) {
    const cat = complaint.category ?? "Other";
    const TypeIcon = TYPE_ICONS_MAP[cat] ?? Icons.Other;
    const [hov, setHov] = useState(false);

    return (
        <div
            onClick={() => onOpen(complaint)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "#fff",
                // Upgraded border colors to match the new crisp header inputs
                border: `1px solid ${hov ? "#94a3b8" : "#e2e8f0"}`,
                borderRadius: 12, padding: "18px 20px",
                cursor: "pointer", display: "flex", flexDirection: "column", gap: 10,
                transition: "all .2s ease",
                boxShadow: hov ? "0 4px 16px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.03)",
                fontFamily: "system-ui, sans-serif",
            }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 1,
                        background: "#f8fafc", border: "1px solid #f1f5f9", // Slight inner styling
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b",
                    }}>
                        <TypeIcon width={16} height={16} />
                    </div>
                    <h3 style={{
                        margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a",
                        lineHeight: 1.35, wordBreak: "break-word",
                    }}>{complaint.title}</h3>
                </div>
                <div style={{ flexShrink: 0 }}>
                    <StatusBadge status={complaint.status} />
                </div>
            </div>

            {complaint.description && (
                <p style={{
                    margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.65,
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>{complaint.description}</p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                {(complaint.address || complaint.location) && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Icons.Pin width={12} height={12} />
                        {complaint.address || complaint.location}
                    </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icons.Clock width={12} height={12} />
                    {fDate(complaint.createdAt)}
                </span>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 4 }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => onVote(complaint._id, "up")} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 10px",
                    borderRadius: 8, border: `1px solid ${userVote === "up" ? "#86efac" : "#e2e8f0"}`,
                    background: userVote === "up" ? "#f0fdf4" : "#f8fafc",
                    color: userVote === "up" ? "#16a34a" : "#64748b",
                    fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                }}>
                    <Icons.ThumbUp filled={userVote === "up"} width={14} height={14} />
                    {votes.upvotes ?? 0}
                </button>

                <button onClick={() => onVote(complaint._id, "down")} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 10px",
                    borderRadius: 8, border: `1px solid ${userVote === "down" ? "#fca5a5" : "#e2e8f0"}`,
                    background: userVote === "down" ? "#fff1f2" : "#f8fafc",
                    color: userVote === "down" ? "#dc2626" : "#64748b",
                    fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                }}>
                    <Icons.ThumbDown filled={userVote === "down"} width={14} height={14} />
                    {votes.downvotes ?? 0}
                </button>

                <button onClick={() => onOpen(complaint)} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 10px",
                    borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc",
                    color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all .15s", marginLeft: "auto",
                }}>
                    <Icons.Chat width={14} height={14} />
                    {commentCount}
                </button>
            </div>
        </div>
    );
}

/* ─── Skeleton  */
function Skel() {
    return (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ height: 16, width: "65%", borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.4s ease infinite" }} />
                <div style={{ height: 22, width: 70, borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.4s ease infinite" }} />
            </div>
            {[100, 80].map((w, i) => (
                <div key={i} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.4s ease infinite" }} />
            ))}
            <div style={{ height: 1, background: "#f1f5f9" }} />
            <div style={{ display: "flex", gap: 8 }}>
                {[50, 50, 110].map((w, i) => (
                    <div key={i} style={{ height: 30, width: w, borderRadius: 6, background: "#f1f5f9", animation: "pulse 1.4s ease infinite" }} />
                ))}
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function ViewComplaints() {

    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilter] = useState("all");
    const [filterCat, setFilterCat] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selected, setSelected] = useState(null);
    const [voteData, setVoteData] = useState({});
    const [userVotes, setUserVotes] = useState({});
    const [commentData, setComments] = useState({});
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "info") => setToast({ msg, type });

    useEffect(() => {
        (async () => {
            try {
                const { data } =user?.role === "admin"
                ? await issueApi.getAllIssues()
                : await issueApi.getMyIssues();
                setComplaints(data);
                const v = {}, c = {}, u = {};
                data.forEach(d => {
                    v[d._id] = { upvotes: d.upvotes ?? 0, downvotes: d.downvotes ?? 0 };
                    u[d._id] = d.userVote ?? null;
                    c[d._id] = (d.comments ?? []).map((cm, i) => ({
                        id: cm._id ?? i,
                        user: cm.userName ?? cm.user ?? "Anonymous",
                        text: cm.text ?? cm.comment ?? "",
                        time: cm.createdAt ?? cm.time ?? new Date().toISOString(),
                        isOwn: cm.userName || cm.user ? false : true,
                    }));
                });
                setVoteData(v);
                setUserVotes(u);
                setComments(c);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    const categories = useMemo(() =>
        ["all", ...new Set(complaints.map(c => c.category).filter(Boolean))], [complaints]);

    const filtered = useMemo(() => {
        let list = [...complaints];
        if (filterStatus !== "all") list = list.filter(c => c.status === filterStatus);
        if (filterCat !== "all") list = list.filter(c => c.category === filterCat);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                c.title?.toLowerCase().includes(q) ||
                c.description?.toLowerCase().includes(q) ||
                c.address?.toLowerCase().includes(q)
            );
        }
        list.sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === "mostVotes") {
                const va = (voteData[a._id]?.upvotes ?? 0) - (voteData[a._id]?.downvotes ?? 0);
                const vb = (voteData[b._id]?.upvotes ?? 0) - (voteData[b._id]?.downvotes ?? 0);
                return vb - va;
            }
            return 0;
        });
        return list;
    }, [complaints, filterStatus, filterCat, search, sortBy, voteData]);

    const openComplaint = async (complaint) => {
        setSelected(complaint);

        try {
            const { data } = await issueApi.getIssue(complaint._id);
            const { complaint: detailed, votes, comments: serverComments } = data;

            setSelected(detailed);
            setVoteData(vd => ({
                ...vd,
                [detailed._id]: { upvotes: votes.upvotes, downvotes: votes.downvotes },
            }));
            setUserVotes(u => ({ ...u, [detailed._id]: votes.userVote }));

            const mappedComments = (serverComments ?? []).map((cm) => ({
                id: cm._id,
                user: cm.user_id?.name ?? "Anonymous",
                text: cm.content ?? "",
                time: cm.createdAt ?? new Date().toISOString(),
                isOwn: cm.user_id?.name === "You" || false,
            }));
            setComments(cd => ({ ...cd, [detailed._id]: mappedComments }));
        } catch (e) {
            console.error(e);
            showToast("Failed to load complaint details", "error");
        }
    };

    const handleVote = async (id, dir) => {
        const prev = userVotes[id] ?? null;
        const tog = prev === dir;

        // Optimistic UI update
        setUserVotes(v => ({ ...v, [id]: tog ? null : dir }));
        setVoteData(vd => {
            const cur = vd[id] ?? { upvotes: 0, downvotes: 0 };
            let { upvotes, downvotes } = cur;
            if (prev === "up") upvotes = Math.max(0, upvotes - 1);
            if (prev === "down") downvotes = Math.max(0, downvotes - 1);
            if (!tog) { if (dir === "up") upvotes++; else downvotes++; }
            return { ...vd, [id]: { upvotes, downvotes } };
        });

        try {
            const { data } = await issueApi.voteIssue(id, dir);
            setVoteData(vd => ({ ...vd, [id]: { upvotes: data.votes.upvotes, downvotes: data.votes.downvotes } }));
            setUserVotes(u => ({ ...u, [id]: data.votes.userVote }));
            showToast(data.message, tog ? "info" : dir === "up" ? "success" : "error");
        } catch (e) {
            console.error(e);
            showToast("Unable to submit vote", "error");
            // revert optimistic change
            setUserVotes(v => ({ ...v, [id]: prev }));
            setVoteData(vd => ({ ...vd }));
        }
    };

    const handleComment = async (id, user, text) => {
        try {
            const { data } = await issueApi.addComment(id, text);
            const comment = data.data;
            const mapped = {
                id: comment._id,
                user: comment.user_id?.name || "You",
                text: comment.content || "",
                time: comment.createdAt || new Date().toISOString(),
                isOwn: true,
            };
            setComments(cd => ({ ...cd, [id]: [...(cd[id] ?? []), mapped] }));
            showToast("Comment posted", "success");
        } catch (e) {
            console.error(e);
            showToast("Unable to post comment", "error");
        }
    };

    // Upgraded control styles for the header
    const selStyle = {
        background: "#f8fafc",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        padding: "9px 36px 9px 14px",
        fontSize: 13,
        fontWeight: 600,
        color: "#1e293b",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        cursor: "pointer",
        fontFamily: "system-ui, sans-serif",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        transition: "all 0.2s ease",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <style>{`
                @keyframes fadeBg  { from{opacity:0} to{opacity:1} }
                @keyframes slideIn { from{transform:translateX(100%)} to{transform:none} }
                @keyframes toastIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:none} }
                @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }

                /* Added classes for nice hover and focus states on the header controls */
                .custom-control:hover {
                    border-color: #94a3b8 !important;
                    background: #ffffff !important;
                }
                .custom-control:focus {
                    border-color: #3b82f6 !important;
                    background: #ffffff !important;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
                }
            `}</style>

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            {/* ── Page header ── */}
            <div style={{
                background: "#fff",
                borderBottom: "1px solid #e2e8f0",
                padding: "20px 32px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                position: "sticky",
                top: 0,
                zIndex: 10
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>

                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Community Reports</h1>
                        {!loading && (
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: "#eff6ff", color: "#2563eb",
                                padding: "4px 10px", borderRadius: "99px",
                                fontSize: 12, fontWeight: 700, marginTop: 8
                            }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
                                {filtered.length} complaint{filtered.length !== 1 ? "s" : ""} found
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <Icons.Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }}
                                width={14} height={14} />
                            <input className="custom-control" placeholder="Search issues..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ ...selStyle, paddingLeft: 34, paddingRight: 12, width: 200, boxSizing: "border-box" }} />
                        </div>

                        {/* Status */}
                        <div style={{ position: "relative" }}>
                            <select className="custom-control" value={filterStatus} onChange={e => setFilter(e.target.value)} style={selStyle}>
                                <option value="all">All Statuses</option>
                                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                            <Icons.ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }}
                                width={12} height={12} />
                        </div>

                        {/* Category */}
                        <div style={{ position: "relative" }}>
                            <select className="custom-control" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={selStyle}>
                                <option value="all">All Categories</option>
                                {categories.filter(c => c !== "all").map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <Icons.ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }}
                                width={12} height={12} />
                        </div>

                        {/* Sort */}
                        <div style={{ position: "relative" }}>
                            <select className="custom-control" value={sortBy} onChange={e => setSortBy(e.target.value)} style={selStyle}>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="mostVotes">Most Supported</option>
                            </select>
                            <Icons.ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }}
                                width={12} height={12} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Grid ── */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px 60px" }}>
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))", gap: 16 }}>
                        {[...Array(4)].map((_, i) => <Skel key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                        <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#4b5563" }}>No complaints found</p>
                        <p style={{ fontSize: 13, margin: "6px 0 0" }}>
                            {search || filterStatus !== "all" || filterCat !== "all"
                                ? "Try adjusting your filters"
                                : "No complaints submitted yet"}
                        </p>
                        {(search || filterStatus !== "all" || filterCat !== "all") && (
                            <button onClick={() => { setSearch(""); setFilter("all"); setFilterCat("all"); }}
                                style={{ marginTop: 14, padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "1px solid #cbd5e1", background: "#fff", color: "#1e293b", cursor: "pointer", transition: "all 0.2s" }}>
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))", gap: 16 }}>
                        {filtered.map(c => (
                            <ComplaintCard key={c._id}
                                complaint={c}
                                votes={voteData[c._id] ?? { upvotes: 0, downvotes: 0 }}
                                userVote={userVotes[c._id] ?? null}
                                commentCount={(commentData[c._id] ?? []).length}
                                onOpen={openComplaint}
                                onVote={handleVote}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Drawer ── */}
            {selected && (
                <Drawer
                    complaint={selected}
                    votes={voteData[selected._id] ?? { upvotes: 0, downvotes: 0 }}
                    userVote={userVotes[selected._id] ?? null}
                    comments={commentData[selected._id] ?? []}
                    onVote={handleVote}
                    onComment={handleComment}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}