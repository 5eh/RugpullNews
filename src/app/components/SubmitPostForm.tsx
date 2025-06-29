"use client";

import React, { useState } from "react";
import { FiPlus, FiMinus, FiAlertCircle } from "react-icons/fi";

const SubmitPostForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    creator: "",
    title: "",
    link: "",
    content: "",
    contentsnippet: "",
    risk_level: "MEDIUM RISK",
    red_flags: [""],
    our_analysis: "",
    summary_analysis: "",
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
    contentsnippet: 200,
    summary_analysis: 500,
  };

  // Risk level options
  const RISK_LEVELS = ["LOW RISK", "MEDIUM RISK", "HIGH RISK"];

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  // Handle red flags changes
  const handleRedFlagChange = (index: number, value: string) => {
    const updatedFlags = [...formData.red_flags];
    updatedFlags[index] = value;
    setFormData({ ...formData, red_flags: updatedFlags });
  };

  // Add new red flag field
  const addRedFlag = () => {
    setFormData({
      ...formData,
      red_flags: [...formData.red_flags, ""],
    });
  };

  // Remove red flag field
  const removeRedFlag = (index: number) => {
    if (formData.red_flags.length > 1) {
      const updatedFlags = [...formData.red_flags];
      updatedFlags.splice(index, 1);
      setFormData({ ...formData, red_flags: updatedFlags });
    }
  };

  // Generate content snippet from content if empty
  const generateContentSnippet = () => {
    if (formData.content && !formData.contentsnippet) {
      const snippet = formData.content.substring(
        0,
        CHARACTER_LIMITS.contentsnippet,
      );
      setFormData({ ...formData, contentsnippet: snippet });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.creator.trim()) {
      newErrors.creator = "Author name is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.link.trim()) {
      newErrors.link = "Source link is required";
    } else if (!/^https?:\/\/.+/.test(formData.link)) {
      newErrors.link =
        "Please enter a valid URL starting with http:// or https://";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.contentsnippet.trim()) {
      newErrors.contentsnippet = "Content snippet is required";
    }

    if (!formData.our_analysis.trim()) {
      newErrors.our_analysis = "Analysis is required";
    }

    if (!formData.summary_analysis.trim()) {
      newErrors.summary_analysis = "Summary analysis is required";
    }

    // Check red flags
    const validFlags = formData.red_flags.filter(
      (flag) => flag.trim().length > 0,
    );
    if (validFlags.length === 0) {
      newErrors.red_flags = "At least one red flag is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pre-process the form before validation
    generateContentSnippet();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the payload - convert red_flags to JSON string as required by the backend
      const payload = {
        ...formData,
        red_flags: JSON.stringify(
          formData.red_flags.filter((flag) => flag.trim() !== ""),
        ),
        // These fields will be set by the admin during approval
        rugpull_score: 0,
        banner_image: "",
        // Add current date in ISO format
        isodate: new Date().toISOString(),
      };

      // In a real implementation, you would send this to your API
      // const response = await fetch('/api/submit-post', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // const data = await response.json();

      // Simulating successful submission for now
      console.log("Form submitted with:", payload);

      setSubmitStatus({
        success: true,
        message:
          "Thank you for your submission! Our team will review it shortly.",
      });

      // Reset form after successful submission
      setFormData({
        creator: "",
        title: "",
        link: "",
        content: "",
        contentsnippet: "",
        risk_level: "MEDIUM RISK",
        red_flags: [""],
        our_analysis: "",
        summary_analysis: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message:
          "An error occurred while submitting your post. Please try again later.",
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
          className={`mb-6 p-4 rounded-lg ${submitStatus.success ? "bg-green-900/30 text-green-300 border border-green-800" : "bg-red-900/30 text-red-300 border border-red-800"}`}
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
        {/* Author and Risk Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="creator"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Author Name*
            </label>
            <input
              type="text"
              id="creator"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
              placeholder="Your name or pseudonym"
            />
            {errors.creator && (
              <p className="mt-1 text-sm text-red-500">{errors.creator}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="risk_level"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Risk Level*
            </label>
            <select
              id="risk_level"
              name="risk_level"
              value={formData.risk_level}
              onChange={handleChange}
              className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            >
              {RISK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Title*{" "}
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
            placeholder="Title of the report"
            maxLength={CHARACTER_LIMITS.title}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Source Link */}
        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Source Link*
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="https://example.com/news-article"
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-500">{errors.link}</p>
          )}
        </div>

        {/* Full Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Full Content*
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            onBlur={generateContentSnippet}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Full content of the article or report"
            rows={5}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {/* Content Snippet */}
        <div>
          <label
            htmlFor="contentsnippet"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Content Snippet*{" "}
            <span className="text-xs text-gray-500">
              ({formData.contentsnippet.length}/
              {CHARACTER_LIMITS.contentsnippet} characters)
            </span>
          </label>
          <textarea
            id="contentsnippet"
            name="contentsnippet"
            value={formData.contentsnippet}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Brief summary of the content (will be automatically generated if left empty)"
            rows={2}
            maxLength={CHARACTER_LIMITS.contentsnippet}
          />
          {errors.contentsnippet && (
            <p className="mt-1 text-sm text-red-500">{errors.contentsnippet}</p>
          )}
          <p className="text-sm text-center mt-6 text-gray-500">
            This will be displayed in article cards and previews.
          </p>
        </div>

        {/* Red Flags */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Red Flags*{" "}
            <span className="text-xs text-gray-500">
              (List specific warning signs or concerns)
            </span>
          </label>
          {errors.red_flags && (
            <p className="mt-1 text-sm text-red-500">{errors.red_flags}</p>
          )}

          <div className="space-y-3">
            {formData.red_flags.map((flag, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => handleRedFlagChange(index, e.target.value)}
                  className="flex-1 p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
                  placeholder="e.g., Anonymous team with no public identities"
                />
                <button
                  type="button"
                  onClick={() => removeRedFlag(index)}
                  className="p-2 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50 transition-colors"
                  disabled={formData.red_flags.length <= 1}
                >
                  <FiMinus />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRedFlag}
              className="flex items-center space-x-2 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-gray-300 transition-colors"
            >
              <FiPlus /> <span>Add Another Red Flag</span>
            </button>
          </div>
        </div>

        {/* Our Analysis */}
        <div>
          <label
            htmlFor="our_analysis"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Detailed Analysis*
          </label>
          <textarea
            id="our_analysis"
            name="our_analysis"
            value={formData.our_analysis}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Provide a detailed analysis of the situation, including context, technical details, and impact"
            rows={8}
          />
          {errors.our_analysis && (
            <p className="mt-1 text-sm text-red-500">{errors.our_analysis}</p>
          )}
        </div>

        {/* Summary Analysis */}
        <div>
          <label
            htmlFor="summary_analysis"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Summary Analysis*{" "}
            <span className="text-xs text-gray-500">
              ({formData.summary_analysis.length}/
              {CHARACTER_LIMITS.summary_analysis} characters)
            </span>
          </label>
          <textarea
            id="summary_analysis"
            name="summary_analysis"
            value={formData.summary_analysis}
            onChange={handleChange}
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            placeholder="Concise summary of your analysis"
            rows={4}
            maxLength={CHARACTER_LIMITS.summary_analysis}
          />
          {errors.summary_analysis && (
            <p className="mt-1 text-sm text-red-500">
              {errors.summary_analysis}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded font-medium text-white transition-all duration-300 text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit post for review ✅"}
          </button>
          <p className="text-sm text-center mt-6 text-gray-500">
            All submissions are reviewed by our team before publishing. We
            typically respond within 48 hours.
          </p>
        </div>
      </form>
    </div>
  );
};

export default SubmitPostForm;
