"use client";

import { KeyRound, Trash2, Upload, User } from "lucide-react";
import {
  dateFormatOptions,
  themeOptions,
  timezoneOptions,
} from "../../data";
import {
  Field,
  GhostButton,
  PrimaryButton,
  SelectInput,
  SettingCard,
  SettingRow,
  TextInput,
} from "../form-controls";

const AccountSection = () => (
  <div className="space-y-4">
    <SettingCard
      icon={User}
      title="Profile"
      description="Your identity and display preferences"
      footer={
        <>
          <GhostButton>Cancel</GhostButton>
          <PrimaryButton>Save changes</PrimaryButton>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-md bg-sf-blue text-lg font-semibold text-white"
        >
          RN
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-sf-text">Profile picture</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <GhostButton>
              <span className="inline-flex items-center gap-1.5">
                <Upload className="size-3.5" />
                Upload image
              </span>
            </GhostButton>
            <button
              type="button"
              className="h-9 rounded-md px-3 text-[13px] font-medium text-sf-text-muted transition-colors hover:text-sf-text"
            >
              Remove
            </button>
          </div>
          <p className="mt-1.5 text-xs text-sf-text-muted">
            PNG or JPG, at least 256×256px. Shown in the app and on emails.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Display name">
          <TextInput defaultValue="Rahul Nayak" />
        </Field>
        <Field label="Email">
          <TextInput type="email" defaultValue="rahul@statusforge.io" />
        </Field>
        <Field label="Default timezone" hint="reports & windows">
          <SelectInput defaultValue="(UTC+05:30) India Standard Time">
            {timezoneOptions.map((tz) => (
              <option key={tz}>{tz}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Date & time format">
          <SelectInput defaultValue={dateFormatOptions[0]}>
            {dateFormatOptions.map((format) => (
              <option key={format}>{format}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Theme">
          <SelectInput defaultValue="Match system">
            {themeOptions.map((theme) => (
              <option key={theme}>{theme}</option>
            ))}
          </SelectInput>
        </Field>
      </div>
    </SettingCard>

    <SettingCard
      icon={KeyRound}
      title="Password"
      description="Change the password used to sign in"
      footer={<PrimaryButton>Update password</PrimaryButton>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Current password">
            <TextInput type="password" autoComplete="current-password" />
          </Field>
        </div>
        <Field label="New password">
          <TextInput type="password" autoComplete="new-password" />
        </Field>
        <Field label="Confirm new password">
          <TextInput type="password" autoComplete="new-password" />
        </Field>
      </div>
    </SettingCard>

    <SettingCard
      icon={Trash2}
      title="Danger zone"
      description="Irreversible and destructive actions"
    >
      <SettingRow
        label="Delete account"
        description="Permanently delete your account, all monitors, incidents, and history."
        tone="danger"
      >
        <GhostButton className="border-sf-red-border text-sf-red hover:border-sf-red">
          <span className="inline-flex items-center gap-1.5">
            <Trash2 className="size-3.5" />
            Delete
          </span>
        </GhostButton>
      </SettingRow>
    </SettingCard>
  </div>
);

export default AccountSection;
