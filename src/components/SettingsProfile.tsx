import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAccountLogic, { usesPassword } from "../hooks/useAccountLogic";
import { SettingsSection } from "./SettingsSection";
import { Field, StatusNote, fieldInput } from "./FormControls";
import type { AppUser } from "../types/user";

interface SettingsProfileProps {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser | null) => void;
}

const CONFIRM_PHRASE = "delete my account";

const SettingsProfile = ({ currentUser, setCurrentUser }: SettingsProfileProps) => {
  const navigate = useNavigate();
  const {
    nameState,
    emailState,
    passwordState,
    deleteState,
    changeDisplayName,
    changeEmail,
    changePassword,
    deleteAccount,
  } = useAccountLogic({ setCurrentUser });

  const [displayName, setDisplayName] = useState(currentUser.displayName ?? "");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePhrase, setDeletePhrase] = useState("");

  const hasPassword = usesPassword();
  const passwordsMatch = newPassword === confirmPassword;
  const canDelete = deletePhrase.trim().toLowerCase() === CONFIRM_PHRASE;

  /** Google-only accounts re-authenticate through a popup, not a password box. */
  const reauthHint = hasPassword
    ? undefined
    : "You signed in with Google, so this opens a Google window to confirm.";

  const handleDelete = async () => {
    const gone = await deleteAccount(deletePassword);
    if (gone) navigate("/");
  };

  return (
    <div className="flex flex-col gap-4">
      <SettingsSection
        title="Display name"
        description="Shown on your profile and to anyone you share a note with."
      >
        <Field label="Name" htmlFor="account-name">
          <input
            id="account-name"
            type="text"
            className={fieldInput}
            value={displayName}
            placeholder="Your name"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Field>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={
              nameState.status === "working" ||
              displayName.trim() === (currentUser.displayName ?? "")
            }
            onClick={() => changeDisplayName(displayName)}
          >
            {nameState.status === "working" ? "Saving..." : "Save name"}
          </button>
          <StatusNote state={nameState} />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Email address"
        description={`Currently ${currentUser.email ?? "unknown"}. Changing it sends a confirmation link to the new address.`}
      >
        <Field label="New email" htmlFor="account-email">
          <input
            id="account-email"
            type="email"
            className={fieldInput}
            value={newEmail}
            placeholder="you@example.com"
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </Field>
        {hasPassword && (
          <Field
            label="Current password"
            htmlFor="account-email-password"
            hint={reauthHint}
          >
            <input
              id="account-email-password"
              type="password"
              autoComplete="current-password"
              className={fieldInput}
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
            />
          </Field>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={emailState.status === "working" || !newEmail.trim()}
            onClick={() => changeEmail(emailPassword, newEmail)}
          >
            {emailState.status === "working" ? "Sending..." : "Send confirmation"}
          </button>
          <StatusNote state={emailState} />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Password"
        description={
          hasPassword
            ? "Choose something at least six characters long."
            : "Your account signs in with Google and has no password to change."
        }
      >
        {hasPassword ? (
          <>
            <Field label="Current password" htmlFor="account-current-password">
              <input
                id="account-current-password"
                type="password"
                autoComplete="current-password"
                className={fieldInput}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>
            <Field label="New password" htmlFor="account-new-password">
              <input
                id="account-new-password"
                type="password"
                autoComplete="new-password"
                className={fieldInput}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>
            <Field
              label="Confirm new password"
              htmlFor="account-confirm-password"
              hint={
                confirmPassword && !passwordsMatch
                  ? "These two do not match yet."
                  : undefined
              }
            >
              <input
                id="account-confirm-password"
                type="password"
                autoComplete="new-password"
                className={fieldInput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={
                  passwordState.status === "working" ||
                  !currentPassword ||
                  !newPassword ||
                  !passwordsMatch
                }
                onClick={() => changePassword(currentPassword, newPassword)}
              >
                {passwordState.status === "working"
                  ? "Changing..."
                  : "Change password"}
              </button>
              <StatusNote state={passwordState} />
            </div>
          </>
        ) : (
          <p className="text-sm opacity-65">
            Manage it from your Google account instead.
          </p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Delete account"
        description="Removes your notes, your profile and your sign-in. This cannot be undone."
        danger
      >
        <Field
          label={`Type "${CONFIRM_PHRASE}" to confirm`}
          htmlFor="account-delete-phrase"
        >
          <input
            id="account-delete-phrase"
            type="text"
            className={fieldInput}
            value={deletePhrase}
            placeholder={CONFIRM_PHRASE}
            onChange={(e) => setDeletePhrase(e.target.value)}
          />
        </Field>
        {hasPassword && (
          <Field
            label="Current password"
            htmlFor="account-delete-password"
            hint={reauthHint}
          >
            <input
              id="account-delete-password"
              type="password"
              autoComplete="current-password"
              className={fieldInput}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          </Field>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-error btn-sm"
            disabled={
              !canDelete ||
              deleteState.status === "working" ||
              (hasPassword && !deletePassword)
            }
            onClick={handleDelete}
          >
            {deleteState.status === "working"
              ? "Deleting..."
              : "Delete my account"}
          </button>
          <StatusNote state={deleteState} />
        </div>
      </SettingsSection>
    </div>
  );
};

export default SettingsProfile;
