import { useState } from "react";

export default function CreateJobModal({ onClose }) {
    const [formData, setFormData] = useState({
        created_at: new Date().toISOString(),
        title: "",
        company: "",
        location: "",
        jobType: "Full-Time",
        salaryMin: "",
        salaryMax: "",
        deadline: "",
        description: "",
        status: "published", // default
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

   const handleSubmit = async (e, status = "published") => {
  e.preventDefault();
  const dataToSend = { ...formData, status };

  try {
    const res = await fetch("/api/save-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      alert(status === "draft" ? "Draft saved!" : "Job published!");
      onClose(); // Close the modal
      window.location.reload(); // 🔁 Refresh the page
    } else {
      const data = await res.json();
      alert(data.message || "Failed to save job");
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Something went wrong. Try again later.");
  }
};



    return (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-[700px] shadow-lg relative">

                {/* Close Button */}
                <button
                    className="absolute top-3 right-4 text-2xl text-gray-700 hover:text-black bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2 className="create-job mb-4 p-3 rounded text-gray-700">Create Job Opening</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col mb-4">
                            <label className="block text-gray-800 font-medium mb-1">Job Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="border p-2 rounded text-gray-900 placeholder-gray-500"
                                placeholder="FullStack, Web Design"
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="block text-gray-800 font-medium mb-1">Company Name</label>
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="border p-2 rounded text-gray-900 placeholder-gray-500"
                                placeholder="Amazon, Microsoft, Swiggy"
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="block text-gray-800 font-medium mb-1">Preferred Location</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="border p-2 rounded text-gray-700"
                            >
                                <option value="">Choose Preferred Location</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="block text-gray-800 font-medium mb-1">Job Type</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="border p-2 rounded text-gray-700"
                            >
                                <option>Full-Time</option>
                                <option>Part-Time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="block text-gray-800 font-medium mb-1">Salary Range</label>
                            <div className="flex space-x-4">
                                <input
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    className="border p-2 rounded text-gray-900 placeholder-gray-500 w-full"
                                    placeholder="₹ Min"
                                    type="number"
                                />
                                <input
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    className="border p-2 rounded text-gray-900 placeholder-gray-500 w-full"
                                    placeholder="₹ Max"
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="block text-gray-800 font-medium mb-1">Application Deadline</label>
                            <input
                                name="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="border p-2 rounded text-gray-700 placeholder-gray-500"
                            />
                        </div>

                        <div className="flex flex-col mb-2 col-span-2">
                            <label className="block text-gray-800 font-medium mb-1">Job Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="border p-2 rounded h-24 text-gray-900"
                                placeholder="Please share a description to let the candidate know more about the job role"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-6 text-gray-900">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "draft")}
                            className="bg-blue-500 border px-4 py-2 rounded hover:bg-gray-100 text-white flex items-center"
                        >
                            Save Draft
                        </button>

                        <button
                            type="submit"
                            onClick={(e) => handleSubmit(e, "published")}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center"
                        >
                            Publish <span className="ml-4 text-2xl">»</span>
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}
