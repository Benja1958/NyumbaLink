import Navbar from "@/components/Navbar";

export default function LandlordPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">
          Landlord Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your property listings.
        </p>
      </main>
    </>
  );
}