import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { UserProfile } from "../types/thesis";
import { auth, db, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, getDoc, setDoc, serverTimestamp, FirebaseUser } from "../lib/firebase";

interface AuthPageProps { onLoginSuccess: (user: UserProfile) => void; setActiveTab: (tab: string) => void; }
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250";

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, setActiveTab }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Comparative Literature");
  const [errorMsg, setErrorMsg] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const buildProfile = async (fbUser: FirebaseUser, extraData?: { name?: string; department?: string }): Promise<UserProfile> => {
    const userRef = doc(db, "users", fbUser.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: fbUser.uid, name: data.name || fbUser.displayName || "Academic Researcher", email: fbUser.email || "",
        avatar: data.avatar || fbUser.photoURL || DEFAULT_AVATAR, role: data.role || "Literature Researcher",
        universityAffiliation: data.universityAffiliation || "", researchBranch: data.researchBranch || "Comparative Literature & Hermeneutics",
        bio: data.bio || "", orcid: data.orcid || "", savedCount: Number(data.savedCount || 0),
        theme: data.theme === "light" ? "light" : "dark",
        citationFormatPreference: ["APA", "Chicago", "BibTeX"].includes(data.citationFormatPreference) ? data.citationFormatPreference : "MLA",
      };
    }
    const profile: UserProfile = {
      id: fbUser.uid, name: extraData?.name || fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Academic Scholar"), email: fbUser.email || "",
      avatar: fbUser.photoURL || DEFAULT_AVATAR, role: "Literature Researcher", universityAffiliation: "",
      researchBranch: extraData?.department || "Comparative Literature & Hermeneutics", bio: "", orcid: "", savedCount: 0,
      theme: "dark", citationFormatPreference: "MLA",
    };
    await setDoc(userRef, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return profile;
  };

  const finishLogin = (profile: UserProfile) => {
    localStorage.setItem("thesisverse_user_profile", JSON.stringify(profile));
    onLoginSuccess(profile);
    setActiveTab("profile");
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(""); setAuthStatus("Connecting to Google through Firebase Authentication..."); setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await buildProfile(result.user);
      finishLogin(profile); setAuthStatus("Authentication successful.");
    } catch (err: any) {
      console.error("Firebase Google Auth error:", err);
      const code = err?.code || "";
      const googleMessages: Record<string, string> = {
        "auth/unauthorized-domain": "This website domain is not authorized in Firebase. Add the current Render domain to Firebase Authentication → Settings → Authorized domains.",
        "auth/popup-blocked": "The browser blocked the Google sign-in popup. Allow popups for ThesisVerse and try again.",
        "auth/popup-closed-by-user": "The Google sign-in window was closed before authentication finished.",
        "auth/cancelled-popup-request": "A Google sign-in request is already open. Please finish it or try again.",
        "auth/operation-not-allowed": "Google sign-in is disabled. Enable Google under Firebase Authentication → Sign-in providers.",
      };
      setErrorMsg(googleMessages[code] || err?.message || "Google sign-in failed. Please try again."); setAuthStatus("");
    } finally { setIsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMsg("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || (isRegisterMode && !name.trim())) { setErrorMsg("Please complete all required fields."); return; }
    setIsLoading(true); setAuthStatus(isRegisterMode ? "Creating your Firebase account..." : "Signing in with Firebase Authentication...");
    try {
      const userCred = isRegisterMode ? await createUserWithEmailAndPassword(auth, normalizedEmail, password) : await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const profile = await buildProfile(userCred.user, { name: name.trim(), department: department.trim() });
      finishLogin(profile); setAuthStatus("Authentication successful.");
    } catch (err: any) {
      console.error("Firebase Email Auth error:", err);
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
        "auth/invalid-credential": "Invalid email or password.", "auth/user-not-found": "Invalid email or password.", "auth/wrong-password": "Invalid email or password.",
        "auth/weak-password": "Password must be at least 6 characters long.", "auth/invalid-email": "Please enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Please wait and try again later.",
        "auth/operation-not-allowed": "Email/password sign-in is disabled. Enable Email/Password under Firebase Authentication → Sign-in providers.",
        "auth/network-request-failed": "Firebase could not reach the authentication service. Check your connection and try again.",
      };
      setErrorMsg(messages[err?.code] || err?.message || "Authentication failed. Please try again."); setAuthStatus("");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl tv-surface border shadow-2xl space-y-6">
      <div className="text-center space-y-2"><div className="w-12 h-12 rounded-2xl bg-[var(--tv-accent-soft)] tv-accent mx-auto flex items-center justify-center"><User className="w-6 h-6" /></div>
        <h1 className="text-2xl font-bold">{isRegisterMode ? "Create Academic Account" : "Sign in to ThesisVerse"}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Secure Firebase authentication for your research workspace.</p></div>
      {errorMsg && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold text-center">{errorMsg}</div>}
      {authStatus && <div className="p-3 rounded-xl bg-[var(--tv-accent-soft)] border border-[var(--tv-border)] tv-accent text-xs font-semibold text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>{authStatus}</span></div>}
      <button onClick={handleGoogleSignIn} disabled={isLoading} type="button" className="w-full py-3 px-4 rounded-xl bg-[var(--tv-accent)] hover:bg-[var(--tv-accent-dark)] text-[var(--tv-on-accent)] font-bold text-xs flex items-center justify-center gap-3 disabled:opacity-50"><span className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-black">G</span>Continue with Google</button>
      <div className="relative flex items-center justify-center"><div className="border-t border-[var(--tv-border)] w-full" /><span className="tv-surface px-3 text-[11px] tv-accent font-semibold uppercase tracking-wider absolute">or email</span></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegisterMode && <><div><label className="block text-xs font-bold text-[var(--tv-text)] mb-1">Full Name</label><div className="relative"><input type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={100} placeholder="Your name" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm" /><User className="w-4 h-4 tv-accent absolute left-3 top-2.5" /></div></div><div><label className="block text-xs font-bold text-[var(--tv-text)] mb-1">Research Focus</label><input type="text" value={department} onChange={e => setDepartment(e.target.value)} maxLength={120} placeholder="e.g. Comparative Literature" className="w-full px-3 py-2 rounded-xl border text-sm" /></div></>}
        <div><label className="block text-xs font-bold text-[var(--tv-text)] mb-1">Email Address</label><div className="relative"><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" maxLength={254} placeholder="you@university.edu" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm" /><Mail className="w-4 h-4 tv-accent absolute left-3 top-2.5" /></div></div>
        <div><label className="block text-xs font-bold text-[var(--tv-text)] mb-1">Password</label><div className="relative"><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={isRegisterMode ? "new-password" : "current-password"} minLength={6} maxLength={128} placeholder="••••••••" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm" /><Lock className="w-4 h-4 tv-accent absolute left-3 top-2.5" /></div></div>
        <button type="submit" disabled={isLoading} className="w-full py-2.5 rounded-xl bg-[var(--tv-accent)] hover:bg-[var(--tv-accent-dark)] text-[var(--tv-on-accent)] font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50">{isRegisterMode ? "Create Account" : "Sign In"}<ArrowRight className="w-4 h-4" /></button>
      </form>
      <div className="text-center pt-2"><button onClick={() => { setIsRegisterMode(v => !v); setErrorMsg(""); setAuthStatus(""); }} className="text-xs tv-accent hover:underline font-semibold">{isRegisterMode ? "Already have an account? Sign in" : "Don't have an account? Register here"}</button></div>
      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400"><ShieldCheck className="w-3.5 h-3.5 tv-accent" /><span>Firebase Authentication + owner-scoped Firestore</span></div>
    </div>
  );
};
