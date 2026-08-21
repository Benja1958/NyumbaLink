"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Camera,
  MailCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";

import { useAuth } from "@/context/AuthContext";

import {
  getLandlordProfile,
  LandlordProfile,
  updateMyLandlordProfile,
  uploadLandlordProfileImage,
} from "@/lib/landlordProfile";


export default function LandlordProfilePage() {
  const {
    user,
    loading: authLoading,
    refreshUser,
  } = useAuth();

  const [
    profile,
    setProfile,
  ] = useState<LandlordProfile | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    about,
    setAbout,
  ] = useState("");


  async function loadProfile() {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await getLandlordProfile(
          user.id
        );

      setProfile(data);

      setFullName(
        data.full_name
      );

      setAbout(
        data.about ?? ""
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load landlord profile"
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (
      authLoading
    ) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    loadProfile();
  }, [
    authLoading,
    user?.id,
  ]);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile) {
      return;
    }

    try {
      setSaving(true);

        const updatedProfile =
        await updateMyLandlordProfile({
            full_name: fullName.trim(),
            about: about.trim(),
        });

        setProfile(updatedProfile);


      setFullName(
        updatedProfile.full_name
      );

      setAbout(
        updatedProfile.about ?? ""
      );

      await refreshUser();

      setEditing(false);

      toast.success(
        "Profile updated successfully"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }


  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      toast.error(
        "Please select an image file"
      );

      return;
    }

    try {
      setUploadingImage(true);

      const result =
        await uploadLandlordProfileImage(
          file
        );

      setProfile(
        (current) =>
          current
            ? {
                ...current,
                profile_image_url:
                  result.profile_image_url,
              }
            : current
      );

      await refreshUser();

      toast.success(
        "Profile photo updated"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload profile photo"
      );
    } finally {
      setUploadingImage(false);

      /*
       * Allows selecting the same
       * file again later.
       */
      event.target.value = "";
    }
  }


  function handleCancelEdit() {
    if (!profile) {
      return;
    }

    setFullName(
      profile.full_name
    );

    setAbout(
      profile.about ?? ""
    );

    setEditing(false);
  }


  if (
    authLoading ||
    loading
  ) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="animate-pulse">
            <div className="h-8 w-52 rounded bg-gray-200" />

            <div className="mt-8 rounded-2xl border bg-white p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="h-28 w-28 rounded-full bg-gray-200" />

                <div className="space-y-3">
                  <div className="h-6 w-48 rounded bg-gray-200" />
                  <div className="h-4 w-64 rounded bg-gray-200" />
                  <div className="h-4 w-40 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }


  if (!user) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">
          <ErrorState
            title="Login required"
            description="Please log in to view your landlord profile."
          />
        </main>
      </>
    );
  }


  if (
    user.role !==
    "landlord"
  ) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">
          <ErrorState
            title="Landlord account required"
            description="This page is only available to landlord accounts."
          />
        </main>
      </>
    );
  }


  if (error) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">
          <ErrorState
            title="Couldn't load your profile"
            description={error}
            onRetry={
              loadProfile
            }
          />
        </main>
      </>
    );
  }


  if (!profile) {
    return null;
  }


  const memberSince =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ).format(
      new Date(
        profile.created_at
      )
    );


  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Landlord Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your public profile and
            build trust with prospective
            tenants.
          </p>
        </div>


        {/* Main profile card */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Profile image */}
            <div className="relative shrink-0">

              {profile.profile_image_url ? (
                <img
                  src={
                    profile.profile_image_url
                  }
                  alt={
                    profile.full_name
                  }
                  className="h-28 w-28 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
                  <UserRound className="h-12 w-12 text-green-800" />
                </div>
              )}

              <label
                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gray-950 text-white shadow transition hover:bg-gray-800"
                title="Change profile photo"
              >
                <Camera className="h-4 w-4" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  disabled={
                    uploadingImage
                  }
                  className="hidden"
                />
              </label>

            </div>


            {/* Name/status */}
            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.full_name}
                </h2>

                {profile.is_verified_landlord && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                    <BadgeCheck className="h-4 w-4" />
                    Verified Landlord
                  </span>
                )}

              </div>

              <p className="mt-1 text-gray-600">
                {profile.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">

                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />

                  Member since{" "}
                  {memberSince}
                </span>

                {profile.email_verified && (
                  <span className="inline-flex items-center gap-2 text-green-700">
                    <MailCheck className="h-4 w-4" />

                    Email verified
                  </span>
                )}

              </div>

              {uploadingImage && (
                <p className="mt-3 text-sm text-gray-500">
                  Uploading profile photo...
                </p>
              )}

            </div>


            {!editing && (
              <button
                type="button"
                onClick={() =>
                  setEditing(true)
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
              >
                Edit Profile
              </button>
            )}

          </div>

        </section>


        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Building2 className="h-5 w-5 text-gray-500" />

            <p className="mt-4 text-2xl font-bold text-gray-900">
              {
                profile.approved_listings_count
              }
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Approved Listings
            </p>
          </div>


          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <MailCheck className="h-5 w-5 text-gray-500" />

            <p className="mt-4 text-lg font-semibold text-gray-900">
              {profile.email_verified
                ? "Verified"
                : "Not verified"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Email Status
            </p>
          </div>


          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <ShieldCheck className="h-5 w-5 text-gray-500" />

            <p className="mt-4 text-lg font-semibold text-gray-900">
              {profile.is_verified_landlord
                ? "Verified"
                : "Not verified"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Landlord Status
            </p>
          </div>

        </section>


        {/* About / edit profile */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {editing ? (
            <form
              onSubmit={
                handleSubmit
              }
            >

              <h2 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h2>


              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={
                    fullName
                  }
                  onChange={(
                    event
                  ) =>
                    setFullName(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                />

              </div>


              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  About
                </label>

                <textarea
                  value={about}
                  onChange={(
                    event
                  ) =>
                    setAbout(
                      event.target.value
                    )
                  }
                  rows={5}
                  maxLength={1000}
                  placeholder="Tell tenants a little about yourself and the properties you manage."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
                />

                <p className="mt-2 text-right text-xs text-gray-400">
                  {about.length}/1000
                </p>

              </div>


              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="rounded-lg bg-green-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={
                    handleCancelEdit
                  }
                  disabled={
                    saving
                  }
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>

            </form>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900">
                About
              </h2>

              {profile.about ? (
                <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                  {profile.about}
                </p>
              ) : (
                <p className="mt-4 text-gray-500">
                  Tell prospective tenants
                  a little about yourself.
                </p>
              )}
            </>
          )}

        </section>

      </main>
    </>
  );
}