import {
  Save,
  User,
  Briefcase,
  Camera,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import {
  Field,
  Input,
  Select,
  Textarea,
} from "../../components/FormField";
import { PageHeader } from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { api, getErrorMessage } from "../../services/api";
import { workerCategories } from "../../utils/constants";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user.name || "",
    wardNumber: user.wardNumber || "",
    gender: user.gender || "prefer-not-to-say",
    category: user.workerDetails?.category || "plumber",
    skills: user.workerDetails?.skills?.join(", ") || "",
    experienceYears: user.workerDetails?.experienceYears || 0,
    availability: user.workerDetails?.availability || "available",
    profilePhoto: null,
  });

  const update = (event) => {
    const { name, value, files } = event.target;

    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      const response = await api.patch("/users/me", data);
      setUser(response.data.user);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <style>{`
        @keyframes pf-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pf-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .pf-card {
          animation: pf-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .pf-float {
          animation: pf-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Profile"
        description="Keep your Panchayat account details accurate for routing services and updates."
      />

      <form
        onSubmit={submit}
        className="
          pf-card
          max-w-4xl
          rounded-3xl
          p-8
          space-y-8
        "
      >
        {/* Header */}
        <div className="flex flex-wrap items-center gap-5">
          <div
            className="
              pf-float
              grid
              h-20
              w-20
              place-items-center
              rounded-3xl
              border
              border-indigo-400/20
              bg-gradient-to-br
              from-indigo-500/20
              to-violet-500/10
              text-indigo-300
            "
          >
            <User size={34} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">
              Account Profile
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Update your personal and service details
            </p>
          </div>
        </div>

        {/* Basic */}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Name">
            <Input
              name="name"
              value={form.name}
              onChange={update}
            />
          </Field>

          <Field label="Ward number">
            <Input
              name="wardNumber"
              type="number"
              min="1"
              value={form.wardNumber}
              onChange={update}
            />
          </Field>

          <Field label="Gender">
            <Select
              name="gender"
              value={form.gender}
              onChange={update}
            >
              <option value="prefer-not-to-say">
                Prefer not to say
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </Field>

          <Field label="Profile photo">
            <div className="relative">
              <Camera
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              />

              <Input
                className="pl-12"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={update}
              />
            </div>
          </Field>
        </div>

        {/* Worker Section */}
        {user.role === "worker" ? (
          <div className="border-t border-white/10 pt-8">
            <div className="mb-6 flex items-center gap-4">
              <div
                className="
                  grid
                  h-14
                  w-14
                  place-items-center
                  rounded-2xl
                  border
                  border-emerald-400/20
                  bg-gradient-to-br
                  from-emerald-500/20
                  to-teal-500/10
                  text-emerald-300
                "
              >
                <Briefcase size={22} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  Worker Details
                </h3>

                <p className="mt-1 text-sm text-neutral-400">
                  Manage your work availability & skills
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Category">
                <Select
                  name="category"
                  value={form.category}
                  onChange={update}
                >
                  {workerCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Availability">
                <Select
                  name="availability"
                  value={form.availability}
                  onChange={update}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </Select>
              </Field>

              <Field label="Experience years">
                <Input
                  name="experienceYears"
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={update}
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Skills">
                  <Textarea
                    name="skills"
                    value={form.skills}
                    onChange={update}
                  />
                </Field>
              </div>
            </div>
          </div>
        ) : null}

        {/* Button */}
        <Button
          type="submit"
          icon={Save}
          className="px-8"
        >
          Save profile
        </Button>
      </form>
    </>
  );
}