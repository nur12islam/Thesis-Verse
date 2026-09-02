import React, { useEffect, useState } from "react";
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, Github, LogOut, CheckCircle2 } from "lucide-react";
import { UserProfile } from "../types/thesis";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  FirebaseUser
} from "../lib/firebase";

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  setActiveTab: (tab: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, setActiveTab }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("Comparative Literature");
  const [errorMsg, setErrorMsg] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper to sync Firebase Auth user to Firestore and local UserProfile
  const syncFirebaseUserToFirestore = async (fbUser: FirebaseUser, extraData?: { name?: string; department?: string }): Promise<UserProfile> => {
    try {
      const userRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        const userProfile: UserProfile = {
          id: fbUser.uid,
          name: data.name || fbUser.displayName || "Academic Researcher",
          email: fbUser.email || "",
          avatar: data.avatar || fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          role: data.role || "Literature Researcher",
          universityAffiliation: data.universityAffiliation || "University of Edinburgh",
          researchBranch: data.researchBranch || "Comparative Literature & Hermeneutics",
          bio: data.bio || "Focusing on comparative literature analysis, textual hermeneutics, and manuscript history.",
          orcid: data.orcid || "0000-0003-9182-1029",
          savedCount: data.savedCount || 3,
          theme: (data.theme as "dark" | "light") || "dark",
          citationFormatPreference: (data.citationFormatPreference as "MLA" | "APA" | "Chicago" | "BibTeX") || "MLA",
        };
        return userProfile;
      } else {
        const newUserProfile: UserProfile = {
          id: fbUser.uid,
          name: extraData?.name || fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Academic Scholar"),
          email: fbUser.email || "",
          avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
          role: "Literature Researcher",
          universityAffiliation: "University of Edinburgh",
          researchBranch: extraData?.department || "Comparative Literature & Hermeneutics",
          bio: "Focusing on comparative literature analysis, textual hermeneutics, and manuscript history.",
          orcid: "0000-0003-9182-1029",
          savedCount: 3,
          theme: "dark",
          citationFormatPreference: "MLA",
        };

        await setDoc(userRef, {
          ...newUserProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return newUserProfile;
      }
    } catch (err) {
      console.warn("Firestore sync warning:", err);
      // Fallback in-memory profile if Firestore permissions or offline
      return {
        id: fbUser.uid,
        name: extraData?.name || fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Academic Scholar"),
        email: fbUser.email || "",
        avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        role: "Literature Researcher",
        universityAffiliation: "University of Edinburgh",
        researchBranch: extraData?.department || "Comparative Literature & Hermeneutics",
        bio: "Focusing on comparative literature analysis, textual hermeneutics, and manuscript history.",
        orcid: "0000-0003-9182-1029",
        savedCount: 3,
        theme: "dark",
        citationFormatPreference: "MLA",
      };
    }
  };

  // Listen for postMessage from Server OAuth Callback if popup fallback is triggered
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "OAUTH_AUTH_SUCCESS") {
        const user: UserProfile = event.data.user;
        setAuthStatus(`Successfully authenticated via ${event.data.provider.toUpperCase()}!`);
        localStorage.setItem("thesisverse_user_profile", JSON.stringify(user));
        setTimeout(() => {
          onLoginSuccess(user);
          setActiveTab("profile");
        }, 800);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLoginSuccess, setActiveTab]);

  // Handle Firebase Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setAuthStatus("Connecting to Google Firebase Authentication...");
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      setAuthStatus(`Welcome, ${fbUser.displayName || fbUser.email}! Syncing academic profile...`);
      const userProfile = await syncFirebaseUserToFirestore(fbUser);

      localStorage.setItem("thesisverse_user_profile", JSON.stringify(userProfile));
      setTimeout(() => {
        onLoginSuccess(userProfile);
        setActiveTab("profile");
      }, 600);
    } catch (err: any) {
      console.warn("Firebase Google popup error, attempting popup window fallback:", err);
      // If popup was blocked or iframe restriction occurs, trigger backend OAuth callback window
      if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user" || err.message?.includes("popup")) {
        triggerOAuthPopup("google");
      } else {
        setErrorMsg(err.message || "Failed to sign in with Google Firebase Auth.");
        setAuthStatus("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Popup window fallback for GitHub/OAuth
  const triggerOAuthPopup = async (provider: "google" | "github") => {
    try {
      setAuthStatus(`Opening ${provider.toUpperCase()} single sign-on popup...`);
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const popup = window.open(
        `/auth/callback?provider=${provider}`,
        `ThesisVerse_OAuth_${provider}`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        setErrorMsg("Popup blocked by browser. Please allow popups for single sign-on.");
        setAuthStatus("");
      }
    } catch (err) {
      console.error("OAuth trigger error:", err);
      setErrorMsg("Failed to open OAuth sign-in window.");
      setAuthStatus("");
    }
  };

  // Handle Email/Password Registration or Sign-In via Firebase Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegisterMode && !name)) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);
    setAuthStatus(isRegisterMode ? "Creating Firebase Academic Account..." : "Signing in with Firebase Auth...");

    try {
      let fbUser: FirebaseUser;

      if (isRegisterMode) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = userCred.user;
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        fbUser = userCred.user;
      }

      const userProfile = await syncFirebaseUserToFirestore(fbUser, { name, department });
      localStorage.setItem("thesisverse_user_profile", JSON.stringify(userProfile));

      setAuthStatus("Authentication successful!");
      setTimeout(() => {
        onLoginSuccess(userProfile);
        setActiveTab("profile");
      }, 600);
    } catch (err: any) {
      console.error("Firebase Email Auth error:", err);
      let message = err.message || "Authentication failed.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email address is already registered. Please sign in instead.";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Invalid email or password credentials.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/operation-not-allowed") {
        message = "Email/Password sign-in is disabled in this Firebase project console. Please click 'Sign in with Google' above to authenticate instantly with Google OAuth.";
      }
      setErrorMsg(message);
      setAuthStatus("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {isRegisterMode ? "Create Academic Account" : "Academic Single Sign-On"}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isRegisterMode
            ? "Join researchers searching, comparing, and discovering literary thesis gaps"
            : "Sign in with Firebase Google Authentication or your institutional email"}
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
          {errorMsg}
        </div>
      )}

      {authStatus && (
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold text-center animate-pulse flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-500 animate-spin" />
          <span>{authStatus}</span>
        </div>
      )}

      {/* Real Firebase Google & GitHub OAuth Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
        >
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <span>Sign in with Google (Recommended)</span>
        </button>

        <button
          onClick={() => triggerOAuthPopup("github")}
          disabled={isLoading}
          type="button"
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-sm border border-slate-700 disabled:opacity-50"
        >
          <Github className="w-4 h-4 text-white" />
          Continue with GitHub OAuth
        </button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider absolute">
          or email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegisterMode && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Alex Rivera"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Literary Branch / Focus
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Comparative Literature, Medieval Poetry"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Institutional Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@university.edu"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isRegisterMode ? "Complete Registration" : "Sign In"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setErrorMsg("");
          }}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
        >
          {isRegisterMode
            ? "Already have an account? Sign in"
            : "Don't have an account? Register here"}
        </button>
      </div>

      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Firebase Auth & Firestore Sync Active</span>
      </div>
    </div>
  );
};
