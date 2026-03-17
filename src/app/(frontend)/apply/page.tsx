'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, CheckCircle, AlertCircle, FileText, X } from 'lucide-react'

export default function ApplyPage() {
  const [form, setForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    jobTitle: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.type !== 'application/pdf') {
      setFileError('Only PDF files are accepted.')
      setFile(null)
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setFileError('File size must be under 5 MB.')
      setFile(null)
      return
    }
    setFile(selected)
  }

  function removeFile() {
    setFile(null)
    setFileError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!file) {
      setFileError('Please upload your resume (PDF).')
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('applicantName', form.applicantName)
      fd.append('email', form.email)
      fd.append('phone', form.phone)
      fd.append('jobTitle', form.jobTitle)
      fd.append('resume', file)

      const res = await fetch('/api/apply', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="apply-success">
        <div className="apply-success__card">
          <CheckCircle className="apply-success__icon" size={56} />
          <h1 className="apply-success__title">Application Submitted!</h1>
          <p className="apply-success__message">
            Thank you, <strong>{form.applicantName}</strong>. We have received your application and
            will review it shortly. We&apos;ll reach out to you at <strong>{form.email}</strong>.
          </p>
          <Link href="/" className="apply-success__btn">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="apply-page">
      <div className="apply-page__container">
        {/* Header */}
        <div className="apply-page__header">
          <h1 className="apply-page__title">Apply for a Position</h1>
          <p className="apply-page__subtitle">
            Fill in your details and upload your CV/Resume to apply.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="apply-form">
          {/* Global error */}
          {error && (
            <div className="apply-form__error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="apply-form__grid">
            {/* Full Name */}
            <div className="apply-form__field">
              <label className="apply-form__label" htmlFor="applicantName">
                Full Name <span className="apply-form__required">*</span>
              </label>
              <input
                id="applicantName"
                name="applicantName"
                type="text"
                required
                value={form.applicantName}
                onChange={handleChange}
                placeholder="e.g. Adarsh Kumar Sharma"
                className="apply-form__input"
              />
            </div>

            {/* Email */}
            <div className="apply-form__field">
              <label className="apply-form__label" htmlFor="email">
                Email Address <span className="apply-form__required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. adarsh@example.com"
                className="apply-form__input"
              />
            </div>

            {/* Phone */}
            <div className="apply-form__field">
              <label className="apply-form__label" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="apply-form__input"
              />
            </div>

            {/* Position */}
            <div className="apply-form__field">
              <label className="apply-form__label" htmlFor="jobTitle">
                Position Applying For <span className="apply-form__required">*</span>
              </label>
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                required
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                className="apply-form__input"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="apply-form__field apply-form__field--full">
            <label className="apply-form__label">
              Upload CV / Resume <span className="apply-form__required">*</span>
            </label>
            <p className="apply-form__hint">Only PDF files accepted. Maximum size: 5 MB.</p>

            {!file ? (
              <label className="apply-form__dropzone" htmlFor="resume-upload">
                <Upload size={32} className="apply-form__dropzone-icon" />
                <span className="apply-form__dropzone-text">
                  Click to select your PDF resume
                </span>
                <span className="apply-form__dropzone-sub">PDF only, max 5 MB</span>
                <input
                  ref={fileRef}
                  id="resume-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFile}
                  className="apply-form__file-input"
                />
              </label>
            ) : (
              <div className="apply-form__file-selected">
                <FileText size={20} className="apply-form__file-icon" />
                <span className="apply-form__file-name">{file.name}</span>
                <span className="apply-form__file-size">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="apply-form__file-remove"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {fileError && (
              <p className="apply-form__field-error">
                <AlertCircle size={14} /> {fileError}
              </p>
            )}
          </div>

          <div className="apply-form__actions">
            <button type="submit" disabled={submitting} className="apply-form__submit">
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
