"use client";

import React, { useState } from "react";
import { FiPlus, FiMinus, FiAlertCircle } from "react-icons/fi";

const SubmitGuideForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    author_name: "",
    title: "",
    category: "Introduction to Scams",
    experience_level: "Beginner",
    summary: "",
    content: "",
    key_takeaways: [""],
    sections: [{ title: "", content: "" }],
    sources: "",
    author_credentials: "",
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Character limits
  const CHARACTER_LIMITS = {
    title: 100,
    summary: 300,
    section_title: 80,
  };

  // Category options
  const CATEGORIES = [
    "Introduction to Scams",
    "Identifying Scams",
    "Exiting Safely",
    "Reporting Scams",
    "Other (please specify)",
  ];

  // Experience level options
  const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // For character-limited fields, restrict input
    if (
      CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS] &&
      value.length > CHARACTER_LIMITS[name as keyof typeof CHARACTER_LIMITS]
    ) {
      return;
    }

    setFormData({ ...formData, [name]: value });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle key takeaways changes
  const handleTakeawayChange = (index: number, value: string) => {
    const updatedTakeaways = [...formData.key_takeaways];
    updatedTakeaways[index] = value;
    setFormData({ ...formData, key_takeaways: updatedTakeaways });
  };

  // Add new key takeaway field
  const addTakeaway = () => {
    setFormData({
      ...formData,
      key_takeaways: [...formData.key_takeaways, ""],
    });
  };

  // Remove key takeaway field
  const removeTakeaway = (index: number) => {
    if (formData.key_takeaways.length > 1) {
      const updatedTakeaways = [...formData.key_takeaways];
      updatedTakeaways.splice(index, 1);
      setFormData({ ...formData, key_takeaways: updatedTakeaways });
    }
  };

  // Handle section changes
  const handleSectionChange = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    const updatedSections = [...formData.sections];
    updatedSections[index][field] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  // Add new section
  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: "", content: "" }],
    });
  };

  // Remove section
  const removeSection = (index: number) => {
    if (formData.sections.length > 1) {
      const updatedSections = [...formData.sections];
      updatedSections.splice(index, 1);
      setFormData({ ...formData, sections: updatedSections });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.author_name.trim()) {
      newErrors.author_name = "Author name is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Main content is required";
    }

    // Check sections
    const validSections = formData.sections.filter(
      (section) => section.title.trim().length > 0 && section.content.trim().length > 0
    );
    if (validSections.length === 0) {
      newErrors.sections = "At least one section with title and content is required";
    }

    // Check key takeaways
    const validTakeaways = formData.key_takeaways.filter(
      (takeaway) => takeaway.trim().length > 0
    );
    if (validTakeaways.length === 0) {
      newErrors.key_takeaways = "At least one key takeaway is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the payload
      const payload = {
        ...formData,
        key_takeaways: JSON.stringify(
          formData.key_takeaways.filter((takeaway) => takeaway.trim() !== "")
        ),
        sections: JSON.stringify(
          formData.sections.filter(
            (section) => section.title.trim() !== "" || section.content.trim() !== ""
          )
        ),
        // Add current date in ISO format
        submitted_at: new Date().toISOString(),
      };

      // In a real implementation, you would send this to your API
      // const response = await fetch('/api/submit-guide', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // Simulating successful submission for now
      console.log("Guide submitted with:", payload);

      setSubmitStatus({
        success: true,
        message:
          "Thank you for your submission! Our team will review your guide and contact you shortly.",
      });

      // Reset form after successful submission
      setFormData({
        author_name: "",
        title: "",
        category: "Introduction to Scams",
        experience_level: "Beginner",
        summary: "",
        content: "",
        key_takeaways: [""],
        sections: [{ title: "", content: "" }],
        sources: "",
        author_credentials: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message:
          "An error occurred while submitting your guide. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Status message */}
      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.success
              ? "bg-green-900/30 text-green-300 border border-green-800"
              : "bg-red-900/30 text-red-300 border border-red-800"
          }`}
        >
          <p className="flex items-center">
            <FiAlertCircle className="mr-2" />
            {submitStatus.message}
          </p>
        </div>
      )}

      {/* Form errors summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-red-900/30 text-red-300 border border-red-800">
          <p className="font-bold mb-2 flex items-center">
            <FiAlertCircle className="mr-2" />
            Please correct the following errors:
          </p>
          <ul className="list-disc pl-5">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Author Name */}
        <div>
          <label
            htmlFor="author_name"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Author Name*
          </label>
          <input
            type="text"
            id="author_name"
            name="author_name"
            value={formData.author_name}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Your name or pseudonym"
          />
          {errors.author_name && (
            <p className="mt-1 text-sm text-red-500">{errors.author_name}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Guide Title*{" "}
            <span className="text-xs text-gray-500">
              ({formData.title.length}/{CHARACTER_LIMITS.title} characters)
            </span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="How to Identify Crypto Scams"
            maxLength={CHARACTER_LIMITS.title}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Category and Experience Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="experience_level"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Experience Level*
            </label>
            <select
              id="experience_level"
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Guide Summary*{" "}
            <span className="text-xs text-gray-500">
              ({formData.summary.length}/{CHARACTER_LIMITS.summary} characters)
            </span>
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Brief overview of what your guide covers and what readers will learn"
            rows={3}
            maxLength={CHARACTER_LIMITS.summary}
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-500">{errors.summary}</p>
          )}
        </div>

        {/* Main Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Main Content*{" "}
            <span className="text-xs text-gray-500">
              (Introduction and overview)
            </span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Start with an introduction to your topic and why it's important"
            rows={6}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {/* Content Sections */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-400">
              Guide Sections*{" "}
              <span className="text-xs text-gray-500">
                (Break your guide into logical sections)
              </span>
            </label>
          </div>
          {errors.sections && (
            <p className="mb-2 text-sm text-red-500">{errors.sections}</p>
          )}

          <div className="space-y-6">
            {formData.sections.map((section, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-medium">Section {index + 1}</h4>
                  {formData.sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="p-1 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50 transition-colors"
                    >
                      <FiMinus />
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor={`section-title-${index}`}
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Section Title
                  </label>
                  <input
                    type="text"
                    id={`section-title-${index}`}
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(index, "title", e.target.value)
                    }
                    className="w-full p-3 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white"
                    placeholder="e.g., 'Common Red Flags' or 'How to Verify Team Identity'"
                    maxLength={CHARACTER_LIMITS.section_title}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`section-content-${index}`}
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Section Content
                  </label>
                  <textarea
                    id={`section-content-${index}`}
                    value={section.content}
                    onChange={(e) =>
                      handleSectionChange(index, "content", e.target.value)
                    }
                    className="w-full p-3 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white"
                    placeholder="Content for this section"
                    rows={4}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSection}
              className="flex items-center space-x-2 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-gray-300 transition-colors"
            >
              <FiPlus /> <span>Add Another Section</span>
            </button>
          </div>
        </div>

        {/* Key Takeaways */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Key Takeaways*{" "}
            <span className="text-xs text-gray-500">
              (Main points readers should remember)
            </span>
          </label>
          {errors.key_takeaways && (
            <p className="mt-1 text-sm text-red-500">{errors.key_takeaways}</p>
          )}

          <div className="space-y-3">
            {formData.key_takeaways.map((takeaway, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={takeaway}
                  onChange={(e) => handleTakeawayChange(index, e.target.value)}
                  className="flex-1 p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
                  placeholder="e.g., Always verify project team identities before investing"
                />
                <button
                  type="button"
                  onClick={() => removeTakeaway(index)}
                  className="p-2 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50 transition-colors"
                  disabled={formData.key_takeaways.length <= 1}
                >
                  <FiMinus />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTakeaway}
              className="flex items-center space-x-2 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-gray-300 transition-colors"
            >
              <FiPlus /> <span>Add Another Takeaway</span>
            </button>
          </div>
        </div>

        {/* Sources/References */}
        <div>
          <label
            htmlFor="sources"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Sources & References{" "}
            <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <textarea
            id="sources"
            name="sources"
            value={formData.sources}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="List any sources, references, or further reading materials"
            rows={3}
          />
        </div>

        {/* Author Credentials */}
        <div>
          <label
            htmlFor="author_credentials"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Author Credentials/Bio{" "}
            <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <textarea
            id="author_credentials"
            name="author_credentials"
            value={formData.author_credentials}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Tell us about your experience and qualifications related to this topic"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded font-medium text-white transition-all duration-300 text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit guide for review ✅"}
          </button>
          <p className="text-sm text-center mt-6 text-gray-500">
            All submissions are reviewed by our educational team. We may contact you
            to collaborate on refining your guide before publishing. We typically
            respond within 3-5 business days.
          </p>
        </div>
      </form>
    </div>
  );
};

export default SubmitGuideForm;
