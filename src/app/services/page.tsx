
import Image from "next/image";
import Link from "next/link";
import {
  Wrench,
  MapPin,
  Clock,
  UserRound,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type Service = {
  _id: string;
  title: string;
  category: string;
  image?: string;
  basePrice: number;
  estimatedDuration?: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
};

type SearchParams = Promise<{
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
}>;

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

async function getServices(params: {
  search: string;
  category: string;
  serviceMode: string;
  sort: string;
}): Promise<Service[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.serviceMode) query.set("serviceMode", params.serviceMode);
  if (params.sort) query.set("sort", params.sort);

  try {
    const response = await fetch(
      `${apiUrl}/services?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    const data = await response.json();

    return Array.isArray(data) ? data : data.services ?? [];
  } catch {
    return [];
  }
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const serviceMode = params.serviceMode ?? "";
  const sort = params.sort ?? "newest";

  const services = await getServices({
    search,
    category,
    serviceMode,
    sort,
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 px-6 py-20 text-center">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-5 py-2 text-sm font-bold text-teal-300">
            <Wrench size={16} />
            FIND YOUR SOLUTION
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Explore Repair{" "}
            <span className="text-teal-400">Services</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Discover trusted technicians for your smart devices and home
            appliances. Quality repairs, reliable service, and peace of mind.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        {/* Search and Filters */}
        <form
          action="/services"
          method="GET"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
              <SlidersHorizontal size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Find Your Repair Service
              </h2>
              <p className="text-sm text-slate-600">
                Search and filter services to find the right solution.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search services..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 font-medium text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <select
              name="category"
              defaultValue={category}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="serviceMode"
              defaultValue={serviceMode}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">All Service Modes</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-7 py-3 font-bold text-white transition hover:bg-teal-800"
            >
              <Search size={18} />
              Search Services
            </button>

            <Link
              href="/services"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Clear Filters
            </Link>
          </div>
        </form>

        {/* Services Heading */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-widest text-teal-700">
              OUR SERVICES
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
              Available Repair Services
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Find the right technician for your repair needs.
            </p>
          </div>

          <span className="rounded-full border border-teal-200 bg-teal-50 px-5 py-2 font-bold text-teal-800">
            {services.length} services found
          </span>
        </div>

        {/* Service Cards */}
        {services.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-slate-100">
                  {service.image?.trim() ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <Wrench size={38} className="text-teal-700" />
                      </div>
                      <span className="text-sm font-semibold">
                        Image not uploaded
                      </span>
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-teal-800 shadow">
                    {service.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-extrabold text-slate-950 transition group-hover:text-teal-700">
                    {service.title}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm font-medium text-slate-700">
                    <p className="flex items-center gap-3">
                      <Wrench size={17} className="shrink-0 text-teal-700" />
                      {service.serviceMode}
                    </p>

                    <p className="flex items-center gap-3">
                      <MapPin size={17} className="shrink-0 text-teal-700" />
                      {service.serviceArea}
                    </p>

                    <p className="flex items-center gap-3">
                      <UserRound size={17} className="shrink-0 text-teal-700" />
                      {service.technicianName || "Technician"}
                    </p>

                    {service.estimatedDuration && (
                      <p className="flex items-center gap-3">
                        <Clock size={17} className="shrink-0 text-teal-700" />
                        {service.estimatedDuration}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-600">
                        Starting from
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-teal-800">
                        ${service.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Wrench size={48} className="mx-auto text-teal-700" />

            <h3 className="mt-5 text-2xl font-extrabold text-slate-900">
              No Services Found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
              No approved repair services match your search right now.
              Please try another category or search term.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-block rounded-xl bg-teal-700 px-6 py-3 font-bold text-white transition hover:bg-teal-800"
            >
              View All Services
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
